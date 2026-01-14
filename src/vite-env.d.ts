/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CHAIN_ID: string
  readonly VITE_CHAIN_NAME: string
  readonly VITE_CHAIN_BECH32_PREFIX: string
  readonly VITE_CHAIN_RPC_ENDPOINT: string
  readonly VITE_CHAIN_REST_ENDPOINT: string
  readonly VITE_STAKING_DENOM: string
  readonly VITE_SITE_TITLE: string
  readonly VITE_SITE_ICON_URL: string
  readonly VITE_MULTISIG_CODE_ID: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
