// ─────────────────────────────────────────────────────────────────────────────
//  Club_Hub Client Data Bridge
//  Note: In Vite React SPA architecture, database operations run exclusively
//  on the backend (Express.js on port 4000). The frontend communicates via
//  REST API (fetchApi).
// ─────────────────────────────────────────────────────────────────────────────

import { fetchApi, API_BASE } from "./api";

/**
 * Client-safe data helper redirecting direct DB queries to backend REST endpoints.
 */
export const clientApi = {
  get: (endpoint: string, token?: string) => fetchApi(endpoint, { method: "GET" }, token),
  post: (endpoint: string, body?: any, token?: string) =>
    fetchApi(endpoint, { method: "POST", body: body ? JSON.stringify(body) : undefined }, token),
  patch: (endpoint: string, body?: any, token?: string) =>
    fetchApi(endpoint, { method: "PATCH", body: body ? JSON.stringify(body) : undefined }, token),
  delete: (endpoint: string, token?: string) => fetchApi(endpoint, { method: "DELETE" }, token),
};

export { API_BASE };
export default clientApi;

