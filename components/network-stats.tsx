"use client"

import { useEffect, useState } from "react"
import { Activity, Cpu, Network } from "lucide-react"

type Stats = {
  blockHeight: string
  hashrate: string
  nodes: string
  updatedAt: string | null
  live: boolean
}

const initial: Stats = { blockHeight: "—", hashrate: "—", nodes: "—", updatedAt: null, live: false }
const metrics = [
  { label: "Block height", key: "blockHeight", icon: Activity },
  { label: "Network hashrate", key: "hashrate", icon: Cpu },
  { label: "Estimated nodes", key: "nodes", icon: Network },
] as const

export function NetworkStats() {
  const [stats, setStats] = useState(initial)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const controller = new AbortController()
    let timer: ReturnType<typeof setTimeout>
    async function refresh() {
      try {
        const response = await fetch("/api/network-stats", {
          signal: AbortSignal.any([controller.signal, AbortSignal.timeout(10_000)]),
        })
        if (!response.ok) throw new Error("Could not load statistics")
        const next: Stats = await response.json()
        if (!controller.signal.aborted) setStats(next)
      } catch {
        if (!controller.signal.aborted) setStats((last) => ({ ...last, live: false }))
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
          timer = setTimeout(refresh, 35_000)
        }
      }
    }

    void refresh()
    return () => {
      controller.abort()
      clearTimeout(timer)
    }
  }, [])

  const status = loading ? "Loading" : stats.live ? "Live from explorer" : stats.updatedAt ? "Last known values" : "Stats unavailable"
  return (
    <div className="network-card">
      <div className="network-heading">
        <h2>Mainnet</h2>
        <span className={"network-status" + (stats.live ? " is-live" : "")} role="status">
          <span aria-hidden="true" />{status}
        </span>
      </div>
      <dl className="network-metrics">
        {metrics.map(({ label, key, icon: Icon }) => (
          <div key={key}>
            <dt><Icon size={15} aria-hidden="true" /> {label}</dt>
            <dd>{stats[key]}</dd>
          </div>
        ))}
      </dl>
      {stats.updatedAt && <time className="stats-time" dateTime={stats.updatedAt}>
        Updated {new Date(stats.updatedAt).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "UTC" })} UTC
      </time>}
    </div>
  )
}
