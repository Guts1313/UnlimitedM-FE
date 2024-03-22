import React, {useRef, useState} from "react";
import InputItem from '../components/InputItem';
import TodoList from '../components/TodoList';

function TodoPage() {

    // This data is only present for demo purposes. Usually you obtain this through the backend.
    const todoItemsData = [
        {
            id: 1,
            title: "Do groceries",
            done: true
        },
        {
            id: 2,
            title: "Clean bathroom",
            done: false
        },
        {
            id: 3,
            title: "Dispose thrash",
            done: true
        },
    ]

    const [todoItems, setToDoItems] = useState(todoItemsData);
    const maxId = todoItemsData.reduce((max, item) => item.id > max ? item.id : max, 0);
    const idCounter = useRef(maxId + 1); // Start with the highest existing id plus one
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
    const incrementId = () =>{
        idCounter.current += 1; // Increment the counter for the next use
    }
    const removeItem = id => {
        setToDoItems(todoItems.filter(item => item.id !==id))
    }

    const editItem = (id, newTitle) => {
        setToDoItems(todoItems.map(item => {
            if (item.id === id) {
                return { ...item, title: newTitle };
            }
            return item;
        }));


    }
    return (
        <div className="container">
            <div className="inner">
                <InputItem addItem={addItem} editItem={editItem} />
                <TodoList todoItems={todoItems} removeItem ={removeItem} editItem={editItem}/>
            </div>
        </div>
    )
}

export default TodoPage;