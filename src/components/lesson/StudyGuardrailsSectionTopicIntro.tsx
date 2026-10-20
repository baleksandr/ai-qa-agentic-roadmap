import { getGuardrailsSectionTopicIntro } from '../../data/study/guardrails-section-topic-intros';
import { StudyTeachingSectionTopicIntro } from './StudyTeachingSectionTopicIntro';

type Props = {
  sectionTitle?: string;
  showCardsHow?: boolean;
};

export function StudyGuardrailsSectionTopicIntro({ sectionTitle, showCardsHow = true }: Props) {
  const topicIntroUk = getGuardrailsSectionTopicIntro(sectionTitle);
  if (!topicIntroUk?.trim()) return null;
  return (
    <StudyTeachingSectionTopicIntro topicIntroUk={topicIntroUk} showCardsHow={showCardsHow} />
  );
}
