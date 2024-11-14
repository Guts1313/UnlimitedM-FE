import React from 'react';
import {checkPropTypes} from "prop-types";
import {useState} from "react";


function CompletedTask({item, removeCompleteItem}){
    const handleRemoval = () =>{
        removeCompleteItem(item.id);
    }

    return (
        <div className={"todoitems-container"}>
            <li>
                <span>{item.title}
                </span>
                <button onClick={handleRemoval}>Remove</button>
            </li>

        </div>
    );
}

export default CompletedTask;