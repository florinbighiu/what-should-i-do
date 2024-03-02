import { useState } from "react";
import axios from "axios";

function TodoForm() {
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleSubmit = async () => {
    const newTodo = {
      title: title,
      comment: comment,
    };

    await axios.post("http://localhost:5000/api/todo/", newTodo);
    setTitle("");
    setComment("");
  };

  return (
    <div className="bg-purple-100 text-black p-8 shadow-xl flex flex-col items-center justify-center">
      <h2 className="text-2xl font-bold uppercase mb-4 text-center">Add a New Todo</h2>
      <div className="grid grid-cols-3 space-x-4">
        <div className="flex mb-4">
          <input
            type="text"
            className="p-2 px-3 text-gray-900 flex-grow rounded-full"
            placeholder="Title"
            value={title}
            onChange={handleTitleChange}
          />
        </div>
        <div className="flex mb-4">
          <input
            className="p-2 px-3 text-gray-900 flex-grow rounded-full"
            placeholder="Comment"
            value={comment}
            onChange={handleCommentChange}
          />
        </div>
        <div className="flex items-center mb-4">
          <button
            type="button"
            className="bg-indigo-700 hover:bg-indigo-900 text-white p-3 rounded-full px-6"
            onClick={handleSubmit}>
            Add Todo
          </button>
        </div>
      </div>
    </div>
  );
}

export default TodoForm;
