function ProgressBar({ progress }) {
  return (
    <div
      style={{
        background: "#eee",
        borderRadius: "5px",
        height: "10px",
        margin: "10px 0",
      }}
    >
      <div
        style={{
          width: `${progress}%`,
          height: "100%",
          background: "#4caf50",
          borderRadius: "5px",
          transition: "width 0.3s ease",
        }}
      />
    </div>
  );
}

export default ProgressBar;