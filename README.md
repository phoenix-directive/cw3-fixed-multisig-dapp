## Preview

<p align="center" width="100%">
    <img alt="cw3-fixed-multisig preview" src="https://i.imgur.com/92xnXyC.gif">
</p>

## Summary

This project creates a web UI around the [CosmWasm/cw-plus](https://github.com/CosmWasm/cw-plus/) [`cw3-fixed-multisig`](https://github.com/CosmWasm/cw-plus/tree/main/contracts/cw3-fixed-multisig) smart contract. Users can:

- Create an instance of `cw3-fixed-multisig` smart contract
- View proposals for a previously instantiated multisig
- Create proposals for sending funds from the multisig
- Vote on proposals created by other users of the multisig
- Execute proposals that have reached sufficient approval vote threshold

## Proposal List UI

The proposal list UI provides icons indicating proposal status:

<img alt="cw3-fixed-multisig-proposal-status-ui table" src="https://i.imgur.com/P5FDDJ8.png">

## Development

This project has been migrated to **Vite** for modern, fast development with static build output that requires no server.

```bash
git clone https://github.com/ebaker/cw3-fixed-multisig-dapp
```

First, setup your `.env` file by copying the example:

```bash
cd cw3-fixed-multisig-dapp
cp .env.example .env.local
```

Install dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) with your browser to see the result.

## Build for Production

Build the app for production to create a static site that can be hosted anywhere:

```bash
npm run build
```

The built files will be in the `dist/` directory. You can preview the production build locally:

```bash
npm run preview
```

## Deployment

Since this is now a static site (no server needed), you can deploy the `dist/` folder to any static hosting service:

### Environment Variables for Production

**IMPORTANT**: When deploying, you MUST configure your environment variables in your hosting platform. The app will not work without them.

Required environment variables:
- `VITE_CHAIN_ID` - The chain ID (e.g., `lucina`, `juno-1`)
- `VITE_CHAIN_NAME` - Display name of the chain (e.g., `Juno`)
- `VITE_CHAIN_BECH32_PREFIX` - Address prefix (e.g., `juno`)
- `VITE_CHAIN_RPC_ENDPOINT` - RPC endpoint URL
- `VITE_CHAIN_REST_ENDPOINT` - REST API endpoint URL
- `VITE_STAKING_DENOM` - Staking denomination (e.g., `ujuno`)
- `VITE_SITE_TITLE` - Site title
- `VITE_SITE_ICON_URL` - Site icon URL
- `VITE_MULTISIG_CODE_ID` - Multisig contract code ID

### Cloudflare Pages Deployment

If deploying to Cloudflare Pages:

1. Set up your environment variables in the Cloudflare dashboard:
   - Go to Workers & Pages → Your project → Settings → Environment variables
   - Add all the required `VITE_*` variables listed above
   - **Important**: Set them for the Production environment

2. Build command: `npm run build`
3. Output directory: `dist`
4. Root directory: `/`

### Other Hosting Platforms

- **GitHub Pages** - Use GitHub Actions and set repository secrets
- **Vercel** - Add environment variables in Project Settings → Environment Variables
- **Netlify** - Add environment variables in Site settings → Build & deploy → Environment
- **AWS S3 + CloudFront** - Environment variables must be set at build time

Simply upload the contents of the `dist/` directory after running `npm run build` with environment variables configured.

## Requirements

Please ensure you have the [Keplr wallet extension](https://chrome.google.com/webstore/detail/keplr/dmkamcknogkgcdfhhbddcghachkejeap) installed in your Chrome based browser (Chrome, Brave, etc).

## Learn More

To learn more about the technologies used:

- [Vite Documentation](https://vitejs.dev/guide/) - learn about Vite features and configuration.
- [React Documentation](https://react.dev/) - learn about React.
- [React Router Documentation](https://reactrouter.com/) - routing for React apps.
- [CosmJS Repository](https://github.com/cosmos/cosmjs) - JavaScript library for Cosmos ecosystem.
- [@cosmjs/cosmwasm-stargate Documentation](https://cosmos.github.io/cosmjs/latest/cosmwasm-stargate/modules.html) - CosmJS CosmWasm Stargate module documentation.
- [Keplr Wallet Documentation](https://docs.keplr.app/api/cosmjs.html) - using Keplr wallet with CosmJS.
- [Tailwind CSS Documentation](https://tailwindcss.com/docs) - utility-first CSS framework.
- [DaisyUI Documentation](https://daisyui.com/docs/use) - lightweight component library built on [tailwindcss](https://tailwindcss.com/).
