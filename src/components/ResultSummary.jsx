export default function ResultSummary() {
  return (
    <div className="result-summary">
      <p>Your answers and score will appear here.</p>
      <button onClick={() => window.location.href = "/quiz"}>
        Restart Quiz
      </button>
    </div>
  );
}