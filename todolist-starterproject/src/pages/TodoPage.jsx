import React, {useRef, useState} from "react";
import InputItem from '../components/InputItem';
import TodoList from '../components/TodoList';
import CompletedTaskList from "../components/CompletedTaskList.jsx";

function TodoPage() {

    // This data is only present for demo purposes. Usually you obtain this through the backend.
    const todoItemsData = []; // Make sure this is an empty array if you want no initial todos

    const [todoItems, setToDoItems] = useState(todoItemsData);
    const maxId = todoItemsData.reduce((max, item) => item.id > max ? item.id : max, 0);
    const idCounter = useRef(maxId + 1); // Start with the highest existing id plus one
    const [completeTasks, setCompleteTasks] = useState([]);
    let completeTasksCounter = useRef(0);
    const addItem = (title) => {
        incrementId();
        console.log(idCounter);

        const newItem = {

            id: idCounter.current, // Use the current value of idCounter
            title: title,
            done: false
        };
        setToDoItems([...todoItems, newItem]);
    }
    const incrementId = () => {
        idCounter.current += 1; // Increment the counter for the next use
    }
    const removeItem = id => {
        setToDoItems(todoItems.filter(item => item.id !== id))
    }
    const removeCompleteItem = id => {
        setCompleteTasks(completeTasks.filter(item => item.id !== id))
    }

    const editItem = (id, newTitle) => {
        setToDoItems(todoItems.map(item => {
            if (item.id === id) {
                return {...item, title: newTitle};
            }
            return item;
        }));


    }
    const completeTask = (id, title) => {
        const task = {
            id: id,
            title: title
        };
        setCompleteTasks([...completeTasks, task]);
        completeTasksCounter.current += 1;
        removeItem(id);
    }
    return (
        <div className="container">
            <div className="inner">
                <InputItem addItem={addItem} editItem={editItem}/>
                <TodoList todoItems={todoItems} removeItem={removeItem} editItem={editItem}
                          completeTask={completeTask}/>
                <h1>Total completed: {completeTasksCounter.current}</h1>

            </div>
            <div className={"outer"}>
                <h1>Complete tasks:</h1>
                <CompletedTaskList completeTaskList={completeTasks}
                                   removeCompleteItem={removeCompleteItem}></CompletedTaskList>
            </div>
        </div>
    )
}

export default TodoPage;