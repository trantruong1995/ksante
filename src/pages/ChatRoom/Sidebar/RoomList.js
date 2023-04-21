import React, {useContext} from 'react';
import {Avatar, Button, Collapse, Typography,} from "antd";
import CollapsePanel from "antd/es/collapse/CollapsePanel";
import {PlusCircleOutlined} from "@ant-design/icons";
import {AppContext} from "../../../context/AppProvider";
import './RoomList.css'

const RoomList = () => {

    const {rooms,setSelectedRoomId,setAddRoom,darkMode,language,friends} = useContext(AppContext)
    const publicRooms = rooms.filter(room => room?.type !== 'personal')

    function handleJoinPersonalChat(frUid){

        const personalRoom = rooms.find(room => room?.type === 'personal' && room.members.includes(frUid))
        setSelectedRoomId(personalRoom.id)

    }

    return (
        <div style={{height: 'calc(100vh - 24px)', overflow: "auto"}} className={darkMode ? 'dark-mode' : null}>
            {publicRooms  &&
                <Collapse defaultActiveKey={['1']} ghost>
                    <CollapsePanel header={language==='EN'?'Room list':'Danh sách phòng'} key="1" style={{fontSize: 18,borderRadius: '0'}} className='text-truncate'>
                        {publicRooms.map(room =>(
                            <div key={room.id}
                                 style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center',marginBottom: 10, borderBottom: '0.5px solid #ccc'}}>
                                <Typography
                                    style={{padding: '10px 0 10px 15px', fontSize: 16, cursor: 'pointer'}}
                                    className={`d-block text-truncate ${darkMode ? 'text-white' : null}`}
                                    onClick={() => setSelectedRoomId(room.id)}
                                >
                                    {room.name}
                                </Typography>
                            </div>
                            )
                        )}
                    </CollapsePanel>
                </Collapse>
            }
            <div className='d-flex justify-content-center border-bottom border-2 pb-2'>
                <Button type='text' style={{fontSize: 18}} className={`p-0 d-flex align-items-center ${darkMode ? 'text-white' : null}`}
                        icon={<PlusCircleOutlined/>}
                        onClick={() => setAddRoom(true)}
                >
                    {language==='EN'?'Add room':'Tạo phòng'}
                </Button>
            </div>
            {friends  &&
                <Collapse defaultActiveKey={['1']} ghost>
                    <CollapsePanel header={language==='EN'?'Personal chat':'Tin nhắn riêng'} key="1" style={{fontSize: 18,borderRadius: '0'}} className='text-truncate'>
                        {friends.map(friend =>(
                            <div key={friend.id} onClick={() => handleJoinPersonalChat(friend.uid)}
                                 style={{display: 'flex', alignItems: 'center',marginBottom: 10, borderBottom: '0.5px solid #ccc'}}>
                                <div>
                                    <Avatar src={friend.photoURL}>
                                        {friend.photoURL ? '' : friend.name?.charAt(0).toUpperCase()}
                                    </Avatar>
                                </div>
                                <div>
                                    <Typography
                                        style={{padding: '10px 0 10px 15px', fontSize: 16, cursor: 'pointer'}}
                                        className={`d-block text-truncate ${darkMode ? 'text-white' : null}`}
                                    >
                                        {friend.displayName}
                                    </Typography>
                                </div>
                            </div>
                        ))}
                    </CollapsePanel>
                </Collapse>
            }
        </div>
    );
};

export default RoomList;