export type AgentExplainerTopic = 'rag' | 'mcp' | 'together';

export type AgentExplainerTeaser = {
  id: AgentExplainerTopic;
  titleUk: string;
  teaserUk: string;
  accent: 'rag' | 'mcp' | 'neutral';
};

export const AGENT_EXPLAINER_TEASERS: AgentExplainerTeaser[] = [
  {
    id: 'rag',
    titleUk: 'RAG',
    teaserUk: 'Знаходить документи для запиту моделі.',
    accent: 'rag',
  },
  {
    id: 'mcp',
    titleUk: 'MCP',
    teaserUk: 'Підключає застосунок до інструмента.',
    accent: 'mcp',
  },
  {
    id: 'together',
    titleUk: 'Разом або окремо',
    teaserUk: 'Показує, для чого потрібна кожна можливість.',
    accent: 'neutral',
  },
];

export type AgentExplainerRagMcpDetail = {
  accent: 'rag' | 'mcp';
  titleUk: string;
  expansionUk: string;
  definitionUk: string;
  howUk: string;
  exampleUk: string;
  qaUk: string;
};

export type AgentExplainerTogetherDetail = {
  accent: 'neutral';
  titleUk: string;
  paragraphsUk: string[];
};

export const AGENT_EXPLAINER_RAG: AgentExplainerRagMcpDetail = {
  accent: 'rag',
  titleUk: 'RAG',
  expansionUk: 'Retrieval-Augmented Generation',
  definitionUk:
    'RAG — підхід, за якого застосунок знаходить фрагменти джерел і передає їх моделі разом із запитом.',
  howUk:
    'Код надсилає пошуковий запит, отримує фрагменти документів із посиланнями на джерела й додає доречні фрагменти до повідомлень для моделі. Модель формує відповідь з урахуванням отриманого тексту.',
  exampleUk:
    'Пошук знайшов postmortem про схоже падіння тесту. Він підказує, що варто перевірити, але не встановлює причину поточного збою. Її QA звіряє з кодом тесту й артефактами цього запуску.',
  qaUk:
    'Чи знайдений документ стосується задачі, чи його зміст підтримує висновок моделі та чи минулий інцидент не подано як доказ поточного падіння.',
};

export const AGENT_EXPLAINER_MCP: AgentExplainerRagMcpDetail = {
  accent: 'mcp',
  titleUk: 'MCP',
  expansionUk: 'Model Context Protocol',
  definitionUk:
    'MCP — протокол, через який застосунок може підключатися до інструментів і джерел даних.',
  howUk:
    'Модель може запропонувати використати інструмент. Код перевіряє назву дії, її аргументи й дозвіл. Після дозволу застосунок звертається до підключеного інструмента та отримує результат або помилку.',
  exampleUk:
    'Застосунок може підключити інструмент читання звіту через MCP. Після дозволу інструмент намагається прочитати звіт цього запуску. Модель сама файл не відкриває.',
  qaUk:
    'Після заборони інструмент не запускається. Після дозволу код отримує результат потрібного запуску або явну помилку читання.',
};

export const AGENT_EXPLAINER_TOGETHER: AgentExplainerTogetherDetail = {
  accent: 'neutral',
  titleUk: 'Разом або окремо',
  paragraphsUk: [
    'RAG відповідає на запитання: «Звідки взяти документи, які можуть допомогти з відповіддю?»',
    'MCP відповідає на запитання: «Як застосунок підключається до інструмента?»',
    'Це незалежні можливості. Агент може працювати без них, з однією або з обома. RAG не доводить правильність знайденого документа. MCP не скасовує перевірку дозволів і результату інструмента.',
  ],
};
