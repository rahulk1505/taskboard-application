import { useEffect, useState } from "react";
import Column from "./Column";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { crudService } from "./crudServices/crudService";

function Board() {
  const [columns, setColumns] = useState([]);
  const [newColumnName, setNewColumnName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [columnTasks, setColumnTasks] = useState({});

  useEffect(() => {
    const fetchBoardData = async () => {
      try {
        const columnData = await crudService.fetch('/api/columns');

        const validColumns = Array.isArray(columnData)
          ? columnData.filter((col) => typeof col === "string" && col.trim() !== "")
          : [];
        setColumns(validColumns);

        const allTasks = await crudService.fetch(`/api/tasks?all=true`);
        console.log("all tasks", allTasks);

        const tasksPerColumn = {};
        for (const col of validColumns) {
          tasksPerColumn[col] = allTasks.filter(
            task => task.column?.trim().toLowerCase() === col.trim().toLowerCase()
          );
        }
        setColumnTasks(tasksPerColumn);
      } catch (err) {
        console.error("Failed to fetch board data", err.message || err);
      }
    };

    fetchBoardData();
  }, []);


  const handleAddColumn = async () => {
    if (newColumnName.trim() === "") return;
    try {
      await crudService.create("/api/columns", { newColumn: newColumnName });
      setColumns([...columns, newColumnName]);
      setColumnTasks({ ...columnTasks, [newColumnName]: [] });
      setNewColumnName("");
    } catch (err) {
      console.error("Failed to create column", err);
    }
  };


  const onDragEnd = async (result) => {
    const { source, destination } = result;

    if (!destination || source.droppableId === destination.droppableId) return;

    const sourceColumn = source.droppableId;
    const destinationColumn = destination.droppableId;

    const sourceTasks = [...columnTasks[sourceColumn]];
    const destinationTasks = [...columnTasks[destinationColumn]];

    const [movedTask] = sourceTasks.splice(source.index, 1);
    movedTask.column = destinationColumn;

    destinationTasks.splice(destination.index, 0, movedTask);

    // Optimistically update UI
    setColumnTasks({
      ...columnTasks,
      [sourceColumn]: sourceTasks,
      [destinationColumn]: destinationTasks,
    });

    // Persist update to backend
    try {
      await crudService.update("/api/tasks", {
        id: movedTask.id,
        newColumn: destinationColumn,
      });
    } catch (err) {
      console.error("❌ Failed to update task column:", err.message || err);
      // Optionally: Revert UI update here
    }
  };


  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={newColumnName}
            onChange={(e) => setNewColumnName(e.target.value)}
            placeholder="New column name"
            className="border p-2 rounded w-60"
          />
          <button
            onClick={handleAddColumn}
            className="bg-green-600 text-white px-4 rounded hover:bg-green-700"
          >
            Add Column
          </button>
        </div>
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 rounded w-60"
        />
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-4 overflow-x-auto">
          {columns.map((title) => (
            <Droppable droppableId={title} key={title}>
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  <Column
                    title={title}
                    searchTerm={searchTerm}
                    tasks={columnTasks[title] || []}
                    setTasks={(tasks) =>
                      setColumnTasks({ ...columnTasks, [title]: tasks })
                    }
                  />
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}

export default Board;