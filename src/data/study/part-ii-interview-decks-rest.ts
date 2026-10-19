import type { StudyInterviewDeck } from './study-interview-types';
import { makeStudyInterviewDeck, q } from './part-ii-interview-decks';

const link = (to: string, label: string, hintUk: string) => ({ to, label, hintUk });

function four(
  prefix: string,
  items: [string, string, string, string][],
): ReturnType<typeof q>[] {
  return items.map(([questionUk, brief, deep, pit], i) =>
    q(`${prefix}-q${i + 1}`, questionUk, brief, deep, pit),
  );
}

export const PART_II_INTERVIEW_REST: Record<string, StudyInterviewDeck> = {
  'concept-05': makeStudyInterviewDeck(
    'concept-05-evals',
    'Evals ловлять регресію після зміни prompt або RAG — не один ручний demo після login_spec.',
    'Evals catch regressions after prompt or RAG changes—not a single manual demo after login_spec.',
    four('c05', [
      [
        'Чим eval відрізняється від одного manual run investigation?',
        'Eval — багато кейсів з метриками на фіксованому harness.',
        'Golden set: чи викликається readPlaywrightReport до висновку; groundedness citation; tool accuracy. Gate у CI.',
        'Плутати «мені сподобалась відповідь» з pass rate на наборі.',
      ],
      [
        'Хто виконує scoring у eval pipeline?',
        'Правила/код і інколи LLM-as-judge — але harness контролює вхід.',
        'Mock tools дають детерміновані facts; scorer перевіряє очікувані поля JSON або наявність tool у trace.',
        'Live prod tools у flaky eval без ізоляції.',
      ],
    ]),
    [link('/topic/concept-19/study', 'Benchmarks', '— порівняння моделей'), link('/topic/concept-18/study', 'Observability', '— prod traces')],
  ),
  'concept-06': makeStudyInterviewDeck(
    'concept-06-mcp',
    'MCP стандартизує tools між harness і серверами інтеграцій.',
    'MCP standardizes tools between harness and integration servers.',
    four('c06', [
      [
        'Що таке MCP у ланцюгу investigation?',
        'Протокол client↔server для discover і виклику tools/resources.',
        'Harness — client; MCP CI server дає read artifact після login_spec. Policy лишається в harness.',
        'Думати, що MCP замінює guardrails.',
      ],
    ]),
    [link('/topic/concept-10/study', 'Tool Calling', '— tool_call формат'), link('/topic/concept-04/study', 'Harness', '— client')],
  ),
  'concept-07': makeStudyInterviewDeck(
    'concept-07-skills',
    'Skills звужують tools і instructions під задачу investigation.',
    'Skills narrow tools and instructions for the investigation task.',
    four('c07', [
      [
        'Навіщо skill замість одного mega-prompt?',
        'Менший allow-list tools → менше hallucinated tool names.',
        'Skill «Playwright investigation» активується після login_spec; write tools — інший skill після gate.',
        'Активувати всі tools завжди.',
      ],
    ]),
    [link('/topic/concept-04/study', 'Harness', '— router skills')],
  ),
  'concept-08': makeStudyInterviewDeck(
    'concept-08-a2a',
    'A2A — структурований обмін задачами між агентами на різних сервісах.',
    'A2A is structured task exchange between agents on different services.',
    four('c08', [
      [
        'Чим A2A відрізняється від звичайного REST?',
        'Контракт agent messages: delegate, status, result.',
        'Investigation agent делегує coding agent TaskSpec + evidence; не вільний чат між LLM.',
        'Плутати A2A з internal function call у monolith.',
      ],
    ]),
    [link('/topic/concept-09/study', 'Multi-Agent', '— ролі агентів')],
  ),
  'concept-09': makeStudyInterviewDeck(
    'concept-09-multi-agent',
    'Кілька спеціалізованих агентів координує orchestration.',
    'Several specialized agents are coordinated by orchestration.',
    four('c09', [
      [
        'Чому не один agent на все після login_spec?',
        'Різні policies, tools і evals для investigation vs coding.',
        'Investigation read-only; coding write після approve — окремі harness instances.',
        'Два агенти без lock на один файл.',
      ],
    ]),
    [link('/topic/concept-02/study', 'Orchestration', '— порядок')],
  ),
  'concept-11': makeStudyInterviewDeck(
    'concept-11-planning',
    'Plan задає кроки investigation до хаотичних tool calls.',
    'A plan sets investigation steps before chaotic tool calls.',
    four('c11', [
      [
        'Хто валідує plan steps?',
        'Harness проти allow-list tools і policy.',
        'План: read CI → read report → hypothesis; replan якщо report empty.',
        'Необмежений replan loop.',
      ],
    ]),
    [link('/topic/concept-12/study', 'Reasoning', '— міркування з facts')],
  ),
  'concept-12': makeStudyInterviewDeck(
    'concept-12-reasoning',
    'Reasoning має спиратися на tool/RAG facts, не на guess.',
    'Reasoning must lean on tool/RAG facts, not guesses.',
    four('c12', [
      [
        'Що таке ungrounded reasoning у investigation?',
        'Красива причина без readPlaywrightReport.',
        'QA: strong claim лише після tool span у trace.',
        'Оцінювати лише fluency тексту.',
      ],
    ]),
    [link('/topic/concept-14/study', 'Prompt Engineering', '— step-by-step prompt')],
  ),
  'concept-13': makeStudyInterviewDeck(
    'concept-13-fine-tuning',
    'Fine-tune змінює weights; RAG дає свіжі факти.',
    'Fine-tuning changes weights; RAG supplies fresh facts.',
    four('c13', [
      [
        'Чи замінить fine-tune RAG для postmortem?',
        'Ні — weights не оновлюються щоночі з wiki.',
        'Tune на стиль звіту; postmortem лишається retrieval.',
        'Очікувати свіжі інциденти з tune без RAG.',
      ],
    ]),
    [link('/topic/concept-03/study', 'RAG', '— retrieval')],
  ),
  'concept-16': makeStudyInterviewDeck(
    'concept-16-workflows',
    'Agentic workflow — продуктовий сценарій з кількох агентів.',
    'An agentic workflow is a multi-agent product scenario.',
    four('c16', [
      [
        'Що передається між investigation і coding agent?',
        'Structured artifact (hypothesis, evidence refs), не весь chat.',
        'Orchestrator handoff; schema version у contract tests.',
        'Вільний markdown без полів.',
      ],
    ]),
    [link('/topic/concept-02/study', 'Orchestration', '— engine')],
  ),
  'concept-18': makeStudyInterviewDeck(
    'concept-18-observability',
    'Trace показує proposal → policy → tool result.',
    'Traces show proposal → policy → tool result.',
    four('c18', [
      [
        'Які spans очікує QA після login_spec run?',
        'model, tool, retrieval, policy_decision з correlation id.',
        'Без trace неможливо довести bypass guardrails.',
        'Логувати secrets у tool args.',
      ],
    ]),
    [link('/topic/concept-05/study', 'Evals', '— controlled regression')],
  ),
  'concept-19': makeStudyInterviewDeck(
    'concept-19-benchmarks',
    'Benchmark — один сигнал вибору моделі, не заміна domain evals.',
    'Benchmarks are one model-selection signal, not a replacement for domain evals.',
    four('c19', [
      [
        'Чому високий public benchmark не релізить investigation agent?',
        'Немає ваших tool/registry/groundedness кейсів.',
        'Використовуйте bench + internal golden login_spec set.',
        'Реліз лише за leaderboard.',
      ],
    ]),
    [link('/topic/concept-05/study', 'Evals', '— internal gate')],
  ),
  'concept-20': makeStudyInterviewDeck(
    'concept-20-production',
    'Production додає SLO, deploy, cost, incident response навколо агента.',
    'Production adds SLOs, deploy, cost, and incident response around the agent.',
    four('c20', [
      [
        'Що зламається першим у prod investigation load?',
        'Rate limits LLM/MCP, queue depth, cost cap — не «якість тексту».',
        'Degraded mode з явним повідомленням; runbook on-call.',
        'Тестувати лише staging mock.',
      ],
    ]),
    [link('/topic/concept-18/study', 'Observability', '— on-call data')],
  ),
};
