type Props = {
  allExpanded: boolean;
  allCollapsed: boolean;
  onExpandAll: () => void;
  onCollapseAll: () => void;
};

/** «Розгорнути / Згорнути всі» — підсвітка відповідає фактичному стану акордеону. */
export function StudySectionsToolbar({
  allExpanded,
  allCollapsed,
  onExpandAll,
  onCollapseAll,
}: Props) {
  return (
    <div className="study-toolbar" role="group" aria-label="Керування розділами уроку">
      <button
        type="button"
        className={`study-toolbar-btn${allExpanded ? ' is-active' : ''}`}
        aria-pressed={allExpanded}
        onClick={onExpandAll}
      >
        Розгорнути всі
      </button>
      <button
        type="button"
        className={`study-toolbar-btn${allCollapsed ? ' is-active' : ''}`}
        aria-pressed={allCollapsed}
        onClick={onCollapseAll}
      >
        Згорнути всі
      </button>
    </div>
  );
}
