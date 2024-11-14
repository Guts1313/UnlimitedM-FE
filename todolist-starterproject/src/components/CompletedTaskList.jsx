import React from 'react';
import CompletedTask from "./CompletedTask.jsx";

function CompletedTaskList({completeTaskList,removeCompleteItem}) {

    return (
        <div className={"container-completed"}>
            <ul>
                {completeTaskList.map(item => (
                <CompletedTask key={item.id} item={item} title={item.title} removeCompleteItem={removeCompleteItem}/>
                ))
                }


            </ul>
        </div>
    );
}

export default CompletedTaskList;