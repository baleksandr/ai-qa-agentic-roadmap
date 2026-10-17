import type { RagInvestigationScenario } from '../../lib/ragInvestigationScenario';
import type { ChainStageDetail } from './rag-chain-stage-details';
import { studyPanelMarkdown } from '../../lib/studyPanelContent';
import { RAG_ONE_QUERY_PREREQUISITE, RAG_QUERY_FLOW_STEPS } from './rag-query-flow-steps';

const STEP_DETAILS: ChainStageDetail[] = [
  {
    titleUk: 'CI, harness і пошуковий запит',
    visualKey: 'query',
    cardBadgeUk: 'Harness',
    cardActorUk: 'Код',
    cardTeaserUk: 'Signal CI → retrieval query + фільтри з перевіреної ідентичності.',
    bodyUk: '',
    qaUk: '',
    panelMarkdownUk: studyPanelMarkdown([
      {
        label: 'Що це?',
        body:
          'CI повідомляє про падіння `login_spec`; harness отримує статус, excerpt логу, `trace id` (умовно `ci-8842`) і формує **текст пошуку** (симптоми, технічні терміни) та **metadata-фільтри** (`tenant`, `env`, `service`, `incident_date_gte`).',
      },
      { label: 'Хто це створює?', body: 'Harness (код). Поля фільтрів — з перевіреної ідентичності CI/користувача, не з виводу LLM.' },
      { label: 'Що далі?', body: 'Retriever шукає в `index-v12` з цими обмеженнями.' },
      {
        label: 'Що перевірити?',
        body:
          'У trace: exact query string + повний набір фільтрів. `incident_date_gte=90d` обчислюється від **часу поточного run** (дата інциденту в metadata chunk), не від дати індексації документа.',
      },
    ]),
    terms: [
      { label: 'retrieval query', text: 'Симптоми для similarity/BM25, окремо від фільтрів.' },
      { label: 'incident_date_gte', text: 'Структурований date filter; не синонім фрази «last 90 days» у тексті.' },
    ],
  },
  {
    titleUk: 'Retriever: кандидати з фільтрами та ACL',
    visualKey: 'retrieve',
    cardBadgeUk: 'Search',
    cardActorUk: 'Код',
    cardTeaserUk: 'candidates → authorized hits після metadata + tenant/ACL.',
    bodyUk: '',
    qaUk: '',
    panelMarkdownUk: studyPanelMarkdown([
      {
        label: 'Що це?',
        body:
          'Під час **індексації** кожен chunk отримує metadata для ізоляції та доступу: `tenant`, політика ролей, `source_id`. При **запиті** retriever застосовує фільтри й ACL; результат цього кроку — **authorized hits[]** (`chunk_id`, `text`, `source_id`, retrieval `score`).',
      },
      { label: 'Хто це створює?', body: 'Search service (код). LLM не формує поля пошуку й не «ходить у базу».' },
      { label: 'Що далі?', body: 'Harness відбирає дозволені фрагменти; опційно rerank (крок 3).' },
      {
        label: 'Важливо.',
        body:
          'Якщо backend не застосовує ACL на пошуку — потрібен **кодовий gate** до використання тексту. Не показуйте chunk іншого tenant як «допустимий hit».',
      },
      {
        label: 'QA-приклад.',
        body:
          'Негативний тест: фрагмент tenant B не з’являється в authorized hits для tenant A і не потрапляє в evidence.',
      },
      {
        label: 'Що перевірити?',
        body:
          'У навчальному UI демо-retriever може не застосовувати `incident_date_gte` — тоді фільтр лишається **вимогою в trace**, не фактом виконання (перевірте код).',
      },
    ]),
    terms: [
      { label: 'candidates', text: 'Сирі результати similarity до повного ACL (у trace може бути приховано).' },
      { label: 'authorized hits', text: 'Пройшли metadata-фільтри та правила доступу.' },
      { label: 'score', text: 'Retrieval score; не P(правильна root cause).' },
    ],
  },
  {
    titleUk: 'Відбір дозволені фрагменти й rerank',
    visualKey: 'retrieve',
    cardBadgeUk: 'Harness',
    cardActorUk: 'Код',
    cardTeaserUk: 'authorized hits → selected evidence; rerank може бути моделлю.',
    bodyUk: '',
    qaUk: '',
    panelMarkdownUk: studyPanelMarkdown([
      {
        label: 'Що це?',
        body:
          'Код повторно гарантує, що жоден недозволений фрагмент не піде далі. З **authorized hits** формується **selected evidence[]** (top після rerank, token budget). Harness **викликає** rerank і обробляє результат — це код; **перестановку** часто робить окрема rerank-модель або алгоритм.',
      },
      { label: 'Хто це створює?', body: 'Harness + reranker (алгоритм або окрема модель оцінки доречності).' },
      { label: 'Що далі?', body: 'Context builder збирає messages лише з `selected evidence`.' },
      {
        label: 'Що перевірити?',
        body:
          'Rerank score ≠ retrieval score. У golden-тестах — наявність очікуваного `chunk_id` у selected (або top-k за політикою), не точна рівність score між середовищами.',
      },
    ]),
    terms: [
      { label: 'selected evidence', text: 'Єдиний набір chunk_id, що реально підуть у prompt.' },
      { label: 'rerank', text: 'Окремий компонент від generative LLM кроку 5.' },
    ],
  },
  {
    titleUk: 'Context builder → messages[]',
    visualKey: 'context',
    cardBadgeUk: 'Context builder',
    cardActorUk: 'Код',
    cardTeaserUk: 'Retrieved context лише з selected evidence.',
    bodyUk: '',
    qaUk: '',
    panelMarkdownUk: studyPanelMarkdown([
      {
        label: 'Що це?',
        body:
          'Код збирає system policy, блок Retrieved context (текст + `source_id` / `chunk_id` для trace) і user turn із CI. Жоден chunk поза **selected evidence** не потрапляє в `messages[]`.',
      },
      { label: 'Хто це створює?', body: 'Context builder (код).' },
      { label: 'Що далі?', body: 'Generative LLM (крок 5).' },
      {
        label: 'Що перевірити?',
        body: 'Trace: `messages` ⊆ selected `chunk_id`; confidential / чужий tenant відсутні.',
      },
    ]),
    terms: [
      { label: 'messages[]', text: 'Вхід generative API, не сирий hits[].' },
      { label: 'evidence', text: 'Текст, який модель реально прочитала в цьому run.' },
    ],
  },
  {
    titleUk: 'LLM: гіпотеза з citations',
    visualKey: 'llm',
    cardBadgeUk: 'Generation',
    cardActorUk: 'LLM',
    cardTeaserUk: 'Текст з source_id — гіпотеза, не root cause.',
    bodyUk: '',
    qaUk: '',
    panelMarkdownUk: studyPanelMarkdown([
      {
        label: 'Що це?',
        body:
          'Generative LLM синтезує відповідь з опорою на переданий context. Citation (умовно `INC-442`) — посилання на минулий інцидент, не підтвердження сьогоднішнього падіння.',
      },
      { label: 'Хто це створює?', body: 'Generative LLM (ймовірнісно).' },
      { label: 'Що далі?', body: 'Перевірки коду (A, B) і QA (C); tool actions — окремі permissions.' },
      {
        label: 'QA-приклад.',
        body:
          'Агент цитує **реальний** INC-442 (селектор змінився), але помилково оголошує це root cause **поточного** падіння — поки DOM/trace CI не підтвердили (див. INC-318 як альтернативне пояснення симптому).',
      },
      {
        label: 'Що перевірити?',
        body: 'Відповідь не містить `source_id`, яких не було в selected evidence.',
      },
    ]),
    terms: [
      { label: 'citation', text: 'Згадка source_id у тексті моделі.' },
      { label: 'гіпотеза', text: 'До перевірок A–C — не фінальний висновок QA.' },
    ],
  },
  {
    titleUk: 'Перевірки коду та QA',
    visualKey: 'llm',
    cardBadgeUk: 'Harness + QA',
    cardActorUk: 'Код + QA',
    cardTeaserUk: 'A citation · B groundedness · C актуальна причина; Jira — окремо.',
    bodyUk: '',
    qaUk: '',
    panelMarkdownUk: studyPanelMarkdown([
      {
        label: 'Що це?',
        body:
          '**A (код):** кожен `source_id` у відповіді ∈ **selected evidence** цього run (перевірка лише по всіх hits недостатня, якщо частину відкинули). **B (код / groundedness check):** твердження випливає з тексту відповідного chunk — правильний `source_id` біля **неправильної** тези не проходить B. **C (QA):** причина **поточного** падіння — DOM, Playwright trace, логи CI; схожий старий INC не замінює oracle.',
      },
      {
        label: 'Хто це створює?',
        body:
          'Код: схема відповіді, citations ⊆ selected evidence, дозволені tool actions. Автоматична groundedness (якщо є) оцінює B, але не гарантує C. QA досліджує тест і підтверджує або відхиляє гіпотезу.',
      },
      {
        label: 'Що далі?',
        body:
          'Створення Jira issue — окрема дія з approval/permissions; RAG-пошук сам тікет не створює.',
      },
      {
        label: 'Що перевірити?',
        body:
          'Ризик 1: chunk tenant B ∉ selected evidence. Ризик 2: citation INC-442 при тезі, якої немає в тексті chk-442-a — fail B навіть при pass A.',
      },
    ]),
    terms: [
      { label: 'groundedness (B)', text: 'Зміст vs chunk, не лише id.' },
      { label: 'oracle (C)', text: 'Актуальні докази падіння тесту зараз.' },
    ],
  },
];

