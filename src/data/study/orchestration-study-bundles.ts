import type { FundamentalsCardPanel, StudyPanelTermEntry } from './fundamentals-card-panels';
import type { StudyLearnerPanelSection } from './study-learner-panel-sections';
import type { StudyTeachingCardsBundle } from './study-teaching-card-types';
import { fundamentalsConceptStep } from './fundamentals-teaching-step';

function orcFramedPlain(labelUk: string, bodyUk: string): StudyLearnerPanelSection {
  return { type: 'plain', labelUk, bodyUk, framed: true };
}

const ORCH_PANEL_UI = {
  hidePanelMainCardLabel: true,
  hidePanelStepTitle: true,
} as const;

const ORCH_SECTION_ASIDE = {
  sectionAsideNotePlacement: 'after-cards' as const,
  sectionAsideNoteTitleUk: 'Нотатка до розділу',
};

function orcPanel(sections: StudyLearnerPanelSection[], terms?: StudyPanelTermEntry[]): FundamentalsCardPanel {
  return { sections, terms };
}

function orcWhyPanel(blocks: {
  happenedUk: string;
  coordinationUk: string;
  exampleUk: string;
  qaUk: string;
  terms: StudyPanelTermEntry[];
}): FundamentalsCardPanel {
  return orcPanel(
    [
      orcFramedPlain('Що сталося', blocks.happenedUk),
      orcFramedPlain('Навіщо потрібна координація', blocks.coordinationUk),
      orcFramedPlain('Приклад ABC-123', blocks.exampleUk),
      orcFramedPlain('Що перевіряє QA', blocks.qaUk),
    ],
    blocks.terms,
  );
}

function orcInvestigationPanel(blocks: {
  knownUk: string;
  systemUk: string;
  forwardUk: string;
  qaUk: string;
  terms: StudyPanelTermEntry[];
  extraSections?: StudyLearnerPanelSection[];
}): FundamentalsCardPanel {
  const sections: StudyLearnerPanelSection[] = [
    orcFramedPlain('Що вже відомо', blocks.knownUk),
    orcFramedPlain('Що робить система', blocks.systemUk),
    orcFramedPlain('Що передає далі', blocks.forwardUk),
    orcFramedPlain('Що перевіряє QA', blocks.qaUk),
  ];
  if (blocks.extraSections?.length) {
    sections.push(...blocks.extraSections);
  }
  return orcPanel(sections, blocks.terms);
}

function orcComponentPanel(blocks: {
  whatUk: string;
  howUk: string;
  exampleUk: string;
  qaUk: string;
  terms: StudyPanelTermEntry[];
}): FundamentalsCardPanel {
  return orcPanel(
    [
      orcFramedPlain('Що це', blocks.whatUk),
      orcFramedPlain('Як працює', blocks.howUk),
      orcFramedPlain('Приклад ABC-123', blocks.exampleUk),
      orcFramedPlain('Що перевіряє QA', blocks.qaUk),
    ],
    blocks.terms,
  );
}

function orcSequencePanel(blocks: {
  inputUk: string;
  codeUk: string;
  outputUk: string;
  exampleUk: string;
  qaUk: string;
  terms: StudyPanelTermEntry[];
}): FundamentalsCardPanel {
  return orcPanel(
    [
      orcFramedPlain('Вхід', blocks.inputUk),
      orcFramedPlain('Що робить код', blocks.codeUk),
      orcFramedPlain('Вихід', blocks.outputUk),
      orcFramedPlain('Приклад ABC-123', blocks.exampleUk),
      orcFramedPlain('Що перевіряє QA', blocks.qaUk),
    ],
    blocks.terms,
  );
}

function orcLlmCodePanel(blocks: {
  whoUk: string;
  doesUk: string;
  exampleUk: string;
  forwardUk: string;
  qaUk: string;
  terms: StudyPanelTermEntry[];
  boundaryUk?: string;
}): FundamentalsCardPanel {
  const sections: StudyLearnerPanelSection[] = [
    orcFramedPlain('Хто діє', blocks.whoUk),
    orcFramedPlain('Що робить', blocks.doesUk),
  ];
  if (blocks.boundaryUk?.trim()) {
    sections.push(orcFramedPlain('Важлива межа', blocks.boundaryUk));
  }
  sections.push(
    orcFramedPlain('Приклад ABC-123', blocks.exampleUk),
    orcFramedPlain('Що передає далі', blocks.forwardUk),
    orcFramedPlain('Що перевіряє QA', blocks.qaUk),
  );
  return orcPanel(sections, blocks.terms);
}

function orcFailurePanel(blocks: {
  happenedUk: string;
  problemUk: string;
  systemUk: string;
  qaUk: string;
  terms: StudyPanelTermEntry[];
}): FundamentalsCardPanel {
  return orcPanel(
    [
      orcFramedPlain('Що сталося', blocks.happenedUk),
      orcFramedPlain('Чому це проблема', blocks.problemUk),
      orcFramedPlain('Як має діяти система', blocks.systemUk),
      orcFramedPlain('Як перевіряє QA', blocks.qaUk),
    ],
    blocks.terms,
  );
}

function orcProductionPanel(blocks: {
  observeUk: string;
  exampleUk: string;
  signalUk: string;
  qaUk: string;
  terms: StudyPanelTermEntry[];
}): FundamentalsCardPanel {
  return orcPanel(
    [
      orcFramedPlain('Що спостерігає команда', blocks.observeUk),
      orcFramedPlain('Приклад ABC-123', blocks.exampleUk),
      orcFramedPlain('Що означає сигнал', blocks.signalUk),
      orcFramedPlain('Що перевіряє QA', blocks.qaUk),
    ],
    blocks.terms,
  );
}

type OrcQaNestedStep = {
  key: string;
  titleUk: string;
  teaserUk: string;
  bodyUk: string;
};

function orcQaNestedPick(labelUk: string, pickAriaLabel: string, steps: OrcQaNestedStep[]): StudyLearnerPanelSection {
  return {
    type: 'processStepPick',
    labelUk,
    pickAriaLabel,
    presentation: 'concepts',
    showActorInPanel: false,
    showStepIndexInPanel: false,
    showNestedCardNumberInPanel: true,
    navLayout: 'sidebar',
    navCompactTitleOnly: true,
    steps: steps.map((step) => ({
      key: step.key,
      titleUk: step.titleUk,
      teaserUk: step.teaserUk,
      actorUk: '',
      detailUk: step.bodyUk,
    })),
  };
}

function orcQaTestingPanel(blocks: {
  prepareUk: string;
  qaPickAriaLabel: string;
  qaSteps: OrcQaNestedStep[];
  expectUk: string;
  mustNotUk: string;
  evidenceUk: string;
  terms: StudyPanelTermEntry[];
}): FundamentalsCardPanel {
  return orcPanel(
    [
      orcFramedPlain('Що підготувати', blocks.prepareUk),
      orcQaNestedPick('Що робить QA', blocks.qaPickAriaLabel, blocks.qaSteps),
      orcFramedPlain('Що очікувати', blocks.expectUk),
      orcFramedPlain('Чого не повинно статися', blocks.mustNotUk),
      orcFramedPlain('Які докази зберегти', blocks.evidenceUk),
    ],
    blocks.terms,
  );
}

type OrcNestedStep = {
  key: string;
  titleUk: string;
  teaserUk: string;
  bodyUk: string;
  qaCheckUk: string;
};

function orcNestedPick(labelUk: string, pickAriaLabel: string, steps: OrcNestedStep[]): StudyLearnerPanelSection {
  return {
    type: 'processStepPick',
    labelUk,
    pickAriaLabel,
    presentation: 'concepts',
    showActorInPanel: false,
    showStepIndexInPanel: false,
    showNestedCardNumberInPanel: true,
    navLayout: 'sidebar',
    navCompactTitleOnly: true,
    steps: steps.map((step) => ({
      key: step.key,
      titleUk: step.titleUk,
      teaserUk: step.teaserUk,
      actorUk: '',
      detailUk: step.bodyUk,
      qaCheckUk: step.qaCheckUk,
    })),
  };
}

export const ORCHESTRATION_WHY_INTRO_UK =
  'Для тікета ABC-123 кілька учасників виконують різні задачі: CI перевіряє код, Coding Agent готує зміну, QA Investigation Agent розбирає падіння login_spec, Review Agent оцінює diff, а людина може ухвалювати рішення щодо ризикового кроку. Кожен відповідає за свою частину. Щоб вони працювали з правильними результатами й у потрібному порядку, продукту потрібні правила координації.';

const ORCHESTRATION_WHY_ASIDE_UK =
  'Оркестрація узгоджує готовність задач, версії результатів і переходи після помилок. Вона потрібна й тоді, коли працює один агент із кількома залежними кроками, і тоді, коли для ABC-123 працюють кілька учасників.';

