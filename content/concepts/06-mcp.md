# Concept 06 — MCP

> **migrationStatus:** `partial` — Study Mode: 8 розділів (PART II пакет 3).

## Review Mode

**Проблема:** десятки інтеграцій (Jira, Git, CI) — різні API; дублювати adapters у кожному агенті дорого.

**Ідея MCP (Model Context Protocol):** стандартний **протокол** між клієнтом (harness) і **MCP server**, що надає tools/resources. Це зовнішній сервіс + контракт, не «ще один LLM».

**Для QA:** контракт tools, auth, timeouts, sandbox paths на MCP server.

## Study Mode

### Навіщо MCP investigation агенту?

Після `login_spec` агенту потрібні Playwright report, CI API, maybe Jira. Замість N кастомних SDK у harness — MCP server «CI» і «Tracker» з описаними capabilities. Harness виступає **MCP client**: discover tools, виклик з тими ж policy, що й local handlers.

### Навчальний run

Harness → MCP client → `read_artifact` на CI server → structured result → state → LLM. Дозвіл на prod Jira — на server + policy, не в prompt.

client → MCP server (tools/resources) → зовнішні API

### Компоненти

MCP server, transport, tool schema, auth, client у harness.

### Послідовність

Discover tools (код) → LLM tool_call → client RPC (код) → server I/O → observation.

### Код vs LLM vs сервіс

LLM — пропозиція. Client/harness — policy. MCP server — реальний I/O до Jira/CI.

### Збої

Server down, schema drift, over-privileged tool. **QA:** contract tests на server; deny path у client.

### Production

Version servers, mTLS, rate limits, separate dev/prod MCP endpoints.

### Запам’ятати та співбесіда

MCP — **стандарт підключення tools**, harness лишається місцем policy.

:::study-sources
- V10 Concept 6; *AI Engineering* — інтеграції (inventory).
- Навчальний: MCP CI read після login_spec.
:::study-sources-end
