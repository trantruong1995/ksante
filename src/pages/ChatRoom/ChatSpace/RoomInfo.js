import React, {forwardRef, useContext, useImperativeHandle, useState} from 'react';
import {AppContext} from "../../../context/AppProvider";
import {EditOutlined, LogoutOutlined, UserAddOutlined} from "@ant-design/icons";
import {Avatar, Button, Input, Popconfirm} from "antd";
import {AuthContext} from "../../../context/AuthProvider";
import {deleteDocument, deleteRoomMessage, updateDocument} from "../../../firebase/service";
import {doc} from "firebase/firestore";
import {db} from "../../../firebase/config";

const RoomInfo = forwardRef((props,ref) => {

    // get use info from context
    const {selectedRoom,selectedRoomId,members,setInviteMembers,setFindUserInRoom,language} = useContext(AppContext)
    const {user: {uid}} = useContext(AuthContext)

    // state for edit room name
    const [editRoom,setEditRoom] = useState(false)
    const [name,setName] = useState(selectedRoom?.name)
    const [description,setDescription] = useState(selectedRoom?.description)

    // handle edit room information
    async function handleEditRoomInfo(){
        if (name === selectedRoom.name && description === selectedRoom.description){
            setEditRoom(false)
            return
        }
        const docRef = doc(db,'rooms',selectedRoomId)
        await updateDocument(docRef,{
            name,description
        })
        setEditRoom(false)
    }

    // handle reset when close popover at parent
    useImperativeHandle(ref, () => ({
        reset() {
            setEditRoom(false)
        }
    }));

    // handle open find member mode
    function handleFindUserInRoom(){
        props.onClose()
        setFindUserInRoom(true)
    }

    // handle quit room
    async function handleQuitRoom (){
        const docRef = doc(db,'rooms',selectedRoomId)

        if (selectedRoom?.members.length === 1){
            deleteRoomMessage(selectedRoomId).then(() => deleteDocument(docRef))
        }else {
            const newMember = selectedRoom?.members.filter(member => member !== uid)
            await updateDocument(docRef,{
                members: [...newMember]
            })
        }
    }

    return (
        <div style={{width: 350}}>
            {/*Room info*/}
            <div className='text-center mt-4 position-relative' style={{borderBottom: '1px solid #ccc'}} >
                {editRoom && <>
                    <Input size={"large"} className='mb-3'
                           value={name} onChange={e => setName(e.target.value)}/>
                    <Input size={"large"} className='mb-3'
                           value={description} onChange={e => setDescription(e.target.value)}/>
                    <div className='mb-3 d-flex justify-content-around'>
                        <Button type={"primary"} ghost onClick={handleEditRoomInfo}>{language==='EN'?'Confirm':'Xác nhận'}</Button>
                        <Button type={"primary"} danger ghost onClick={() => setEditRoom(prevState => !prevState)}>{language==='EN'?'Cancel':'Hủy'}</Button>
                    </div>
                </>}
                {!editRoom && <>
                    <EditOutlined
                        className='position-absolute'
                        style={{fontSize: 22, top: 6, right: 18}}
                        onClick={() => {
                            setEditRoom(prevState => !prevState)
                        }}
                    />
                    <h3>{selectedRoom.name}</h3>
                    <h5>{selectedRoom.description}</h5>
                </>}
            </div>

            {/*Room members*/}
            <div className='mt-3 ms-3' style={{borderBottom: '1px solid #ccc'}} >
                <h5>Members: {selectedRoom.members.length}</h5>
                <div className='d-flex align-items-center pt-2 pb-4'>
                    <div onClick={handleFindUserInRoom} style={{cursor: 'pointer'}}>
                        <Avatar.Group maxCount={10}>
                            {members?.map(member => (
                                <Avatar key={member.uid} src={member.photoURL}>
                                    {member.photoURL? '' : member.displayName.charAt(0).toUpperCase()}
                                </Avatar>
                            ))}
                        </Avatar.Group>
                    </div>
                    <UserAddOutlined
                        style={{fontSize: 20, paddingLeft: 10}}
                        onClick={() => {
                            // Close pop up
                            props.onClose()
                            // Open find member modal
                            setInviteMembers(true)
                        }}
                    />
                </div>
            </div>

            {/*Quit room*/}
            <div className='d-flex justify-content-center align-items-center pt-2'>
                <Popconfirm
                    title={language==='EN'?'Confirm to quit room':'Xác nhận thoát phòng'}
                    description={language==='EN'?'You will no longer to be member of this room.':'Bạn sẽ không còn trong nhóm nữa'}
                    onConfirm={() => handleQuitRoom()}
                >
                    <div className='d-flex justify-content-center align-items-center text-danger'
                         style={{fontSize: 20,cursor: 'pointer'}}
                    >
                        <LogoutOutlined style={{marginRight: 5}}/>
                        {language==='EN'?'Quit room':'Rời phòng'}
                    </div>
                </Popconfirm>
            </div>
        </div>
    );
});

export default RoomInfo;
