export const mytConfig = {
  tagline:
    "A Privacy-Preserving Settlement Layer for Machines, AI Agents, and Enterprises.",
  links: {
    githubRepo: "https://github.com/myt-core",
    githubReleases: "https://github.com/myt-core/MYT/releases",
    windowsBinary: "https://github.com/myt-core/MYT/releases/latest",
    documentation: "https://github.com/MYT-Core/MYT-Whitepaper",
    whitepaperRepo: "https://github.com/MYT-Core/MYT-Whitepaper",
    whitepaperPdf: "/MYT_Whitepaper_v1.3.pdf",
    explorerMainnet: "https://explorer.myt-coin.com/",
    explorerTestnet: "https://testnet-explorer.myt-coin.com/",
    discord: "https://discord.gg/nuWjx7kvqp",
    linuxRelease: "https://github.com/MYT-Core/MYT/releases/tag/v.1.0.1-mainnet.1",
    linuxBinary:
      "https://github.com/MYT-Core/MYT/releases/download/v.1.0.1-mainnet.1/myt-v1.0.1-mainnet.1-linux-x86_64.tar.gz",
    antivirusExplanation:
      "https://github.com/myt-core/MYT/releases",
    bitcointalkAnn: "https://bitcointalk.org/index.php?topic=5577468.0",
  },
  download: {
    windowsSha256:
      "143c2deee12f40c5956e53a0c57c378cd11c8ddab649f53db2c414b51810aded",
  },
  whitepaper: {
    version: "v1.3",
  },
  release: {
    version: "v1.0.0-mainnet.3",
    date: "2026-03-09",
  },
  specs: [
    { label: "Algorithm", value: "CryptoNight then RandomX (CPU-first)" },
    { label: "Block Time", value: "60 seconds" },
    { label: "Supply", value: "21,000,000 MYT max" },
    { label: "Halving", value: "Every ~4 years" },
    { label: "Ring Size", value: "16" },
    { label: "Ports", value: "P2P 39080 / RPC 39081" },
    { label: "Seed Node", value: "87.106.240.3, 67.217.244.109" },
  ],
} as const