export const ORCHESTRATION_WHY_BUNDLE: StudyTeachingCardsBundle = {
  ariaLabel: 'Навіщо orchestration для тікета ABC-123',
  presentation: 'concepts',
  hideFlowOverview: true,
  hideSectionCardsInteractionHint: true,
  ...ORCH_PANEL_UI,
  ...ORCH_SECTION_ASIDE,
  sectionAsideNoteUk: ORCHESTRATION_WHY_ASIDE_UK,
  steps: [
    fundamentalsConceptStep(
      'orch-why-artifacts',
      'Дочекатися потрібних даних',
      'Investigation починається, коли артефакти CI готові',
      orcWhyPanel({
        happenedUk:
          'CI повідомив, що login_spec не дочекався #login-btn. Саме повідомлення вже є, але Playwright-звіт і trace можуть ще збиратися.',
        coordinationUk:
          'QA Investigation Agent не повинен вважати артефакт доступним лише тому, що CI повідомив про падіння. Координатор або workflow перевіряє, чи завершився етап підготовки потрібних даних. Продукт може дозволяти агенту почати з CI summary раніше, але крок читання звіту залежить від його готовності.',
        exampleUk:
          'CI позначив тест як failed. Після завершення публікації артефактів система відкриває задачу «перевірити звіт». Якщо публікація не вдалася, investigation отримує статус помилки або працює лише з доступними фактами.',
        qaUk:
          'Крок читання звіту не позначають успішним до появи артефакта. Якщо артефакт так і не створено, агент не цитує його вміст. У записах видно окремо результат тесту й готовність артефактів.',
        terms: [
          {
            label: 'Залежність задач',
            text: 'умова, за якою один крок може початися лише після потрібного результату іншого.',
          },
          {
            label: 'Готовність артефакта',
            text: 'стан, у якому файл або інші дані вже доступні для передбаченої продуктом перевірки.',
          },
        ],
      }),
    ),
    fundamentalsConceptStep(
      'orch-why-workflow',
      'Тримати спільний порядок робіт',
      'Система знає, які задачі готові, а які чекають',
      orcWhyPanel({
        happenedUk:
          'Для ABC-123 є кілька робіт: отримати CI-результат, розібрати падіння, оцінити зміну, за потреби підготувати Jira-задачу. Деякі кроки залежать один від одного, інші можуть виконуватися паралельно.',
        coordinationUk:
          'Продукт визначає умови переходу між задачами: яка готова, яка чекає на дані та яку можна призначити наступною. Це не означає, що один агент має виконувати все. Оркестрація узгоджує роботу учасників і передає їм потрібний стан.',
        exampleUk:
          'Investigation може аналізувати готові CI-артефакти, поки Coding Agent готує окрему зміну. Review Agent оцінює конкретний diff лише після того, як відповідна версія зміни готова. Створення Jira issue не має автоматично передувати розслідуванню, якщо для нього потрібні висновки QA.',
        qaUk:
          'У кожної задачі є зрозумілий статус: готова, виконується, чекає або завершена. Заблоковану задачу не запускають так, ніби її залежності виконані. Паралельні задачі не отримують дані чужої версії роботи.',
        terms: [
          {
            label: 'Orchestration',
            text: 'координація задач: їхнього порядку, залежностей, передачі результатів і рішень після помилки.',
          },
          {
            label: 'Workflow graph',
            text: 'модель, у якій задачі є вузлами, а умови переходу між ними визначають, що може виконуватися далі.',
          },
        ],
      }),
    ),
    fundamentalsConceptStep(
      'orch-why-revision',
      'Передавати правильну версію результату',
      'Reviewer оцінює той diff, який справді готовий',
      orcWhyPanel({
        happenedUk:
          'Coding Agent оновив код для ABC-123. Після цього з’явився новий diff, але Review Agent почав коментувати попередній варіант.',
        coordinationUk:
          'Передача задачі reviewer має містити посилання на конкретну версію зміни. Якщо код оновили під час review, продукт має визначити, чи попередній review ще чинний, чи потрібна повторна перевірка.',
        exampleUk:
          'Review Agent отримує ідентифікатор revision або commit, який потрібно оцінити. Його висновок прив’язують до тієї самої версії. Після нового commit система не видає старий висновок за review поточного diff.',
        qaUk:
          'Запис review містить ідентифікатор перевіреної версії. Після оновлення коду UI чітко показує, до якої версії належать коментарі. Старе схвалення не застосовують автоматично до нової зміни.',
        terms: [
          { label: 'Diff', text: 'різниця між конкретними версіями коду.' },
          {
            label: 'Revision',
            text: 'ідентифікована версія зміни, до якої можна прив’язати результат перевірки.',
          },
        ],
      }),
    ),
    fundamentalsConceptStep(
      'orch-why-conflict',
      'Захищати спільні ресурси',
      'Два процеси не повинні непомітно перезаписати один config',
      orcWhyPanel({
        happenedUk:
          'Coding Agent і другий процес одночасно редагують один конфігураційний файл для ABC-123. Якщо обидва запишуть результат без перевірки, одна зі змін може загубитися.',
        coordinationUk:
          'Продукт визначає, як узгоджувати конкурентні записи: наприклад, через ізоляцію робочих копій, перевірку версії перед записом або інший механізм, який застосовується в цій системі. Самого текстового правила «не конфліктуйте» в prompt недостатньо для надійного контролю запису.',
        exampleUk:
          'Обидва процеси почали зі старої версії config. Перший зберіг зміну. Другий перед записом бачить, що версія файла змінилася, і отримує конфлікт для розв’язання замість тихого перезапису.',
        qaUk:
          'У тесті два процеси змінюють той самий ресурс. Після завершення немає непомітно втраченої зміни. Конфлікт видно в статусі задачі та записах workflow.',
        terms: [
          {
            label: 'Конкурентний запис',
            text: 'спроби кількох процесів змінити один ресурс у той самий час.',
          },
          {
            label: 'Конфлікт версій',
            text: 'ситуація, коли ресурс змінився після того, як процес почав із ним працювати.',
          },
        ],
      }),
    ),
    fundamentalsConceptStep(
      'orch-why-gates',
      'Керувати помилками та схваленням',
      'Після збою система вирішує, чи повторити, зупинити або чекати людину',
      orcWhyPanel({
        happenedUk:
          'Зовнішній сервіс не відповів або агент запропонував ризикову дію, наприклад створити Jira issue для ABC-123. Повторний виклик і схвалення людини вирішують різні питання.',
        coordinationUk:
          'Продукт визначає, коли повтор безпечний, скільки разів його можна робити й коли завершити задачу з помилкою. Якщо правила вимагають рішення людини, дію зупиняють до цього рішення. Схвалення не захищає саме по собі від дубля issue після втраченого результату запису.',
        exampleUk:
          'Система підготувала чернетку Jira issue після розслідування. Якщо потрібне approval, виклик createJiraIssue чекає на нього. Після дозволу запис виконується із захистом від дублювання, передбаченим продуктом. Після відмови виклику Jira немає.',
        qaUk:
          'До схвалення немає дії із записом. Після відмови issue не створено. У тесті з втраченою відповіддю від Jira повтор не створює другий тікет, якщо продукт підтримує автоматичний retry створення.',
        terms: [
          {
            label: 'Human gate',
            text: 'точка workflow, де конкретна дія чекає рішення людини за правилами продукту.',
          },
          { label: 'Retry', text: 'повторна спроба після помилки за визначеним правилом.' },
          {
            label: 'Idempotency',
            text: 'механізм, що запобігає повторному результату дії із записом.',
          },
        ],
      }),
    ),
  ],
};

export const ORCHESTRATION_INVESTIGATION_INTRO_UK =
  'Після падіння login_spec система має дочекатися потрібних артефактів, передати задачу на розслідування та обрати наступну гілку за фактичним результатом. Окремі дії можуть потребувати схвалення людини. Простежимо один можливий маршрут для ABC-123 без припущення, що кожна гілка обов’язково виконується.';

