const isLocalhost = window.location.hostname === "localhost";

export const BASE_URL = isLocalhost
  ? "http://localhost/meditracksystem/api"
  : "http://dctcontrichy.com/meditrack/api";