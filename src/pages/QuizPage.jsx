import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import bgImg from "../assets/strtbck.jpeg";
import "../Styles/quiz.css";

function QuizPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(30);

  const API_URL =
    location.state?.apiUrl ||
    "https://opentdb.com/api.php?amount=10&category=18&difficulty=easy&type=multiple";

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => {
        const formatted = data.results.map((q) => {
          const options = [
            ...q.incorrect_answers.map((ans) => ({
              text: ans,
              isCorrect: false,
            })),
            { text: q.correct_answer, isCorrect: true },
          ];
          for (let i = options.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [options[i], options[j]] = [options[j], options[i]];
          }
          return {
            text: decodeHTMLEntities(q.question),
            correct: q.correct_answer,
            options,
          };
        });
        setQuestions(formatted);
        setLoading(false);
      });
  }, [API_URL]);

  const decodeHTMLEntities = (str) => {
    const txt = document.createElement("textarea");
    txt.innerHTML = str;
    return txt.value;
  };

  useEffect(() => {
    if (loading) return;
    if (timeLeft <= 0) {
      handleSkipOnTimeout();
      return;
    }
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, loading]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const handleAnswer = (isCorrect, idx) => {
    setSelected(idx);
    const selectedOption = questions[currentIndex].options[idx].text;
    const correctOption = questions[currentIndex].correct;

    const newAnswer = {
      question: questions[currentIndex].text,
      selected: selectedOption,
      correct: correctOption,
      isCorrect,
    };

    setAnswers((prev) => {
      const updated = [...prev];
      updated[currentIndex] = newAnswer;
      return updated;
    });

    if (isCorrect) setScore((prev) => prev + 1);
  };

  const goNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setTimeLeft(30);
      setSelected(
        answers[currentIndex + 1]
          ? questions[currentIndex + 1].options.findIndex(
              (opt) => opt.text === answers[currentIndex + 1].selected
            )
          : null
      );
    } else {
      navigate("/results", {
        state: {
          score,
          total: questions.length,
          answers,
          name: location.state?.name,
        },
      });
    }
  };

  const goPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setTimeLeft(30);
      setSelected(
        answers[currentIndex - 1]
          ? questions[currentIndex - 1].options.findIndex(
              (opt) => opt.text === answers[currentIndex - 1].selected
            )
          : null
      );
    }
  };

  const skipQuestion = () => {
    const newAnswer = {
      question: questions[currentIndex].text,
      selected: null,
      correct: questions[currentIndex].correct,
      isCorrect: false,
    };
    setAnswers((prev) => {
      const updated = [...prev];
      updated[currentIndex] = newAnswer;
      return updated;
    });
    goNext();
  };

  const handleSkipOnTimeout = () => {
    const alreadyAnswered = answers[currentIndex];
    if (!alreadyAnswered) {
      const newAnswer = {
        question: questions[currentIndex].text,
        selected: null,
        correct: questions[currentIndex].correct,
        isCorrect: false,
      };
      setAnswers((prev) => {
        const updated = [...prev];
        updated[currentIndex] = newAnswer;
        return updated;
      });
    }
    goNext();
  };

  const submitQuiz = () => {
    navigate("/results", {
      state: { score, total: questions.length, answers, name: location.state?.name },
    });
  };

  if (loading) return <p>Loading quiz...</p>;

  return (
    <div
      className="quiz-page"
      style={{
        backgroundImage: `url(${bgImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
      }}
    >
      <div className="quiz-card">
        <div className="progress-container">
          <div
            className="progress-bar"
            style={{
              width: `${((currentIndex + 1) / questions.length) * 100}%`,
            }}
          />
        </div>

        <div className="quiz-header-top">
          <p className="quiz-title">Quiz</p>
          <p className="quiz-timer">{formatTime(timeLeft)}</p>
        </div>

        <div key={currentIndex} className="fade-in">
          <div className="quiz-header">
            <p className="quiz-subtitle">
              Question {currentIndex + 1} of {questions.length}
            </p>
            <h2 className="quiz-question">{questions[currentIndex].text}</h2>
          </div>

          <ul className="quiz-options">
            {questions[currentIndex].options.map((option, idx) => (
              <li
                key={idx}
                className={`quiz-option tappable ${
                  selected === idx ? "selected" : ""
                }`}
                onClick={() => handleAnswer(option.isCorrect, idx)}
              >
                {option.text}
              </li>
            ))}
          </ul>
        </div>

        <div className="quiz-buttons">
          <button
            className="nav-btn prev-btn tappable"
            disabled={currentIndex === 0}
            onClick={goPrev}
          >
            ← Prev
          </button>

          <button className="nav-btn skip-btn tappable" onClick={skipQuestion}>
            Skip ⏭
          </button>

          {currentIndex < questions.length - 1 ? (
            <button
              className="nav-btn next-btn tappable"
              onClick={goNext}
              disabled={selected === null && !answers[currentIndex]}
            >
              Next →
            </button>
          ) : (
            <button
              className="nav-btn submit-btn tappable"
              onClick={submitQuiz}
              disabled={selected === null && !answers[currentIndex]}
            >
              Submit ✅
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default QuizPage;