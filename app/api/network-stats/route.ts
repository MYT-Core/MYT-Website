import { NextResponse } from "next/server"
import { mytConfig } from "@/lib/myt-config"

export const dynamic = "force-dynamic"
export const revalidate = 0

const endpointCandidates = [
  "/api/v1/stats",
  "/api/stats",
  "/stats",
  "/v1/stats",
  "/api/network/stats",
  "/network/stats",
  "/ext/summary",
]

type ParsedStats = {
  blockHeight: string
  hashrate: string
  nodes: string
}

function normalizeKey(value: string) {
  return value.replace(/[^a-z0-9]/gi, "").toLowerCase()
}

function findValue(source: unknown, matchers: string[]): unknown {
  const queue: unknown[] = [source]
  const seen = new Set<unknown>()

  while (queue.length > 0) {
    const current = queue.shift()
    if (!current || typeof current !== "object" || seen.has(current)) {
      continue
    }

    seen.add(current)

    for (const [key, value] of Object.entries(current as Record<string, unknown>)) {
      const normalized = normalizeKey(key)
      if (matchers.some((matcher) => normalized.includes(matcher))) {
        return value
      }

      if (value && typeof value === "object") {
        queue.push(value)
      }
    }
  }

  return undefined
}

function parseNumeric(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value
  }

  if (typeof value === "string") {
    const stripped = value.replaceAll(",", "").trim()
    const numeric = Number.parseFloat(stripped.replace(/[^\d.-]/g, ""))
    if (Number.isFinite(numeric)) {
      return numeric
    }
  }

  return undefined
}

function formatInteger(value: unknown): string {
  const numeric = parseNumeric(value)
  if (numeric === undefined) {
    return "--"
  }

  return Math.round(numeric).toLocaleString("en-US")
}

function formatHashrate(value: unknown): string {
  if (typeof value === "string" && /h\/?s/i.test(value)) {
    return value.trim()
  }

  const numeric = parseNumeric(value)
  if (numeric === undefined) {
    return "--"
  }

  const units = ["H/s", "KH/s", "MH/s", "GH/s", "TH/s", "PH/s", "EH/s"]
  let scaled = numeric
  let unitIndex = 0

  while (scaled >= 1000 && unitIndex < units.length - 1) {
    scaled /= 1000
    unitIndex += 1
  }

  const maximumFractionDigits = scaled >= 100 ? 0 : scaled >= 10 ? 1 : 2

  return `${scaled.toLocaleString("en-US", { maximumFractionDigits })} ${units[unitIndex]}`
}

function extractStats(payload: unknown): ParsedStats {
  const blockHeight = findValue(payload, ["blockheight", "height", "blocks"])
  const hashrate = findValue(payload, ["networkhashrate", "hashrate", "nethash"])
  const nodes = findValue(payload, ["nodecount", "nodes", "peers", "connections"])

  return {
    blockHeight: formatInteger(blockHeight),
    hashrate: formatHashrate(hashrate),
    nodes: formatInteger(nodes),
  }
}

function buildUrl(base: string, path: string) {
  return `${base.replace(/\/+$/, "")}${path}`
}

function normalizeBase(base: string) {
  return base.replace(/\/+$/, "")
}

function toOrigin(base: string) {
  try {
    const url = new URL(base)
    return `${url.protocol}//${url.host}`
  } catch {
    return normalizeBase(base)
  }
}

async function fetchJson(url: string): Promise<unknown | null> {
  try {
    const response = await fetch(url, {
      cache: "no-store",
      headers: {
        accept: "application/json",
      },
      signal: AbortSignal.timeout(4500),
    })

    if (!response.ok) {
      return null
    }

    const contentType = response.headers.get("content-type") ?? ""
    if (!contentType.toLowerCase().includes("json")) {
      return null
    }

    return await response.json()
  } catch {
    return null
  }
}

async function fetchText(url: string): Promise<string | null> {
  try {
    const response = await fetch(url, {
      cache: "no-store",
      headers: {
        accept: "text/html,application/xhtml+xml",
      },
      signal: AbortSignal.timeout(5000),
    })

    if (!response.ok) {
      return null
    }

    const contentType = response.headers.get("content-type") ?? ""
    if (!contentType.toLowerCase().includes("html")) {
      return null
    }

    return await response.text()
  } catch {
    return null
  }
}

function decodeHtmlEntities(input: string) {
  return input
    .replaceAll("&#x2F;", "/")
    .replaceAll("&#47;", "/")
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .trim()
}

function extractStatsFromExplorerHtml(html: string): ParsedStats | null {
  const cardRegex =
    /<div class="stat-card[^"]*">\s*<div class="stat-title">([^<]+)<\/div>\s*<div class="stat-value">([^<]+)<\/div>/gim
  const values = new Map<string, string>()

  let match: RegExpExecArray | null
  while ((match = cardRegex.exec(html)) !== null) {
    const title = decodeHtmlEntities(match[1] ?? "").toLowerCase()
    const value = decodeHtmlEntities(match[2] ?? "")
    values.set(title, value)
  }

  if (values.size === 0) {
    return null
  }

  return {
    blockHeight: formatInteger(values.get("block")),
    hashrate: formatHashrate(values.get("hashrate")),
    nodes: formatInteger(values.get("running nodes")),
  }
}

async function fetchExplorerStats() {
  const configuredApiBase =
    process.env.MYT_MAINNET_EXPLORER_API_URL ??
    process.env.NEXT_PUBLIC_MYT_MAINNET_EXPLORER_API_URL

  const baseCandidates = [
    configuredApiBase,
    `${normalizeBase(mytConfig.links.explorerMainnet)}/api`,
    mytConfig.links.explorerMainnet,
  ].filter((value): value is string => Boolean(value))

  for (const base of [...new Set(baseCandidates)]) {
    for (const endpoint of endpointCandidates) {
      const url = buildUrl(base, endpoint)
      const payload = await fetchJson(url)
      if (!payload) {
        continue
      }

      const stats = extractStats(payload)
      const foundValue =
        stats.blockHeight !== "--" || stats.hashrate !== "--" || stats.nodes !== "--"

      if (foundValue) {
        return {
          ...stats,
          source: url,
          live: true,
        }
      }
    }
  }

  const htmlCandidates = [
    configuredApiBase ? toOrigin(configuredApiBase) : undefined,
    process.env.MYT_MAINNET_EXPLORER_URL,
    process.env.NEXT_PUBLIC_MYT_MAINNET_EXPLORER_URL,
    mytConfig.links.explorerMainnet,
  ].filter((value): value is string => Boolean(value))

  for (const base of [...new Set(htmlCandidates)]) {
    const url = buildUrl(base, "/")
    const html = await fetchText(url)
    if (!html) {
      continue
    }

    const parsed = extractStatsFromExplorerHtml(html)
    if (!parsed) {
      continue
    }

    const foundValue =
      parsed.blockHeight !== "--" || parsed.hashrate !== "--" || parsed.nodes !== "--"

    if (foundValue) {
      return {
        ...parsed,
        source: url,
        live: true,
      }
    }
  }

  return null
}

export async function GET() {
  const stats = await fetchExplorerStats()

  if (stats) {
    return NextResponse.json({
      ...stats,
      updatedAt: new Date().toISOString(),
    })
  }

  return NextResponse.json({
    blockHeight: "--",
    hashrate: "--",
    nodes: "--",
    source: "Set MYT_MAINNET_EXPLORER_API_URL for live explorer stats.",
    updatedAt: new Date().toISOString(),
    live: false,
  })
}