export const ORCHESTRATION_INVESTIGATION_BUNDLE: StudyTeachingCardsBundle = {
  ariaLabel: 'Investigation після login_spec для тікета ABC-123',
  presentation: 'process',
  hideFlowOverview: true,
  hideSectionCardsInteractionHint: true,
  ...ORCH_PANEL_UI,
  steps: [
    fundamentalsConceptStep(
      'orch-inv-ci-ready',
      'Дані CI готові',
      'Збій відомий, потрібні артефакти можна перевіряти',
      orcInvestigationPanel({
        knownUk:
          'CI повідомив, що login_spec не дочекався #login-btn. Сам факт падіння можна знати раніше, ніж система завершить публікацію Playwright-звіту й trace.',
        systemUk:
          'Відстежує окремо результат тесту й готовність потрібних артефактів. Якщо для investigation достатньо CI summary, агент може почати з нього. Читання звіту дозволяють планувати лише з розумінням, чи вже доступний артефакт цього запуску.',
        forwardUk:
          'Задачу розслідування з ідентифікатором CI запуску, фактичним повідомленням про збій і посиланнями на доступні артефакти. Вміст звіту не підставляють, якщо файл ще не прочитали.',
        qaUk:
          'Investigation не плутає повідомлення «тест упав» зі станом «звіт готовий». Якщо артефакт не опубліковано, система не позначає його успішно прочитаним. Дані іншого CI запуску не потрапляють у ABC-123.',
        terms: [
          {
            label: 'CI ready',
            text:
              'визначений продуктом стан, коли потрібні для наступної задачі результати CI вже доступні. У цьому уроці окремо розрізняємо результат тесту й готовність артефактів.',
          },
          {
            label: 'Артефакт',
            text: 'файл або інший результат конкретного запуску, наприклад Playwright-звіт.',
          },
        ],
      }),
    ),
    fundamentalsConceptStep(
      'orch-inv-task',
      'Задача на розслідування',
      'QA агент збирає докази, а не вгадує причину',
      orcInvestigationPanel({
        knownUk:
          'Є timeout на #login-btn і доступні на цей момент дані CI. Причину падіння поки не підтверджено.',
        systemUk:
          'Призначає QA Investigation Agent задачу розібрати збій. Агент може запропонувати прочитати звіт або trace. Код перевіряє доступ до конкретного артефакта, викликає дозволений інструмент і записує фактичний результат або помилку.',
        forwardUk:
          'Підсумок для наступного рішення: що підтверджено, які гіпотези залишилися, які артефакти прочитано й яких даних бракує. Якщо інструмент повернув помилку, підсумок не має цитувати непрочитаний звіт.',
        qaUk:
          'Підсумок прив’язаний до правильного CI запуску. Сильні твердження спираються на фактично отримані результати. Оркестратор не передає Coding Agent або Review Agent вигадану причину падіння як встановлений факт.',
        terms: [
          {
            label: 'Investigation task',
            text: 'окрема задача workflow зі зрозумілим входом, статусом і результатом.',
          },
          {
            label: 'Observation',
            text: 'дані або помилка, які система фактично отримала під час перевірки.',
          },
        ],
      }),
    ),
    fundamentalsConceptStep(
      'orch-inv-branch',
      'Вибір наступної гілки',
      'Результат визначає, чи потрібні виправлення, повтор або допомога людини',
      orcInvestigationPanel({
        knownUk:
          'Investigation Agent повернув підтверджені факти, непідтверджені гіпотези та статус використаних інструментів. Це основа для наступного рішення, а не автоматичний наказ змінювати код.',
        systemUk:
          'За правилами workflow визначає доречний подальший маршрут. Можливі варіанти: підготувати виправлення за достатнього доказу, обмежено повторити тимчасово невдалу перевірку або передати випадок людині, якщо автоматичному висновку бракує даних. Ці варіанти не повинні виконуватися всі підряд.',
        forwardUk:
          'Конкретну задачу наступному учаснику або статус, що автоматичне продовження неможливе. Разом із задачею передає посилання на докази й версію даних, на якій ґрунтується рішення.',
        qaUk:
          'Гілку вибрано на підставі записаного результату, а не за ключовим словом timeout. Якщо доказів немає, Coding Agent не отримує вигаданий наказ «виправ застарілий селектор».',
        terms: [
          {
            label: 'Гілка workflow',
            text: 'можливий подальший маршрут залежно від результату попередньої задачі.',
          },
          { label: 'Routing', text: 'вибір наступної задачі або учасника за умовами workflow.' },
        ],
        extraSections: [
          orcNestedPick('Можливі гілки після investigation', 'Гілки workflow для ABC-123', [
            {
              key: 'orch-branch-fix',
              titleUk: 'Підготувати виправлення',
              teaserUk: 'Доказ дозволяє сформулювати конкретну задачу Coding Agent',
              bodyUk:
                'Якщо отримані дані справді вказують на зміну селектора або іншу конкретну проблему, workflow може передати Coding Agent задачу підготувати виправлення. Разом передають доказ, ідентифікатор запуску й межі припущень. Після зміни потрібні перевірка CI та review саме нової версії diff. Сам investigation не означає, що код уже виправлено.',
              qaCheckUk:
                'Виправлення прив’язане до отриманого доказу, а Review Agent оцінює актуальний diff, а не стару версію.',
            },
            {
              key: 'orch-branch-retry',
              titleUk: 'Повторити перевірку',
              teaserUk: 'Тимчасова помилка може дозволяти обмежений retry',
              bodyUk:
                'Якщо читання артефакта завершилося тимчасовою помилкою, продукт може дозволити повтор із визначеною межею. Не повторюй виклик лише тому, що результат не підтримав бажану гіпотезу. Повтор дії із записом потребує окремого захисту від дублювання.',
              qaCheckUk:
                'Підставляють тимчасову помилку й перевіряють кількість спроб, паузу або інше правило продукту, причину завершення та відсутність нескінченного циклу.',
            },
            {
              key: 'orch-branch-human',
              titleUk: 'Передати людині',
              teaserUk: 'Доказів замало або потрібне рішення поза автоматичним workflow',
              bodyUk:
                'Якщо звіт недоступний, trace не пояснює timeout і безпечного наступного кроку немає, система може передати людині відомі факти, невідомі питання й причину зупинки. Не називай це автоматично «причину знайдено». Передача людині для аналізу відрізняється від approval конкретної ризикової дії на наступній картці.',
              qaCheckUk:
                'Людині передано факти поточного run без вигаданих доказів і без секретів у повідомленні.',
            },
          ]),
        ],
      }),
    ),
    fundamentalsConceptStep(
      'orch-inv-approval',
      'Схвалення, якщо воно потрібне',
      'Ризикову дію виконують лише після рішення за правилами продукту',
      orcInvestigationPanel({
        knownUk:
          'Після investigation може з’явитися пропозиція створити Jira issue, запустити повторний CI pipeline або виконати іншу дію. Не кожна з цих дій обов’язково потребує людини: це визначає політика конкретного продукту.',
        systemUk:
          'Для дії, яка потребує approval, workflow ставить саме цей крок на паузу. Людина бачить, що планують зробити і на основі яких даних. Після дозволу код окремо перевіряє умови виконання та здійснює дію. Після відмови не запускає її.',
        forwardUk:
          'Записане рішення людини й відповідний статус задачі. Якщо дію дозволили та виконали, результат виконання також фіксують. Схвалення не означає, що зовнішній API обов’язково відповів успішно.',
        qaUk:
          'До потрібного схвалення немає виклику ризикового інструмента. Після відмови немає побічного ефекту. Якщо результат дії із записом загубився й продукт робить retry, захист від дубля перевіряють окремо: approval сам по собі його не забезпечує.',
        terms: [
          {
            label: 'Human gate',
            text: 'умовна точка workflow, де конкретна дія чекає рішення людини.',
          },
          {
            label: 'Approval',
            text: 'записане рішення дозволити або відхилити конкретну запропоновану дію.',
          },
          {
            label: 'Побічний ефект',
            text: 'зміна зовнішньої системи, наприклад створення Jira issue.',
          },
        ],
      }),
    ),
  ],
};

export const ORCHESTRATION_COMPONENTS_INTRO_UK =
  'Оркестрація має знати, які задачі є у workflow, що вже завершено, кому передати наступний крок і як діяти після помилки. У невеликому продукті кілька цих функцій може виконувати один компонент. Розділимо їх за відповідальністю, а не за кількістю процесів чи серверів.';

