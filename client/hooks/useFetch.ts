import { useEffect, useState } from "react";

interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

// Responses are kept for the session, so a page or tab opened again renders at once
// instead of flashing a loading state in the middle of its transition.
const cache = new Map<string, unknown>();
const pending = new Map<string, Promise<unknown>>();

export function load(url: string): Promise<unknown> {
  let request = pending.get(url);
  if (!request) {
    request = fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`${res.status}`);
        return res.json();
      })
      .then((data) => {
        cache.set(url, data);
        return data;
      });
    // A failed request can be tried again
    request.catch(() => pending.delete(url));
    pending.set(url, request);
  }
  return request;
}

export function useFetch<T>(url: string): FetchState<T> {
  const [result, setResult] = useState<{ url: string; error: string | null } | null>(null);

  useEffect(() => {
    if (cache.has(url)) return;
    let cancelled = false;
    load(url).then(
      () => !cancelled && setResult({ url, error: null }),
      (err: Error) => !cancelled && setResult({ url, error: err.message }),
    );
    return () => {
      cancelled = true;
    };
  }, [url]);

  if (cache.has(url)) return { data: cache.get(url) as T, loading: false, error: null };
  const error = result?.url === url ? result.error : null;
  return { data: null, loading: !error, error };
}
