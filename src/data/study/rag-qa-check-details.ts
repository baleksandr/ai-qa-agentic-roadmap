export type QaCheckDetail = {
  /** Коротка мітка фази для візуалізації */
  phaseUk: string;
  phaseKey: 'offline' | 'retrieve' | 'context' | 'security' | 'observe';
  meansUk: string;
  whyUk: string;
  howUk: string;
  qaAgentUk: string;
  /** Орієнтир у книзі (без цитування тексту) */
  bookRefUk?: string;
  terms?: Array<{ label: string; text: string }>;
};

const DETAILS: Record<string, QaCheckDetail> = {
  Індексація: {
    phaseUk: 'Offline · індекс',
    phaseKey: 'offline',
    meansUk:
      'Після зміни документів у корпусі індекс має містити **нові chunks**. Урок: тестовий query повертає новий chunk; версія індексу в deploy-логах збігається з очікуваною.',
    whyUk:
      'Це фаза **підготовки знань**, не відповідь на одне питання користувача. Застарілий індекс дає «успішний» retrieval з неправильного минулого.',
    howUk:
      'Після оновлення postmortem/wiki — запустити тестовий query з golden набору; порівняти `chunk_id` і текст фрагмента з джерелом; перевірити версію індексу в логах deploy.',
    qaAgentUk:
      'Навчальний приклад: після зміни runbook про `#login-btn` reindex → query знаходить оновлений фрагмент, не старий селектор.',
    bookRefUk: '*AI Engineering*: workflow RAG (індексація / parse / chunk / embed), друк. с. 113–115.',
    terms: [
      { label: 'Тестовий query', text: 'Фіксований запит з golden набору — не довільний prompt LLM.' },
      { label: 'Версія індексу', text: 'Маркер deploy (напр. index-v12 у сценарії уроку) для звірки середовищ.' },
    ],
  },
  'Retrieval без LLM': {
    phaseUk: 'Runtime · пошук',
    phaseKey: 'retrieve',
    meansUk:
      'Оцінка **retriever** окремо: фіксований запит → очікуваний набір `chunk_id` (recall@k). Precision/recall на контрольному наборі — не суб’єктивна «гарна відповідь».',
    whyUk:
      'LLM може звучати переконливо при поганому пошуку. Без тестів retrieval не видно, чи проблема в індексі, chunking чи в моделі.',
    howUk:
      'Golden queries у CI або regression suite: виклик retriever API без generation; порівняння hits з еталоном; метрики recall@k / precision на фіксованому наборі.',
    qaAgentUk:
      'Навчальний приклад: query про login timeout staging → у top-k очікуваний chunk з postmortem (умовний INC-442 у сценарії уроку).',
    bookRefUk: '*AI Engineering*: retrieval / similarity search у workflow RAG, друк. с. 112–113.',
    terms: [
      { label: 'recall@k', text: 'Чи потрібний chunk потрапив у перші k результатів.' },
      { label: 'Golden query', text: 'Запит з відомою правильною відповіддю в індексі — еталон для регресії.' },
      { label: 'Без LLM', text: 'Жодного виклику generative model — лише код пошуку.' },
    ],
  },
  'Ізоляція tenant': {
    phaseUk: 'Runtime · контекст',
    phaseKey: 'context',
    meansUk:
      'Урок: context builder **не підмішує** дані tenant B у run tenant A (перевірка з mock LLM). Це про межі даних після retrieval, перед generation.',
    whyUk:
      'RAG додає зовнішні фрагменти в prompt; помилка фільтра tenant — витік даних між клієнтами.',
    howUk:
      'Два tenant у тестовому індексі; однаковий query для tenant A — у hits і в зібраному context лише дозволені `source_id` tenant A.',
    qaAgentUk: 'Негативний тест: confidential chunk tenant B відсутній у trace run tenant A.',
    bookRefUk: 'Книга описує pipeline RAG; tenant ACL — політика застосунку (урок + production розділ).',
    terms: [
      { label: 'Mock LLM', text: 'Модель не генерує текст — перевіряєте лише зібраний context/hits.' },
      { label: 'Context builder', text: 'Код, який форматує evidence перед API моделі.' },
    ],
  },
  'Groundedness і citations': {
    phaseUk: 'Runtime · відповідь',
    phaseKey: 'context',
    meansUk:
      'Урок: **A** — `source_id` у відповіді ∈ **selected evidence** цього run; **B** — теза підтверджується текстом chunk (INC-442 + хибна теза → fail B); **C** — QA звіряє **поточне** падіння з DOM/trace/логами. A не замінює B і C.',
    whyUk:
      'Модель може мати «правильний» INC-442 у citation і невірний висновок або плутати два схожі chunks.',
    howUk:
      'Автотести на (а)–(б) по trace context vs відповідь; (в) — чекліст QA з актуальним DOM і CI.',
    qaAgentUk: 'INC-442 у відповіді + селектор у DOM уже інший → fail на (в), навіть якщо (а) пройшло.',
    bookRefUk: '*AI Engineering*: augment prompt retrieved content перед generation, друк. с. 106, 112–113.',
    terms: [
      { label: 'source_id', text: 'Ідентифікатор джерела (інцидент, документ) з metadata chunk.' },
      { label: 'Trace retrieval', text: 'Лог hits (chunk_id, score) для конкретного run.' },
    ],
  },
  Права: {
    phaseUk: 'Security · ACL',
    phaseKey: 'security',
    meansUk:
      'Урок: **негативні тести** — роль без доступу не бачить confidential chunk у hits. Помилка ACL — security incident, не «погана модель».',
    whyUk:
      'Індексація і query-time фільтрація мають узгоджуватися; інакше confidential текст потрапляє в prompt.',
    howUk:
      'Роль без прав на restricted postmortem; той самий query, що для admin — очікувано порожні hits або deny від policy.',
    qaAgentUk: 'Ті самі ризики, що в картці «Порушення доступу» в урокі про збої RAG — інший кут тесту (негативний tenant).',
    terms: [
      { label: 'ACL-aware retrieval', text: 'Фільтри на індексації і на кожному запиті (tenant, role, project).' },
      { label: 'Негативний тест', text: 'Очікувана відмова або порожня видача, не «м’який» pass.' },
    ],
  },
  'Adversarial document': {
    phaseUk: 'Security · corpus',
    phaseKey: 'security',
    meansUk:
      'Урок: штучний chunk з **ін’єкцією** не повинен стати system policy агента — перевірка prompt injection через RAG (розділ про ін’єкцію в документ).',
    whyUk:
      'Retrieved text стає частиною prompt; зловмисний вміст у wiki може намагатися змінити поведінку моделі.',
    howUk:
      'Додати тестовий документ з інструкцією «ігноруй system» у індекс; run investigation — відповідь і tool policy лишаються в межах harness.',
    qaAgentUk: 'Поєднати з guardrails уроком (concept-17): policy після retrieval, не лише «розумна» модель.',
    bookRefUk: '*AI Engineering*: guardrails / red teaming на рівні застосунку, друк. с. 193–194, 352 (загальний контекст, не RAG-only глава).',
    terms: [
      { label: 'Adversarial chunk', text: 'Контрольований фрагмент у тестовому індексі, не prod wiki.' },
      { label: 'Політика агента', text: 'System/developer правила harness — мають витримати retrieved text.' },
    ],
  },
  'Trace run': {
    phaseUk: 'Observability',
    phaseKey: 'observe',
    meansUk:
      'Урок: у trace одного run — query, retrieval latency, `chunk_id` + scores, розмір context, generation latency, **mapping citation → chunk**.',
    whyUk:
      'Без повного trace неможливо відокремити регресію retrieval від регресії generation після deploy.',
    howUk:
      'Зберегти один run_id; перевірити наявність усіх полів; для кожного citation — зв’язок з chunk у trace (не лише текст відповіді).',
    qaAgentUk:
      'Після падіння login_spec: trace показує query, hits з scores, розмір evidence, потім generation — один ланцюг для postmortem QA.',
    bookRefUk: '*AI Engineering*: LLM Observability; Evaluation vs Observability, друк. с. 370–371.',
    terms: [
      { label: 'retrieval_latency', text: 'Час пошуку до виклику LLM — runtime метрика в observability.' },
      { label: 'generation_latency', text: 'Час відповіді моделі — не плутати з retrieval.' },
      { label: 'citation → chunk', text: 'Урок: явне зіставлення citation у відповіді з hit у retrieval (див. groundedness).' },
    ],
  },
};

export function lookupRagQaCheckDetail(title: string): QaCheckDetail | null {
  const key = Object.keys(DETAILS).find((k) => title.includes(k) || k.includes(title));
  return key ? DETAILS[key] : null;
}

export function qaCheckDetailToMarkdown(
  detail: QaCheckDetail,
  lessonBody?: string,
  options?: { omitTerms?: boolean },
): string {
  const lines = [
    `**Що це?** ${detail.meansUk}`,
    `**Навіщо тестувати?** ${detail.whyUk}`,
    `**Як тестувати?** ${detail.howUk}`,
    `**QA-приклад.** ${detail.qaAgentUk}`,
  ];
  if (lessonBody?.trim()) {
    lines.push(`**Формулювання в урокі.** ${lessonBody.trim()}`);
  }
  if (!options?.omitTerms && detail.terms?.length) {
    lines.push('', '**Терміни:**', '');
    for (const t of detail.terms) {
      lines.push(`- **${t.label}** — ${t.text}`);
    }
  }
  return lines.join('\n\n');
}