export const ORCHESTRATION_COMPONENTS_BUNDLE: StudyTeachingCardsBundle = {
  ariaLabel: 'Компоненти orchestration для тікета ABC-123',
  presentation: 'concepts',
  hideFlowOverview: true,
  hideSectionCardsInteractionHint: true,
  ...ORCH_PANEL_UI,
  steps: [
    fundamentalsConceptStep(
      'orch-comp-model',
      'Модель workflow',
      'Описує задачі та умови переходу між ними',
      orcComponentPanel({
        whatUk:
          'Модель workflow визначає можливі кроки й залежності між ними. Її можна представити графом задач, станами та переходами або іншим способом, який підходить продукту. Не пиши, що workflow graph і state machine завжди один і той самий формат: це різні способи описати організацію роботи.',
        howUk:
          'Система знає, що перевірка звіту залежить від готовності CI-артефакта, а review конкретного diff залежить від появи саме цієї версії зміни. Модель workflow визначає умови переходу, але сама не читає файл і не змінює код.',
        exampleUk:
          'Після події «артефакти CI готові» стає можливою задача investigation. Якщо Coding Agent створив нову revision, review попередньої revision не вважають перевіркою нового diff.',
        qaUk:
          'Задачу не запускають, доки її залежність не виконана. Для помилки CI, успішного investigation і відсутнього артефакта передбачені зрозумілі стани або маршрути.',
        terms: [
          {
            label: 'Workflow graph',
            text: 'подання задач як вузлів, а залежностей і переходів між ними як зв’язків.',
          },
          {
            label: 'State machine',
            text: 'подання допустимих станів задачі або workflow та правил зміни цих станів.',
          },
        ],
      }),
    ),
    fundamentalsConceptStep(
      'orch-comp-scheduler',
      'Вибір готової задачі',
      'Знаходить крок, умови для якого вже виконано',
      orcComponentPanel({
        whatUk:
          'Scheduler або dispatcher визначає, які задачі можна почати зараз, і передає їх на виконання. У конкретному продукті це може бути окремий сервіс або логіка в коді orchestrator.',
        howUk:
          'Перед запуском перевіряє залежності, поточний статус і доступного виконавця. Якщо звіт іще публікують, читання звіту не є готовою задачею. Якщо артефакт доступний, задачу investigation можна передати відповідному виконавцю.',
        exampleUk:
          'Повідомлення «login_spec failed» уже отримано, але Playwright-звіт ще не готовий. Задача «проаналізувати доступний CI summary» може бути готовою, а «прочитати звіт» — чекати. Коли звіт з’явився, система переглядає готовність другого кроку.',
        qaUk:
          'Готову задачу можна запустити. Заблоковану не запускають передчасно. Одна й та сама подія готовності не призводить до двох непотрібних виконань, якщо продукт обіцяє захист від дублювання.',
        terms: [
          { label: 'Scheduler', text: 'логіка, що визначає, коли задача готова до запуску.' },
          {
            label: 'Dispatcher',
            text: 'логіка, що передає готову задачу виконавцю. У конкретній системі обидві ролі можуть бути об’єднані.',
          },
        ],
      }),
    ),
    fundamentalsConceptStep(
      'orch-comp-queue',
      'Передача задач',
      'Дає змогу виконавцю отримати роботу й повідомити результат',
      orcComponentPanel({
        whatUk:
          'Для передачі задач продукт може використовувати чергу, сховище зі статусами або прямий виклик. Task queue — один із можливих механізмів, а не вимога до кожної оркестрації.',
        howUk:
          'Після визначення готової задачі система передає її виконавцю разом із необхідними ідентифікаторами: ABC-123, потрібним CI run та, коли це review, конкретною revision. Виконавець повертає результат або помилку, після чого статус задачі оновлюють.',
        exampleUk:
          'QA Investigation Agent отримує задачу для конкретного падіння login_spec. Якщо повідомлення доставили повторно, продукт повинен обробити це відповідно до своїх правил, а не мовчки створити два однакові Jira issues.',
        qaUk:
          'Задача містить ідентифікатор правильного run. Повторна доставка не змішує результати різних розслідувань. Якщо виконавець недоступний, задача не зникає без зрозумілого статусу.',
        terms: [
          {
            label: 'Task queue',
            text: 'механізм, у якому задачі чекають, поки їх отримає виконавець.',
          },
          {
            label: 'Повторна доставка',
            text: 'ситуація, коли той самий запит на виконання надходить виконавцю ще раз.',
          },
        ],
      }),
    ),
    fundamentalsConceptStep(
      'orch-comp-routing',
      'Призначення виконавця',
      'Визначає, хто має виконати конкретний крок',
      orcComponentPanel({
        whatUk:
          'Routing rules пов’язують тип задачі з відповідним виконавцем або способом її виконання. Це можуть бути правила коду, налаштування workflow чи інший механізм продукту. Вибір виконавця не дає йому автоматично прав на всі інструменти.',
        howUk:
          'Задачу аналізу артефактів передають QA Investigation Agent. Задачу підготувати зміну коду — Coding Agent. Перевірку конкретного diff — Review Agent. Дію, для якої потрібне рішення людини, направляють до людини за правилами продукту.',
        exampleUk:
          'Review Agent отримує revision, яку слід перевірити. Якщо він отримав застарілу revision, його схвалення не можна застосувати до нової зміни без перевірки.',
        qaUk:
          'Кожен виконавець отримує відповідний тип задачі та правильну версію вхідних даних. Пропозиція викликати інструмент усе одно проходить перевірку доступу.',
        terms: [
          {
            label: 'Routing rules',
            text: 'правила вибору виконавця або наступного маршруту задачі.',
          },
          {
            label: 'Виконавець',
            text: 'агент, код інструмента або людина, яким передали конкретну роботу.',
          },
        ],
      }),
    ),
    fundamentalsConceptStep(
      'orch-comp-retry',
      'Повтор і час очікування',
      'Обмежує спроби після помилки або затримки',
      orcComponentPanel({
        whatUk:
          'Правила retry і timeout визначають, скільки чекати на результат, коли повторити задачу й коли завершити її з помилкою. Різні типи дій потребують різних правил.',
        howUk:
          'Після тимчасової помилки читання продукт може дозволити обмежений повтор. Якщо результат створення Jira issue невідомий через втрату відповіді, повтор не можна вважати безпечним без перевірки наслідку або захисту від дублювання.',
        exampleUk:
          'Читання CI-артефакта завершилося timeout. Система фіксує спробу та діє за встановленим лімітом. Створення Jira issue, яке могло вже відбутися, обробляють окремо: друга спроба не повинна навмання створити ще один тікет.',
        qaUk:
          'Спроб не більше за межу продукту. У trace є помилка й причина повтору або зупинки. Дія із записом не створює дубль за сценарієм, де перше виконання відбулося, а відповідь загубилася.',
        terms: [
          { label: 'Retry', text: 'повторна спроба за визначеним правилом.' },
          { label: 'Timeout', text: 'межа очікування результату конкретної операції.' },
          {
            label: 'Idempotency',
            text: 'механізм захисту від повторного наслідку дії із записом.',
          },
        ],
      }),
    ),
    fundamentalsConceptStep(
      'orch-comp-approval',
      'Схвалення дії',
      'Зупиняє конкретний ризиковий крок до рішення людини',
      orcComponentPanel({
        whatUk:
          'Approval gate — умовний етап workflow для дії, яку політика продукту не дозволяє виконувати без рішення людини. Це не обов’язковий етап кожного run або кожного читання файла.',
        howUk:
          'Система показує людині заплановану дію та потрібний контекст. Після схвалення код перевіряє актуальні умови й виконує дозволений крок. Після відмови дія не виконується. Саме рішення й подальший результат записують окремо.',
        exampleUk:
          'Агент підготував чернетку Jira issue. Якщо створення тікета потребує approval, запит до Jira не надсилають до рішення людини. Після відмови чернетка не перетворюється на створений issue.',
        qaUk:
          'До рішення немає побічного ефекту. Після відмови немає виклику createJiraIssue. Схвалення належить саме до тієї дії та того вмісту, які людині показали.',
        terms: [
          {
            label: 'Approval gate',
            text: 'умовна точка зупинки перед дією, що потребує рішення людини.',
          },
          {
            label: 'Побічний ефект',
            text: 'зміна зовнішньої системи, наприклад створення Jira issue.',
          },
        ],
      }),
    ),
    fundamentalsConceptStep(
      'orch-comp-state',
      'Спільний стан і події',
      'Учасники бачать узгоджений перебіг роботи',
      orcComponentPanel({
        whatUk:
          'Система зберігає статуси задач і їхні результати, щоб інші учасники workflow знали, що вже сталося. Для сповіщення про зміни вона може використовувати події. Shared state та event bus виконують різні ролі й не зобов’язані бути двома окремими сервісами.',
        howUk:
          'Після завершення CI, investigation або review відповідний результат пов’язують із ABC-123 та ідентифікатором конкретного запуску чи revision. Наступний виконавець отримує потрібні дані, а не довільний «останній результат» іншої задачі.',
        exampleUk:
          'CI опублікував звіт. Investigation записав, що прочитав його й отримав фрагмент. Coding Agent підготував revision B. Review Agent бачить саме revision B та результат investigation, який стосується правильного CI run.',
        qaUk:
          'Статуси не суперечать фактичним подіям. Дані двох запусків login_spec не змішуються. Після перезапуску продукт відновлює лише ті дані, які справді зберігає за своєю архітектурою: не обіцяй автоматичне відновлення без механізму збереження.',
        terms: [
          {
            label: 'Shared state',
            text: 'дані про поточний перебіг workflow, доступні потрібним учасникам за правилами продукту.',
          },
          {
            label: 'Event bus',
            text: 'можливий механізм передавання повідомлень про події між частинами системи.',
          },
          {
            label: 'Correlation ID',
            text: 'ідентифікатор, який допомагає пов’язати події одного workflow або run.',
          },
        ],
      }),
    ),
  ],
};

export const ORCHESTRATION_SEQUENCE_INTRO_UK =
  'Один workflow координує кілька задач, які стосуються ABC-123. Застосунок створює екземпляр workflow, знаходить готові задачі, передає їх виконавцям і за фактичними результатами оновлює стан. Це навчальна модель: назви полів і спосіб зберігання залежать від продукту.';

