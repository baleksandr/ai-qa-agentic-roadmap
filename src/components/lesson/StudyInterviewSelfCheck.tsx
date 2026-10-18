import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { StudyInterviewDeck } from '../../data/study/study-interview-types';
import { useStudySelfCheck } from '../../hooks/useStudySelfCheck';
import { LessonRichParagraphs, parseLessonBold } from './lessonRichText';
import { StudyDefinitionAccent } from './StudyDefinitionAccent';
import { StudyLearnerFlowTrack } from './StudyLearnerFlowTrack';

/** «Термін — визначення.» + решта абзаців для блоку «Коротко». */
function splitInterviewBriefDefinition(text: string): {
  termUk: string;
  leadUk: string;
  tailUk: string;
} | null {
  const trimmed = text.trim();
  const dash = trimmed.match(/^([^—\n]+)\s*—\s*(.+)$/u);
  if (!dash) return null;
  const termUk = dash[1].trim().replace(/^\[\[/, '').replace(/\]\]$/, '').trim();
  const afterDash = dash[2].trim();
  const periodIdx = afterDash.search(/\.\s+/);
  if (periodIdx < 0) return null;
  const leadUk = afterDash.slice(0, periodIdx + 1).trim();
  const tailUk = afterDash.slice(periodIdx + 1).trim();
  if (!termUk || !leadUk) return null;
  return { termUk, leadUk, tailUk };
}

function stripInterviewQuestionPrefix(questionUk: string): string {
  return questionUk.replace(/^\d+\.\s+/, '').trim();
}

function stripPitfallPrefix(pitfallUk: string): string {
  return pitfallUk.replace(/^Помилка:\s*/i, '').replace(/^Помилка\s*[-—]\s*/i, '').trim();
}

type Props = {
  deck: StudyInterviewDeck;
};

