"use client"

import { useEffect, useMemo, useState } from "react"
import { Activity, Cpu, Network } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"

type NetworkStatsResponse = {
  blockHeight: string
  hashrate: string
  nodes: string
  source: string
  updatedAt: string
  live: boolean
}

const initialState: NetworkStatsResponse = {
  blockHeight: "--",
  hashrate: "--",
  nodes: "--",
  source: "",
  updatedAt: "",
  live: false,
}

export function NetworkStats() {
  const [stats, setStats] = useState<NetworkStatsResponse>(initialState)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    const fetchStats = async () => {
      try {
        const response = await fetch("/api/network-stats", {
          cache: "no-store",
        })

        if (!response.ok) {
          throw new Error("Failed to fetch network stats")
        }

        const payload = (await response.json()) as NetworkStatsResponse
        if (mounted) {
          setStats(payload)
        }
      } catch {
        if (mounted) {
          setStats((current) => ({ ...current, live: false }))
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    fetchStats()
    const intervalId = window.setInterval(fetchStats, 20000)

    return () => {
      mounted = false
      window.clearInterval(intervalId)
    }
  }, [])

  const updatedLabel = useMemo(() => {
    if (!stats.updatedAt) {
      return "Waiting for first update"
    }

    return new Date(stats.updatedAt).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }, [stats.updatedAt])

  return (
    <Card className="border-primary/25 bg-card/60 p-6 shadow-[0_0_50px_-32px_rgba(67,191,255,0.6)] backdrop-blur-sm">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold">Mainnet Network Stats</h2>
          <Badge
            variant={stats.live ? "secondary" : "outline"}
            className={stats.live ? "border-cyan-400/50 bg-cyan-400/10 text-cyan-300" : undefined}
          >
            {stats.live ? "Live from Explorer" : loading ? "Loading" : "Fallback"}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground">Updated: {updatedLabel}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-primary/20 bg-background/60 p-4">
          <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground">
            <Activity className="h-4 w-4" />
            Block Height
          </div>
          <div className="text-2xl font-bold">{stats.blockHeight}</div>
        </div>

        <div className="rounded-xl border border-cyan-400/25 bg-background/60 p-4">
          <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground">
            <Cpu className="h-4 w-4" />
            Hashrate
          </div>
          <div className="text-2xl font-bold">{stats.hashrate}</div>
        </div>

        <div className="rounded-xl border border-blue-400/20 bg-background/60 p-4">
          <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground">
            <Network className="h-4 w-4" />
            Nodes
          </div>
          <div className="text-2xl font-bold">{stats.nodes}</div>
        </div>
      </div>

      <p className="mt-4 text-xs text-muted-foreground">Source: {stats.source || "Explorer endpoint not configured yet."}</p>
    </Card>
  )
}