export const ORCHESTRATION_SEQUENCE_BUNDLE: StudyTeachingCardsBundle = {
  ariaLabel: 'Послідовність orchestration для ABC-123 після login_spec',
  presentation: 'process',
  hideFlowOverview: true,
  hideSectionCardsInteractionHint: true,
  ...ORCH_PANEL_UI,
  steps: [
    fundamentalsConceptStep(
      'orch-seq-create',
      'Створити workflow',
      'Пов’язати задачу з окремим екземпляром роботи',
      orcSequencePanel({
        inputUk:
          'Подія «потрібно розібрати падіння login_spec» для ABC-123. Вона може надійти від користувача або від CI за правилами продукту. Не описуй user goal як єдине можливе джерело запуску.',
        codeUk:
          'Створює окремий екземпляр workflow. Записує ідентифікатор, мету, посилання на тікет ABC-123, конкретний CI запуск і початковий статус. Визначає, які дані вже доступні та які задачі ще чекають на результат CI.',
        outputUk:
          'Ідентифікатор workflow та його початковий стан. Умовні назви полів для уроку: workflowId і status. Це не заявлений контракт API цього продукту.',
        exampleUk:
          'CI повідомив про timeout на #login-btn. У workflow записано цей факт і посилання на CI запуск. Playwright-звіт ще не позначено прочитаним.',
        qaUk:
          'Два незалежні падіння тесту не отримують один спільний стан випадково. Workflow посилається на правильний CI запуск. У початковому стані немає вигаданого результату Playwright-звіту.',
        terms: [
          {
            label: 'Екземпляр workflow',
            text: 'один конкретний перебіг робіт для певної задачі.',
          },
          {
            label: 'workflowId',
            text: 'умовна назва ідентифікатора цього перебігу; вона не зобов’язана збігатися з ідентифікатором внутрішнього run агента.',
          },
        ],
      }),
    ),
    fundamentalsConceptStep(
      'orch-seq-ready',
      'Знайти готові задачі',
      'Запускати крок лише після виконання його умов',
      orcSequencePanel({
        inputUk:
          'Поточний стан workflow, статуси попередніх задач і відомості про доступність потрібних артефактів.',
        codeUk:
          'Переглядає залежності між задачами. Готовими вважає ті, для яких виконані визначені продуктом умови. Інші залишає в стані очікування. Якщо кілька незалежних задач готові одночасно, продукт може запустити їх паралельно за власними правилами.',
        outputUk:
          'Перелік готових задач або явний статус очікування. Сам факт включення в перелік ще не означає, що виконавець завершив роботу.',
        exampleUk:
          'Повідомлення CI про падіння вже доступне. Задача «розібрати CI summary» може бути готовою. Задача «прочитати Playwright-звіт» чекає, доки CI опублікує артефакт цього запуску.',
        qaUk:
          'Заблокована задача не запускається передчасно. Після появи потрібного артефакта готовність переглядають. Задача не стає готовою на підставі артефакта іншого CI запуску.',
        terms: [
          { label: 'Ready task', text: 'задача, для якої виконані умови початку.' },
          {
            label: 'Precondition',
            text: 'конкретна умова, що має бути виконана до запуску кроку.',
          },
        ],
      }),
    ),
    fundamentalsConceptStep(
      'orch-seq-assign',
      'Передати задачу виконавцю',
      'Дати потрібну роботу відповідному агенту, сервісу або людині',
      orcSequencePanel({
        inputUk:
          'Готова задача, правила призначення виконавця та посилання на дані, потрібні саме для цієї задачі.',
        codeUk:
          'Обирає виконавця за правилами workflow. Це може бути QA Investigation Agent, Coding Agent, зовнішній CI job або людина. Передає опис задачі, ідентифікатори й дозволений контекст. Не передає весь wiki лише тому, що він існує: виконавець має отримати доречні дані відповідно до доступу.',
        outputUk:
          'Задача, передана конкретному виконавцю. У навчальному прикладі це можна назвати task envelope: тип задачі, її ідентифікатор, ідентифікатор workflow та посилання на потрібний контекст. Назви полів і формат визначає продукт.',
        exampleUk:
          'QA Investigation Agent отримує задачу розібрати timeout і посилання на артефакти конкретного CI запуску. Review Agent згодом отримує іншу задачу з ідентифікатором конкретної revision. Він не повинен перевіряти довільний «останній diff».',
        qaUk:
          'Задачу отримав відповідний виконавець. Посилання ведуть до даних правильного workflow та версії роботи. Виконавець не отримав матеріали іншого клієнта або run, якщо доступ до них заборонений.',
        terms: [
          {
            label: 'Task envelope',
            text: 'навчальна назва повідомлення з даними, потрібними для виконання однієї задачі.',
          },
          {
            label: 'Context pointer',
            text: 'посилання на потрібні дані; сам по собі pointer не скасовує перевірку доступу до них.',
          },
          { label: 'Routing', text: 'вибір виконавця для готової задачі.' },
        ],
      }),
    ),
    fundamentalsConceptStep(
      'orch-seq-result',
      'Отримати фактичний результат',
      'Відрізнити виконану задачу від помилки й очікування рішення',
      orcSequencePanel({
        inputUk:
          'Повідомлення від виконавця або подія про зміну стану задачі. Продукт визначає власні типи результатів; умовні навчальні варіанти — success, failure та waiting_for_approval. Не подавай їх як універсальний enum.',
        codeUk:
          'Перевіряє, до якої задачі та якого workflow належить результат. Записує отримані дані, помилку або стан очікування. Якщо виконавець повернув «звіт не знайдено», код не записує це як успішне читання. Якщо дія чекає рішення людини, код не позначає її вже виконаною.',
        outputUk: 'Оновлений запис про конкретну задачу та подія для наступного рішення workflow.',
        exampleUk:
          'QA Investigation Agent повідомив: readPlaywrightReport повернув помилку читання. Workflow фіксує, що спроба була, але доказ зі звіту не отримано. Якщо створення Jira issue потребує approval, це окремий стан очікування перед дією із записом.',
        qaUk:
          'Результат прив’язаний до правильного task id і workflow. Success, failure і очікування рішення не зливаються в один статус «готово». Повторне повідомлення про той самий результат не створює суперечливих переходів, якщо продукт передбачає повторну доставку подій.',
        terms: [
          {
            label: 'Task result',
            text: 'фактичний підсумок роботи одного виконавця: дані, помилка або інший визначений продуктом стан.',
          },
          {
            label: 'Подія workflow',
            text: 'повідомлення про те, що стан задачі змінився й потрібно переглянути наступні кроки.',
          },
        ],
      }),
    ),
    fundamentalsConceptStep(
      'orch-seq-transition',
      'Оновити стан і визначити наступний крок',
      'Перейти до нової задачі, повтору, очікування або завершення',
      orcSequencePanel({
        inputUk:
          'Поточний стан workflow, отриманий результат та правила переходів, повторів і зупинки.',
        codeUk:
          'Оновлює статус завершеної або невдалої задачі й визначає, які залежності тепер виконані. Після успіху може відкрити наступну задачу. Після помилки застосовує визначені продуктом правила: обмежений retry, іншу гілку, передачу людині або завершення. Коли рішення людини обов’язкове, не виконує дію до схвалення.\n\nПравила переходу, ліміти та дозволи забезпечує код. Якщо продукт звертається до моделі по пропозицію наступного кроку, код усе одно перевіряє цю пропозицію перед виконанням. Не пиши, що всі рішення workflow завжди детерміновані без участі моделі; детермінованими мають бути встановлені правила безпеки, дозволу та зупинки.',
        outputUk:
          'Новий стан workflow і перелік задач, які стали готовими, або причина очікування чи завершення.',
        exampleUk:
          'Звіт не вдалося прочитати. Якщо правила дозволяють і trace доступний, наступною задачею може стати перевірка trace. Якщо джерел більше немає, workflow передає людині відомий симптом та повідомлення, що причина не підтверджена. Він не переходить до «виправ селектор» без доказу.',
        qaUk:
          'Після failure виконано передбачений маршрут, а не випадкове повторення. Кількість спроб не перевищує ліміт. Після завершення workflow не з’являється нова задача без нової події, яка за правилами продукту дозволяє продовження.',
        terms: [
          {
            label: 'Перехід стану',
            text: 'зміна статусу задачі або workflow після визначеної події.',
          },
          {
            label: 'Retry policy',
            text: 'правила, за якими продукт дозволяє й обмежує повторну спробу.',
          },
          {
            label: 'Escalation',
            text: 'передача випадку іншому виконавцю або людині, коли автоматичне продовження недоречне.',
          },
        ],
      }),
    ),
  ],
};

export const ORCHESTRATION_LLM_CODE_INTRO_UK =
  'У workflow для ABC-123 різні учасники відповідають за різні рішення. CI повідомляє результат перевірки. Код оркестрації керує задачами та правилами. Модель може аналізувати дані всередині призначеного їй run. Людина ухвалює рішення там, де цього вимагає продукт. Розділимо ці ролі на прикладі падіння login_spec.';

export const ORCHESTRATION_LLM_CODE_BUNDLE: StudyTeachingCardsBundle = {
  ariaLabel: 'Де код, а де LLM у workflow ABC-123',
  presentation: 'concepts',
  hideFlowOverview: true,
  hideSectionCardsInteractionHint: true,
  ...ORCH_PANEL_UI,
  steps: [
    fundamentalsConceptStep(
      'orch-role-ci',
      'CI і перевірені події',
      'Система тестування повідомляє результат запуску',
      orcLlmCodePanel({
        whoUk: 'CI pipeline та код, який приймає його події й пов’язує їх із workflow.',
        doesUk:
          'CI запускає тест і фіксує його результат. У навчальному прикладі login_spec завершився timeout під час очікування #login-btn. Код окремо перевіряє, до якого CI запуску належить повідомлення та чи вже доступні його артефакти.',
        exampleUk:
          'Повідомлення «login_spec failed» означає, що тест не пройшов. Воно не означає, що Playwright-звіт уже опубліковано або що причина timeout відома.',
        forwardUk:
          'Ідентифікатор CI запуску, результат тесту, доступні посилання на артефакти та події про їхню готовність, якщо продукт такі події надає.',
        qaUk:
          'Статус тесту збігається з фактичним результатом CI. Артефакт іншого запуску не прив’язано до ABC-123. Модель не використовується як джерело істини для твердження «CI пройшов» або «CI впав».',
        terms: [
          {
            label: 'CI pipeline',
            text: 'автоматизований процес, який запускає перевірки й повідомляє їхній результат.',
          },
          {
            label: 'CI event',
            text: 'повідомлення про подію конкретного запуску, яке застосунок може використати в workflow.',
          },
        ],
      }),
    ),
    fundamentalsConceptStep(
      'orch-role-orchestrator',
      'Код оркестрації',
      'Керує готовими задачами, передачею роботи й лімітами',
      orcLlmCodePanel({
        whoUk:
          'Код orchestrator та пов’язані з ним компоненти продукту. Це може бути один сервіс або кілька частин системи.',
        doesUk:
          'Зберігає стан workflow, перевіряє залежності задач, призначає виконавця й обробляє результати. Код контролює таймери, кількість повторних спроб, дозволені переходи та правила зупинки. Якщо задача потребує схвалення, код ставить її на паузу до рішення.',
        exampleUk:
          'Задача читання звіту чекає на готовність артефакта. Після готовності код передає investigation задачу для потрібного CI запуску. Якщо читання повернуло тимчасову помилку, код діє за налаштованим правилом retry, а не за довільною обіцянкою моделі «спробую нескінченно».',
        forwardUk: 'Готову задачу відповідному виконавцю або статус очікування, помилки чи завершення workflow.',
        qaUk:
          'Заблоковану задачу не запускають передчасно. Кількість спроб і час очікування відповідають правилам продукту. Після завершення workflow нові задачі не з’являються без підстави.',
        terms: [
          { label: 'Orchestrator', text: 'код, який узгоджує задачі й переходи всього workflow.' },
          { label: 'Routing', text: 'вибір виконавця або наступного маршруту для задачі.' },
          { label: 'Retry count', text: 'кількість уже виконаних повторних спроб.' },
        ],
      }),
    ),
    fundamentalsConceptStep(
      'orch-role-model',
      'Модель усередині задачі агента',
      'Пропонує перевірки й висновок із переданих їй даних',
      orcLlmCodePanel({
        whoUk:
          'Мовна модель у run QA Investigation Agent. Код його harness готує запити, перевіряє інструменти та керує цим run.',
        doesUk:
          'Модель може сформувати гіпотези, запропонувати прочитати Playwright-звіт і переглянути висновок після отриманого результату. Якщо продукт використовує явний план усередині run, модель може запропонувати й його. Пропозиція моделі не є фактичним виконанням інструмента.',
        boundaryUk:
          'План кроків усередині agent run і координація всього workflow ABC-123 мають різний масштаб. Внутрішній план допомагає агенту розібрати падіння. Orchestrator вирішує, коли запустити investigation, кому передати результат і яка задача готова далі. Один продукт може поєднати ці ролі в коді, але пояснення не повинно змішувати їх.',
        exampleUk:
          'Модель бачить CI summary й пропонує readPlaywrightReport. Harness перевіряє виклик. Після дозволеного читання модель пояснює тільки фактично переданий фрагмент. Результат investigation повертається до workflow як результат окремої задачі.',
        forwardUk:
          'Пропозицію інструмента своєму harness або підсумок investigation. Код передає підсумок orchestrator із посиланням на факти й статус задачі.',
        qaUk:
          'Модель не оголошує причину timeout доведеною без доказу. Orchestrator не сприймає текст «звіт прочитано» за підтвердження виклику, якщо в trace виконання не було.',
        terms: [
          {
            label: 'Agent run',
            text: 'одне виконання задачі агента з його внутрішніми кроками та результатом.',
          },
          {
            label: 'Harness',
            text: 'код навколо моделі, який готує контекст, перевіряє запропоновані дії та керує run.',
          },
          {
            label: 'Внутрішній план',
            text: 'можливий перелік перевірок у межах одного agent run, а не план усього workflow.',
          },
        ],
      }),
    ),
    fundamentalsConceptStep(
      'orch-role-human',
      'Людина та схвалення',
      'Людина вирішує питання, яке політика передала їй',
      orcLlmCodePanel({
        whoUk: 'Людина ухвалює рішення. Код показує їй конкретну дію, записує відповідь і застосовує правило workflow.',
        doesUk:
          'Якщо продукт вимагає approval перед певною дією, людина бачить її зміст і доступні підстави. Вона схвалює або відхиляє саме цю дію. Код не виконує її до потрібного рішення та не трактує мовчання як дозвіл.',
        exampleUk:
          'Investigation підготував чернетку Jira issue. Якщо створення issue потребує approval, UI показує людині текст чернетки й дію «створити». Після схвалення код може викликати Jira за чинними правилами. Після відхилення issue не створюють. Звичайне читання Playwright-звіту не називай дією, що завжди потребує схвалення.',
        forwardUk:
          'Записане рішення людини, прив’язане до конкретної дії та її версії. Після дозволу результат зовнішньої дії записують окремо: approval сам по собі не доводить, що Jira issue успішно створено.',
        qaUk:
          'До схвалення немає виклику дії із записом. Після відмови немає нового issue. Якщо чернетку змінили після схвалення, старе рішення не застосовують до нового вмісту без правил, які явно дозволяють це в продукті.',
        terms: [
          {
            label: 'Approval',
            text: 'явне рішення людини дозволити або відхилити конкретну дію.',
          },
          {
            label: 'Human gate',
            text: 'точка workflow, де дія чекає цього рішення за правилами продукту.',
          },
          {
            label: 'Побічний ефект',
            text: 'зміна зовнішньої системи, наприклад створення Jira issue.',
          },
        ],
      }),
    ),
  ],
};

