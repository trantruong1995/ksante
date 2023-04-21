import React from 'react';
import ListUser from "./ListUser";
import ListRoom from "./ListRoom";

const Content = ({data}) => {

    return (
        <div className='row p-0 m-0 h-100'>
            <div className='col p-0 m-0'>
                <div style={{backgroundColor: '#ccc',textAlign: 'center', height: 24}}>Simple</div>
                <div>
                    {data === 'Friends' ? <ListUser/> : <ListRoom/>}
                </div>
            </div>
        </div>
    );
};

export default Content;