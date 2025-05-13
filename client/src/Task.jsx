function Task({ text, highlight = "" }) {
  const getHighlightedText = (text, highlight) => {
    if (!highlight) return text;
    const parts = text.split(new RegExp(`(${highlight})`, "gi"));
    return parts.map((part, i) =>
      part.toLowerCase() === highlight.toLowerCase() ? (
        <mark key={i} className="bg-yellow-200">{part}</mark>
      ) : (
        part
      )
    );
  };

  return (
    <div className="bg-white rounded-md p-3 shadow-sm cursor-pointer hover:bg-gray-100">
      {getHighlightedText(text, highlight)}
    </div>
  );
}

export default Task;