export const ORCHESTRATION_FAILURES_INTRO_UK =
  'Навіть коли окремі агенти та інструменти працюють правильно, workflow може зупинитися через залежності, повторити одну задачу забагато разів або передати її не тому виконавцю. QA перевіряє переходи між задачами за фактичними подіями й записами orchestrator.';

export const ORCHESTRATION_FAILURES_BUNDLE: StudyTeachingCardsBundle = {
  ariaLabel: 'Збої orchestration для ABC-123',
  presentation: 'concepts',
  hideFlowOverview: true,
  hideSectionCardsInteractionHint: true,
  ...ORCH_PANEL_UI,
  steps: [
    fundamentalsConceptStep(
      'orch-fail-deadlock',
      'Задачі чекають одна на одну',
      'Жодна із заблокованих задач не може початися',
      orcFailurePanel({
        happenedUk:
          'Для ABC-123 задача A чекає завершення задачі B. Задача B водночас чекає результату A. Обидві залишаються в стані очікування, хоча роботу потрібно продовжити.',
        problemUk:
          'Система не має готової задачі для запуску й не повідомляє зрозумілої причини зупинки. Це приклад взаємного блокування. Сам факт наявності циклу в моделі workflow ще не доводить помилку: деякі цикли є запланованими повторами з умовою виходу. Проблема виникає, коли немає можливого переходу вперед за фактичного стану.',
        systemUk:
          'На етапі перевірки опису workflow виявляти неможливі залежності, які можна встановити наперед. Під час виконання помічати ситуацію, де залишилися незавершені задачі, але жодна не може стати готовою за чинними умовами. Записувати причину блокування та застосовувати правила продукту для зупинки або передачі випадку людині.',
        qaUk:
          'Готує workflow, у якому A залежить від B, а B — від A без початкової події, що відкриває одну з них. Перевіряє, що продукт виявляє блокування або завершує його зрозумілим статусом, а не чекає безкінечно. Окремо перевіряє дозволений цикл із умовою виходу: його не слід помилково відхиляти лише через наявність зворотного зв’язку.',
        terms: [
          {
            label: 'Deadlock',
            text: 'стан, у якому задачі чекають одна на одну й жодна не може просунути workflow.',
          },
          {
            label: 'Progress',
            text: 'зміна стану або результат, які дають змогу перейти до наступної роботи.',
          },
        ],
      }),
    ),
    fundamentalsConceptStep(
      'orch-fail-retry-storm',
      'Забагато повторів',
      'Невдала перевірка запускається знову без результату',
      orcFailurePanel({
        happenedUk:
          'CI job для ABC-123 завершився тимчасовою помилкою. Workflow запускає його повторно, але після кожної помилки одразу робить ще одну спробу. Кількість запусків і навантаження ростуть, а нового доказу про login_spec немає.',
        problemUk:
          'Повтори витрачають ресурси та можуть перевантажити CI або зовнішній сервіс. Помилка тесту, тимчасова недоступність сервісу й невідомий результат дії із записом потребують різних рішень. Не налаштовуй повтор будь-якого failed тесту так, ніби повтор сам визначить його причину.',
        systemUk:
          'Застосовувати правила retry для конкретного типу задачі: які помилки допускають повтор, скільки спроб дозволено і коли зупинитися. Якщо продукт використовує паузу між спробами, вона теж має відповідати його правилам. Для дій із побічним ефектом потрібен захист від дублювання або перевірка результату перед повтором.',
        qaUk:
          'Підставляє послідовність контрольованих тимчасових помилок. Перевіряє фактичну кількість спроб, тривалість або інтервали, якщо вони визначені продуктом, і причину завершення. У trace кожна спроба має результат. Після досягнення межі новий CI job не запускається.',
        terms: [
          {
            label: 'Retry storm',
            text: 'надмірна кількість повторних запусків через помилку або неправильне правило повтору.',
          },
          { label: 'Max attempts', text: 'встановлена продуктом межа кількості спроб.' },
          {
            label: 'Backoff',
            text: 'збільшення паузи між повторами, якщо продукт застосовує таке правило.',
          },
        ],
      }),
    ),
    fundamentalsConceptStep(
      'orch-fail-duplicate',
      'Подію обробили двічі',
      'Повторне повідомлення створило зайве розслідування',
      orcFailurePanel({
        happenedUk:
          'Повідомлення ci_finished про той самий CI запуск надійшло або було доставлено двічі. Після кожної доставки система створила окремий investigation run для ABC-123.',
        problemUk:
          'Два агенти можуть одночасно читати ті самі артефакти, підготувати два однакові висновки або двічі ініціювати наступну дію. У системах із повторною доставкою подій потрібно розрізняти нову подію й повтор уже обробленої.',
        systemUk:
          'Визначити стійкий спосіб ідентифікувати логічну подію та захистити створення задачі від повтору. Це може бути eventId або складений ключ із типу події та ідентифікатора CI запуску — залежно від контракту продукту. Саме поле eventId без надійного запису про обробку не гарантує відсутності дубля після перезапуску процесу.',
        qaUk:
          'Надсилає ту саму подію двічі, зокрема після перезапуску обробника, якщо продукт обіцяє відновлення. Очікує один логічний investigation для цього CI запуску або іншу чітко визначену продуктом поведінку. У записах видно, що повторну доставку розпізнали, а результат не приписали іншому run.',
        terms: [
          {
            label: 'Duplicate event',
            text: 'повторне надходження повідомлення про ту саму логічну подію.',
          },
          {
            label: 'Idempotent consumer',
            text: 'обробник, повторний виклик якого не створює зайвого логічного результату.',
          },
          {
            label: 'eventId',
            text: 'можливий ідентифікатор події; конкретне поле визначає продукт.',
          },
        ],
      }),
    ),
    fundamentalsConceptStep(
      'orch-fail-routing',
      'Задачу спрямували не туди',
      'Збій, який потребує розбору, потрапив у неправильну гілку',
      orcFailurePanel({
        happenedUk:
          'Для ABC-123 CI зафіксував падіння login_spec. Правила routing віднесли подію до гілки «ignore», хоча за правилами продукту таке падіння потребує investigation. Жоден агент не отримав задачу розібрати збій.',
        problemUk:
          'Падіння залишається без перевірки. Якщо UI показує workflow як успішно завершений, команда може навіть не помітити пропущеної задачі. Потрібно перевіряти не лише фінальний статус, а й причину вибору гілки.',
        systemUk:
          'Застосовувати визначені правила routing до перевірених даних події. Для випадків, які не відповідають жодному правилу, продукт має мати явну поведінку: безпечний статус, чергу для ручного розбору або інший заданий маршрут. Не припускай, що будь-яке падіння тесту завжди потрібно направляти одному й тому самому агенту.',
        qaUk:
          'Готує контрольні випадки: падіння, що потребує investigation; подію, яку за правилами продукту можна проігнорувати; і випадок без однозначного маршруту. Для кожного перевіряє наступний вузол workflow, фактично створену задачу й причину вибору в trace orchestrator. Випадок login_spec не опиняється в «ignore» без відповідного правила.',
        terms: [
          {
            label: 'Wrong routing',
            text: 'вибір невідповідної гілки або виконавця для задачі.',
          },
          {
            label: 'Golden workflow',
            text: 'контрольний сценарій із підготовленими вхідними подіями та очікуваними переходами.',
          },
        ],
      }),
    ),
  ],
};

export const ORCHESTRATION_QA_TESTING_INTRO_UK =
  'QA перевіряє не тільки фінальний висновок агента. Для orchestration потрібно побачити, коли задача стала готовою, хто її отримав, чому її повторили або зупинили та до якого workflow належать події. Нижче — чотири окремі перевірки на прикладі ABC-123 і падіння login_spec.';