export function StudyInterviewSelfCheck({ deck }: Props) {
  const { getMark, setMark } = useStudySelfCheck(deck.deckId);
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const briefLabel = deck.answerBriefLabelUk?.trim() || 'Коротко для співбесіди';
  const deepLabel = deck.answerDeepLabelUk?.trim() || 'Розберімо до гвинтиків';

  return (
    <div className="study-rag-interview-block study-interview-self-check">
      <aside
        className="lesson-callout lesson-key-idea study-rag-interview-intro"
        aria-label={deck.headingUk}
      >
        <span className="lesson-callout-label">{deck.headingUk}</span>
        <p className="study-rag-interview-lead study-learner-explanation">{deck.leadUk}</p>
      </aside>

      <ol className="study-rag-interview-list">
        {deck.questions.map((q, index) => {
          const show = revealed[q.id];
          const mark = getMark(q.id);
          const deepInfoOnly =
            Boolean(q.deepInfoCards?.length) &&
            !q.answerDeepUk?.trim() &&
            !(q.answerDeepFlowStages && q.answerDeepFlowStages.length >= 2);
          const questionDeepLabel =
            q.answerDeepLabelUk !== undefined
              ? q.answerDeepLabelUk.trim()
              : deepInfoOnly
                ? ''
                : deepLabel;
          const structuredBriefDefinition = q.answerBriefDefinition;
          const briefDefinition =
            !structuredBriefDefinition && q.answerBriefUk?.trim()
              ? splitInterviewBriefDefinition(q.answerBriefUk)
              : null;
          const suppressTermAccent = structuredBriefDefinition
            ? [structuredBriefDefinition.termUk]
            : briefDefinition
              ? [briefDefinition.termUk]
              : undefined;
          const briefTailInlineOpts = { suppressTermAccent, maxTermAccents: 0 as const };
          const briefPlainInlineOpts = { suppressTermAccent, maxTermAccents: 1 as const };
          const deepInlineOpts = { suppressTermAccent, maxTermAccents: 0 as const };
          const hasDeep = Boolean(
            q.answerDeepUk?.trim() || q.deepInfoCards?.length || q.answerDeepFlowStages?.length,
          );
          return (
            <li
              key={q.id}
              className={`study-rag-interview-card${show ? ' study-rag-interview-card--open' : ''}`}
            >
              <div className="study-rag-interview-card-head">
                <span className="study-rag-interview-num">{index + 1}</span>
                <p className="study-rag-interview-question">{stripInterviewQuestionPrefix(q.questionUk)}</p>
              </div>

              {!show ? (
                <button
                  type="button"
                  className="study-rag-interview-reveal-btn"
                  onClick={() => setRevealed((prev) => ({ ...prev, [q.id]: true }))}
                >
                  Показати відповідь
                </button>
              ) : (
                <div className="study-rag-interview-revealed">
                  <div className="study-rag-interview-answer-block">
                    {q.answerBriefUk || q.answerBriefDefinition || hasDeep ? (
                      <>
                        {q.answerBriefUk || q.answerBriefDefinition ? (
                          <section
                            className="study-rag-interview-tier-panel study-rag-interview-tier-panel--brief"
                            aria-label={briefLabel}
                          >
                            <p className="study-rag-interview-answer-tier-label">{briefLabel}</p>
                            <div className="study-rag-interview-answer study-rag-interview-answer-brief">
                              {(() => {
                                if (structuredBriefDefinition) {
                                  return (
                                    <>
                                      <StudyDefinitionAccent
                                        termUk={structuredBriefDefinition.termUk}
                                        termEn={structuredBriefDefinition.termEn}
                                        leadUk={structuredBriefDefinition.leadUk}
                                      />
                                      {structuredBriefDefinition.exampleUk?.trim() ? (
                                        <LessonRichParagraphs
                                          text={structuredBriefDefinition.exampleUk}
                                          className="study-rag-interview-answer-p study-rag-interview-brief-example"
                                          {...briefTailInlineOpts}
                                        />
                                      ) : null}
                                      {q.answerBriefUk?.trim() ? (
                                        <LessonRichParagraphs
                                          text={q.answerBriefUk}
                                          className="study-rag-interview-answer-p study-rag-interview-answer-brief-tail"
                                          {...briefTailInlineOpts}
                                        />
                                      ) : null}
                                    </>
                                  );
                                }
                                const brief = q.answerBriefUk ?? '';
                                const definition = briefDefinition;
                                if (definition) {
                                  return (
                                    <>
                                      <StudyDefinitionAccent
                                        termUk={definition.termUk}
                                        leadUk={definition.leadUk}
                                      />
                                      {definition.tailUk ? (
                                        <LessonRichParagraphs
                                          text={definition.tailUk}
                                          className="study-rag-interview-answer-p study-rag-interview-answer-brief-tail"
                                          {...briefTailInlineOpts}
                                        />
                                      ) : null}
                                    </>
                                  );
                                }
                                return (
                                  <LessonRichParagraphs
                                    text={brief}
                                    className="study-rag-interview-answer-p"
                                    {...briefPlainInlineOpts}
                                  />
                                );
                              })()}
                            </div>
                          </section>
                        ) : null}
                        {hasDeep ? (
                          <section
                            className="study-rag-interview-tier-panel study-rag-interview-tier-panel--deep"
                            aria-label={questionDeepLabel}
                          >
                            {questionDeepLabel ? (
                              <p className="study-rag-interview-answer-tier-label study-rag-interview-answer-tier-deep">
                                {questionDeepLabel}
                              </p>
                            ) : null}
                            {q.deepInfoCards && q.deepInfoCards.length > 0 ? (
                              <ul
                                className={`study-interview-deep-info-grid${
                                  q.deepInfoCardsLayout === 'scenario'
                                    ? ' study-interview-deep-info-grid--scenario'
                                    : ''
                                }`}
                              >
                                {q.deepInfoCards.map((card, cardIndex) => (
                                  <li
                                    key={card.titleUk}
                                    className={`study-interview-deep-info-card${
                                      q.deepInfoCardsLayout === 'scenario'
                                        ? ' study-interview-deep-info-card--scenario'
                                        : ''
                                    }`}
                                  >
                                    {q.deepInfoCardsLayout === 'scenario' ? (
                                      <span className="study-interview-deep-info-card-step" aria-hidden="true">
                                        {cardIndex + 1}
                                      </span>
                                    ) : null}
                                    <div className="study-interview-deep-info-card-inner">
                                      <p className="study-interview-deep-info-card-title">{card.titleUk}</p>
                                      <LessonRichParagraphs
                                        text={card.bodyUk}
                                        className="study-interview-deep-info-card-body"
                                        {...deepInlineOpts}
                                      />
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            ) : null}
                            {q.answerDeepUk?.trim() ? (
                              <div className="study-rag-interview-answer-deep">
                                <LessonRichParagraphs
                                  text={q.answerDeepUk}
                                  className="study-rag-interview-answer-p"
                                  {...deepInlineOpts}
                                />
                              </div>
                            ) : null}
                            {q.answerDeepFlowStages && q.answerDeepFlowStages.length >= 2 ? (
                              <div className="study-rag-interview-deep-flow">
                                {q.answerDeepFlowCaptionUk?.trim() ? (
                                  <p className="study-rag-interview-deep-flow-caption study-learner-explanation">
                                    {q.answerDeepFlowCaptionUk}
                                  </p>
                                ) : null}
                                <StudyLearnerFlowTrack
                                  stages={q.answerDeepFlowStages}
                                  ariaLabel="Ланцюг подій у trace"
                                />
                              </div>
                            ) : null}
                          </section>
                        ) : null}
                      </>
                    ) : (
                      <p className="study-rag-interview-answer">{parseLessonBold(q.answerUk ?? '')}</p>
                    )}
                  </div>
                  {q.pitfallUk ? (
                    <div className="study-rag-interview-pitfall study-rag-interview-pitfall-standalone" role="note">
                      <span className="study-rag-interview-pitfall-label">Типова помилка</span>
                      <p className="study-rag-interview-pitfall-text">
                        {parseLessonBold(stripPitfallPrefix(q.pitfallUk ?? ''), deepInlineOpts)}
                      </p>
                    </div>
                  ) : null}
                </div>
              )}

              <div
                className={`study-rag-interview-card-footer${show ? ' study-rag-interview-card-footer--revealed' : ''}`}
              >
                {show ? (
                  <button
                    type="button"
                    className="study-rag-interview-reveal-btn study-rag-interview-hide-btn"
                    onClick={() => setRevealed((prev) => ({ ...prev, [q.id]: false }))}
                  >
                    Приховати відповідь
                  </button>
                ) : null}
                <div className="study-rag-interview-marks" role="group" aria-label="Самооцінка">
                  <button
                    type="button"
                    className={`study-rag-interview-mark${mark === 'ok' ? ' is-active' : ''}`}
                    onClick={() => setMark(q.id, mark === 'ok' ? null : 'ok')}
                  >
                    Можу пояснити
                  </button>
                  <button
                    type="button"
                    className={`study-rag-interview-mark study-rag-interview-mark-repeat${mark === 'repeat' ? ' is-active' : ''}`}
                    onClick={() => setMark(q.id, mark === 'repeat' ? null : 'repeat')}
                  >
                    Треба повторити
                  </button>
                </div>
              </div>
            </li>
          );
        })}
      </ol>

      <aside className="lesson-callout lesson-interview study-rag-interview-pitch">
        <span className="lesson-callout-label">Цільна відповідь (~30–45 с)</span>
        <p className="study-lang-flag">
          <span className="study-lang-badge" aria-hidden="true">🇺🇦</span> Українською
        </p>
        <p className="study-rag-interview-pitch-text">{deck.pitchUk}</p>
        <p className="study-lang-flag study-lang-flag-answer">
          <span className="study-lang-badge" aria-hidden="true">🇬🇧</span> English
        </p>
        <p className="study-rag-interview-pitch-text study-interview-answer-en" lang="en">
          {deck.pitchEn}
        </p>
      </aside>

      {deck.nextLinks.length > 0 && (
        <nav className="study-rag-interview-next" aria-label="Що вивчити далі">
          <p className="study-rag-interview-next-title">Що вивчити далі</p>
          <ul className="study-rag-interview-next-list">
            {deck.nextLinks.map((link) => (
              <li key={link.to} className="study-rag-interview-next-item">
                <Link to={link.to} className="study-rag-interview-next-link">
                  <span className="study-rag-interview-next-link-title">{link.label}</span>
                  {link.hintUk?.trim() ? (
                    <span className="muted small study-rag-interview-next-hint">{link.hintUk}</span>
                  ) : null}
                  <span className="study-rag-interview-next-link-cta">
                    {deck.nextLinkCtaUk?.trim() || 'Перейти до теми ↗'}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
}
