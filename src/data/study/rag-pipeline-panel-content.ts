import { RAG_INC442, RAG_LOGIN_SPEC_SIGNAL } from './rag-teaching-thread';
import { clarityDataPanel, clarityProcessPanel } from '../../lib/studyClarityPanel';

const INC = RAG_INC442;

export const RAG_LOADER_PANEL = clarityProcessPanel({
  problem:
    'Postmortem і wiki лежать у різних форматах (PDF, HTML export). Модель не може їх «прочитати з диска» — потрібен код, який витягне текст для індексації.',
  simpleIdea:
    '**Document loader** (завантажувач документів) — звичайний код (cron або batch job), який читає **дозволені** джерела і передає сирий текст далі. **Metadata** — службові поля про документ (дата, сервіс, середовище, tenant), не зміст статті.',
  input:
    `Навчально: export Confluence з postmortem, у т.ч. файл з описом ${INC.sourceId} (умовний тікет).`,
  who: 'Код застосунку (ETL / cron). Не LLM і не QA під час run investigation.',
  action:
    'Відкриває файл або API, витягує текст і metadata, відкидає заборонені шляхи (.env, токени, закриті space без ACL).',
  output: 'Сирий текст + metadata (наприклад service=auth, env=staging) для кроку Parse.',
  nextRecipient: 'Parser — нормалізує формат у плоский текст.',
  why: 'Без цього кроку в індекс потрапляють лише те, що ви явно дозволили; межа доступу задається тут і на retrieval.',
  teachingExample: `Документ ${INC.sourceId} потрапляє в pipeline разом з іншими postmortem про login — ще без chunk_id.`,
  risks: 'В індекс потрапляють секрети або дані іншого tenant; ACL джерела не збігається з retrieval.',
  qa: 'Негативний тест: закритий space / .env не з’являються в тестовому корпусі після loader.',
  deeper:
    'У проді джерела різні (S3, SharePoint, Jira API). Принцип той самий: loader ≠ generative model.',
});

export const RAG_PARSE_PANEL = clarityProcessPanel({
  problem:
    'PDF і HTML містять розмітку, колонтитули, зламані переноси — chunker не може різати «сирий файл».',
  simpleIdea:
    '**Parse** (парсер) — код, який перетворює файл у **звичайний текст** (інколи зберігає заголовки для меж chunk).',
  input: `Текст postmortem ${INC.sourceId} після loader (HTML або markdown export).`,
  who: 'Код pipeline offline. Без embedding і без виклику generative LLM.',
  action: 'Прибирає розмітку, зводить кодування, за потреби виділяє секції заголовків.',
  output: 'Єдиний текстовий потік для chunker — ще без chunk_id.',
  nextRecipient: 'Chunker ділить текст на фрагменти з id.',
  why: 'Один і той самий postmortem має давати стабільний текст після re-parse (регресія парсера).',
  teachingExample: `У тексті ${INC.sourceId} залишається речення про #login-btn і data-test=login-submit — Parse не змінює зміст, лише формат.`,
  risks: 'Парсер «з’їдає» таблиці або селектори — chunker отримає порожній або обрізаний зміст.',
  qa: 'Golden file: той самий вхід → той самий текст на виході Parse після оновлення парсера.',
});

export const RAG_CHUNKS_PANEL = clarityDataPanel({
  problem:
    'Embedding model і context window не вміщують цілий postmortem — потрібні **chunks** (фрагменти) зручного розміру.',
  simpleIdea:
    '**Chunk** — запис із `chunk_id`, полем `text` і **metadata** (source_id, tenant, дата). **Chunker** — код, який ріже текст і присвоює id.',
  whatItIs: 'Список фрагментів у сховищі підготовки знань — те, по чому потім шукають на запиті.',
  whoPrepared: 'Chunker (код offline) після Parse.',
  contains:
    `Приклад: \`${INC.chunkId}\`, \`source_id=${INC.sourceId}\`, text: «${INC.chunkTextUk}». Це не весь PDF — один searchable фрагмент.`,
  whoUsesNext: 'Крок embed/index записує vector або BM25-представлення; retriever читає text + metadata на runtime.',
  teachingExample:
    `Після падіння login_spec retriever шукає саме такі chunks про #login-btn, не «абстрактний INC-442».`,
  risks:
    'Chunk «рве» речення про селектор — similarity знаходить інший фрагмент або нічого корисного.',
  qa:
    'Offline golden: порівняти `text` chunk з джерелом postmortem; переконатися, що селектор цілий у одному chunk.',
  deeper:
    'Overlap і межі за заголовками — політика chunker; у різних продах розмір chunk різний.',
});

