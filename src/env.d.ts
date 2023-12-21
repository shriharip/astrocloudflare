/// <reference types="astro/client" />
/// <reference path="../.astro/types.d.ts" />interface ImportMetaEnv {
	interface ImportMetaEnv {
    readonly TURSO_URL: string;
    readonly TURSO_PROD_URL: string;
    readonly TURSO_AUTH_TOKEN: string;
    readonly TURSO_PROD_AUTH_TOKEN: string;
    readonly RESEND_KEY: string;
    readonly SPNRS_SECRET: string;
    readonly POSTHOG_API_KEY: string;
    readonly POSTHOG_HOST: string;
  }
	
	interface ImportMeta {
		readonly env: ImportMetaEnv;
	}