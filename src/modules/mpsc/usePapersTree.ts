import { useEffect, useState } from 'react';
import * as api from '@/lib/mpscApi';

/** Thin wrapper over `GET /api/papers/tree/` — exam type -> year -> sitting. */
export function usePapersTree() {
  const [tree, setTree] = useState<api.PapersTree | null>(null);

  useEffect(() => {
    let cancelled = false;
    api.getPapersTree().then((r) => {
      if (!cancelled) setTree(r);
    }).catch(() => {
      if (!cancelled) setTree({ examTypes: [] });
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return { tree, loading: tree === null };
}
