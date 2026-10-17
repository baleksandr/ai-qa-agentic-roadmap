# Інвентар тем для атласу архітектур

Орієнтир: повні уроки + `learning-map.registry.ts`. Не кожна тема потребує окремої анімованої діаграми.

| topicId | Назва (карта) | Роль у системі | Окрема схема? | Тип візуалізації | Що пояснює схема | Зв’язки з іншими схемами |
|---------|---------------|----------------|---------------|------------------|------------------|--------------------------|
| fundamentals | Основи AI та LLM | Базова модель і context | Ні (посилання) | — | — | → agent, harness |
| concept-14 | Промпт і інструкції | Формування messages | Пізніше | Потік messages | system/developer/user blocks | harness, CAG |
| concept-10 | Tool Calling | LLM → tool → result | **Так (готово)** | Покроковий потік | propose → validate → execute → context | agent, harness, guardrails, MCP |
| concept-04 | Agent Harness | Цикл run, context, stop | **Так (готово)** | Покроковий цикл | init → build context → LLM → tools → stop | agent, tool-calling, memory |
| concept-12 | Міркування моделі | Внутрішня генерація | Ні | Порівняння / текст уроку | attention, tokens | harness |
| concept-01 | Пам’ять і стан | run state vs memory | Пріоритет 3 | Два шляхи даних | checkpoint, context builder | harness, RAG |
| concept-03 | RAG | Retrieval у запиті | **Так (готово)** | Два процеси | index + query | combined, harness |
| concept-15 | Векторний пошук | Індекс / metric | Ні | Підрозділ RAG | embedding, top-k | RAG |
| concept-06 | MCP | Протокол tools | **Так (готово)** | Client/server | discovery → call → result | tool-calling, combined |
| concept-13 | Fine-tuning | Зміна weights | Ні | Карта рішень | коли не RAG | — |
| concept-07 | Skills | Пакети інструкцій | Пріоритет 5 | Завантаження skill | select → inject context | harness, CAG |
| concept-11 | Планування | План перед виконанням | Пізніше | Граф кроків | plan → revise | orchestration |
| concept-02 | Оркестрація | Хто виконує крок | Пріоритет 4 | Граф + router | task routing, retries | harness, workflows |
| concept-16 | Agentic workflows | Граф workflow | Пізніше | State machine | nodes, checkpoint | orchestration |
| concept-09 | Кілька агентів | Розподіл ролей | Ні | Карта зв’язків | specialists | A2A |
| concept-08 | A2A | Агент ↔ агент | Пізніше | Повідомлення/task | handoff | multi-agent |
| concept-17 | Guardrails | Policy на вході/виході/дії | Пріоритет 6 | Три зони | input → tool → output checks | tool-calling, harness |
| concept-18 | Observability | Traces/metrics | Пріоритет 7 | Timeline spans | traceId, spans | harness (паралельно) |
| concept-05 | Evals | Оцінка run | Пріоритет 8 | Після run | dataset → scores | observability |
| concept-19 | Бенчмарки | Порівняння версій | Ні | Таблиця / текст | freeze benchmark | evals |
| concept-20 | Production | Інтеграція шарів | Ні (combined) | combined schema | паралельні блоки | усі готові схеми |
| lab-0…lab-9 | QA Regression Agent | Практика | Ні | combined + labs | end-to-end | combined |

## Статус реалізації атласу

| Схема | Статус |
|-------|--------|
| Загальний цикл агента | Готово |
| Tool Calling | Готово |
| Agent Harness | Готово |
| RAG, CAG, MCP | Готово |
| У спільному агенті | Готово |
| Memory & State, Orchestration, Skills, Guardrails, Observability, Evals | Заплановано (пріоритет 3–8) |

SAG не додається без підтвердженого визначення в матеріалах курсу.
