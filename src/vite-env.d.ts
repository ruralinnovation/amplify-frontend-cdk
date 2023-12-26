/// <reference types="vite/client.d.ts" />

interface ImportMetaEnv {
  readonly VITE_APP_VERSION: string
  readonly VITE_AMP_BACKEND_API: string
  readonly VITE_MAPBOX_TOKEN: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