export const RAG_EMBED_PANEL = clarityProcessPanel({
  problem: 'Потрібно швидко знайти «схожі за змістом» фрагменти за текстом запиту — plain text перебирати повільно.',
  simpleIdea:
    '**Embedding model** — окрема модель (не generative chat), яка перетворює текст chunk на **вектор** (список чисел) для similarity search. BM25-only індекс embedding не використовує — це інший варіант реалізації.',
  input: `Текст chunk \`${INC.chunkId}\` (${INC.sourceId}).`,
  who: 'Код offline job + API embedding model. Generative LLM investigation run тут не бере участі.',
  action: 'Обчислює vector для кожного chunk (або готує inverted index для BM25).',
  output: 'Vector + посилання на chunk_id і text + metadata в index.',
  nextRecipient: 'Searchable store (vector DB або hybrid).',
  why: 'Без rebuild після зміни embedding model golden queries «пливуть» — порівнюйте версію індексу в deploy.',
  teachingExample: `Chunk про #login-btn отримує vector; query «login timeout staging» наближається до нього в просторі similarity.`,
  risks: 'Застаріла embedding model при новому індексі — recall падає без помітної помилки в UI.',
  qa: `Після зміни моделі — rebuild і прогін golden query; очікуваний top-k містить \`${INC.chunkId}\`.`,
  deeper: 'Hybrid = vector + BM25; книга описує vector store як типовий, не єдиний варіант.',
});

export const RAG_INDEX_PANEL = clarityDataPanel({
  problem: 'На момент запиту треба за мілісекунди отримати k кандидатів — vectors і текст мають жити в готовому store.',
  simpleIdea:
    '**Index / vector store** — сховище пошуку RAG-додатку (пам’ять retrieval), **не** пам’ять LLM і не «база в голові моделі».',
  whatItIs: `Версіонований артефакт (навчально \`${INC.indexVersion}\`) з vectors, text chunks і metadata.`,
  whoPrepared: 'Offline pipeline (embed + запис у vector DB / hybrid store).',
  contains: `Усі chunks tenant acme про auth, включно з \`${INC.chunkId}\`.`,
  whoUsesNext: 'Retriever на кожному run investigation (код, programmatically).',
  teachingExample:
    'Перед run login_spec індекс уже містить INC-442; runtime лише читає store, не будує його з нуля.',
  risks: 'Staging читає старий index — retrieval повертає застарілий селектор з минулого року.',
  qa: 'У deploy-логах версія індексу збігається з очікуваною; тестовий query бачить новий chunk після reindex.',
});

export const RAG_RETRIEVER_PANEL = clarityProcessPanel({
  problem:
    'Після падіння тесту harness має знайти схожі минулі інциденти — LLM для цього не викликають.',
  simpleIdea:
    '**Retriever** (пошук) — код, який за текстом запиту повертає **top-k** кандидатів: chunk_id, text, score, source_id.',
  input: `Query: «${INC.queryUk}», фільтри ${INC.filtersUk} (навчально).`,
  who: 'Код retriever + індекс. Не generative LLM.',
  action: 'Similarity / BM25 / hybrid lookup з урахуванням metadata filters і ACL.',
  output: 'Список **candidates** → після фільтрів **authorized hits** (напр. INC-442 і INC-318).',
  nextRecipient: 'Опційно rerank, потім context builder обирає **selected evidence**.',
  why: 'Recall@k можна тестувати без LLM — це окремий шар від якості відповіді моделі.',
  teachingExample:
    `\`${INC.chunkId}\` зазвичай у top-k для login staging; score — для інженерів у trace, не «ймовірність правди».`,
  risks: 'Правильний chunk є в індексі, але не в top-k — модель ніколи його не побачить.',
  qa: 'Golden query без LLM: очікуваний chunk_id у top-k; replay exact query string з trace.',
});

