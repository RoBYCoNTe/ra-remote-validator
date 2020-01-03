let appUrl = `//${document.location.host}/`;
if (appUrl.endsWith(":3000/")) {
  appUrl = "//dev.local:8880/";
}
export const APP_URL = appUrl;
export const API_URL = `${APP_URL}api`;
export const VERSION = "1.0.0";
