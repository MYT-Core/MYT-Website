const core = "https://github.com/MYT-Core/MYT"
const tag = "v1.0.2-mainnet"
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
    machineRelease: "https://github.com/MYT-Core/MYT-Machine/releases/tag/v0.6.0-rc1",
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
        url: assetBase + "myt-v1.0.2-mainnet-win64.zip",
        sha256: "18981435922ada2d8556fc8af77a1b45c6d0e86400666fd2223831f1873753b3",
      },
      {
        platform: "Linux",
        format: "x86-64 · TAR.GZ",
        url: assetBase + "myt-v1.0.2-mainnet-linux-x86_64.tar.gz",
        sha256: "0850f8d4c6edb5e7fc8a7fda2aa107e8915db0f44a34a9824d3a49971a6ac973",
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
