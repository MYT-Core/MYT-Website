import Image from "next/image"
import {
  ArrowDownToLine, ArrowRight, ArrowUpRight, BadgeCheck, Box, Cpu, EyeOff, Fingerprint,
  Link2, LockKeyhole, Monitor, ReceiptText, ShieldCheck, Terminal, Wallet,
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

const machineModules = [
  { icon: Wallet, phase: "4A", name: "Settlement", detail: "Exact-amount payments, wallet-local status, native payment proofs and wallet signatures through your own myt-wallet-rpc." },
  { icon: Fingerprint, phase: "4B", name: "Machine identity", detail: "Offline Ed25519 identities and challenge-response authentication. No wallet, network or registry needed." },
  { icon: Link2, phase: "4C", name: "Address binding", detail: "A two-sided, signed proof that a machine identity controls a settlement address, disclosed only when you choose." },
  { icon: ReceiptText, phase: "4D", name: "Invoices & billing", detail: "Immutable payment requests and invoices that turn PAID only on a verified, invoice-bound payment proof." },
  { icon: BadgeCheck, phase: "4E", name: "Reputation", detail: "Signed opinions, revocations and a local, explicit trust policy. No global score, no hidden ranking." },
  { icon: EyeOff, phase: "4F", name: "Selective disclosure", detail: "Prove a claim such as “at least 25 verified settlements” without revealing the exact count or history." },
]

const machineFlow = [
  { title: "Identify", detail: "The agent creates an offline machine identity and binds it to its MYT address." },
  { title: "Request", detail: "A service issues a signed payment request and a persistent invoice." },
  { title: "Pay", detail: "The agent pays the exact amount from its own wallet. No custodian, no API credits." },
  { title: "Prove", detail: "A native payment proof marks the invoice PAID after ten confirmations." },
  { title: "Build trust", detail: "Verified settlements feed reputation claims the agent can disclose selectively." },
]

const sdkExample = `from pathlib import Path
from myt_machine import MachineSettlement, RpcConfig, WalletRpcClient

password = Path("/secure/agent-a.rpc-password").read_text().rstrip("\\r\\n")
client = WalletRpcClient(RpcConfig(
    url="http://127.0.0.1:38083",
    username="agent-a",
    password=password,
    timeout=10,
))
settlement = MachineSettlement(client, account_index=0, address_index=0)

print(settlement.status())
print(settlement.balance())`

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
              <Image src="/myt_logo.png" alt="" fill sizes="(max-width: 760px) 100vw, 58vw" preload />
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
          <div className="wrap">
            <div className="machine-hero">
              <p className="eyebrow">MYT Machine</p>
              <h2>Give agents a way<br className="desktop-break" /> to settle.</h2>
              <p className="machine-lead">
                An open-source Python SDK and CLI that lets software agents pay, invoice, prove payments and
                build reputation on MYT, without accounts, API keys or a custodian. Everything runs
                off-chain on top of your own wallet. The base chain stays a neutral settlement layer.
              </p>
              <div className="machine-actions">
                <a className="button button-primary" href={links.machineRepo}>Explore MYT Machine <ArrowUpRight size={16} aria-hidden="true" /></a>
                <a className="text-link" href={links.machineRelease}>Release candidate notes <ArrowUpRight size={16} aria-hidden="true" /></a>
              </div>
            </div>

            <div className="machine-grid">
              {machineModules.map(({ icon: Icon, phase, name, detail }) => (
                <article className="machine-module" key={phase}>
                  <div className="module-head">
                    <Icon size={24} strokeWidth={1.6} aria-hidden="true" />
                    <span>{phase}</span>
                  </div>
                  <h3>{name}</h3>
                  <p>{detail}</p>
                </article>
              ))}
            </div>

            <div className="machine-flow" aria-label="How an agent settles with MYT Machine">
              <h3>How an agent settles</h3>
              <ol>
                {machineFlow.map(({ title, detail }, index) => (
                  <li key={title}>
                    <span className="flow-step">{String(index + 1).padStart(2, "0")}</span>
                    <strong>{title}</strong>
                    <p>{detail}</p>
                  </li>
                ))}
              </ol>
            </div>

            <div className="machine-panel">
              <div className="code-card">
                <div className="code-title"><Terminal size={17} aria-hidden="true" /> Python SDK</div>
                <pre><code>{sdkExample}</code></pre>
              </div>
              <div className="claim-card">
                <div className="claim-title"><ShieldCheck size={22} aria-hidden="true" /> Selective disclosure claim</div>
                <code>verified_recipient_<wbr />settlement_events <span>&gt;= 25</span></code>
                <p>
                  The evaluator attests the threshold from verified settlements. The agent proves it with a
                  randomized BBS presentation while the exact count, history and counterparties stay private.
                </p>
                <ul className="status-list">
                  <li><span className="dot dot-ok" /> 4A–4E released and tested on Linux and Windows</li>
                  <li><span className="dot dot-wait" /> 4F (BBS disclosure) in release-candidate review</li>
                  <li><span className="dot dot-wait" /> Independent cryptographic review pending</li>
                </ul>
              </div>
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
            <p className="download-note">Verify the package checksum before running it. The Windows launcher's online mode asks for your node's TLS certificate fingerprint; without one, use Mining Mode with a local node.</p>
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
