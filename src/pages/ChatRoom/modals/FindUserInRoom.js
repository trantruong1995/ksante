import React, {useContext, useMemo, useState} from 'react';
import {AppContext} from "../../../context/AppProvider";
import {Avatar, Input, Modal, Popconfirm,message} from "antd";
import {CloseOutlined} from "@ant-design/icons";
import {doc} from "firebase/firestore";
import {db} from "../../../firebase/config";
import {deleteDocument, deleteRoomMessage, updateDocument} from "../../../firebase/service";
import {AuthContext} from "../../../context/AuthProvider";

const FindUserInRoom = () => {

    const {findUserInRoom,setFindUserInRoom,members,selectedRoomId,selectedRoom,language} = useContext(AppContext)
    const {user: {uid}} = useContext(AuthContext)

    const [search,setSearch] = useState('')

    const removeMessage = {EN:'Are you sure to remove this member?',VI:'Mời người này ra khỏi phòng?'}
    const description = {EN:'That is you, sure to quit room?',VI:'Đó là bạn, bạn vẫn muốn thoát phòng chứ?'}
    const description2 = {EN:'This member will no longer in your rom.',VI:'Thành viên này sẽ không còn trong phòng nữa.'}
    const description3 = {EN: 'This room will be delete too.',VI:'Phòng này cũng sẽ bị xóa theo.'}

    function handleOk(){
        setFindUserInRoom(false)
    }
    function handleCancel(){
        setFindUserInRoom(false)
    }

    function handleRemoveUser(memberUid) {
        // update room members
        const docRef = doc(db,'rooms',selectedRoomId)

        const newMember = selectedRoom.members.filter(member => member !== memberUid)

        if (selectedRoom?.members.length === 1){
            deleteRoomMessage(selectedRoomId).then(() => deleteDocument(docRef))
        }else {
            updateDocument(docRef,{
                members: [...newMember]
            }).then(message.info(language==='EN'?'Member has been kicked':'Thành viên đã bị mời ra khỏi phòng'))
        }
    }

    const listMember = useMemo(() => {
        return search === '' ? members : members?.filter(member => member.displayName.toLowerCase().includes(search.toLowerCase()))
    },[search,members])

    return (
        <Modal
            open={findUserInRoom}
            title={language==='EN'?'Find member in room':'Tìm thành  viên trong phòng'}
            onOk={handleOk}
            onCancel={handleCancel}
            cancelText={language==='EN'?'Cancel':'Trở về'}
            okText={language==='EN'?'Ok':'Xong'}
        >
            <Input
                value={search}
                placeholder={language==='EN'?'Enter member name':'Tên thành viên cần tìm kiếm'}
                onChange={(e) => setSearch(e.target.value)}
            >
            </Input>
            <div className='w-100 overflow-scroll' style={{maxHeight: 300}}>
                {listMember && listMember.map(member => (
                    <div key={member.uid} className='p-2 d-flex justify-content-between align-items-center'>
                        {
                            member.uid === uid ? (
                                <div className='d-flex align-items-center'>
                                    <Avatar src={member.photoURL} size='large' style={{border: '2px solid #1677FF'}}>
                                        {member.photoURL ? '' : member.displayName[0].toUpperCase()}
                                    </Avatar>
                                    <div className='ps-3' style={{color: '#1677FF'}}>
                                        {member.displayName} (You)
                                    </div>
                                </div>
                            ) : (
                                <div className='d-flex align-items-center'>
                                    <Avatar src={member.photoURL} size='large'>
                                        {member.photoURL ? '' : member.displayName.charAt(0).toUpperCase()}
                                    </Avatar>
                                    <div className='ps-3'>
                                        {member.displayName}
                                    </div>
                                </div>
                            )
                        }
                        <Popconfirm
                            title={language==='EN'?removeMessage.EN:removeMessage.VI}
                            description={selectedRoom?.members.length === 1 ?
                                (language==='EN'?description3.EN:description3.VI) :
                                (member.uid === uid ? (language==='EN'?description.EN:description.VI) : (language==='EN'?description2.EN:description2.VI))}
                            onConfirm={() => handleRemoveUser(member.uid)}
                        >
                            <CloseOutlined/>
                        </Popconfirm>
                    </div>
                ))}
            </div>

        </Modal>
    );
};

export default FindUserInRoom;
