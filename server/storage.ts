// Preconfigured storage helpers for Manus WebDev templates
// Uses the Biz-provided storage proxy (Authorization: Bearer <token>)
// Includes retry with exponential backoff for transient S3/R2 errors (503, 500, 429)

import { ENV } from './_core/env';

type StorageConfig = { baseUrl: string; apiKey: string };

const MAX_RETRIES = 5;
const INITIAL_DELAY_MS = 500;
const RETRYABLE_STATUS_CODES = [500, 502, 503, 429];

function getStorageConfig(): StorageConfig {
  const baseUrl = ENV.forgeApiUrl;
  const apiKey = ENV.forgeApiKey;

  if (!baseUrl || !apiKey) {
    throw new Error(
      "Storage proxy credentials missing: set BUILT_IN_FORGE_API_URL and BUILT_IN_FORGE_API_KEY"
    );
  }

  return { baseUrl: baseUrl.replace(/\/+$/, ""), apiKey };
}

function buildUploadUrl(baseUrl: string, relKey: string): URL {
  const url = new URL("v1/storage/upload", ensureTrailingSlash(baseUrl));
  url.searchParams.set("path", normalizeKey(relKey));
  return url;
}

async function buildDownloadUrl(
  baseUrl: string,
  relKey: string,
  apiKey: string
): Promise<string> {
  const downloadApiUrl = new URL(
    "v1/storage/downloadUrl",
    ensureTrailingSlash(baseUrl)
  );
  downloadApiUrl.searchParams.set("path", normalizeKey(relKey));
  const response = await fetchWithRetry(downloadApiUrl.toString(), {
    method: "GET",
    headers: buildAuthHeaders(apiKey),
  });
  return (await response.json()).url;
}

function ensureTrailingSlash(value: string): string {
  return value.endsWith("/") ? value : `${value}/`;
}

function normalizeKey(relKey: string): string {
  return relKey.replace(/^\/+/, "");
}

function toFormData(
  data: Buffer | Uint8Array | string,
  contentType: string,
  fileName: string
): FormData {
  const blob =
    typeof data === "string"
      ? new Blob([data], { type: contentType })
      : new Blob([data as any], { type: contentType });
  const form = new FormData();
  form.append("file", blob, fileName || "file");
  return form;
}

function buildAuthHeaders(apiKey: string): HeadersInit {
  return { Authorization: `Bearer ${apiKey}` };
}

async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchWithRetry(
  url: string | URL,
  init: RequestInit,
  maxRetries = MAX_RETRIES
): Promise<Response> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, init);

      if (response.ok || !RETRYABLE_STATUS_CODES.includes(response.status)) {
        return response;
      }

      // Retryable status code
      lastError = new Error(
        `Storage request failed (${response.status} ${response.statusText})`
      );

      if (attempt < maxRetries) {
        const delay = INITIAL_DELAY_MS * Math.pow(2, attempt) + Math.random() * 200;
        console.warn(
          `[Storage] Retry ${attempt + 1}/${maxRetries} after ${response.status} error, waiting ${Math.round(delay)}ms...`
        );
        await sleep(delay);
      }
    } catch (err) {
      // Network error (timeout, DNS, etc.)
      lastError = err instanceof Error ? err : new Error(String(err));

      if (attempt < maxRetries) {
        const delay = INITIAL_DELAY_MS * Math.pow(2, attempt) + Math.random() * 200;
        console.warn(
          `[Storage] Retry ${attempt + 1}/${maxRetries} after network error, waiting ${Math.round(delay)}ms...`
        );
        await sleep(delay);
      }
    }
  }

  throw lastError ?? new Error("Storage request failed after all retries");
}

export async function storagePut(
  relKey: string,
  data: Buffer | Uint8Array | string,
  contentType = "application/octet-stream"
): Promise<{ key: string; url: string }> {
  const { baseUrl, apiKey } = getStorageConfig();
  const key = normalizeKey(relKey);
  const uploadUrl = buildUploadUrl(baseUrl, key);
  const formData = toFormData(data, contentType, key.split("/").pop() ?? key);
  const response = await fetchWithRetry(uploadUrl.toString(), {
    method: "POST",
    headers: buildAuthHeaders(apiKey),
    body: formData,
  });

  if (!response.ok) {
    const message = await response.text().catch(() => response.statusText);
    throw new Error(
      `Storage upload failed (${response.status} ${response.statusText}): ${message}`
    );
  }
  const url = (await response.json()).url;
  return { key, url };
}

export async function storageGet(relKey: string): Promise<{ key: string; url: string; }> {
  const { baseUrl, apiKey } = getStorageConfig();
  const key = normalizeKey(relKey);
  return {
    key,
    url: await buildDownloadUrl(baseUrl, key, apiKey),
  };
}
