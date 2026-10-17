import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { StudyInterviewDeck } from '../../data/study/study-interview-types';
import { useStudySelfCheck } from '../../hooks/useStudySelfCheck';
import { MarkdownBody } from '../MarkdownBody';
import { STUDY_LEARNER_MARKDOWN } from '../../lib/studyLearnerMarkdown';
import { LessonRichParagraphs, parseLessonBold } from './lessonRichText';

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

  return (
    <div className="study-rag-interview-block study-interview-self-check">
      <h4 className="study-rag-interview-heading">{deck.headingUk}</h4>
      <p className="muted small study-rag-interview-lead">{deck.leadUk}</p>

      <ol className="study-rag-interview-list">
        {deck.questions.map((q, index) => {
          const show = revealed[q.id];
          const mark = getMark(q.id);
          return (
            <li key={q.id} className="study-rag-interview-card">
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
                <>
                  <div className="study-rag-interview-answer-block">
                    {q.answerBriefUk || q.answerDeepUk ? (
                      <>
                        <p className="study-rag-interview-answer-tier-label">Коротко для співбесіди</p>
                        <div className="study-rag-interview-answer study-rag-interview-answer-brief">
                          <LessonRichParagraphs text={q.answerBriefUk ?? ''} className="study-rag-interview-answer-p" />
                        </div>
                        {q.answerDeepUk ? (
                          <>
                            <p className="study-rag-interview-answer-tier-label study-rag-interview-answer-tier-deep">
                              Розберімо до гвинтиків
                            </p>
                            <div className="study-rag-interview-answer-deep markdown-body">
                              <MarkdownBody markdown={q.answerDeepUk} {...STUDY_LEARNER_MARKDOWN} />
                            </div>
                          </>
                        ) : null}
                      </>
                    ) : (
                      <p className="study-rag-interview-answer">{parseLessonBold(q.answerUk ?? '')}</p>
                    )}
                    {q.pitfallUk ? (
                      <p className="study-rag-interview-pitfall">
                        <span className="study-rag-interview-pitfall-label">Типова помилка</span>
                        {stripPitfallPrefix(q.pitfallUk)}
                      </p>
                    ) : null}
                  </div>
                  <button
                    type="button"
                    className="study-rag-interview-reveal-btn study-rag-interview-hide-btn"
                    onClick={() => setRevealed((prev) => ({ ...prev, [q.id]: false }))}
                  >
                    Приховати відповідь
                  </button>
                </>
              )}

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
              <li key={link.to}>
                <Link to={link.to}>{link.label}</Link>
                <span className="muted small">{link.hintUk}</span>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
}
