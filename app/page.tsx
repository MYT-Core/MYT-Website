import Image from "next/image"
import { NetworkStats } from "@/components/network-stats"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { getLatestReleaseInfo } from "@/lib/github-release"
import { mytConfig } from "@/lib/myt-config"
import {
  Download,
  ExternalLink,
  FileText,
  Github,
  MessageCircle,
  Terminal,
} from "lucide-react"

export const revalidate = 300

const navigationItems = [
  { label: "Download", href: "#download", external: false },
  { label: "Documentation / Whitepaper", href: "#whitepaper", external: false },
  { label: "Explorer (Mainnet + Testnet)", href: "#explorer", external: false },
  { label: "GitHub", href: mytConfig.links.githubRepo, external: true },
  { label: "Discord", href: mytConfig.links.discord, external: true },
]

export default async function Home() {
  const releaseInfo = await getLatestReleaseInfo()

  return (
    <div className="page-shell min-h-screen">
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-primary/20 bg-[#020204]">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex h-16 items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-black p-1 shadow-[0_0_0_1px_rgba(0,0,0,1)]">
                <Image
                  src="/myt_logo.png"
                  alt="MYT Logo"
                  width={32}
                  height={32}
                  className="h-7 w-7 rounded-[6px] object-cover"
                  priority
                />
              </div>
              <span className="text-xl font-bold">MYT</span>
            </div>

            <nav className="flex flex-1 items-center justify-end gap-4 overflow-x-auto text-sm">
              {navigationItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target={item.external ? "_blank" : undefined}
                  rel={item.external ? "noreferrer" : undefined}
                  className="whitespace-nowrap text-muted-foreground transition-colors hover:text-foreground"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>
        </div>
      </header>

      <section className="relative pt-28 pb-20 sm:pt-36 sm:pb-28">
        <div className="hero-top-transition absolute inset-0 -z-20"></div>
        <div className="container mx-auto px-4 sm:px-6">
          <div className="mx-auto max-w-5xl">
            <div className="mb-8 text-center">
              <Image
                src="/myt_logo.png"
                alt="MYT"
                width={96}
                height={96}
                className="mx-auto mb-6 h-24 w-24 rounded-2xl object-cover"
                priority
              />

              <Badge className="mb-6 border-cyan-400/40 bg-cyan-400/10 text-cyan-300">
                <span className="relative mr-1.5 flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-400"></span>
                </span>
                Mainnet Live
              </Badge>

              <h1 className="mb-6 text-balance text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">MYT</h1>
              <p className="mx-auto mb-10 max-w-3xl text-pretty text-lg text-muted-foreground sm:text-xl">
                {mytConfig.tagline}
              </p>

              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button size="lg" asChild className="w-full sm:w-auto">
                  <a href="#download">
                    <Download className="h-4 w-4" />
                    Download
                  </a>
                </Button>
                <Button size="lg" variant="outline" asChild className="w-full sm:w-auto bg-transparent">
                  <a href={mytConfig.links.githubRepo} target="_blank" rel="noreferrer">
                    View on GitHub
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>

            <NetworkStats />
          </div>
        </div>

      </section>

      <section id="download" className="py-20 sm:py-28">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">Download</h2>
            <p className="text-lg text-muted-foreground">Official binaries and source build instructions.</p>
          </div>

          <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-2">
            <Card className="border-border bg-card p-8">
              <h3 className="mb-3 text-2xl font-semibold">Windows Binary</h3>
              <p className="mb-6 text-muted-foreground">
                Direct link from GitHub Releases. Verify the checksum before running.
              </p>

              <Button asChild className="mb-4 w-full">
                <a href={releaseInfo.windowsAssetUrl} target="_blank" rel="noreferrer">
                  Download for Windows ({releaseInfo.tag})
                </a>
              </Button>

              <Button asChild variant="ghost" className="mb-6 w-full">
                <a href={releaseInfo.url} target="_blank" rel="noreferrer">
                  <Github className="h-4 w-4" />
                  View release details
                </a>
              </Button>

              <div className="rounded-lg border border-border/70 bg-muted/30 p-4">
                <div className="mb-2 text-xs uppercase tracking-wide text-muted-foreground">SHA256</div>
                <code className="block break-all text-sm">{releaseInfo.windowsSha256}</code>
              </div>

              <p className="mt-4 text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Antivirus will flag this - this is normal, here&apos;s why.</span>{" "}
                <a
                  href={mytConfig.links.antivirusExplanation}
                  target="_blank"
                  rel="noreferrer"
                  className="underline underline-offset-4"
                >
                  Read the short explanation
                </a>
                .
              </p>
            </Card>

            <Card className="border-border bg-card p-8">
              <h3 className="mb-3 text-2xl font-semibold">Linux</h3>
              <p className="mb-6 text-muted-foreground">Direct Linux binary from the official GitHub release.</p>

              <Button asChild variant="outline" className="mb-4 w-full bg-transparent">
                <a href={mytConfig.links.linuxBinary} target="_blank" rel="noreferrer">
                  <Download className="h-4 w-4" />
                  Download Linux (x86_64)
                </a>
              </Button>

              <Button asChild variant="ghost" className="mb-4 w-full">
                <a href={mytConfig.links.linuxRelease} target="_blank" rel="noreferrer">
                  <Terminal className="h-4 w-4" />
                  View release page
                </a>
              </Button>

              <p className="rounded-lg border border-border/70 bg-muted/30 p-3 text-sm text-muted-foreground">
                Seed Node P2P: <span className="font-medium text-foreground">87.106.240.3:39080</span>
                <br />
                Seed Node RPC: <span className="font-medium text-foreground">87.106.240.3:39081</span>
                <br />
                Seed Node: <span className="font-medium text-foreground">87.106.240.3, 67.217.244.109</span>
              </p>
            </Card>
          </div>
        </div>
      </section>

      <section id="technical" className="py-20 sm:py-28">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="mx-auto max-w-4xl">
            <div className="mb-10 text-center">
              <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">Technical Specs</h2>
              <p className="text-lg text-muted-foreground">Compact spec sheet for quick verification.</p>
            </div>

            <Card className="border-border bg-card p-6 sm:p-8">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <tbody>
                    {mytConfig.specs.map((item) => (
                      <tr key={item.label} className="border-b border-border/60 last:border-b-0">
                        <td className="py-3 pr-4 font-medium">{item.label}</td>
                        <td className="py-3 text-muted-foreground">{item.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p className="mt-6 text-sm text-muted-foreground">
                More implementation details are documented in the whitepaper.
                <a href="#whitepaper" className="ml-2 underline underline-offset-4">
                  Open Whitepaper section
                </a>
              </p>
            </Card>
          </div>
        </div>
      </section>

      <section id="whitepaper" className="py-20 sm:py-28">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="mx-auto max-w-5xl">
            <Card className="border-border bg-card p-8">
              <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <h2 className="text-3xl font-bold tracking-tight">Documentation / Whitepaper</h2>
                  <p className="text-muted-foreground">Whitepaper version: {mytConfig.whitepaper.version}</p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button asChild variant="outline" className="bg-transparent">
                    <a href={mytConfig.links.whitepaperRepo} target="_blank" rel="noreferrer">
                      <FileText className="h-4 w-4" />
                      Whitepaper Repo
                    </a>
                  </Button>
                  <Button asChild>
                    <a href={mytConfig.links.whitepaperPdf} target="_blank" rel="noreferrer">
                      Open Whitepaper PDF
                    </a>
                  </Button>
                </div>
              </div>

              <div className="overflow-hidden rounded-xl border border-border/70">
                <iframe
                  title="MYT Whitepaper PDF"
                  src={mytConfig.links.whitepaperPdf}
                  className="h-[560px] w-full"
                />
              </div>
            </Card>
          </div>
        </div>
      </section>

      <section id="explorer" className="py-20 sm:py-28">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">Explorer Links</h2>
            <p className="text-lg text-muted-foreground">Mainnet and Testnet are linked directly below.</p>
          </div>

          <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
            <Card className="border-primary/30 bg-card p-8 shadow-[0_0_45px_-28px_rgba(67,191,255,0.65)]">
              <h3 className="mb-2 text-2xl font-semibold">Mainnet Explorer</h3>
              <p className="mb-6 text-muted-foreground">{mytConfig.links.explorerMainnet}</p>
              <Button asChild className="w-full">
                <a href={mytConfig.links.explorerMainnet} target="_blank" rel="noreferrer">
                  Open Mainnet
                </a>
              </Button>
            </Card>

            <Card className="border-primary/20 bg-card p-8 shadow-[0_0_45px_-28px_rgba(93,227,255,0.5)]">
              <h3 className="mb-2 text-2xl font-semibold">Testnet Explorer</h3>
              <p className="mb-6 text-muted-foreground">{mytConfig.links.explorerTestnet}</p>
              <Button asChild variant="outline" className="w-full bg-transparent">
                <a href={mytConfig.links.explorerTestnet} target="_blank" rel="noreferrer">
                  Open Testnet
                </a>
              </Button>
            </Card>
          </div>
        </div>
      </section>

      <section id="community" className="py-20 sm:py-28">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">Community</h2>
            <p className="text-lg text-muted-foreground">Join MYT development and discussion channels.</p>
          </div>

          <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
            <Card className="border-border bg-card p-6">
              <h3 className="mb-3 text-xl font-semibold">Discord</h3>
              <Button asChild className="w-full">
                <a href={mytConfig.links.discord} target="_blank" rel="noreferrer">
                  <MessageCircle className="h-4 w-4" />
                  Join Discord
                </a>
              </Button>
            </Card>

            <Card className="border-border bg-card p-6">
              <h3 className="mb-3 text-xl font-semibold">GitHub</h3>
              <Button asChild variant="outline" className="w-full bg-transparent">
                <a href={mytConfig.links.githubRepo} target="_blank" rel="noreferrer">
                  <Github className="h-4 w-4" />
                  Open Repository
                </a>
              </Button>
            </Card>

            <Card className="border-border bg-card p-6">
              <h3 className="mb-3 text-xl font-semibold">BitcoinTalk ANN</h3>
              <Button asChild variant="outline" className="w-full bg-transparent">
                <a href={mytConfig.links.bitcointalkAnn} target="_blank" rel="noreferrer">
                  Open ANN Thread
                </a>
              </Button>
            </Card>
          </div>
        </div>
      </section>

      <footer className="border-t border-border py-12">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="mx-auto flex max-w-5xl flex-col gap-4 text-center">
            <p className="text-base font-semibold">No ICO. No premine. No team allocation.</p>
            <p className="text-sm text-muted-foreground">
              Disclaimer: MYT is experimental open-source software and not a financial product.
            </p>
            <p className="text-sm text-muted-foreground">
              Community-driven website: This page is maintained by the community and is not hosted by the MYT core team.
            </p>
            <p className="text-sm text-muted-foreground">
              Hosting provided by{" "}
              <a href="https://xbinor.io/" target="_blank" rel="noreferrer" className="underline underline-offset-4">
                xbinor.io
              </a>
              .
            </p>
            <p className="text-sm text-muted-foreground">
              Latest release: {releaseInfo.tag} ({releaseInfo.publishedAt})
            </p>
            <p className="text-xs text-muted-foreground/80">MYT</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