export const RAG_FILTERS_PANEL = clarityProcessPanel({
  problem: 'Без обмежень пошук повертає chunks іншого tenant або production, хоча run лише для staging acme.',
  simpleIdea:
    '**Metadata filters** — умови на поля chunk (tenant, env, service, дата), які застосовує **код** до або після vector search.',
  input: `Hits-кандидати після retriever; умови ${INC.filtersUk}.`,
  who: 'Код retriever / policy harness. Не LLM.',
  action: 'Відсіює chunks, що не відповідають scope run (ACL, tenant).',
  output: 'Authorized hits — лише дозволені для цього запуску.',
  nextRecipient: 'Rerank або context builder.',
  why: 'Ізоляція даних — обов’язкова перевірка QA, не опція.',
  teachingExample:
    'Chunk іншого tenant може існувати в індексі, але не потрапляє в authorized hits для acme.',
  risks: 'Помилка фільтра — витік cross-tenant у prompt.',
  qa: 'Негативний тест: tenant A не бачить chunks tenant B при тому ж query.',
});

export const RAG_RERANK_PANEL = clarityProcessPanel({
  problem: 'Top-k за similarity не завжди найкращий порядок для вузького context window.',
  simpleIdea:
    '**Rerank** (опційно) — harness викликає перестановку hits; оцінку часто робить **rerank-модель** (ймовірнісно). Код задає budget і що передати далі.',
  input: 'Authorized hits (INC-442, INC-318 у навчальному прикладі).',
  who: 'Код orchestration; scoring — часто окрема модель, не generative LLM run.',
  action: 'Піднімає доречніші chunks, обрізає список під token budget.',
  output: 'Відсортований короткий список **selected evidence**.',
  nextRecipient: 'Context builder форматує messages[].',
  why: 'У цьому курсі до LLM часто лишають лише INC-442; INC-318 залишається поза prompt.',
  teachingExample: `\`${INC.chunkId}\` потрапляє в prompt; chk-318-b може бути дозволений hit, але не selected.`,
  risks: 'Flaky score між середовищами — не використовуйте біт-в-біт порівняння як oracle.',
  qa: 'Golden по chunk_id після rerank, не по точному score.',
  deeper: 'Rerank можна вимкнути — тоді context builder бере top-k як є.',
});

export const RAG_CONTEXT_PANEL = clarityProcessPanel({
  problem: 'LLM API приймає messages[], а не «сирий» список hits — потрібен форматований evidence block.',
  simpleIdea:
    '**Context builder** — код, який збирає system/developer, блок **Retrieved context** (зовнішній документ, не system policy) і user turn.',
  input: `Selected evidence: один фрагмент ${INC.sourceId} з текстом про #login-btn + user turn з CI (login_spec, trace).`,
  who: 'Harness (TypeScript / backend). Не LLM.',
  action:
    'Вкладає source_id і text у prompt; інструкції з wiki **не** стають системними правилами агента (захист від injection).',
  output: 'Готовий messages[] для API generative model.',
  nextRecipient: 'Generative LLM.',
  why: 'У trace має бути видно, який chunk реально передали — для перевірки citation.',
  teachingExample: 'Retrieved context містить лише INC-442; INC-318 модель у цьому run не бачить.',
  risks: 'Confidential chunk проскочив у prompt; занадто великий evidence — обрізання важливого.',
  qa: 'Кожен citation у відповіді → chunk_id у selected evidence цього run.',
});

