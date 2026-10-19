export type McpRememberThesis = {
  termUk: string;
  explanationUk: string;
};

/** §8 «Запам’ятати» — чотири тези в одному компактному блоці. */
export const MCP_REMEMBER_THESES: McpRememberThesis[] = [
  {
    termUk: 'MCP',
    explanationUk:
      'протокол взаємодії застосунку з компонентами, що надають інструменти й дані.',
  },
  {
    termUk: 'Host',
    explanationUk: 'застосунок, який керує агентом і підключає сервери.',
  },
  {
    termUk: 'MCP client',
    explanationUk: 'частина host, яка спілкується з конкретним сервером.',
  },
  {
    termUk: 'Дозвіл на дію',
    explanationUk:
      'рішення коду застосунку за правилами продукту. Сервер і джерело даних можуть мати додаткові перевірки.',
  },
];
