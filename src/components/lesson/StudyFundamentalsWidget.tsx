import { getFundamentalsProcessCompare } from '../../data/study/fundamentals-study-widgets';
import { getFundamentalsWidgetBundle } from '../../data/study/fundamentals-interactive-bundles';
import { StudyFundamentalsAiTaxonomyMap } from './StudyFundamentalsAiTaxonomyMap';
import { StudyProcessCompareSection } from './StudyProcessCompareSection';
import { StudyTeachingCardsSection } from './StudyTeachingCardsSection';

type Props = { widgetId: string };

export function StudyFundamentalsWidget({ widgetId }: Props) {
  if (widgetId === 'glossary-01-ai-map') {
    return <StudyFundamentalsAiTaxonomyMap />;
  }
  const compare = getFundamentalsProcessCompare(widgetId);
  if (compare) return <StudyProcessCompareSection bundle={compare} />;
  const bundle = getFundamentalsWidgetBundle(widgetId);
  if (!bundle) return null;
  return <StudyTeachingCardsSection bundle={bundle} />;
}
