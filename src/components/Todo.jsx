import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const Todo = () => {
  const [todo, setTodo] = useState("");
  const [status, setStatus] = useState("");
  const queryClient = useQueryClient();

  // Fetch Todos
  const {
    data: todos,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["todos"],
    queryFn: async () => {
      const response = await axios.get("https://dummyjson.com/todos");
      return response.data.todos;
    },
  });

  // Add Mutation
  const addMutation = useMutation({
    mutationFn: async (newTodo) => {
      try {
        const response = await fetch("https://dummyjson.com/todos/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newTodo),
        });
        return await response.json(); // Return the added todo
      } catch (e) {
        console.error(e);
        throw e;
      }
    },
    onSuccess: (addedTodo) => {
      console.log("New Todo Added:", addedTodo);
      queryClient.setQueryData(["todos"], (oldTodos = []) => [
          addedTodo,
        ...oldTodos,
      ]);
    },
  });

  // Post New Todo
  const postTodo = () => {
    if (!todo.trim()) {
      alert("Please enter a todo!");
      return;
    }

    const newTodo = {
      todo,
      completed: status.toLowerCase() === "completed", // Convert status to boolean
      userId: Math.floor(Math.random() * 100),
    };

    addMutation.mutate(newTodo);
    setTodo(""); // Clear input fields
    setStatus("");
  };

  if (isLoading) return <div>Loading Todos...</div>;
  if (isError) return <div>Error: {error?.message}</div>;

  return (
    <>
      <div className="flex flex-col bg-cyan-200 p-4">
        <input
          value={todo}
          onChange={(e) => setTodo(e.target.value)}
          className="w-50 border-2 border-gray-400 rounded-lg py-2 px-3 mb-2"
          type="text"
          placeholder="Enter Todo"
        />
        <input
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-50 border-2 border-gray-400 rounded-lg py-2 px-3 mb-2"
          type="text"
          placeholder="Status (completed/not completed)"
        />
        <button className="bg-sky-600 text-white py-2 rounded-lg" onClick={postTodo}>
          Add Todo
        </button>
      </div>

      {todos?.map(({ id, todo, completed }) => (
        <div key={id} className="p-4 border-b border-gray-300">
          <h1 className="bg-red-300 text-white p-2">{todo}</h1>
          <p className={`p-2 text-white ${completed ? "bg-green-700" : "bg-red-500"}`}>
            {completed ? "Completed" : "Not Completed"}
          </p>
        </div>
      ))}
    </>
  );
};

export default Todo;
