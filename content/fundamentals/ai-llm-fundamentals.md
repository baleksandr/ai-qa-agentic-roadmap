# AI / LLM Fundamentals

> **migrationStatus (з DOCX):** `partial`  
> **Джерело:** PDF (DOCX відсутній)  

## Review Mode

Короткий **індекс** словника Fundamentals (пункти **1–20**). Повні пояснення, схеми та приклади для QA — у **Study Mode** (акордеони з тими ж номерами). Тут без дублювання довгого тексту.

1. **AI** — широка область систем із інтелектуальною поведінкою (сприйняття, прогноз, генерація, планування, рішення).
2. **ML** — поведінка з даних під час навчання, не лише з ручних правил.
3. **Deep Learning** — багатошарові мережі, основа сучасних LLM.
4. **Model** — навчена система з параметрами: вхід → обчислення → вихід.
5. **Training vs Inference** — навчання змінює параметри; inference використовує готову модель.
6. **LLM** — послідовності токенів; на inference — наступні токени з контексту.
7. **Transformer** — архітектура LLM; зв’язки між токенами в межах context.
8. **Token / Tokenization** — одиниці тексту та перетворення в token IDs.
9. **Context Window** — максимум контексту в одному виклику.
10. **Prompt / Messages** — system, user, assistant, tool results тощо.
11. **Next-token prediction** — цикл ймовірність → вибір токена → розширення context.
12. **Temperature / Sampling** — варіативність виводу, не «джерело істини».
13. **Reasoning / Thinking** — додаткове міркування; не те саме, що agent.
14. **Hallucination** — правдоподібна, але непідтверджена або хибна відповідь.
15. **Deterministic vs Probabilistic** — код vs LLM; потрібні validation і evals.
16. **Structured Output** — JSON/схема для надійного парсингу.
17. **Model API** — HTTP-шар до провайдера моделі.
18. **Tokens / Cost / Latency** — вартість, швидкість, production-обмеження.
19. **Model landscape** — LLM, SLM, VLM, …; RAG/MCP/Agent — не «типи моделей».
20. **Перехід до Agentic AI** — tools, state, memory, loop, permissions, control.

Детальні підрозділи курсу (1.1–1.8 з PDF) збережені в архівному блоці **Study Mode** нижче для звірки з джерелом.

## Study Mode

### 1. AI / LLM Fundamentals — що реально відбувається
### 1.1 Що таке AI, ML, Deep Learning і Generative AI
Artificial Intelligence (AI) — парасольковий термін для систем, які виконують задачі, де потрібні
розпізнавання закономірностей, прогнозування, генерація, планування або підтримка рішень. Machine
Learning — підхід, де поведінка системи формується з даних, а не лише з вручну прописаних правил. Deep
Learning — ML на багатошарових нейронних мережах. Generative AI — моделі, що генерують новий
контент: текст, код, зображення, аудіо тощо.

AI
├── rule-based / search / planning systems
└── Machine Learning
└── Deep Learning
└── Generative AI
└── Large Language Models (LLMs)
**Ключова ідея: LLM — не синонім усього AI. Це один клас моделей усередині ширшого поля.**
**Питання: What is AI?**
**Interview answer (EN): AI is a broad field of systems that perform tasks involving perception, prediction, generation,**
planning or decision support. LLMs are one class of generative AI models focused on token sequences.
### 1.1.1 Карта спеціалізованих AI-моделей і де тут Agentic AI
Інфографіка нижче корисна як vocabulary map, але вона змішує класи моделей, архітектури та agentic
concepts. Тому ми не вчимо її як “8 рівнозначних типів моделей”. Наша задача — зрозуміти, що є самою
моделлю, що є model architecture, а що вже application/runtime навколо моделі.