export const RAG_LLM_PANEL = clarityProcessPanel({
  problem: 'Потрібна людськомовна гіпотеза на основі CI + минулих інцидентів.',
  simpleIdea:
    '**Generative LLM** синтезує відповідь з опорою на переданий context. Вона **не** шукає в wiki і **не** підтверджує root cause сама.',
  input: `messages[] з Retrieved context (${INC.sourceId}) і описом падіння login_spec.`,
  who: 'Generative LLM через API (ймовірнісно).',
  action: 'Формулює гіпотезу, може процитувати source_id.',
  output: 'Текст відповіді (навчально: «схоже на зміну селектора, див. INC-442»).',
  nextRecipient: 'Harness / QA: перевірки citation, groundedness, oracle DOM/trace.',
  why: 'Відповідь — **гіпотеза**, поки QA не звірив поточне падіння.',
  teachingExample: RAG_LOGIN_SPEC_SIGNAL,
  risks: 'Правильний citation + хибний висновок; плутанина двох схожих chunks.',
  qa: 'Три шари: технічна citation, зміст chunk, oracle поточного збою; висновок: підтверджено / спростовано / доказів недостатньо.',
});

/** Offline ribbon: Searchable store */
export const RAG_QUERY_PANEL = clarityProcessPanel({
  problem: 'Після падіння тесту harness має сформувати пошуковий запит — не чекати, поки LLM «сама згадає» wiki.',
  simpleIdea:
    '**Query** — текст пошуку для retriever; **metadata filters** — обмеження (tenant, env, service), які задає код разом із запитом.',
  input: `${RAG_LOGIN_SPEC_SIGNAL} Harness будує query і фільтри (навчально ${INC.filtersUk}).`,
  who: 'Код harness. Generative LLM на цьому кроці не викликають.',
  action: 'Збирає retrieval query з симптомів CI; застосовує policy фільтрів до retriever.',
  output: `Рядок пошуку «${INC.queryUk}» + scope metadata.`,
  nextRecipient: 'Retriever (similarity / hybrid lookup).',
  why: 'Exact query string у trace дозволяє replay retrieval без LLM.',
  teachingExample: 'Той самий run, де далі з’являться hits з INC-442 і INC-318.',
  risks: 'Занадто вузький query — правильний postmortem не в top-k.',
  qa: 'У trace збережено query і фільтри; golden replay повертає очікувані chunk_id.',
});

export const RAG_HITS_PANEL = clarityDataPanel({
  problem: 'Список «щось знайшлось» не означає, що все це побачить модель — є кілька шарів.',
  simpleIdea:
    '**Candidates** — сирі збіги similarity. **Authorized hits** — після tenant/ACL і metadata. **Selected evidence** — те, що реально потрапить у messages[].',
  whatItIs: 'Структуровані записи: chunk_id, text, score, source_id у trace run.',
  whoPrepared: 'Retriever формує candidates/authorized; harness + rerank обирають selected.',
  contains: `Навчально authorized: ${INC.sourceId} і INC-318; selected для LLM часто лише \`${INC.chunkId}\`.`,
  whoUsesNext: 'Context builder форматує selected у Retrieved context.',
  teachingExample: 'Score 0.81 у INC-442 — для інженерів у trace, не «81% правда».',
  risks: 'Плутанина hits і selected — QA думає, що модель бачила INC-318, хоча chunk не був у prompt.',
  qa: 'Citation у відповіді ⊆ selected evidence; forbidden tenant ∉ authorized.',
  deeper: 'Rerank може змінити порядок перед відбором у prompt.',
});

export const RAG_SEARCHABLE_STORE_PANEL = clarityDataPanel({
  problem: 'Runtime не повинен будувати індекс з нуля на кожен клік «Analyze».',
  simpleIdea: '**Searchable store** — готовий індекс після offline-фази; retriever лише читає.',
  whatItIs: `Зберігання vectors/text/metadata версії \`${INC.indexVersion}\`.`,
  whoPrepared: 'Результат embed/index offline job.',
  contains: 'Усі проіндексовані chunks дозволених tenant, включно з postmortem login.',
  whoUsesNext: 'Retriever у нижній гілці схеми (runtime).',
  teachingExample: 'Один раз побудували index — багато run investigation читають той самий store (поки не reindex).',
  risks: 'Застарілий store — retrieval «правильний», але з минулого року.',
  qa: 'Після reindex тестовий query повертає оновлений chunk_id; regression на версії індексу.',
});
