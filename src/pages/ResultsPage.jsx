import { useLocation, useNavigate } from "react-router-dom";
import "../Styles/result.css";
import bgImg from "../assets/strtbck.jpeg";
import { useEffect, useState } from "react";
import { FaRedoAlt, FaListUl } from "react-icons/fa";

function ResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { score = 0, total = 0, answers = [], name } = location.state || {};

  // Persistent name
  const playerName = name || localStorage.getItem("playerName") || "Player";

  const correctCount = score;
  const wrongCount = total - score;
  const percentage = total > 0 ? (score / total) * 100 : 0;

  const [progress, setProgress] = useState(0);
  const [highScore, setHighScore] = useState(0);

  // Animate circular progress
  useEffect(() => {
    let start = 0;
    const interval = setInterval(() => {
      start += 1;
      if (start <= percentage) {
        setProgress(start);
      } else {
        clearInterval(interval);
      }
    }, 20);
    return () => clearInterval(interval);
  }, [percentage]);

  // Load and update player-specific high score
  useEffect(() => {
    const highScores = JSON.parse(localStorage.getItem("highScores") || "{}");

    const playerHigh = highScores[playerName] || 0;

    if (score > playerHigh) {
      highScores[playerName] = score;
      localStorage.setItem("highScores", JSON.stringify(highScores));
      setHighScore(score);
    } else {
      setHighScore(playerHigh);
    }
  }, [score, playerName]);

  return (
    <div
      className="results-page"
      style={{
        backgroundImage: `url(${bgImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
      }}
    >
      <div className="score-card">
        {/* Show Player Name */}
        <h2 className="player-name">🎉 Well done, {playerName}!</h2>

        <div className="score-circle">
          <svg className="progress-ring" viewBox="0 0 120 120">
            <circle className="progress-ring-bg" cx="60" cy="60" r="54" />
            <circle
              className="progress-ring-fill"
              cx="60"
              cy="60"
              r="54"
              strokeDasharray={2 * Math.PI * 54}
              strokeDashoffset={
                2 * Math.PI * 54 - (progress / 100) * 2 * Math.PI * 54
              }
            />
          </svg>
          <div className="score-circle-content">
            <p className="score-label">Your Score</p>
            <h2 className="score-value">{progress.toFixed(0)}%</h2>
          </div>
        </div>

        {/* Player-Specific High Score */}
        <p className="high-score">
          🏆 {playerName}'s High Score: {highScore}/{total}
        </p>

        <div className="stats">
          <div className="stat-item purple">
            <p>{percentage.toFixed(0)}%</p>
            <span>Completion</span>
          </div>
          <div className="stat-item purple">
            <p>{total}</p>
            <span>Total Questions</span>
          </div>
          <div className="stat-item green">
            <p>{correctCount}</p>
            <span>Correct</span>
          </div>
          <div className="stat-item red">
            <p>{wrongCount}</p>
            <span>Wrong</span>
          </div>
        </div>

        <div className="result-buttons">
          <button className="round-btn black" onClick={() => navigate("/")}>
            <FaRedoAlt /> Restart
          </button>
          <button
            className="round-btn black"
            onClick={() =>
              navigate("/review", {
                state: { answers, score, total, name: playerName },
              })
            }
          >
            <FaListUl /> Review Answers
          </button>
         
        </div>
      </div>
    </div>
  );
}

export default ResultsPage;