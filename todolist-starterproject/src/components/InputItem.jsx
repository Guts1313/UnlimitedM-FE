// eslint-disable-next-line no-unused-vars
import React, { useState } from "react"

// Import PropTypes

// eslint-disable-next-line react/prop-types
function InputItem({addItem}) {

    const [title, setTitle] = useState("empty");

    const handleSubmit = e => {
        e.preventDefault();
        addItem(title);
    };

    const textChanged = e => {
        setTitle(e.target.value);
    };

    return (
        <form className="form-container" onSubmit={handleSubmit}>
            <input
                type="text"
                className="input-text"
                placeholder="Add item"
                value={title}
                onChange={textChanged}
            />
            <button className="input-submit">Submit</button>
        </form>
    );
}
export default InputItem;