/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BASE_URL: string
  readonly VITE_ENV: string
  // 更多变量...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}