Рисунок. “8 Different Specialized AI Models” — користувацька навчальна інфографіка. Нижче ми уточнюємо taxonomy
й не сприймаємо всі 8 пунктів як одну категорію.
**Model vs Architecture vs Agentic System**
**MODEL / MODEL FAMILY**
├── LLM — language generation / reasoning
├── SLM — smaller language model
├── VLM — vision + language
├── MLM — masked-token language modeling
├── SAM — specialized segmentation model
└── LCM — image-generation approach/model family
MODEL ARCHITECTURE
└── MoE — Mixture of Experts routing inside a model

**AGENTIC APPLICATION**
LLM/VLM/SLM
+ Harness
+ Planning / Reasoning
+ Tool Calling
+ State / Memory
+ MCP / A2A / APIs
+ Guardrails
+ Evals / Observability
= Agent / Agentic System
**Ключова ідея: RAG, MCP, Harness, A2A, Skills, Guardrails та Evals — не “типи AI-моделей”. Це building**
blocks навколо моделі, з яких складається надійна AI application.
LLM / SLM: великий vs малий language model
LLM зазвичай обирають, коли потрібні ширші capability та складніше reasoning. SLM — коли важливі lower
latency, lower cost, локальний/edge deployment або вузька задача. У production часто корисний model
routing: прості classification/tool-selection задачі віддати дешевшій моделі, а складні
architecture/reasoning — сильнішій.
User task → Router (deterministic rules або model) → SLM для простої задачі / LLM для
складної → validation → result.
VLM — Vision-Language Model
VLM приймає visual input разом із текстом і може відповідати про screenshot, diagram, document page або
photo. Для QA це відкриває visual regression assistance, UI understanding, screenshot triage та аналіз
документів, але output все одно probabilistic і потребує validation.
Screenshot + question → visual encoding / multimodal model → combined representation →
generated answer / structured result.
MoE — Mixture of Experts
MoE — це не набір окремих agents. Це model architecture: router усередині моделі вибирає, які expert-
блоки активувати для token/input. Ідея — мати велику загальну capacity, але не активувати всі parameters
на кожному кроці inference.
Token representation → Router → selected Experts → combine expert outputs → next model layer.
MLM — Masked Language Model
MLM навчається відновлювати приховані частини input. Класичний mental example: “The cat is sitting on
the [MASK]”. Це відрізняється від autoregressive GPT-style generation, де модель послідовно прогнозує next
token і додає його в context.
Input with [MASK] → encoder-style model → probability over missing token → predicted token.
SAM — Segment Anything Model
SAM — specialized computer-vision model для segmentation. Його задача — не написати відповідь про
картинку, а виділити маскою pixels, які належать об’єкту/області. Для нашого Agentic QA roadmap це
secondary topic, але хороший приклад того, що “AI model” не обов’язково є language model.
Image + point/box/mask prompt → segmentation model → pixel mask → downstream
vision/application logic.

LCM — Latent Consistency Model
LCM належить до image-generation напрямку й орієнтований на швидке отримання якісного image result
за малою кількістю sampling steps. Це не центральна тема нашої траєкторії, тому достатньо розуміти її
місце: generative vision, а не agent orchestration.
Noise / latent representation → few generation steps → decoded image.
LAM — Large Action Model: термін із застереженням
“Large Action Model” зустрічається в статтях і продуктах як назва систем, орієнтованих на
actions/workflows, але це не настільки усталена базова категорія, як LLM або VLM. Для нашої mental model
краще розкладати “дію” на LLM + planning/reasoning + harness + tools + permissions.
Goal → LLM/Planner → Harness → Tool Call → deterministic tool execution → Observation → next
decision.
Де ми на нашій Agentic Architecture Map
LLM / SLM / VLM — це центральний MODEL block усередині Agent. MoE — внутрішня architecture моделі.
SAM/LCM — спеціалізовані vision/generation напрями поза основним agent flow. Harness, Planning,
Orchestration, MCP, RAG, A2A, Guardrails, Evals та Observability — application/runtime layers навколо
моделі.
USER → PLANNING → HARNESS → ORCHESTRATION → [MODEL: LLM / SLM / VLM] → TOOL CALLING → MCP /
RAG / A2A → RESULTS → GUARDRAILS → EVALS → OBSERVABILITY
### 1.2 Що таке LLM
Large Language Model — нейронна модель, навчена працювати з послідовностями токенів. Спрощено:
вона отримує вже відомий контекст і оцінює ймовірності можливих наступних токенів. Потім один токен
обирається, додається до контексту, і процес повторюється.
Prompt / context
↓
Tokenization
↓
Token IDs
↓
Transformer layers
↓
Probability distribution over next token
↓
Select token
↓
Append to context
↓
Repeat
Через це модель може генерувати код, пояснення чи план, але сама по собі не має гарантії істинності.
Вона оптимізована на побудову правдоподібної послідовності, а не на роль бази даних чи формального
proof engine.
**Ключова ідея: Корисна mental model: LLM — probabilistic engine над контекстом. Надійність системи**
з’являється не лише з моделі, а з context, tools, validation, permissions та evals.

