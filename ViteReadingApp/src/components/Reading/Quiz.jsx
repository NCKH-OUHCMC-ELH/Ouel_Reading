import React, { useState, useEffect, useRef } from 'react';
import './Quiz.css';

export default function Quiz({ passage, questions, question, setQuestion, lock, setLock }) {

  const [index, setIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [result, setResult] = useState(false);
  const [suggestionOptions, setSuggestionOptions] = useState(['A', 'B', 'C', 'D']);
  const [suggestioned, setSuggestioned] = useState(false);

  const OptionA = useRef(null);
  const OptionB = useRef(null);
  const OptionC = useRef(null);
  const OptionD = useRef(null);

  const option_array = [OptionA, OptionB, OptionC, OptionD];
  const map = { A: 0, B: 1, C: 2, D: 3 };

  useEffect(() => {
    const newIndex = questions.findIndex(q => q === question);
    if (newIndex >= 0) {
      setIndex(newIndex);
      setLock(false);
      resetOptions();
      setSuggestionOptions(['A', 'B', 'C', 'D']);
      setSuggestioned(false);
    }
  }, [question]);



  const checkAns = (e, ans) => {
    if (lock) return;
    const correct = question.correct_answer;
    setUserAnswers(prev => ({
      ...prev,
      [index]: ans
    }));
    if (correct === ans) {
      e.target.classList.add("correct");
      setScore(prev => prev + 1);
    } else {
      e.target.classList.add("wrong");
      option_array[map[correct]].current.classList.add("correct");
    }
    setLock(true);
  };


  const resetOptions = () => {
    option_array.forEach(opt => {
      opt.current.classList.remove("wrong");
      opt.current.classList.remove("correct");
    });
  };

  const SavedAnswer = (qIndex) => {
    const saved = userAnswers[qIndex];
    if (!saved) {
      setLock(false);
      return;
    }
    const correct = questions[qIndex].correct_answer;
    option_array[map[saved]].current.classList.add(
      saved === correct ? "correct" : "wrong"
    );
    if (saved !== correct) {
      option_array[map[correct]].current.classList.add("correct");
    }
    setLock(true);
  };


  const next = () => {

    if (index === questions.length - 1) {
      setResult(true);
      return;
    }

    const nextQ = questions[index + 1];
    setQuestion(nextQ);
    setTimeout(() => SavedAnswer(index + 1));
  };


  const prevn = () => {
    if (index === 0) return;

    const nextQ = questions[index - 1];
    setQuestion(nextQ);
    setTimeout(() => SavedAnswer(index - 1));
  };

  const useFiftyFifty = () => {
    if (lock || suggestioned) return;
    const correct = question.correct_answer;
    const wrongOptions = ['A', 'B', 'C', 'D'].filter(opt => opt !== correct);
    const randomWrong = wrongOptions[Math.floor(Math.random() * wrongOptions.length)];
    setSuggestionOptions([correct, randomWrong]);
    setSuggestioned(true);
  }


  const reset = () => {
    setSuggestionOptions(['A', 'B', 'C', 'D']);
    setQuestion(questions[0]);
    setLock(false);
    setUserAnswers({});
    setScore(0);
    setResult(false);
    resetOptions();
    setSuggestioned(false);
  }

  return (
    <div className='container'>
      <h1>Quiz</h1>
      <hr />

      {result ? (
        <>
          <h2>Điểm : {score}/{questions.length}</h2>
          <button onClick={reset}>Làm bài khác</button>
        </>
      ) : (
        <>
          <h2>{index + 1}. {question.question_text}</h2>

          <ul>
            <li ref={OptionA} onClick={(e) => checkAns(e, "A")} className={!suggestionOptions.includes("A") ? "hidden" : ""}>{question.option_a}</li>
            <li ref={OptionB} onClick={(e) => checkAns(e, "B")} className={!suggestionOptions.includes("B") ? "hidden" : ""}>{question.option_b}</li>
            <li ref={OptionC} onClick={(e) => checkAns(e, "C")} className={!suggestionOptions.includes("C") ? "hidden" : ""}>{question.option_c}</li>
            <li ref={OptionD} onClick={(e) => checkAns(e, "D")} className={!suggestionOptions.includes("D") ? "hidden" : ""}>{question.option_d}</li>
          </ul>
          <button onClick={next}> {index + 1 === questions.length ? "Nộp bài":"Next"}</button>
          {index > 0 && <button onClick={prevn}>Prev</button>}
          {lock ? (
            <div className="explanation">
              Giải thích: {question.explanation}
            </div>
          ) : (
            !suggestioned && <button onClick={useFiftyFifty}>50/50</button>
          )}
          <div className="index">{index + 1} / {questions.length} Câu hỏi</div>
        </>
      )}
    </div>
  );
}
