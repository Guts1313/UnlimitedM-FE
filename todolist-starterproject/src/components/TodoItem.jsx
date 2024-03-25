// eslint-disable-next-line no-unused-vars
import React, {useState} from "react"

// eslint-disable-next-line react/prop-types
function TodoItem({item, removeItem, completeTask}) {

    const [checked, setChecked] = useState();
    const [complete, setComplete] = useState();

    const handleChange = () => {
        setChecked(!checked);
    };

    const handleCompletion = () => {
        if (checked) {
            setComplete(complete);
            completeTask(item.id, item.title)
        } else {
            alert("Check the box first!");
        }
    }

    return (
        <div className={"todoitems-container"}>
            <li>
                    {item.title}

                <button id={"complete-btn"} onClick={handleCompletion}>Complete task</button>
                <button id={"remove-btn"} onClick={() => removeItem(item.id)}>Remove</button>
                <input type={"checkbox"}
                       checked={checked}
                       onChange={handleChange}/>
                Done task?
            </li>

        </div>
    );
}


export default TodoItem;