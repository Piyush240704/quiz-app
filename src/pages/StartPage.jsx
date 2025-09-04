import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/startpage.css";
import bgImg from "../assets/strtbck.jpeg";
import { FaPlay } from "react-icons/fa";

function StartPage() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [category, setCategory] = useState("18");
  const [difficulty, setDifficulty] = useState("easy");
  const [mode, setMode] = useState("normal");

  // Load saved name from localStorage
  useEffect(() => {
    const storedName = localStorage.getItem("playerName");
    if (storedName) setName(storedName);
  }, []);

  const handleStart = () => {
    if (name.trim() === "") {
      alert("Please enter your name before starting!");
      return;
    }

    // Save name in localStorage
    localStorage.setItem("playerName", name);

    const apiUrl = `https://opentdb.com/api.php?amount=10&category=${category}&difficulty=${difficulty}&type=multiple`;

    navigate("/quiz", {
      state: { apiUrl, name, mode },
    });
  };

  return (
    <div
      className="startpage"
      style={{ backgroundImage: `url(${bgImg})` }}
    >
      <div className="card">
        <h1>Quiz Time</h1>

        <div className="form-group">
          <label>Enter Name:</label>
          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Category:</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="18">Computers</option>
            <option value="9">General Knowledge</option>
            <option value="21">Sports</option>
            <option value="23">History</option>
            <option value="17">Science & Nature</option>
          </select>
        </div>

        <div className="form-group">
          <label>Difficulty:</label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        <div className="form-group">
          <label>Quiz Mode:</label>
          <select value={mode} onChange={(e) => setMode(e.target.value)}>
            <option value="normal">Normal</option>
            <option value="challenge">Challenge</option>
          </select>
        </div>

        <button onClick={handleStart} className="start-btn">
          <FaPlay /> Start Quiz
        </button>
      </div>
    </div>
  );
}

export default StartPage;