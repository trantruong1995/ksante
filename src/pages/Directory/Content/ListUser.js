import React, {useCallback, useContext, useState} from 'react';
import FindFriend from "../../../components/FindFriend";
import {AppContext} from "../../../context/AppProvider";
import {Avatar, Button, message, Popconfirm} from "antd";
import {doc} from "firebase/firestore";
import {db} from "../../../firebase/config";
import {deleteDocument, deleteRoomMessage, getDocument, updateDocument} from "../../../firebase/service";
import {useNavigate} from "react-router-dom";

const ListUser = () => {

    const {language,friends,userDetail,darkMode,rooms,setSelectedRoomId} = useContext(AppContext)
    const navigate = useNavigate()

    const [search,setSearch] = useState('')

    const temp = friends.filter(f => f.displayName.toLowerCase().includes(search.toLowerCase()))

    const handleFilter = useCallback((e) => {
        setSearch(e)
    },[])

    // navigate to personal room
    function handleChangeRoom(frUid){
        // find personal room
        const personalRoom = rooms.find(room => room.type === 'personal' && room.members.includes(frUid))
        // set selected room ID for App context
        setSelectedRoomId(personalRoom.id)
        // navigate to home
        navigate('/')
    }

    // handle unfriend
    async function handleRemoveFriend(frid, frUid) {
        // get your friend detail
        const frRef = doc(db, 'users', frid)
        const friendDetail = await getDocument(frRef)

        // new data for you
        const docRef = doc(db, 'users', userDetail.id)
        const newFr = userDetail.friends.filter(friend =>  friend !== frUid)
        const data = {
            friends: newFr
        }

        // new data for your friend
        const newFrFr = friendDetail.friends.filter(friend => friend !== userDetail.uid)
        const frData = {
            friends: newFrFr
        }

        // update your friend detail
        await updateDocument(frRef, frData)

        // update your data
        updateDocument(docRef, data).then(message.info(language === 'EN' ? 'Unfriend success' : 'Hủy kết bạn thành công'))

        // find and remove personal room
        const personalRoom = rooms.find(room => room.type === 'personal' && room.members.includes(frUid))
        const roomRef = doc(db,'rooms',personalRoom.id)
        // delete message
        await deleteRoomMessage(personalRoom.id)
        // delete room
        await deleteDocument(roomRef)
    }

    return (
        <div>
            <div style={{height: 'calc(100vh - 24px)',overflowY: "auto"}} className={`${darkMode?'dark-mode-bg dark-mode-text': null}`}>
                <div>
                    <FindFriend onFilter={handleFilter}/>
                </div>
                <div>
                    {temp.map(friend => (<div key={friend.id}>
                        <div className='d-flex align-items-center justify-content-between border-bottom py-3 px-3 px-lg-5'>
                            <div className='d-flex align-items-center'
                                 onClick={() => handleChangeRoom(friend.uid)}
                            >
                                <div className='me-3 me-lg-5'>
                                    <Avatar src={friend.photoURL}>
                                        {friend.photoURL ? '' : friend.displayName.charAt(0).toUpperCase()}
                                    </Avatar>
                                </div>
                                <div>
                                    {friend.displayName}
                                </div>
                            </div>
                            <div className='me-3'>
                                <Popconfirm title={language==='EN'?'Sure to unfriend':'Xác nhận hủy kết bạn'}
                                    onConfirm={() => handleRemoveFriend(friend.id,friend.uid)}
                                >
                                    <Button type='primary' ghost danger>{language==='EN'?'Unfriend':'Hủy kết bạn'}</Button>
                                </Popconfirm>
                            </div>
                        </div>
                    </div>))}
                </div>
            </div>
        </div>
    );
};

export default ListUser;
