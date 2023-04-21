import React, {useContext} from 'react';
import {AppContext} from "../../../context/AppProvider";
import {Avatar} from "antd";
import {useNavigate} from "react-router-dom";

const ListRoom = () => {

    const {rooms,language,setSelectedRoomId,darkMode} = useContext(AppContext)
    const navigate = useNavigate()
    const publicRooms = rooms.filter(room => room.type !== 'personal')

    return (
        <div style={{height: 'calc(100vh - 24px)',overflowY: "auto",paddingLeft: 30}} className={`${darkMode?'dark-mode-bg dark-mode-text':null}`}>
            {publicRooms.map(room => (<div key={room.id}>
                <div className='d-flex align-items-center border-bottom mt-2'
                     onClick={() => {
                         setSelectedRoomId(room.id)
                         navigate('/')
                     }}
                >
                    <div className='me-3 me-lg-5'>
                        <Avatar size={"large"}>
                            {room.name.charAt(0).toUpperCase()}
                        </Avatar>
                    </div>
                    <div>
                        <h4>{room.name}</h4>
                        <h5>{room.description}</h5>
                        <h5>{language==='EN'?'Members: ':'Thành viên: '}{room.members.length}</h5>
                    </div>
                </div>
            </div>))}
        </div>
    );
};

export default ListRoom;