### 1.2.1 Навіщо взагалі виникли LLM
До LLM комп’ютерні системи добре виконували чітко запрограмовані правила, але їм було важко
універсально працювати з природною мовою: пояснювати, узагальнювати, писати код,
перефразовувати, знаходити закономірності в тексті. LLM дає probabilistic language engine, який навчився
на великій кількості прикладів передбачати продовження послідовності та завдяки цьому опанував
багато мовних і reasoning-подібних патернів.
Простий приклад
Ти пишеш: “Напиши Playwright test для login”. Модель не відкриває всередині себе готовий файл
login.spec.ts. Вона отримує твій текст як токени і крок за кроком генерує найбільш доречне продовження:
import → test() → page.goto() → locator → assertion. Кожний наступний шматок залежить від уже наданого та
згенерованого контексту.
Що звідки куди
User text → tokenizer → token IDs → model inference → probabilities for next token → token selection → token
додається до context → наступний inference step → ... → final text.
Де LLM, а де deterministic code
Tokenizer, API validation, JSON parser, permission checks, database writes, виконання tool-функції — це
deterministic software. Вибір змісту відповіді, формулювання тексту або рішення “який tool доречно
викликати” може робити LLM. Саме тому production AI system майже ніколи не повинна покладати
критичні гарантії лише на модель.
Де може впасти
Модель може не мати потрібного факту в context, неправильно інтерпретувати інструкцію, згенерувати
правдоподібну помилку, перевищити context/usage limit або повернути формат, якого не очікує код. Тому
навколо LLM будують validation, structured outputs, tools, permissions, retries, evals і observability.
Як це тестувати
Перевіряй не тільки точний текст. Для LLM важливі task success, factual correctness, format/schema
compliance, safety, tool-selection correctness, latency, token usage і стабільність на наборі reference
examples.
### 1.3 Tokens і tokenization
Модель не читає текст як людина. Tokenizer перетворює рядок у послідовність token IDs. Токен може
відповідати цілому слову, частині слова, punctuation або іншому фрагменту. Конкретне розбиття залежить
від tokenizer конкретної model family.
"Playwright automation"
↓ tokenizer
[token_1, token_2, token_3, ...]
↓
integer IDs
↓
embeddings / model computation
Tokens важливі інженеру з трьох причин: вони займають context window, впливають на latency і часто є
одиницею billing. Довгі tool schemas, дубльована документація та зайві logs можуть витрачати context без
користі.

