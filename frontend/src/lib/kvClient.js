import { Redis } from '@upstash/redis';

// Vercel KV / Upstash Redis configuration
// When deployed on Vercel, attach Upstash KV from Vercel Storage.
// In development or custom environments, specify VITE_KV_REST_API_URL and VITE_KV_REST_API_TOKEN.
const rawUrl =
  import.meta.env.VITE_KV_REST_API_URL ||
  import.meta.env.VITE_UPSTASH_REDIS_REST_URL ||
  '';

const rawToken =
  import.meta.env.VITE_KV_REST_API_TOKEN ||
  import.meta.env.VITE_UPSTASH_REDIS_REST_TOKEN ||
  '';

export const isKVConfigured = () => Boolean(rawUrl && rawToken);

export const kv = isKVConfigured()
  ? new Redis({ url: rawUrl, token: rawToken })
  : null;

export const KV_KEYS = {
  SCHOOLS: 'techexpo:schools_v1',
  WEIGHTS: 'techexpo:weights_v1',
  LAST_SYNCED: 'techexpo:last_synced_v1',
};

/**
 * Ping the Vercel KV / Upstash Redis instance to verify connection and latency
 */
export async function pingKV() {
  if (!kv) return { ok: false, error: 'Database credentials not configured' };
  const start = Date.now();
  try {
    const res = await kv.ping();
    return { ok: true, latency: Date.now() - start, response: res };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

/**
 * Push all schools to Vercel KV
 */
export async function syncSchoolsToKV(schools) {
  if (!kv) return { ok: false, error: 'Database credentials not configured' };
  try {
    await kv.set(KV_KEYS.SCHOOLS, schools);
    await kv.set(KV_KEYS.LAST_SYNCED, new Date().toISOString());
    return { ok: true };
  } catch (err) {
    console.error('Vercel KV sync error:', err);
    return { ok: false, error: err.message };
  }
}

/**
 * Pull all schools from Vercel KV
 */
export async function fetchSchoolsFromKV() {
  if (!kv) return null;
  try {
    const data = await kv.get(KV_KEYS.SCHOOLS);
    return Array.isArray(data) && data.length > 0 ? data : null;
  } catch (err) {
    console.error('Vercel KV fetch error:', err);
    return null;
  }
}

/**
 * Push criteria weights to Vercel KV
 */
export async function syncWeightsToKV(weights) {
  if (!kv) return { ok: false, error: 'Database credentials not configured' };
  try {
    await kv.set(KV_KEYS.WEIGHTS, weights);
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

/**
 * Pull criteria weights from Vercel KV
 */
export async function fetchWeightsFromKV() {
  if (!kv) return null;
  try {
    const weights = await kv.get(KV_KEYS.WEIGHTS);
    return weights && typeof weights === 'object' ? weights : null;
  } catch (err) {
    return null;
  }
}
