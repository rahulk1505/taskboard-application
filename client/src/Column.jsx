import { useState } from "react";
import Task from "./Task";
import { Draggable } from "react-beautiful-dnd";
import { crudService } from "./crudServices/crudService";

function Column({ title, searchTerm, tasks, setTasks }) {
  const [showInput, setShowInput] = useState(false);
  const [newTask, setNewTask] = useState("");

  const handleAddTask = async () => {
    if (!title || newTask.trim() === '') return;

    try {
      const newTaskData = await crudService.create('/api/tasks', {
        column: title,
        title: newTask.trim(),
      });

      setTasks([...tasks, newTaskData]);
      setNewTask('');
      setShowInput(false);
    } catch (err) {
      console.error('Failed to create task', err.message || err);
    }
  };

  const handleCancel = () => {
    setNewTask("");
    setShowInput(false);
  };

  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-72 flex-shrink-0 pl-4">
      <div className="bg-blue-100 rounded-xl shadow-lg p-4">
        <h2 className="text-lg font-semibold mb-4">{title}</h2>

        <div className="space-y-2 mb-2">
          {filteredTasks.map((task, idx) => (
            <Draggable key={task.id} draggableId={task.id} index={idx}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                >
                  <Task text={task.title} highlight={searchTerm} />
                </div>
              )}
            </Draggable>
          ))}
        </div>

        {showInput ? (
          <div>
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Enter a title for this card..."
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 mb-2"
            />
            <div className="flex gap-2">
              <button
                onClick={handleAddTask}
                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
              >
                Add
              </button>
              <button
                onClick={handleCancel}
                className="text-gray-600 hover:text-gray-800 px-2"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowInput(true)}
            className="text-sm text-gray-700 hover:text-black hover:underline mt-2 cursor-pointer"
          >
            + Add a Task
          </button>
        )}
      </div>
    </div>
  );
}

export default Column;
