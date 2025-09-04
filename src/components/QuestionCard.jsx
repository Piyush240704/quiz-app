function QuestionCard({ question, onAnswer }) {
  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "20px",
        marginTop: "20px",
        background: "#fff",
      }}
    >
      <h2>{question.text}</h2>
      {question.options.map((option, i) => (
        <button
          key={i}
          onClick={() => onAnswer(option.isCorrect)}
          style={{
            display: "block",
            width: "100%",
            padding: "10px",
            margin: "5px 0",
            border: "none",
            borderRadius: "5px",
            background: "#f1f1f1",
            cursor: "pointer",
          }}
        >
          {option.text}
        </button>
      ))}
    </div>
  );
}

export default QuestionCard;