import { useState, useEffect } from "react";
import axios from "axios";

function TodoList() {
  const [todos, setTodos] = useState([]);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [updatedTitle, setUpdatedTitle] = useState("");
  const [updatedComment, setUpdatedComment] = useState("");
  const [selectedTodo, setSelectedTodo] = useState(null);

  useEffect(() => {
    async function fetchTodos() {
      try {
        const response = await axios.get("http://localhost:5000/api/todo/");
        setTodos(response.data);
      } catch (error) {
        console.error("Error fetching todos:", error);
      }
    }

    fetchTodos();
  }, [todos]);

  const handleDelete = async (todoId) => {
    try {
      const response = await axios.delete(`http://localhost:5000/api/todo/${todoId}`);
      if (response.status === 200) {
        setTodos((prevTodos) => prevTodos.filter((todo) => todo._id !== todoId));
      }
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  const handleUpdate = async (todo) => {
    setSelectedTodo(todo);
    setUpdatedTitle(todo.title);
    setUpdatedComment(todo.comment);
    setShowUpdateForm(true);
  };

  const handleUpdateSubmit = async () => {
    if (!selectedTodo) return;

    try {
      const response = await axios.put(`http://localhost:5000/api/todo/${selectedTodo._id}`, {
        title: updatedTitle,
        comment: updatedComment,
      });
      if (response.status === 200) {
        setTodos((prevTodos) =>
          prevTodos.map((todo) => (todo._id === selectedTodo._id ? response.data : todo))
        );
        setShowUpdateForm(false);
        setSelectedTodo(null);
        setUpdatedTitle("");
        setUpdatedComment("");
      }
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  return (
    <div className="bg-rose-50 h-screen p-8">
      {todos.length > 0 && (
        <h1 className="text-3xl font-bold uppercase text-center text-black mb-4">Todo List</h1>
      )
      }
      <ul>
        {todos?.map((todo) => (
          <li key={todo._id} className="mb-4">
            <div className="bg-purple-100 p-4 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-blue-700 mb-2">{todo.title}</h2>
              <p className="text-gray-600 text-bold">{todo.comment}</p>
              <p className="text-sm text-gray-500 mt-2">
                {new Date(todo.createdAt).toLocaleString()}
              </p>
              <div className="flex flex-row space-x-3">
                <button
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 mt-3 rounded-full hover:pointer"
                  onClick={() => handleDelete(todo._id)}
                >
                  Delete
                </button>
                <button
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 mt-3 rounded-full hover:pointer"
                  onClick={() => handleUpdate(todo)}
                >
                  Update
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {showUpdateForm && selectedTodo && (
        <div className="fixed inset-0 flex items-center justify-center z-10 bg-gray-900 bg-opacity-50">
          <div className="bg-purple-100 p-4 rounded-md flex flex-col space-y-3">
            <h2 className="text-xl text-center font-semibold mb-2">Update Todo</h2>
            <input
              type="text"
              placeholder="Title"
              value={updatedTitle}
              onChange={(e) => setUpdatedTitle(e.target.value)}
              className="rounded-md p-2"
            />
            <textarea
              placeholder="Comment"
              value={updatedComment}
              onChange={(e) => setUpdatedComment(e.target.value)}
              className="rounded-md p-2"
            />
            <div className="flex flex-row space-x-3 justify-center">
              <button
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 mt-3 rounded-full"
                onClick={handleUpdateSubmit}
              >
                Save
              </button>
              <button
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 mt-3 rounded-full"
                onClick={() => {
                  setShowUpdateForm(false);
                  setSelectedTodo(null);
                  setUpdatedTitle("");
                  setUpdatedComment("");
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TodoList;