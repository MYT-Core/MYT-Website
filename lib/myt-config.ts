const core = "https://github.com/MYT-Core/MYT"
const tag = "v1.0.3-mainnet"
const releaseUrl = core + "/releases/tag/" + tag
const assetBase = core + "/releases/download/" + tag + "/"

export const mytConfig = {
  links: {
    githubRepo: "https://github.com/MYT-Core",
    core,
    whitepaperRepo: "https://github.com/MYT-Core/MYT-Whitepaper",
    whitepaperPdf: "/MYT_Whitepaper_v1.4.pdf",
    explorerMainnet: "https://explorer.myt-coin.com/",
    explorerTestnet: "https://testnet-explorer.myt-coin.com/",
    machineRepo: "https://github.com/MYT-Core/MYT-Machine",
    machineRelease: "https://github.com/MYT-Core/MYT-Machine/releases/tag/v0.6.0-rc2",
    discord: "https://discord.gg/nuWjx7kvqp",
    bitcointalk: "https://bitcointalk.org/index.php?topic=5577468.0",
  },
  mainnetRelease: {
    tag,
    releaseUrl,
    assets: [
      {
        platform: "Windows",
        format: "x86-64 · ZIP",
        url: assetBase + "myt-v1.0.3-mainnet-win64.zip",
        sha256: "05ff36f3a80c307f5d226de1d8512266c2f8c859f4d64f34ac40a377909ee9eb",
      },
      {
        platform: "Linux",
        format: "x86-64 · TAR.GZ",
        url: assetBase + "myt-v1.0.3-mainnet-linux-x86_64.tar.gz",
        sha256: "6cad7d36fc18d477ca9ca92110f97547e2f9fe04e59c1d0c78f252621910ba53",
      },
    ],
  },
  whitepaperVersion: "v1.4",
  specs: [
    { label: "Proof of work", value: "RandomX" },
    { label: "Block target", value: "60 seconds" },
    { label: "Maximum supply", value: "21,000,000 MYT" },
    { label: "Ring size", value: "16" },
    { label: "Mainnet ports", value: "39080 (P2P) · 39081 (RPC)" },
    { label: "Halving interval", value: "2,102,400 blocks" },
  ],
} as const
