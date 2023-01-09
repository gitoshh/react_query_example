import "./css/App.css";
import { getTodos, addTodo, deleteTodo, updateTodo } from "./api/todos";
import { useQuery, useMutation, useQueryClient } from "react-query";

import { XMarkIcon } from "@heroicons/react/20/solid";
import { useState } from "react";

import { DateTime } from "luxon";
import { data } from "autoprefixer";

function App() {
  const [task, setTask] = useState("");

  // Access the client
  const queryClient = useQueryClient();

  // Queries
  const {
    isLoading,
    isError,
    data: todos,
    error,
  } = useQuery("todos", getTodos, {
    select: (todos) => todos.sort((prev, next) => next.id - prev.id),
  });

  // Mutations
  const newTodo = useMutation(addTodo, {
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries("todos");
    },
  });

  const removeTodo = useMutation(deleteTodo, {
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries("todos");
    },
  });

  const modifyTodo = useMutation(updateTodo, {
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries("todos");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(task);
    newTodo.mutate({
      title: task,
      done: false,
      created_at: DateTime.now().toString(),
    });
    setTask("");
  };

  const handleDelete = (todo) => {
    removeTodo.mutate(todo);
  };

  const handleChecked = (todo) => {
    todo.done = !todo.done;
    modifyTodo.mutate(todo);
  };

  let content;

  if (isLoading) {
    content = (
      <div>
        <h1>Loading...</h1>
      </div>
    );
  } else if (isError) {
    content = (
      <div>
        <h1>{error.message}</h1>
      </div>
    );
  } else {
    content = todos.map((todo) => (
      <li key={todo.id}>
        <div className="flex w-96 items-center px-4 py-4 sm:px-6">
          <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
            <div className="truncate">
              <div className="flex text-sm">
                <div className="relative flex items-start">
                  <div className="flex h-5 items-center">
                    <input
                      id={todo.id}
                      aria-describedby="todo task"
                      name={todo.title}
                      checked={todo.done ? "checked" : ""}
                      onChange={() => handleChecked(todo)}
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label
                      htmlFor={todo.title}
                      className={`font-medium text-gray-700 ${
                        todo.done ? "line-through" : ""
                      }`}
                    >
                      {todo.title}
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className="ml-5 flex-shrink-0 hover:rounded-full hover:bg-red-600 hover:text-white"
            onClick={() => handleDelete(todo)}
          >
            <XMarkIcon
              className="h-5 w-5 text-red-400 hover:text-white"
              aria-hidden="true"
            />
          </div>
        </div>
      </li>
    ));
  }

  return (
    <div className="App bg-white shadow sm:rounded-lg">
      <div className="w-full px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">Todos</h3>
        <form className="mt-5 sm:flex sm:items-center" onSubmit={handleSubmit}>
          <div className="w-full sm:max-w-xs">
            <input
              type="text"
              name="text"
              value={task}
              className="block w-full rounded-sm border-gray-300 text-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="new task"
              onChange={(e) => setTask(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="flex flex-nowrap mt-3 flex w-full items-center shadow-lg justify-center rounded-sm border border-transparent bg-indigo-600 px-4 py-2 font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
          >
            Add
          </button>
        </form>

        <div className="block text-start my-6">
          <div className="overflow-hidden bg-white shadow sm:rounded-md">
            <ul role="list" className="divide-y divide-gray-200">
              {content}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
