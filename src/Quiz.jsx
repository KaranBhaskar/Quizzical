import React, { useState, useEffect } from "react";
import { decode } from "html-entities";
import { nanoid } from "nanoid";

export default function Quiz() {
  const [playAgain, setPlayAgain] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [correctAns, setCorrectAns] = useState(true);
  const [correctAnswers, setCorrectAnswers] = useState(-19);
  const [selectedAnswers, setSelectedAnswers] = useState({});

  useEffect(() => {
    setCorrectAns((prv) => !prv);
  }, [correctAnswers, playAgain]);

  useEffect(() => {
    if (questions.length) {
      setQuestions([]);
    }
    const url = "https://opentdb.com/api.php?amount=5&type=multiple";
    fetch(url)
      .then((res) => res.json())
      .then((datas) => {
        for (const value of datas.results) {
          setQuestions((prv) => [...prv, { data: value, uuid: nanoid() }]);
        }
      });
  }, [playAgain]);

  const questionsElement = questions.map(({ data, uuid }) => {
    const answers = data.incorrect_answers;
    if (!answers.includes(data.correct_answer)) {
      answers.splice(
        Math.floor(Math.random() * data.incorrect_answers.length),
        0,
        data.correct_answer
      );
    }
    const uniqueId = uuid;
    const mcqs = answers.map((answer) => {
      const style = {
        backgroundColor:
          answer === data.correct_answer
            ? "#94d742"
            : `${uniqueId}` in selectedAnswers &&
              selectedAnswers[`${uniqueId}`] === answer
            ? "rgba(248,188,188,0.48)"
            : "rgba(0,0,0,0.5)",
      };

      return (
        <React.Fragment key={nanoid()}>
          <input
            type="radio"
            name={uniqueId}
            id={answer}
            value={answer}
            onChange={handleChange}
            checked={
              `${uniqueId}` in selectedAnswers &&
              selectedAnswers[`${uniqueId}`] === answer
            }
          />
          <label style={correctAns ? style : {}} htmlFor={answer}>
            {decode(answer)}
          </label>
        </React.Fragment>
      );
    });
    function handleChange(e) {
      if (e.target.nodeName === "INPUT") {
        const key = e.target.name;
        const value = e.target.value;
        setSelectedAnswers((prv) => {
          return { ...prv, [key]: value };
        });
      }
    }

    return (
      <div className="questions" key={uniqueId}>
        <h2>{decode(data.question)}</h2>
        <div className="mcqs">{mcqs}</div>
      </div>
    );
  });

  function checkAnswers() {
    if (correctAns) {
      setPlayAgain((prv) => !prv);
    }
    let correct = 0;
    for (const key in questions) {
      const newKey = questions[key]["uuid"];
      const answer = questions[key]["data"]["correct_answer"];
      if (newKey in selectedAnswers && selectedAnswers[newKey] === answer) {
        correct++;
      }
    }
    setCorrectAnswers(correct);
  }

  return (
    <div>
      {questionsElement}
      <div className="answers">
        {correctAns && (
          <p>
            You scored {correctAnswers}/{questions.length} answers
          </p>
        )}
        <button onClick={checkAnswers}>
          {!correctAns ? "Check Answers" : "Play again"}
        </button>
      </div>
    </div>
  );
}
