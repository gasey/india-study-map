import { useEffect, useState } from 'react';
import type { FeatureCollection } from 'geojson';

// Module-level cache so a base layer is fetched only once per session
const cache = new Map<string, FeatureCollection>();
const pending = new Map<string, Promise<FeatureCollection>>();

/** Fetch a GeoJSON file from a URL, with in-memory caching. */
export function useGeoJSON(url: string | null | undefined): FeatureCollection | null {
  const [data, setData] = useState<FeatureCollection | null>(
    url ? cache.get(url) ?? null : null
  );

  useEffect(() => {
    if (!url) {
      setData(null);
      return;
    }
    const cached = cache.get(url);
    if (cached) {
      setData(cached);
      return;
    }

    let aborted = false;
    let promise = pending.get(url);
    if (!promise) {
      promise = fetch(url)
        .then((r) => {
          if (!r.ok) throw new Error(`Failed to fetch ${url}: ${r.status}`);
          return r.json();
        })
        .then((json: FeatureCollection) => {
          cache.set(url, json);
          pending.delete(url);
          return json;
        })
        .catch((err) => {
          pending.delete(url);
          console.error(err);
          throw err;
        });
      pending.set(url, promise);
    }

    promise.then((json) => {
      if (!aborted) setData(json);
    }).catch(() => {});

    return () => {
      aborted = true;
    };
  }, [url]);

  return data;
}
