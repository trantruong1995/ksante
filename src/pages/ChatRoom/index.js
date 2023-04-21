import React from 'react';
import SideBar from "./Sidebar";
import ChatSpace from "./ChatSpace";

const Chat = () => {
    return (
        <div className='row p-0 m-0' style={{height: '100vh'}}>
            <div className='col-4 p-0 m-0'>
                <SideBar/>
            </div>
            <div className='col-8 p-0 m-0'>
                <ChatSpace/>
            </div>
        </div>
    );
};

export default Chat;