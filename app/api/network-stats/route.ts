import { NextResponse } from "next/server"
import { mytConfig } from "@/lib/myt-config"

export const dynamic = "force-dynamic"

const refreshMs = 30_000
const maxStaleMs = 6 * 60 * 60 * 1000
const maxBodyBytes = 512 * 1024
const empty = { blockHeight: "—", hashrate: "—", nodes: "—" }
type Stats = typeof empty
let snapshot: { stats: Stats; retrievedAt: number } | undefined
let refreshAfter = 0
let upstreamAvailable = false
let refreshing: Promise<void> | undefined

function integer(value: unknown) {
  if (typeof value === "string") {
    const text = value.trim().replace(/^#/, "").replaceAll(",", "")
    if (!/^\d{1,16}$/.test(text)) return "—"
    value = Number(text)
  }
  return typeof value === "number" && Number.isSafeInteger(value) && value >= 0
    ? value.toLocaleString("en-US") : "—"
}

function hashrate(value: unknown) {
  if (typeof value === "string") {
    const normalized = value.trim().replaceAll(",", "")
    const match = /^(\d{1,16}(?:\.\d{1,8})?)\s*([KMGTPE]?H\/?S)?$/i.exec(normalized)
    if (!match) return "—"
    if (match[2]) return Number(match[1]).toLocaleString("en-US", { maximumFractionDigits: 2 }) + " " + match[2].toUpperCase().replace(/\/?S$/, "/s")
    value = Number(match[1])
  }
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0 || value > 1e24) return "—"
  const units = ["H/s", "KH/s", "MH/s", "GH/s", "TH/s", "PH/s", "EH/s"]
  let index = 0
  while (value >= 1000 && index < units.length - 1) {
    value /= 1000
    index++
  }
  return (value as number).toLocaleString("en-US", { maximumFractionDigits: 2 }) + " " + units[index]
}

function parseStats(raw: string, type: string): Stats | undefined {
  if (type === "application/json" || type.endsWith("+json")) {
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return
    if (typeof parsed.status === "string" && parsed.status !== "success" && parsed.status !== "OK") return
    const data = parsed.data && typeof parsed.data === "object" ? parsed.data : parsed
    return {
      blockHeight: integer(data.blockHeight ?? data.block_height ?? data.height),
      hashrate: hashrate(data.hashrate ?? data.hash_rate ?? data.network_hashrate),
      nodes: integer(data.running_nodes ?? data.visible_nodes ?? data.node_count ?? data.nodes),
    }
  }
  if (type === "text/html") {
    const fields = new Map<string, string>()
    const cards = /<div class="stat-card[^"]*">\s*<div class="stat-title">([^<]{1,64})<\/div>\s*<div class="stat-value">([^<]{1,128})<\/div>/gi
    for (const match of raw.matchAll(cards)) {
      fields.set(match[1].trim().toLowerCase(), match[2].replace(/&#x2f;|&#47;/gi, "/").replaceAll("&nbsp;", " "))
    }
    return {
      blockHeight: integer(fields.get("block")),
      hashrate: hashrate(fields.get("hashrate")),
      nodes: integer(fields.get("running nodes")),
    }
  }
}

async function readBounded(response: Response) {
  const declared = response.headers.get("content-length")
  if (declared && (!/^\d+$/.test(declared) || Number(declared) > maxBodyBytes)) {
    await response.body?.cancel()
    throw new Error("Upstream response is too large")
  }
  if (!response.body) throw new Error("Empty upstream response")
  const reader = response.body.getReader()
  const decoder = new TextDecoder("utf-8", { fatal: true })
  let count = 0
  let text = ""
  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) return text + decoder.decode()
      count += value.length
      if (count > maxBodyBytes) throw new Error("Upstream response is too large")
      text += decoder.decode(value, { stream: true })
    }
  } finally {
    await reader.cancel().catch(() => undefined)
    reader.releaseLock()
  }
}

async function refresh() {
  try {
    const url = new URL(
      process.env.MYT_MAINNET_EXPLORER_STATS_URL
        ?? process.env.MYT_MAINNET_EXPLORER_URL
        ?? mytConfig.links.explorerMainnet,
    )
    if (url.protocol !== "https:" || url.username || url.password || url.search || url.hash) {
      throw new Error("Invalid explorer statistics URL")
    }
    const response = await fetch(url, {
      cache: "no-store",
      redirect: "error",
      signal: AbortSignal.timeout(4000),
      headers: { Accept: "application/json, text/html;q=0.9" },
    })
    if (!response.ok) {
      await response.body?.cancel()
      throw new Error("Explorer statistics unavailable")
    }
    const type = response.headers.get("content-type")?.split(";", 1)[0].trim().toLowerCase() ?? ""
    const stats = parseStats(await readBounded(response), type)
    if (!stats || Object.values(stats).every((value) => value === "—")) throw new Error("Missing statistics")
    snapshot = { stats, retrievedAt: Date.now() }
    upstreamAvailable = true
  } catch {
    upstreamAvailable = false
  } finally {
    refreshAfter = Date.now() + refreshMs
    refreshing = undefined
  }
}

export async function GET() {
  if (Date.now() >= refreshAfter) {
    // Start in a microtask so a synchronous setup failure can clear the shared promise.
    refreshing ??= Promise.resolve().then(refresh)
    await refreshing
  }
  const current = snapshot && Date.now() - snapshot.retrievedAt <= maxStaleMs ? snapshot : undefined
  return NextResponse.json({
    ...(current?.stats ?? empty),
    updatedAt: current ? new Date(current.retrievedAt).toISOString() : null,
    live: Boolean(current && upstreamAvailable),
  }, {
    headers: { "Cache-Control": "public, s-maxage=30" },
  })
}