**Input, output і reasoning tokens**
• Input tokens — system/developer instructions, user request, history, retrieved documents, code, tool
results.
• Output tokens — те, що модель генерує у відповідь.
• Reasoning/internal computation — додаткова обчислювальна робота reasoning-моделей; не варто
будувати систему, що залежить від доступу до сирого chain-of-thought.
**Питання: Why do tokens matter?**
**Interview answer (EN): Tokens consume context capacity and influence latency and often cost. Good context**
engineering maximizes useful signal per token instead of sending everything to the model.
### 1.4 Context Window
Context window — максимальний робочий обсяг токенів, доступних моделі в конкретному inference. У
нього потрапляє не лише твій останній prompt, а вся інформація, яку application передає моделі в цьому
виклику.
Context = system instructions
+ conversation/history
+ current task
+ retrieved knowledge
+ code/examples
+ tool definitions
+ tool results
Великий context не гарантує кращої відповіді. Якщо додати застарілі вимоги, дублікати, нерелевантний
код і десятки tools, модель отримує більше шуму. Context engineering — це керування signal-to-noise ratio.
### 1.5 Training vs Inference
Training змінює параметри моделі на великих наборах даних. Inference використовує вже навчені
параметри для обробки конкретного context. Коли ти даєш Cursor Jira ticket і просиш змінити Playwright
test — ти не “навчаєш модель”; ти формуєш inference context.
Training: data → optimization → model parameters
Inference: model parameters + context → output
### 1.6 Reasoning / Thinking
Для складних задач деякі моделі витрачають більше internal computation: розглядають проміжні кроки,
перевіряють альтернативи, планують tool calls. Практично це корисно для architecture, debugging,
planning, code review і multi-step tasks.
Увага: Не пояснюй reasoning як “модель думає так само, як людина”. Коректніше говорити про
додатковий computational process для складної задачі.
Для engineering system важливий не прихований reasoning transcript, а спостережувані речі: final answer,
tool calls, artifacts, traces, tests і measurable outcome.
### 1.7 Temperature, determinism і sampling
Модель зазвичай має розподіл ймовірностей наступного токена. Sampling strategy визначає, як із нього
вибирається токен. Вища randomness може збільшувати різноманітність, але для automation нам часто
важливі structured constraints, schemas та deterministic validation більше, ніж “креативність”.

**Ключова ідея: Навіть при низькій randomness LLM system не слід вважати математично deterministic**
end-to-end: інфраструктура, model updates, tools і контекст теж можуть змінювати результат.
### 1.8 Hallucinations: чому вони виникають
Hallucination — правдоподібне, але неправильне або непідтверджене твердження/дія. Модель може
“домалювати” відсутній endpoint, selector, library method або business rule, бо її задача — продовжити
послідовність, а не гарантувати факт.
**Типові причини**
• У context немає потрібного факту.
• Є конфліктуючі або застарілі джерела.
• Prompt просить відповідь навіть коли evidence недостатньо.
• Tool result інтерпретований неправильно.
• Модель переносить знайомий pattern у невідповідний API/framework.
Як QA/Engineer зменшує ризик
Generated output
↓
Schema/type validation
↓
Docs / requirement check
↓
Lint / compile / typecheck
↓
Execute tests/tools
↓
Evidence + human review
**Питання: How do you handle hallucinations?**
**Interview answer (EN): I treat generated output as untrusted until it is validated against authoritative context and**
executable evidence such as schemas, type checks, tests, tool results and human review.
**Hands-on Lab — Token/context experiment**
### 1. Візьми одну й ту саму QA задачу.
### 2. Запусти її з мінімальним context.
### 3. Додай релевантний POM + requirement і повтори.
### 4. Додай зайві нерелевантні файли й повтори.
### 5. Порівняй точність, latency, обсяг input і помилки. Запиши висновок про signal-to-noise.

### QA-приклад

Див. відповідний підрозділ «повний приклад» у Study Mode (якщо є в джерелі).

### Failure modes / security / testing / observability / production

Див. розділи failure / security / testing / observability / production у Study Mode.

### Запитання для самоперевірки

Відновіть flow без документа (див. блок «АААА» або hands-on у джерелі).

### Коротка відповідь для співбесіди

Див. **Interview answer** у Study Mode.
