import React, {useContext, useMemo, useState} from 'react';
import {AppContext} from "../../../context/AppProvider";
import {Avatar, Input, Modal, message, Button} from "antd";
import {doc} from "firebase/firestore";
import {db} from "../../../firebase/config";
import {addDocument, fetchUserList, getDocument, updateDocument} from "../../../firebase/service";
import {AuthContext} from "../../../context/AuthProvider";
import {useDebounce} from "../../../hooks/useDebounce";

const FindFriend = () => {

    const {findFriend,setFindFriend,friendUids,userDetail,language} = useContext(AppContext)
    const {user} = useContext(AuthContext)

    const [search,setSearch] = useState('')
    const [users,setUsers] = useState([])

    const debounced = useDebounce(search,500)

    function handleOk(){
        setFindFriend(false)
        setSearch('')
    }
    function handleCancel(){
        setFindFriend(false)
        setSearch('')
    }

    async function handleAddFriend(frUid,docId) {

        // get friend detail
        const frRef = doc(db,'users',docId)
        const friendDetail = await getDocument(frRef)

        // new data for you
        const docRef = doc(db,'users',userDetail.id)
        const data = {
            friends: [...friendUids,frUid]
        }

        // new data for your friend
        const frData = {
            friends: [...friendDetail?.friends,user.uid]
        }

        // generate new personal room
        const newRoom = {
            type: 'personal',
            members: [user.uid,frUid]
        }

        // update your friend data
        await updateDocument(frRef,frData)

        // update your data
        updateDocument(docRef,data).then(message.info(language==='EN'?'Add friend success':'Thêm bạn thành công'))

        // create new personal room
        await addDocument('rooms',newRoom)

    }

    // filter friend list
    useMemo(() => {

        if (!debounced.trim()){
            setUsers([])
            return;
        }
        // get list users from api
        fetchUserList(debounced,friendUids).then(data => {
            const filter = data.filter(d => d.value !== user.uid)
            setUsers(filter)
        })

    },[debounced,friendUids])

    return (
        <Modal
            open={findFriend}
            title={language==='EN'?'Find friends':'Tìm kiếm bạn bè'}
            onOk={handleOk}
            onCancel={handleCancel}
            cancelText={language==='EN'?'Cancel':'Trở về'}
            okText={language==='EN'?'Ok':'Xong'}
        >
            <Input
                value={search}
                placeholder={language==='EN'?'Enter friend name':'Tên bạn cần tìm kiếm'}
                onChange={(e) => setSearch(e.target.value)}
            >
            </Input>
            <div className='w-100 overflow-scroll' style={{maxHeight: 500}}>
                {users && users?.map(user => (
                    <div className='d-flex align-items-center py-2 px-3' key={user.value}>
                        <Avatar src={user.photoURL} size='large' style={{border: '2px solid #1677FF'}}>
                            {user.photoURL ? '' : user.displayName[0].toUpperCase()}
                        </Avatar>
                        <div className='ps-3'>
                            {user.label}
                        </div>
                        <div style={{flex: 1}} className='text-end'>
                            <Button type='primary' ghost
                                    onClick={() => handleAddFriend(user.value,user.id)}>
                                {language==='EN'?'Add friend':'Thêm bạn'}
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

        </Modal>
    );
};

export default FindFriend;
