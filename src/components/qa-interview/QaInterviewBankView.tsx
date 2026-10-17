import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { QaInterviewBank } from '../../data/qa-interview/qa-interview-bank';
import { QA_INTERVIEW_BANK_NEXT_LINKS } from '../../data/qa-interview/qa-interview-bank';
import { useStudySelfCheck } from '../../hooks/useStudySelfCheck';
import { LessonRichParagraphs, parseLessonBold } from '../lesson/lessonRichText';

function stripInterviewQuestionPrefix(questionUk: string): string {
  return questionUk.replace(/^\d+\.\s+/, '').trim();
}

function stripPitfallPrefix(pitfallUk: string): string {
  return pitfallUk.replace(/^Помилка:\s*/i, '').replace(/^Помилка\s*[-—]\s*/i, '').trim();
}

type Props = {
  bank: QaInterviewBank;
};

export function QaInterviewBankView({ bank }: Props) {
  const { getMark, setMark } = useStudySelfCheck(bank.bankId);
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});

  return (
    <div className="study-rag-interview-block study-interview-self-check qa-interview-bank">
      <p className="muted small study-rag-interview-lead">{bank.pageLeadUk}</p>

      {bank.categories.map((category) => (
        <section
          key={category.categoryId}
          className="qa-interview-category"
          aria-labelledby={`qa-interview-cat-${category.categoryId}`}
        >
          <h2 className="qa-interview-category-title" id={`qa-interview-cat-${category.categoryId}`}>
            {category.titleUk}
          </h2>
          <ol className="study-rag-interview-list">
            {category.questions.map((q, index) => {
              const show = revealed[q.id];
              const mark = getMark(q.id);
              return (
                <li key={q.id} className="study-rag-interview-card">
                  <div className="study-rag-interview-card-head">
                    <span className="study-rag-interview-num">{index + 1}</span>
                    <p className="study-rag-interview-question">
                      {stripInterviewQuestionPrefix(q.questionUk)}
                    </p>
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
                              <LessonRichParagraphs
                                text={q.answerBriefUk ?? ''}
                                className="study-rag-interview-answer-p"
                              />
                            </div>
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
        </section>
      ))}

      {QA_INTERVIEW_BANK_NEXT_LINKS.length > 0 ? (
        <nav className="study-rag-interview-next" aria-label="Пов’язані теми маршруту">
          <p className="study-rag-interview-next-title">Пов’язані теми</p>
          <ul className="study-rag-interview-next-list">
            {QA_INTERVIEW_BANK_NEXT_LINKS.map((link) => (
              <li key={link.to}>
                <Link to={link.to}>{link.label}</Link>
                <span className="muted small">{link.hintUk}</span>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </div>
  );
}
