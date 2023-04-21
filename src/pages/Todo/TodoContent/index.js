import React, {useContext, useEffect, useState} from 'react';
import {AppContext} from "../../../context/AppProvider";
import {AntCloudOutlined, CloseOutlined, EditOutlined} from "@ant-design/icons";
import {AuthContext} from "../../../context/AuthProvider";
import {Avatar, Button, Input, Popconfirm, Select, Typography} from "antd";
import {formatDate} from "../../../util/converter";
import {useNavigate} from "react-router-dom";
import {doc} from "firebase/firestore";
import {db} from "../../../firebase/config";
import {deleteDocument, updateDocument} from "../../../firebase/service";

const TodoContent = () => {

    const {user} = useContext(AuthContext)
    const {darkMode,language,selectedTodo,todoId,friends,rooms,setSelectedRoomId} = useContext(AppContext)
    const navigate = useNavigate()

    const [edit,setEdit] = useState(false)
    const [newDes,setNewDes] = useState(selectedTodo?.description)

    // reset when change todo
    useEffect(() => {
        setEdit(false)
        setNewDes(selectedTodo?.description)
    },[todoId,selectedTodo?.description])

    // get creator
    const from =  (selectedTodo?.from === user.uid) ? user
        : friends.find(friend => friend?.uid === selectedTodo?.from)
    // get assigned
    const assigned = friends.filter(friend => selectedTodo?.assignTo.includes(friend.uid))

    // handle navigate to private chat
    function handleNavigateToPrivateChat(uid){
        const selectedRoom = rooms.find(room => room.type==='personal' && room.members.includes(uid))
        setSelectedRoomId(selectedRoom.id)
        navigate('/')
    }
    // handle change todo status
    async function handleChangeStatus(e){
        // update todo
        const docRef = doc(db,'todos',selectedTodo?.id)
        await updateDocument(docRef,{
            status: e
        })
    }
    // handle update description
    async function handleUpdateDescription(){
        const docRef = doc(db,'todos',selectedTodo?.id)
        await updateDocument(docRef,{
            description: newDes
        })
        setEdit(false)
    }

    // handle delete todo
    async function handleDeleteTodo(){
        // update todo
        const docRef = doc(db,'todos',selectedTodo?.id)
        await deleteDocument(docRef)
        window.location.reload()
    }

    return (
        <div className='row p-0 m-0 h-100'>
            <div className='col p-0 m-0'>
                <div style={{backgroundColor: '#ccc',textAlign: 'center', height: 24}}>Simple</div>
                {selectedTodo &&
                    <div style={{height: 'calc(100vh - 24px)',overflowY: "auto", padding: 10}}
                         className={`${darkMode?'dark-mode-bg dark-mode-text':null}`}>
                        <div className='d-flex align-items-center justify-content-between'>
                            <div className='fw-bold text-truncate'>{selectedTodo.name}</div>
                            <div className='d-flex align-items-center'>
                                <div className='fw-bold me-1'>
                                    {language==='EN'?'Created at :':'Tạo lúc :'}
                                </div>
                                <div>
                                    <Typography.Text style={{color: '#a7a7a7', fontSize: 13}}>
                                        {formatDate(selectedTodo.createAt.seconds)}
                                    </Typography.Text>
                                </div>
                            </div>
                        </div>
                        <div className='d-flex align-items-center justify-content-between border-bottom pb-2'>
                            <div className='d-flex align-items-center'>
                                <div className='fw-bold me-1'>
                                    {language==='EN'?'Created by :':'Tạo bởi :'}
                                </div>
                                {from.uid === user.uid ?
                                    <div className='text-success'>{language==='EN'?'You':'Bạn'}</div> :
                                    <div style={{cursor: "pointer"}}
                                        onClick={() => {
                                        handleNavigateToPrivateChat(from.uid)}}
                                    >{from.displayName}</div>
                                }
                            </div>
                            <div className='d-flex align-items-center'>
                                <div className='fw-bold me-1'>
                                    {language==='EN'?'Deadline :':'Hạn cuối :'}
                                </div>
                                <Typography.Text style={{fontSize: 13,color: 'red'}}>
                                    {selectedTodo.deadline}
                                </Typography.Text>
                            </div>
                        </div>
                        <div className='border-bottom p-2 d-flex align-items-center justify-content-between'>
                            <div>
                                <span>{language==='EN'?'Members :':'Thành viên :'}</span>
                                <span>{selectedTodo.assignTo.length}</span><br/>
                                <span style={{fontSize: 12}}>
                                    {language==='EN'?'(You can only see person who is your friend)':'(Bạn chỉ xem được thành viên là bạn của bạn)'}
                                </span>
                            </div>
                            <div>
                                <Avatar.Group
                                    maxCount={5}
                                    size={"large"}
                                >
                                    {assigned && assigned.map(friend => <Avatar key={friend.id} src={friend.photoURL}>
                                        {friend.photoURL?'':friend.displayName.charAt(0).toUpperCase()}
                                    </Avatar>)}
                                    {selectedTodo.assignTo.includes(user.uid) && <Avatar src={user.photoURL}></Avatar>}
                                </Avatar.Group>
                            </div>
                        </div>
                        <div className='p-2'>
                            <div className='d-flex align-items-center justify-content-between mx-4 p-3 border-bottom'>
                                <div>
                                    <span className='me-2'>{language==='EN'?'Process :':'Tiến trình :'}</span>
                                    <Select
                                        style={{
                                            width: 120,
                                        }}
                                        value={selectedTodo?.status}
                                        onChange={e =>  handleChangeStatus(e)}
                                    >
                                        <Select.Option value='create' className='text-info'>{language==='EN'?'Just created':'Vừa tạo'}</Select.Option>
                                        <Select.Option value='process' className='text-primary'>{language==='EN'?'In procesing':'Đang thực hiện'}</Select.Option>
                                        <Select.Option value='delay' className='text-danger'>{language==='EN'?'Delay':'Trì hoãn'}</Select.Option>
                                        <Select.Option value='done' className='text-success'>{language==='EN'?'Done':'Hoàn thành'}</Select.Option>
                                    </Select>
                                </div>
                                <div>
                                    <EditOutlined
                                        style={{fontSize: 18, marginRight: 10,cursor: 'pointer'}}
                                        onClick={() => setEdit(pre => !pre)}
                                    />
                                    <Popconfirm title={'Confirm delete todo'}
                                        onConfirm={handleDeleteTodo}
                                    >
                                        <CloseOutlined style={{fontSize: 18, color: 'red', cursor: 'pointer'}}/>
                                    </Popconfirm>
                                </div>
                            </div>
                            {!edit &&
                                <div className='mt-3'>
                                    {selectedTodo.description}
                                </div>
                            }
                            {edit &&
                                <div className='mt-3'>
                                    <Input.TextArea
                                        value={newDes}
                                        onChange={e => setNewDes(e.target.value)}
                                    />
                                    <div className='text-center'>
                                        <Button className='mt-1' type='primary' ghost onClick={handleUpdateDescription}>{language==='EN'?'Update':'Cập nhật'}</Button>
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                }
                {!selectedTodo &&
                    <div className={`d-flex justify-content-center align-items-center ${darkMode?'bg-black text-white':null}`}
                         style={{height: 'calc(100vh - 24px)'}}>
                        <div style={{fontSize: 24, display: 'flex', alignItems: 'center'}}>
                            <div>{language==='EN'?'Select any todo to view detail':'Chọn một công việc để xem chi tiết'}</div>
                            <AntCloudOutlined style={{marginLeft: 10, fontSize: 36}}/>
                        </div>
                    </div>
                }
            </div>
        </div>
    );
};

export default TodoContent;
