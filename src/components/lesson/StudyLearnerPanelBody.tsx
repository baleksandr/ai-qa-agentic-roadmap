import type { FundamentalsCardPanel } from '../../data/study/fundamentals-card-panels';
import { fundamentalsCardPanelSections } from '../../data/study/fundamentals-card-panels';
import { StudyLearnerFlatPanelValue } from './StudyLearnerFlatPanelValue';
import { StudyLearnerPanelRichSections } from './StudyLearnerPanelRichSections';
import { StudyPanelTerms } from './StudyPanelTerms';
import { StudyRememberTakeaways } from './StudyRememberTakeaways';

type Section = { labelUk: string; bodyUk: string };

type Props = {
  sections?: Section[];
  panel?: FundamentalsCardPanel;
  /** Номер основної картки (1, 2, 3…) для вкладених processStepPick. */
  parentCardNumber?: string;
};

/** Семантичні підписи + текст у навчальних панелях (Fundamentals і спільний стиль). */
export function StudyLearnerPanelBody({ sections, panel, parentCardNumber }: Props) {
  if (panel?.sections?.length) {
    return (
      <>
        <StudyLearnerPanelRichSections sections={panel.sections} parentCardNumber={parentCardNumber} />
        {panel.rememberUk?.trim() ? (
          <div className="study-learner-panel-remember">
            <p className="study-learner-panel-label">Запам’ятати</p>
            <StudyRememberTakeaways text={panel.rememberUk} />
          </div>
        ) : null}
        {panel.terms?.length ? <StudyPanelTerms terms={panel.terms} /> : null}
      </>
    );
  }

  const rows = sections ?? (panel ? fundamentalsCardPanelSections(panel) : []);
  if (!rows.length) return null;

  return (
    <>
      <dl className="study-learner-panel">
        {rows.map((row) => (
          <div key={row.labelUk} className="study-learner-panel-block">
            <dt className="study-learner-panel-label">{row.labelUk}</dt>
            <dd className="study-learner-panel-value">
              <StudyLearnerFlatPanelValue labelUk={row.labelUk} bodyUk={row.bodyUk} />
            </dd>
          </div>
        ))}
      </dl>
      {panel?.terms?.length ? <StudyPanelTerms terms={panel.terms} /> : null}
    </>
  );
}
