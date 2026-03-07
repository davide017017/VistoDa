// Dominio ufficiale produzione (cambialo solo qui)
const PROD_DOMAIN = "vistoda.netlify.app"; // URL Netlify (lo aggiorniamo dopo se hai dominio custom)

// Backend produzione (cambialo solo qui)
const PROD_API_URL = "https://vistoda-backend.onrender.com"; // ← URL Render reale

// Backend sviluppo locale
const DEV_API_URL = "http://127.0.0.1:8000";

// Ambiente automatico
const isDev = !location.hostname.includes(PROD_DOMAIN);

export const API_BASE_URL = isDev ? DEV_API_URL : PROD_API_URL;