export function getRagOneQueryPrerequisite() {
  return RAG_ONE_QUERY_PREREQUISITE;
}

export function getRagOneQueryFlowSteps() {
  return RAG_QUERY_FLOW_STEPS;
}

export function lookupRagOneQueryStepDetail(stepIndex: number): ChainStageDetail | null {
  const i = stepIndex - 1;
  return STEP_DETAILS[i] ?? null;
}

/** Додаток з навчального сценарію login_spec (лише дані з уроку) */
export function ragOneQueryScenarioAppendix(
  stepIndex: number,
  scenario: RagInvestigationScenario,
): string {
  const parts: string[] = [];
  if (stepIndex === 1) {
    parts.push('**У цьому прикладі (з уроку)**', '');
    if (scenario.ciLeadMarkdown.trim()) parts.push(scenario.ciLeadMarkdown.trim(), '');
    parts.push('Картка **Retrieval query і metadata-фільтри** вище в блоці «один запит» — той самий умовний query і filters.');
  }
  if (stepIndex === 2) {
    parts.push(
      '**У цьому прикладі (authorized hits — tenant acme)**',
      '',
      'У панелі Hits: **candidates** (пошук) → **authorized hits** (після ACL/фільтрів) → **selected evidence** (крок 3).',
    );
    if (scenario.hitsLeadMarkdown.trim()) {
      parts.push('', scenario.hitsLeadMarkdown.trim());
    }
    for (const c of scenario.chunks) {
      parts.push(
        `- **chunk_id=${c.id}** · source_id=${c.sourceId} · score ${c.score.toFixed(2)}: ${c.excerpt}`,
      );
    }
  }
  if (stepIndex === 3) {
    parts.push(
      '**У цьому прикладі (selected evidence, умовно)**',
      '',
      '- `chk-442-a` (INC-442) — у prompt після rerank/token budget.',
      '- `chk-318-b` (INC-318) — лишається в authorized hits для контрасту симптомів; у відібраному context може бути обрізано політикою top-k.',
    );
  }
  if (stepIndex === 5 && scenario.outroMarkdown.trim()) {
    parts.push('**У цьому прикладі (висновок уроку)**', '', scenario.outroMarkdown.trim());
  }
  return parts.length ? `\n\n${parts.join('\n')}` : '';
}

export function ragOneQueryPrerequisiteAppendix(scenario: RagInvestigationScenario): string {
  if (!scenario.prerequisiteMarkdown.trim()) return '';
  return `\n\n${scenario.prerequisiteMarkdown.trim()}`;
}
