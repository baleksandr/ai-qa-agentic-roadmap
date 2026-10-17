import { useCallback, useMemo, useState } from 'react';

type Options = {
  /** Відкрити перший розділ при першому рендері (за замовчуванням true). */
  openFirst?: boolean;
  initialOpenId?: string | null;
};

export function useStudySectionsOpen(sectionIds: readonly string[], options?: Options) {
  const [openIds, setOpenIds] = useState<Set<string>>(() => {
    const first =
      options?.initialOpenId ?? (options?.openFirst !== false ? sectionIds[0] : undefined);
    if (first) return new Set([first]);
    return new Set();
  });

  const expandAll = useCallback(() => setOpenIds(new Set(sectionIds)), [sectionIds]);
  const collapseAll = useCallback(() => setOpenIds(new Set()), []);

  const toggleSection = useCallback((id: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const openSection = useCallback((id: string) => {
    setOpenIds((prev) => new Set(prev).add(id));
  }, []);

  const { allExpanded, allCollapsed } = useMemo(() => {
    const total = sectionIds.length;
    const open = openIds.size;
    return {
      allExpanded: total > 0 && open === total,
      allCollapsed: open === 0,
    };
  }, [openIds, sectionIds]);

  return {
    openIds,
    expandAll,
    collapseAll,
    toggleSection,
    openSection,
    allExpanded,
    allCollapsed,
  };
}
