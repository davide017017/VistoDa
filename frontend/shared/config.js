// Dominio ufficiale produzione (cambialo solo qui)
const PROD_DOMAIN = "vistoda.com";

// Backend produzione (cambialo solo qui)
const PROD_API_URL = "https://api.vistoda.com";

// Backend sviluppo locale
const DEV_API_URL = "http://127.0.0.1:8000";

// Ambiente automatico
const isDev = !location.hostname.includes(PROD_DOMAIN);

export const API_BASE_URL = isDev ? DEV_API_URL : PROD_API_URL;
