import { parseLearningMapStageTitle } from '../lib/learningMapStageTitle';

type Props = {
  title: string;
  subtitle?: string;
  titleId?: string;
};

export function MapStageHeroCard({ title, subtitle, titleId }: Props) {
  const { index, headingUk } = parseLearningMapStageTitle(title);
  return (
    <header className="map-stage-header">
      <div className="map-stage-hero-card">
        <div className="map-stage-hero-card__scan" aria-hidden="true" />
        {index ? (
          <span className="map-stage-hero-card__index" aria-hidden="true">{index}</span>
        ) : null}
        <div className="map-stage-hero-card__copy">
          <h2 id={titleId} className="map-stage-title">
            {index ? headingUk : title}
          </h2>
          {subtitle ? (
            <p className="map-stage-sub map-stage-hero-card__subtitle">{subtitle}</p>
          ) : null}
        </div>
      </div>
    </header>
  );
}