export const ORCHESTRATION_QA_TESTING_BUNDLE: StudyTeachingCardsBundle = {
  ariaLabel: 'Як QA тестує orchestration для ABC-123',
  presentation: 'process',
  hideFlowOverview: true,
  hideSectionCardsInteractionHint: true,
  ...ORCH_PANEL_UI,
  steps: [
    fundamentalsConceptStep(
      'orch-qa-order',
      'Порядок після CI',
      'Investigation не читає звіт до готовності артефакта',
      orcQaTestingPanel({
        prepareUk:
          'Підставний CI pipeline повідомляє «login_spec failed», але відкладає публікацію Playwright-звіту. Тест знає ідентифікатор конкретного CI запуску. Подія готовності артефакта має назву, визначену вашим продуктом; artifacts_ready нижче — умовна назва для прикладу.',
        qaPickAriaLabel: 'Кроки QA: порядок після CI для ABC-123',
        qaSteps: [
          {
            key: 'orch-qa-order-start',
            titleUk: 'Запускає workflow',
            teaserUk: 'Передає падіння login_spec для ABC-123',
            bodyUk:
              'QA запускає тестовий workflow і передає повідомлення CI про timeout на #login-btn. Playwright-звіт поки не публікує. У стані workflow має бути відомий факт падіння, але не результат читання звіту.',
          },
          {
            key: 'orch-qa-order-wait',
            titleUk: 'Перевіряє очікування',
            teaserUk: 'Звіт ще не готовий, читання не почалося',
            bodyUk:
              'До публікації артефакта QA переглядає статус задачі читання звіту й виклики інструмента. Задача може чекати, а система може працювати з уже доступним CI summary. Виклику читання непублікованого звіту та запису «звіт прочитано» немає.',
          },
          {
            key: 'orch-qa-order-publish',
            titleUk: 'Публікує артефакт',
            teaserUk: 'Звіт потрібного CI запуску стає доступним',
            bodyUk:
              'QA робить тестовий Playwright-звіт доступним і надсилає подію про його готовність у форматі цього продукту. Подія має стосуватися саме CI запуску, пов’язаного з ABC-123.',
          },
          {
            key: 'orch-qa-order-verify',
            titleUk: 'Звіряє порядок',
            teaserUk: 'Задачу читання передали лише після готовності',
            bodyUk:
              'QA порівнює записи про готовність артефакта, призначення задачі й фактичний виклик читання. Задача, якій потрібен звіт, починається після його готовності. Артефакт іншого запуску не розблоковує ABC-123.',
          },
        ],
        expectUk:
          'Система може почати аналізувати вже доступний CI summary. Спроба читати Playwright-звіт чекає, доки артефакт конкретного запуску готовий. Після події готовності задача переходить до виконання за правилами продукту.',
        mustNotUk:
          'Задачу не позначають «звіт прочитано» до фактичного читання. Артефакт іншого CI запуску не розблоковує ABC-123.',
        evidenceUk:
          'Послідовність записів: тест упав, артефакт став доступним, задача отримала статус ready, інструмент фактично викликали. Порівнюй зв’язок і порядок подій у тестовому trace або іншому джерелі істини продукту; наявність event bus не є обов’язковою.',
        terms: [
          {
            label: 'Готовність задачі',
            text: 'стан, у якому виконані її умови початку.',
          },
          {
            label: 'Артефакт CI',
            text: 'файл або інший результат конкретного запуску перевірок.',
          },
        ],
      }),
    ),
    fundamentalsConceptStep(
      'orch-qa-gate',
      'Схвалення ризикової дії',
      'Дію із записом зупиняють до потрібного рішення людини',
      orcQaTestingPanel({
        prepareUk:
          'Для тестового workflow налаштуй правило: зміна production config або інша конкретна ризикова дія потребує approval. Підставний виконавець формує запит на цю дію. Звичайне читання Playwright-звіту не позначай автоматично як таке, що потребує людини.',
        qaPickAriaLabel: 'Кроки QA: схвалення ризикової дії',
        qaSteps: [
          {
            key: 'orch-qa-gate-request',
            titleUk: 'Готує запит на зміну',
            teaserUk: 'Workflow доходить до дії з production config',
            bodyUk:
              'У тестовому середовищі QA доводить workflow до конкретної пропозиції змінити production config. Для цієї дії правила тестового продукту вимагають схвалення людини. Показану дію та її вміст фіксують для подальшої перевірки.',
          },
          {
            key: 'orch-qa-gate-pause',
            titleUk: 'Перевіряє паузу',
            teaserUk: 'До рішення зміни конфігурації немає',
            bodyUk:
              'QA не надає схвалення й перевіряє статус задачі. Вона чекає рішення. Інструмент зміни конфігурації не викликали, зовнішній стан не змінився.',
          },
          {
            key: 'orch-qa-gate-decisions',
            titleUk: 'Тестує два рішення',
            teaserUk: 'Відхилення й схвалення перевіряють окремо',
            bodyUk:
              'В одному запуску QA відхиляє дію та перевіряє, що її не виконали. В іншому — схвалює. Рішення має належати до конкретної дії, яку показали людині, а не до будь-якої майбутньої зміни config.',
          },
          {
            key: 'orch-qa-gate-execute',
            titleUk: 'Звіряє виконання',
            teaserUk: 'Після схвалення виконують лише дозволену дію',
            bodyUk:
              'QA перевіряє, що код застосував чинні правила доступу й викликав інструмент саме з тими даними, які дозволено виконати. Запис про схвалення і фактичний результат зміни — окремі події: дозвіл ще не доводить успіх зовнішньої операції.',
          },
        ],
        expectUk:
          'До схвалення дія заблокована. Після відмови її не виконують. Після схвалення код може розпочати виконання, а результат зовнішньої дії фіксують окремо. Approval не доводить, що сама зміна вже успішно відбулася.',
        mustNotUk:
          'Мовчання людини не сприймають як дозвіл. Рішення щодо старої версії дії не застосовують до зміненого вмісту без явного правила продукту.',
        evidenceUk:
          'Запит на схвалення, рішення й час рішення, ідентифікатор дії, факт або відсутність виклику після рішення. Поле approvedBy — умовний приклад: його наявність і форма залежать від продукту.',
        terms: [
          {
            label: 'Approval gate',
            text: 'точка workflow, де конкретна дія чекає рішення людини.',
          },
          {
            label: 'Audit record',
            text: 'запис, який допомагає встановити, яке рішення було ухвалене і до якої дії воно належало.',
          },
        ],
      }),
    ),
    fundamentalsConceptStep(
      'orch-qa-retry',
      'Обмеження повторів',
      'Тимчасова помилка не запускає безкінечні CI rerun',
      orcQaTestingPanel({
        prepareUk:
          'Підставний CI job кілька разів повертає помилку, для якої правила продукту дозволяють повтор. Наперед зафіксуй налаштовану межу спроб і визнач, чи початковий запуск входить до цього числа. Не використовуй нечітке «flake flag» без правила, що саме він означає.',
        qaPickAriaLabel: 'Кроки QA: обмеження повторів CI',
        qaSteps: [
          {
            key: 'orch-qa-retry-setup',
            titleUk: 'Готує тимчасові помилки',
            teaserUk: 'CI job повертає контрольовані збої',
            bodyUk:
              'QA налаштовує підставний CI job так, щоб він повертав помилку, для якої правила продукту дозволяють retry. До запуску тесту фіксує межу спроб і правило, чи входить початковий запуск у цю кількість.',
          },
          {
            key: 'orch-qa-retry-count',
            titleUk: 'Рахує виконання',
            teaserUk: 'Лічильник звіряють із реальними jobs',
            bodyUk:
              'QA запускає задачу та рахує кожен фактично створений CI job: початковий запуск і дозволені повтори. Значення в state має відповідати цим виконанням, а не лише кількості запланованих спроб.',
          },
          {
            key: 'orch-qa-retry-outcome',
            titleUk: 'Чекає підсумку',
            teaserUk: 'Успіх або межа спроб завершують retry',
            bodyUk:
              'QA перевіряє два сценарії. Якщо CI job успішний раніше межі, нових повторів немає. Якщо всі дозволені спроби завершилися помилкою, задача отримує відповідний підсумковий статус.',
          },
          {
            key: 'orch-qa-retry-stop',
            titleUk: 'Перевіряє зупинку',
            teaserUk: 'Після завершення новий CI job не стартує',
            bodyUk:
              'QA переглядає виклики після фінального статусу задачі. Жоден додатковий job не з’являється. У trace видно причину останнього повтору та причину зупинки.',
          },
        ],
        expectUk:
          'Кількість спроб не перевищує налаштовану межу. Якщо тест подав помилку на кожній дозволеній спробі, фактична кількість дорівнює цій межі. Якщо успіх настав раніше, повтори припиняються раніше. Якщо налаштовано паузу між спробами, вона відповідає правилу продукту.',
        mustNotUk:
          'Немає нескінченного rerun і повтору помилки, для якої retry заборонений. Run не показують успішним, якщо всі дозволені спроби завершилися помилкою.',
        evidenceUk:
          'Статус і номер кожної спроби, причина повтору, підсумковий статус задачі та фактична кількість запусків CI. Лічильник у state звіряй із реально створеними jobs.',
        terms: [
          { label: 'Retry', text: 'повторна спроба після визначеної помилки.' },
          {
            label: 'Межа спроб',
            text: 'налаштована кількість допустимих виконань, із чітким правилом обліку початкової спроби.',
          },
        ],
      }),
    ),
    fundamentalsConceptStep(
      'orch-qa-isolation',
      'Ізоляція паралельних workflow',
      'Події двох тікетів не змішуються',
      orcQaTestingPanel({
        prepareUk:
          'Два тестові тікети, ABC-123 і ABC-124, з окремими падіннями login_spec та окремими ідентифікаторами CI запусків. Для артефактів додай різні впізнавані тестові рядки.',
        qaPickAriaLabel: 'Кроки QA: ізоляція ABC-123 і ABC-124',
        qaSteps: [
          {
            key: 'orch-qa-iso-start',
            titleUk: 'Запускає два тікети',
            teaserUk: 'ABC-123 і ABC-124 мають окремі workflow',
            bodyUk:
              'QA створює два навчальні тікети та пов’язує кожен зі своїм CI запуском. У тестових звітах використовує різні впізнавані фрази, щоб помітити можливе змішування даних.',
          },
          {
            key: 'orch-qa-iso-shuffle',
            titleUk: 'Перемішує події',
            teaserUk: 'Результати CI надходять у різному порядку',
            bodyUk:
              'QA по черзі надсилає події обох запусків: повідомлення про падіння, готовність артефактів і результати задач. Подія для ABC-124 не повинна змінювати стан ABC-123.',
          },
          {
            key: 'orch-qa-iso-complete',
            titleUk: 'Доводить до результату',
            teaserUk: 'Обидва розслідування працюють паралельно',
            bodyUk:
              'QA дає workflow виконати дозволені задачі. Кожен Investigation Agent отримує артефакт свого CI запуску. Один workflow не повинен чекати чужого результату або використовувати чужий звіт.',
          },
          {
            key: 'orch-qa-iso-bindings',
            titleUk: 'Звіряє прив’язки',
            teaserUk: 'Підсумки містять дані лише свого тікета',
            bodyUk:
              'QA перевіряє ідентифікатори workflow, CI запусків і задач, а також тексти отриманих фрагментів. У підсумку ABC-123 немає впізнаваної фрази зі звіту ABC-124, і навпаки.',
          },
        ],
        expectUk:
          'Кожен workflow має власний ідентифікатор і посилається на свій CI запуск. Investigation для ABC-123 отримує лише належний йому артефакт, а investigation для ABC-124 — свій. Одночасна робота не змінює цієї прив’язки.',
        mustNotUk:
          'Подія готовності артефакта ABC-124 не розблоковує читання звіту ABC-123. Фрагмент одного звіту не з’являється в підсумку іншого тікета.',
        evidenceUk:
          'Ідентифікатори workflow, CI запусків і задач, посилання на артефакти та фактичний вміст результатів. Умовне поле workflowId використовуй лише як навчальну назву, якщо в продукті воно зветься інакше.',
        terms: [
          {
            label: 'Ізоляція workflow',
            text: 'збереження окремих задач, даних і результатів для незалежних розслідувань.',
          },
          {
            label: 'Correlation ID',
            text: 'ідентифікатор, за яким можна пов’язати події одного workflow.',
          },
        ],
      }),
    ),
  ],
};

