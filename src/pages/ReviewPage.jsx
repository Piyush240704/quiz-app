import { useLocation, useNavigate } from "react-router-dom";
import "../Styles/review.css";
import bgImg from "../assets/strtbck.jpeg";
import { FaArrowLeft } from "react-icons/fa";

function ReviewPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { answers = [] } = location.state || {};

  const total = answers.length;
  const correct = answers.filter((a) => a.isCorrect).length;
  const wrong = total - correct;

  return (
    <div
      className="review-page"
      style={{
        backgroundImage: `url(${bgImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
      }}
    >
      <div className="review-container">
        <h1 className="review-title">Review Answers</h1>

        <div className="review-summary">
          <div className="summary-item purple">
            <p>{total}</p>
            <span>Total</span>
          </div>
          <div className="summary-item green">
            <p>{correct}</p>
            <span>Correct</span>
          </div>
          <div className="summary-item red">
            <p>{wrong}</p>
            <span>Wrong</span>
          </div>
        </div>

        <div className="review-list">
          {answers.map((ans, idx) => (
            <div
              key={idx}
              className={`review-item ${ans.isCorrect ? "correct" : "wrong"}`}
            >
              <h3 className="review-question">
                {idx + 1}. {ans.question}
              </h3>
              <p className="review-answer">
                <strong>Your Answer:</strong>{" "}
                {ans.selected ? ans.selected : "Skipped"}
              </p>
              <p className="review-correct">
                <strong>Correct Answer:</strong> {ans.correct}
              </p>
            </div>
          ))}
        </div>

        <button
          className="back-btn"
          onClick={() => navigate("/results", { state: location.state })}
        >
           <FaArrowLeft /> Back to Results
        </button>
      </div>
    </div>
  );
}

export default ReviewPage;