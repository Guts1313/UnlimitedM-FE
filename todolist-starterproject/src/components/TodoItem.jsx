// eslint-disable-next-line no-unused-vars
import React, {useState} from "react"

// eslint-disable-next-line react/prop-types
function TodoItem({item, removeItem,editItem}) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState(item.title);

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = () => {
        editItem(item.id, editedTitle);
        setIsEditing(false);
    };

    const handleChange = (e) => {
        setEditedTitle(e.target.value);
    };

    return (
        <li>
            {isEditing ? (
                <input type="text" value={editedTitle} onChange={handleChange} />
            ) : (
                <span>{item.title}</span>
            )}

            <button onClick={() => removeItem(item.id)}>Remove</button>
            {isEditing ? (
                <button onClick={handleSave}>Save</button>
            ) : (
                <button onClick={handleEdit}>Edit</button>
            )}
        </li>
    );
}


export default TodoItem;