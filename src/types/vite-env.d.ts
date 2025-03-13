/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_TON_API_KEY: string;
  readonly VITE_TON_ENDPOINT: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
} 