# MYT website

Use Node.js 22 or newer and the pnpm version declared in package.json.

```sh
pnpm install --frozen-lockfile
pnpm typecheck
pnpm dev
```

Run pnpm build for a production build and pnpm start for a Node deployment.
On Vercel, use the Next.js preset and the tracked pnpm lockfile.

The downloads in lib/myt-config.ts bind each binary to the exact Mainnet tag
and SHA-256 digest. Update the tag, both asset names, and both verified digests
together when publishing new Core binaries.

The statistics route reads one HTTPS endpoint. It defaults to the Mainnet
Explorer home page. To use a single JSON endpoint, set the server-side
MYT_MAINNET_EXPLORER_STATS_URL to its full HTTPS URL. Accepted JSON fields
include height, hash_rate and running_nodes, optionally under data. For the
previous MYT_MAINNET_EXPLORER_API_URL setting, replace the base URL with the
complete URL in the new variable. The response is cached for 30 seconds.

The default statistics source is the explorer JSON endpoint /api/networkinfo,
not the slower HTML homepage. MYT_MAINNET_EXPLORER_STATS_URL can override it.
If the upstream does not provide a node count, the UI leaves that value unknown;
peer counts are not presented as a network-wide node count.
