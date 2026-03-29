import { mytConfig } from "@/lib/myt-config"

type GitHubAsset = {
  name: string
  digest?: string | null
  browser_download_url: string
}

type GitHubRelease = {
  tag_name: string
  html_url: string
  published_at: string
  assets: GitHubAsset[]
}

export type ReleaseInfo = {
  tag: string
  url: string
  publishedAt: string
  windowsAssetUrl: string
  windowsSha256: string
}

const RELEASES_API = "https://api.github.com/repos/MYT-Core/MYT/releases/latest"

function formatDate(isoDate: string) {
  const date = new Date(isoDate)
  if (Number.isNaN(date.getTime())) {
    return mytConfig.release.date
  }

  return date.toISOString().slice(0, 10)
}

function pickWindowsAsset(assets: GitHubAsset[]) {
  return assets.find((asset) => /win/i.test(asset.name) && /\.zip$/i.test(asset.name))
}

function pickShaAsset(assets: GitHubAsset[]) {
  return assets.find((asset) => /\.sha256$/i.test(asset.name) || /sha256sums/i.test(asset.name))
}

async function readShaFromAsset(assetUrl: string): Promise<string | null> {
  try {
    const response = await fetch(assetUrl, {
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    })

    if (!response.ok) {
      return null
    }

    const text = await response.text()
    const match = text.match(/[a-f0-9]{64}/i)
    return match ? match[0].toLowerCase() : null
  } catch {
    return null
  }
}

export async function getLatestReleaseInfo(): Promise<ReleaseInfo> {
  const fallback: ReleaseInfo = {
    tag: mytConfig.release.version,
    url: mytConfig.links.githubReleases,
    publishedAt: mytConfig.release.date,
    windowsAssetUrl: mytConfig.links.windowsBinary,
    windowsSha256: mytConfig.download.windowsSha256,
  }

  try {
    const response = await fetch(RELEASES_API, {
      cache: "no-store",
      headers: {
        Accept: "application/vnd.github+json",
        "User-Agent": "myt-landing",
      },
      signal: AbortSignal.timeout(6000),
    })

    if (!response.ok) {
      return fallback
    }

    const release = (await response.json()) as GitHubRelease
    const windowsAsset = pickWindowsAsset(release.assets ?? [])
    const shaAsset = pickShaAsset(release.assets ?? [])

    const shaFromDigest = windowsAsset?.digest?.replace(/^sha256:/i, "").trim() || null
    const shaFromFile = shaAsset ? await readShaFromAsset(shaAsset.browser_download_url) : null

    return {
      tag: release.tag_name || fallback.tag,
      url: release.html_url || fallback.url,
      publishedAt: formatDate(release.published_at),
      windowsAssetUrl: windowsAsset?.browser_download_url || fallback.windowsAssetUrl,
      windowsSha256: shaFromDigest || shaFromFile || fallback.windowsSha256,
    }
  } catch {
    return fallback
  }
}

