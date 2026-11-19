import Image from "next/image"
import {
  ArrowDownToLine, ArrowRight, ArrowUpRight, Box, Cpu, LockKeyhole,
  Monitor, ShieldCheck, Terminal,
} from "lucide-react"
import { NetworkStats } from "@/components/network-stats"
import { mytConfig } from "@/lib/myt-config"

const links = mytConfig.links
const release = mytConfig.mainnetRelease
const features = [
  { icon: LockKeyhole, name: "Private transactions", detail: "Stealth addresses, ring signatures, and confidential amounts protect transaction details on-chain." },
  { icon: Cpu, name: "CPU-first mining", detail: "RandomX proof of work is designed for general-purpose processors." },
  { icon: Box, name: "Fixed supply", detail: "A maximum of 21 million MYT, with rewards halving on a fixed block schedule." },
]

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <header className="site-header">
        <div className="wrap nav">
          <a className="brand" href="#top" aria-label="MYT home">
            <Image src="/myt_logo.png" alt="" width={32} height={32} className="brand-icon" />
            MYT
          </a>
          <nav aria-label="Main navigation">
            <a href="#protocol">Protocol</a>
            <a href="#machine">Machine</a>
            <a href="#explorer">Explorer</a>
          </nav>
          <a className="button button-nav" href="#download">Download</a>
        </div>
      </header>

      <main id="main">
        <section className="hero" id="top" aria-labelledby="hero-title">
          <div className="wrap hero-inner">
            <div className="hero-copy">
              <p className="eyebrow hero-eyebrow">MYT &nbsp;·&nbsp; Privacy settlement</p>
              <h1 id="hero-title">Private by design.<br /><span>Built to settle.</span></h1>
              <p className="hero-subtitle">
                An open-source proof-of-work network for confidential payments and machine-to-machine settlement.
              </p>
              <div className="hero-actions">
                <a className="button button-primary" href="#download">Get MYT <ArrowDownToLine size={17} aria-hidden="true" /></a>
                <a className="text-link" href={links.whitepaperPdf}>Read the whitepaper <ArrowUpRight size={16} aria-hidden="true" /></a>
              </div>
            </div>
            <div className="hero-visual" aria-hidden="true">
              <Image src="/myt-hero.webp" alt="" fill sizes="(max-width: 760px) 100vw, 58vw" preload />
            </div>
          </div>
        </section>

        <section id="explorer" className="network-section" aria-label="Mainnet network and explorers">
          <div className="wrap">
            <NetworkStats />
            <div className="explorer-links">
              <a href={links.explorerMainnet}>Mainnet explorer <ArrowUpRight size={15} aria-hidden="true" /></a>
              <a href={links.explorerTestnet}>Testnet explorer <ArrowUpRight size={15} aria-hidden="true" /></a>
            </div>
          </div>
        </section>

        <section id="protocol" className="section section-light">
          <div className="wrap">
            <div className="section-intro">
              <p className="eyebrow">The protocol</p>
              <h2>Privacy at the<br className="desktop-break" /> protocol level.</h2>
              <a className="text-link" href={links.whitepaperPdf}>Whitepaper {mytConfig.whitepaperVersion} <ArrowUpRight size={17} aria-hidden="true" /></a>
            </div>
            <div className="feature-grid">
              {features.map(({ icon: Icon, name, detail }) => (
                <article className="feature" key={name}>
                  <Icon size={29} strokeWidth={1.55} aria-hidden="true" />
                  <h3>{name}</h3>
                  <p>{detail}</p>
                </article>
              ))}
            </div>
            <dl className="specs">
              {mytConfig.specs.map(({ label, value }) => (
                <div key={label}><dt>{label}</dt><dd>{value}</dd></div>
              ))}
            </dl>
          </div>
        </section>

        <section id="machine" className="section section-machine">
          <div className="wrap machine-panel">
            <div className="machine-copy">
              <p className="eyebrow">MYT Machine</p>
              <h2>Give agents a way<br className="desktop-break" /> to settle.</h2>
              <p>Wallet settlement, signed machine identities, invoices and selectively disclosed settlement claims.</p>
              <a className="text-link" href={links.machineRelease}>View the release candidate <ArrowUpRight size={17} aria-hidden="true" /></a>
            </div>
            <div className="claim-card">
              <div className="claim-title"><ShieldCheck size={22} aria-hidden="true" /> Example claim</div>
              <code>verified_recipient_<wbr />settlement_events <span>&gt;= 25</span></code>
              <p>The evaluator attests the threshold. The recipient can prove it while keeping the exact count private.</p>
              <span className="review-status">External cryptographic review pending</span>
            </div>
          </div>
        </section>

        <section id="download" className="section section-light section-download">
          <div className="wrap">
            <div className="section-intro">
              <p className="eyebrow">{release.tag}</p>
              <h2>Download MYT.</h2>
              <a className="text-link" href={release.releaseUrl}>Release details <ArrowUpRight size={17} aria-hidden="true" /></a>
            </div>
            <div className="download-grid">
              {release.assets.map((asset) => {
                const Icon = asset.platform === "Windows" ? Monitor : Terminal
                return (
                  <article key={asset.platform} className="download-card">
                    <Icon size={30} strokeWidth={1.55} aria-hidden="true" />
                    <div className="download-title">
                      <h3>{asset.platform}</h3>
                      <p>{asset.format}</p>
                    </div>
                    <a className="button button-primary" href={asset.url}>Download {asset.platform} <ArrowDownToLine size={16} aria-hidden="true" /></a>
                    <details>
                      <summary>Package SHA-256</summary>
                      <code>{asset.sha256}</code>
                    </details>
                  </article>
                )
              })}
            </div>
            <p className="download-note">Verify the package checksum before running it. For this Windows release, choose Local Mode in the launcher.</p>
            <a className="text-link" href={links.core}>Build from source <ArrowRight size={16} aria-hidden="true" /></a>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="wrap footer-inner">
          <a className="brand" href="#top"><Image src="/myt_logo.png" alt="" width={29} height={29} className="brand-icon" /> MYT</a>
          <nav aria-label="Community and documentation">
            <a href={links.githubRepo}>GitHub</a>
            <a href={links.discord}>Discord</a>
            <a href={links.bitcointalk}>BitcoinTalk</a>
            <a href={links.whitepaperRepo}>Whitepaper source</a>
          </nav>
        </div>
      </footer>
    </>
  )
}
