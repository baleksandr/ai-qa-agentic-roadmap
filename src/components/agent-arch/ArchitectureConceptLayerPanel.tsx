import { Link } from 'react-router-dom';
import type { ArchitectureConceptPanel } from '../../data/architecture/architecture-node-panels';

type Props = {
  title: string;
  panel: ArchitectureConceptPanel;
  topicId: string;
  topicLabel: string;
};

type Section = {
  key: string;
  titleUk: string;
  bodyUk: string;
  variant?: 'qa' | 'default';
};

function buildSections(panel: ArchitectureConceptPanel): Section[] {
  const sections: Section[] = [];
  if (panel.what?.trim()) {
    sections.push({ key: 'what', titleUk: 'Що це', bodyUk: panel.what.trim() });
  }
  if (panel.input?.trim()) {
    sections.push({ key: 'input', titleUk: 'Що отримує', bodyUk: panel.input.trim() });
  }
  if (panel.output?.trim()) {
    sections.push({
      key: 'output',
      titleUk: 'Що повертає або робить',
      bodyUk: panel.output.trim(),
    });
  }
  const relation = [panel.why?.trim(), panel.recipient?.trim()].filter(Boolean).join(' ');
  if (relation) {
    sections.push({ key: 'relation', titleUk: 'Як пов’язано з іншими поняттями', bodyUk: relation });
  }
  if (panel.exampleUk?.trim()) {
    sections.push({ key: 'example', titleUk: 'Приклад login_spec', bodyUk: panel.exampleUk.trim() });
  }
  if (panel.qaAgent?.trim()) {
    sections.push({
      key: 'qa',
      titleUk: 'Що перевіряє QA',
      bodyUk: panel.qaAgent.trim(),
      variant: 'qa',
    });
  }
  if (panel.risks?.trim()) {
    sections.push({ key: 'risks', titleUk: 'Що може піти не так', bodyUk: panel.risks.trim() });
  }
  return sections;
}

export function ArchitectureConceptLayerPanel({ title, panel, topicId, topicLabel }: Props) {
  const sections = buildSections(panel);

  return (
    <aside
      className="arch-concept-detail-panel"
      aria-live="polite"
    >
      <p className="arch-concept-detail-badge">Обране поняття</p>
      <h3 className="arch-concept-detail-title">{title}</h3>
      {panel.who?.trim() ? (
        <p className="arch-concept-detail-actor muted small">{panel.who.trim()}</p>
      ) : null}

      <div className="arch-concept-detail-sections">
        {sections.map((section) => (
          <article
            key={section.key}
            className={`arch-concept-detail-card ${section.variant === 'qa' ? 'is-qa' : ''}`}
          >
            <h4 className="arch-concept-detail-card-title">{section.titleUk}</h4>
            <p className="arch-concept-detail-card-body">{section.bodyUk}</p>
          </article>
        ))}
      </div>

      {panel.terms && panel.terms.length > 0 ? (
        <div className="arch-concept-detail-terms">
          <h4 className="arch-concept-detail-card-title">Терміни</h4>
          <ul className="arch-concept-detail-terms-list">
            {panel.terms.map((t) => (
              <li key={t.label}>
                <span className="study-term-accent">{t.label}</span>
                {' — '}
                {t.text}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <p className="arch-concept-detail-study">
        Вивчити докладніше:{' '}
        <Link to={`/topic/${topicId}/study`}>{topicLabel}</Link>
      </p>
    </aside>
  );
}
