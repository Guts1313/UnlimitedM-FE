// eslint-disable-next-line no-unused-vars
import React from "react"
import TodoItem from './TodoItem';

// eslint-disable-next-line react/prop-types
function TodoList({ todoItems, removeItem,editItem,completeTask }) {
  return (
      <div className={"todolist-container"}>

      <ul>

          {/* eslint-disable-next-line react/prop-types */}
        {todoItems.map(item => (
            <TodoItem key={item.id} item={item} removeItem={removeItem} editItem={editItem} completeTask={completeTask} />
        ))}

      </ul>
      </div>

  );
}


export default TodoList;