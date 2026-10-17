import type { ProcessStep } from '../../lib/studyBodyFormat';
import { lookupGuardrailsProcessStep } from './guardrails-process-steps';
import { lookupRagFlowStep } from './rag-query-flow-steps';
import type { StudyTeachingCardsBundle } from './study-teaching-card-types';
import { buildTeachingCardDetail } from './study-teaching-card-types';
import { getFundamentalsTeachingCards } from './fundamentals-teaching-cards';

export function getStructuredSectionTeachingCards(
  topicId: string,
  sectionId: string,
): StudyTeachingCardsBundle | null {
  if (topicId === 'fundamentals') return getFundamentalsTeachingCards(sectionId);
  return null;
}

function helpToBundle(
  ariaLabel: string,
  steps: ProcessStep[],
  resolve: (step: ProcessStep) => {
    titleUk: string;
    teaserUk: string;
    actorLabel: string;
    panel: {
      whatUk: string;
      inputUk: string;
      outputUk: string;
      linkUk: string;
      exampleUk: string;
      failureUk: string;
      testUk: string;
    };
  } | null,
): StudyTeachingCardsBundle | null {
  const mapped = steps
    .map((step) => {
      const h = resolve(step);
      if (!h) return null;
      return {
        key: step.index,
        titleUk: h.titleUk,
        teaserUk: h.teaserUk,
        cardActorUk: h.actorLabel,
        detail: buildTeachingCardDetail(h.titleUk, h.teaserUk, h.panel, {
          cardActorUk: h.actorLabel,
        }),
      };
    })
    .filter(Boolean) as StudyTeachingCardsBundle['steps'];

  if (mapped.length < 2) return null;
  return { ariaLabel, steps: mapped };
}

/** Markdown-розділи з extractProcessSteps, де вже є предметні підказки (guardrails, RAG). */
export function buildProcessStepsTeachingBundle(
  topicId: string,
  sectionHint: string | undefined,
  steps: ProcessStep[],
): StudyTeachingCardsBundle | null {
  const hint = (sectionHint ?? '').toLowerCase();

  if (
    topicId === 'concept-17' &&
    (hint.includes('крок за кроком') || hint.includes('під капотом'))
  ) {
    return helpToBundle('Guardrails під капотом', steps, (step) => {
      const help = lookupGuardrailsProcessStep(step.text);
      if (!help) return null;
      const prev = step.index > 1 ? `Після кроку ${step.index - 1} у ланцюгу guardrails.` : 'Старт ланцюга guardrails.';
      const next =
        step.index < steps.length
          ? `Далі — крок ${step.index + 1}, якщо політика дозволяє.`
          : 'Після цього кроку результат повертається в context або run зупиняється.';
      return {
        titleUk: help.titleUk,
        teaserUk: help.explainUk.slice(0, 120) + (help.explainUk.length > 120 ? '…' : ''),
        actorLabel: help.actorLabel,
        panel: {
          whatUk: help.explainUk,
          inputUk: 'Залежить від попереднього кроку guardrails (див. trace run).',
          outputUk: 'Сигнал для наступного validator, policy або executor.',
          linkUk: `${prev} ${next}`,
          exampleUk:
            'Навчальний приклад: пропозиція readPlaywrightReport після login_spec проходить input checks, потім LLM, потім schema і policy.',
          failureUk: 'Пропуск validator або policy — side effect без approval.',
          testUk: help.qaUk,
        },
      };
    });
  }

  if (topicId === 'concept-03' && hint.includes('одному запиті')) {
    return helpToBundle('RAG у одному запиті (кроки з уроку)', steps, (step) => {
      const help = lookupRagFlowStep(step.index, step.text);
      if (!help) return null;
      return {
        titleUk: help.titleUk,
        teaserUk: help.explainUk.slice(0, 100) + (help.explainUk.length > 100 ? '…' : ''),
        actorLabel: help.actorLabel,
        panel: {
          whatUk: help.explainUk,
          inputUk: help.inputUk,
          outputUk: help.outputUk,
          linkUk: `Крок ${step.index} у runtime RAG після login_spec; дані передаються наступному компоненту pipeline.`,
          exampleUk: 'Навчальний приклад: запит про причину падіння login_spec → chunks з postmortem → відповідь з citation.',
          failureUk: 'Порожній retrieval або нерелевантний chunk — модель відповідає без опори на документи.',
          testUk: 'Перевірте в trace: query embedding, top-K ids, фільтри metadata, наявність citation у відповіді.',
        },
      };
    });
  }

  return null;
}
