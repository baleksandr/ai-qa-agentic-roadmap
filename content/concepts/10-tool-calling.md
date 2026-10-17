# Concept 10 — Tool Calling

> **migrationStatus:** `partial` — Study Mode: 8 розділів (еталон RAG); interview deck + панелі кроків.

## Review Mode

**Проблема:** модель може сказати «треба відкрити звіт Playwright» або «перевірити QA-123», але текст відповіді сам по собі не читає диск і не викликає HTTP.

**Ідея tool calling:** application описує tool schemas (ім’я, опис, параметри); LLM повертає structured `tool_call`; harness (код) валідує, перевіряє права, виконує handler і повертає tool result у контекст (`messages`) для наступного кроку.

**Межа:** ймовірнісний вибір tool/args — LLM; реальний I/O, sandbox, policy, retries — детермінований код.

**Для QA:** тестуйте окремо schema/args, deny policy, duplicate side effects, truncation великого result — не лише «чи звучить відповідь розумно».

## Study Mode

### Навіщо потрібен tool calling?

Regression agent після падіння `login_spec` має отримати дані з `./playwright-report/`, trace або API — не вигадати їх з пам’яті моделі.

| Твердження | Пояснення |
|------------|-----------|
| **Текст ≠ дія** | «Відкрий report» у відповіді LLM — не відкритий файл |
| **Tool schema** | Код оголошує, які операції дозволені і з якими типами args |
| **tool_call** | Структурований намір від моделі; виконання — після allow |
| **Не плутати з RAG** | RAG підкладає фрагменти з індексу; tool виконує I/O під час run |

### Один виклик tool у run investigation

**Навчальний приклад (умовно):** після таймауту `#login-btn` harness уже передав LLM tool schemas і короткий опис збою з CI. Модель пропонує перший крок — прочитати HTML звіт.

```text
allow-list tools: readPlaywrightReport(path), readTrace(...), …  — оголошує harness
```

```text
tool_call (пропозиція LLM):
  name: readPlaywrightReport
  arguments: { "path": "./playwright-report/index.html" }
```

**Крок 1.** Harness отримав failure summary з CI (код, не LLM).

**Крок 2.** LLM повертає `tool_call` — пропозиція виклику, не виконання I/O.

**Крок 3.** Validation: schema, sandbox path (лише `playwright-report/`), policy allow/deny.

**Крок 4.** Tool handler читає файл; диск і мережа — у handler, не в LLM.

**Крок 5.** Harness додає `role=tool` message (часто обрізаний snippet) → наступний turn LLM.

У trace має бути ланцюг: proposed call → allow/deny → duration → розмір result.

### З чого складається механізм?

Один run investigation (назви в проді різняться):

```text
CI summary → Harness → LLM (tool_call) → validation / policy → handler → результат у messages → LLM
```

### Де код, а де LLM?

Один навчальний прохід `readPlaywrightReport` після `login_spec`: шість кроків (harness → пропозиція LLM → перевірки → read → результат у context → відповідь LLM), таблиця ролей LLM / код / людина і два приклади меж (небезпечний path, повторний Jira). Деталі — в інтерактивному блоці нижче.

### Де може зламатися?

Сім типових збоїв tool calling (навчальні приклади: `login_spec`, `readPlaywrightReport`, `createJiraIssue`). Повні пояснення — в інтерактивних картках нижче.

#### Hallucinated tool name

Невідомий інструмент до I/O.

#### Invalid arguments

Невірний JSON, тип або path поза sandbox.

#### Wrong tool chosen

Дозволений tool, але не для задачі.

#### Duplicate side effect

Повторний write після retry.

#### Huge tool result

Завеликий HTML у контекст моделі.

#### Tool timeout / unavailable

503 або timeout без вигаданих даних.

#### Permission denied

Policy deny без side effect.

### Як QA це тестує?

Практичний план: три рівні (handler → harness без LLM → run з моделлю), шість категорій перевірок із setup → дія → очікування → докази, і два навчальні сценарії Given/When/Then (`readPlaywrightReport` з небезпечним path, повторний `createJiraIssue`). Деталі — в інтерактивному блоці нижче.

### Production і observability

| Тема | Пояснення |
|------|-----------|
| **Trace** | toolName, args hash/redacted, allow/deny, duration, downstream status |
| **Versioning tools** | Зміна schema — backward compatibility тести |
| **Rate limits** | Throttle на API tools |
| **max_steps** | Захист від циклу LLM ↔ tools |

### Запам’ятати та співбесіда

| Теза | Коротко |
|------|---------|
| **Tool calling** | LLM пропонує structured call; harness виконує після перевірок |
| **Schema** | Дозволені імена й типи — не «будь-який API» |
| **tool result** | Факти з I/O у context; часто обрізані |
| **≠ RAG** | Retrieval з індексу vs виклик функції зараз |

Нижче — інтерактив **«Перевір себе перед співбесідою»** (10 запитань, pitch UK/EN, посилання далі).

:::study-sources
- Deep Study Guide v10 — Concept 10 Tool Calling (архів курсу).
- Навчальний сценарій: `readPlaywrightReport`, `login_spec` — для закріплення механізму (не live run).
- Атлас: `/agent-architecture?tab=tool-calling` — покрокова схема з панелями.
:::study-sources-end
