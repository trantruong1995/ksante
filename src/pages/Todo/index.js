import React from 'react';
import TodoContent from "./TodoContent";
import TodoSidebar from "./TodoSidebar";

const Todo = () => {
    return (
        <div className='row p-0 m-0' style={{height: '100vh'}}>
            <div className='col-4 p-0 m-0'>
                <TodoSidebar/>
            </div>
            <div className='col-8 p-0 m-0'>
                <TodoContent/>
            </div>
        </div>
    );
};

export default Todo;
