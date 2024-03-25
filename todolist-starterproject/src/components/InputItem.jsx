// eslint-disable-next-line no-unused-vars
import React, {useState} from "react"

// Import PropTypes

// eslint-disable-next-line react/prop-types
function InputItem({addItem}) {
    const [title, setTitle] = useState('');
    const onType = (e) => {
        setTitle(e.target.value);
    };
    const handleAddItem = () => {
        addItem(title); // Pass the title to the addItem function
        setTitle(''); // Clear the input after adding
    };
    return (
        <div>
            <input type="text" value={title} onChange={onType}></input>
            <button onClick={handleAddItem}>Click</button>

        </div>
    )


}


export default InputItem;