export const ORCHESTRATION_PRODUCTION_INTRO_UK =
  'У production важливо бачити не тільки результат усього workflow, а й те, де задача чекає, повторюється або не може продовжитися. Під час випуску нової схеми workflow потрібно також знати, за якими правилами продовжуються вже розпочаті розслідування.';

export const ORCHESTRATION_PRODUCTION_BUNDLE: StudyTeachingCardsBundle = {
  ariaLabel: 'Production observability для workflow ABC-123',
  presentation: 'concepts',
  hideFlowOverview: true,
  hideSectionCardsInteractionHint: true,
  ...ORCH_PANEL_UI,
  steps: [
    fundamentalsConceptStep(
      'orch-prod-time',
      'Час у задачі',
      'Показує, на якому етапі workflow затримався',
      orcProductionPanel({
        observeUk:
          'Час очікування перед запуском задачі та час її фактичного виконання. Це різні величини: довге очікування Playwright-звіту не слід показувати як повільне читання файла.',
        exampleUk:
          'CI повідомив про падіння login_spec, але публікація артефактів зайняла більше часу, ніж зазвичай. Investigation чекало готовності звіту. Коли звіт з’явився, readPlaywrightReport виконався швидко.',
        signalUk:
          'Якщо зростає час очікування, команда перевіряє залежності, чергу та готовність даних. Якщо зростає час виконання, перевіряє конкретного виконавця або зовнішній сервіс. Сам по собі довгий час не доводить, яка з цих причин спрацювала.',
        qaUk:
          'Час початку й завершення кожного стану узгоджений з подіями workflow. Очікування не плутають із виконанням. Для завершених і незавершених задач показники обчислюють за визначеними правилами продукту.',
        terms: [
          {
            label: 'Час очікування',
            text: 'проміжок до початку виконання готової або заблокованої задачі, залежно від визначення метрики в продукті.',
          },
          {
            label: 'Час виконання',
            text: 'проміжок від фактичного початку роботи виконавця до її результату.',
          },
        ],
      }),
    ),
    fundamentalsConceptStep(
      'orch-prod-retry',
      'Повторні спроби',
      'Допомагає виявити помилки й надмірні повтори',
      orcProductionPanel({
        observeUk:
          'Кількість повторів за типом задачі, причини retry, підсумок після повтору та частку задач, які досягли встановленої межі спроб. Не називай кожен повтор помилкою: обмежений retry може бути запланованою реакцією на тимчасовий збій.',
        exampleUk:
          'CI job двічі повернув тимчасову помилку. Workflow повторює його лише тоді, коли ця помилка підпадає під правила повтору. Після успіху або досягнення межі нові спроби припиняються.',
        signalUk:
          'Різке збільшення повторів може вказувати на недоступність CI, проблемний контракт інтеграції або некоректне правило retry. Для з’ясування причини команда дивиться на коди помилок і записи фактичних спроб.',
        qaUk:
          'Метрика повторів збігається з реально створеними jobs і лічильником у state. Після досягнення межі немає нового запуску. Для дій із записом повтор не створює дубль за правилами продукту.',
        terms: [
          { label: 'Retry', text: 'повторна спроба після визначеного результату.' },
          {
            label: 'Межа спроб',
            text: 'налаштована максимальна кількість виконань задачі з чітким правилом обліку початкової спроби.',
          },
        ],
      }),
    ),
    fundamentalsConceptStep(
      'orch-prod-stuck',
      'Застряглі workflow',
      'Виявляє роботу, яка не завершується й не просувається',
      orcProductionPanel({
        observeUk:
          'Workflow, у яких є незавершені задачі, але протягом визначеного часу немає очікуваного переходу. Правило виявлення має враховувати законне очікування: наприклад, задача може чекати людину, публікацію артефакта або запланований retry.',
        exampleUk:
          'Investigation чекає на Playwright-звіт, але CI завершив публікацію з помилкою. Якщо жодна подія не може розблокувати задачу, workflow не повинен залишатися вічно з нечітким статусом «у роботі».',
        signalUk:
          'Спочатку команда встановлює, на яку саме подію чекає задача і чи може вона ще надійти. Лише після цього відрізняє законне очікування від втраченої події, неправильного переходу або взаємного блокування.',
        qaUk:
          'Моделює втрачений результат і законну довгу паузу окремо. У першому випадку продукт виявляє проблему або завершує задачу за встановленим правилом. У другому — не позначає workflow зламаним лише тому, що він чекає в межах дозволеного часу.',
        terms: [
          {
            label: 'Stuck workflow',
            text: 'workflow, який не просувається тоді, коли за правилами продукту вже мав отримати наступну подію або змінити стан.',
          },
          {
            label: 'Heartbeat',
            text: 'можливий сигнал, що виконавець ще працює; його використовують лише якщо це передбачено архітектурою продукту.',
          },
        ],
      }),
    ),
    fundamentalsConceptStep(
      'orch-prod-gate-sla',
      'Очікування рішення людини',
      'Показує, як довго ризикова дія чекає approval',
      orcProductionPanel({
        observeUk:
          'Кількість задач, які чекають рішення людини, час очікування та випадки, що перевищили погоджену для продукту межу. Показник часу схвалення не є часом роботи моделі чи зовнішнього API.',
        exampleUk:
          'Чернетка Jira issue готова, але створення тікета потребує approval. Workflow чекає на рішення. Якщо погоджений час очікування вичерпано, продукт діє за визначеним правилом: наприклад, нагадує відповідальній людині або завершує крок зі статусом очікування, що потребує уваги. Не вигадуй конкретну автоматичну дію, якщо її не реалізовано.',
        signalUk:
          'Довге очікування може бути проблемою процесу схвалення. Воно не є дозволом виконати дію без людини. Відсутність відповіді не трактують як approval.',
        qaUk:
          'До рішення немає виклику інструмента, який змінює зовнішню систему. Для погоджених випадків правильно рахується час очікування. Після відхилення дія не виконується, а після схвалення результат її виконання записується окремо.',
        terms: [
          {
            label: 'Human gate',
            text: 'точка workflow, у якій конкретна дія чекає рішення людини.',
          },
          {
            label: 'SLA',
            text: 'погоджена ціль або межа часу для процесу, якщо продукт визначив її для цього етапу.',
          },
        ],
      }),
    ),
    fundamentalsConceptStep(
      'orch-prod-version',
      'Версія workflow після випуску',
      'Старий run має продовжитися за зрозумілими правилами',
      orcProductionPanel({
        observeUk:
          'Яка версія опису workflow діяла для конкретного екземпляра, скільки незавершених workflow працюють за старою версією та чи виникли помилки переходів після deploy. Спосіб версіонування визначає продукт.',
        exampleUk:
          'ABC-123 почався за схемою v1 і чекає на результат investigation. Під час очікування команда випустила v2 з додатковою задачею review. Продукт має явно визначити, чи ABC-123 завершується за v1, чи проходить передбачену міграцію на v2. Не перемикай незавершений workflow мовчки так, щоб його поточний стан більше не мав допустимого переходу.',
        signalUk:
          'Після deploy збільшилася кількість workflow, які не можуть перейти з поточного стану. Команда перевіряє сумісність нової схеми з уже збереженими станами та правилами відновлення.',
        qaUk:
          'Створює workflow за v1, зупиняє його на визначеному кроці, випускає тестову v2 і продовжує роботу. Перевіряє маршрут за реально обраною стратегією продукту: завершення на v1 або явна міграція. Уже виконана дія із записом не повторюється лише через зміну версії.',
        terms: [
          {
            label: 'Версія workflow',
            text: 'конкретна редакція правил задач і переходів.',
          },
          {
            label: 'Міграція workflow',
            text: 'передбачене продуктом переведення незавершеного екземпляра на нові правила зі збереженням потрібного стану.',
          },
          { label: 'Deploy', text: 'випуск нової версії застосунку або його налаштувань.' },
        ],
      }),
    ),
  ],
};
