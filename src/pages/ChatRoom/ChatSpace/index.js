import React, {useCallback, useContext, useEffect, useMemo, useRef, useState} from 'react';
import {AppContext} from "../../../context/AppProvider";
import {Avatar, Button, Image, Popover} from "antd";
import {
    AntCloudOutlined, CloseOutlined, PictureOutlined,
    SettingOutlined,
    UserAddOutlined
} from "@ant-design/icons";
import InputEmoji from "react-input-emoji";

import RoomInfo from "./RoomInfo";
import {useFireStore} from "../../../hooks/useFireStore";
import Message from "./Message";
import {AuthContext} from "../../../context/AuthProvider";
import {formatDate} from "../../../util/converter";
import {addDocument, uploadFile} from "../../../firebase/service";

const ChatSpace = () => {

    const {selectedRoom,members,setInviteMembers,darkMode,language,friends} = useContext(AppContext)
    const {user: {uid,displayName,photoURL}} = useContext(AuthContext)
    const inputRef = useRef()

    const [roomInfo,setRoomInfo] = useState(false)
    const [message,setMessage] = useState('')
    const [image,setImage] = useState(null)
    const [imgURL,setImgURL] = useState(null)
    const [sending,setSending] = useState(false)

    // find friend in private room
    const friend = selectedRoom?.type === 'personal' && friends.find(friend => selectedRoom.members.includes(friend.uid))

    // handle send message
    async function handleSendMessage(){

        setSending(true)

        if (message === '' && image === null){
            return
        }

        let newMessage = {
            content: message,
            roomId: selectedRoom.id,
            uid,
            displayName,
            photoURL,
        }

        if (image){
            const imgURL = await uploadFile(image)
            newMessage = {
                content: message,
                roomId: selectedRoom.id,
                uid,
                displayName,
                photoURL,
                imgURL
            }
        }
        // send new message to firebase
        await addDocument('messages',newMessage)
        setImage(null)
        setMessage('')
        setSending(false)
    }

    // listen new message from firebase
    const messageCondition = useMemo(() => {
        return {
            fieldName: 'roomId',
            operator: '==',
            compareValue: selectedRoom?.id
        }
    },[selectedRoom?.id])
    const messages = useFireStore('messages',messageCondition)

    // handle event when input change
    function handleChangeInput(e){
        setMessage(e)
    }

    // handle event when image change
    function handleChangeImage(e){
        setImgURL(URL.createObjectURL(e.target.files[0]))
        setImage(e.target.files[0])
    }

    // remove image url when image is changed
    useEffect(() => {
        return () => {
            imgURL && URL.revokeObjectURL(imgURL)
        }
    },[image,imgURL])

    // handle event when room info popover is trigger
    const handleOpenInfoPopover = useCallback(() => {
        setRoomInfo(prevState => !prevState)
    },[])

    return (
        <div className='row p-0 m-0 h-100'>
            <div className='col p-0 m-0'>
                <div style={{backgroundColor: '#ccc',textAlign: 'center', height: 24}}>Simple</div>
                {selectedRoom && (selectedRoom.type !== 'personal' ?
                    (
                        <div>
                            {/*Room info*/}
                            <div className={`d-flex justify-content-between align-items-center px-3 ${darkMode ? 'dark-mode-text dark-mode-bg' : null}`} style={{borderBottom: '1px solid #ccc', height: 70}}>
                                <div>
                                    <div className='d-flex align-items-center'>
                                        <div className='me-3 text-truncate' style={{maxWidth: 180, fontSize: 20, fontWeight: 'bold'}}>
                                            {selectedRoom.name}
                                        </div>
                                        <Popover
                                            placement='bottomLeft'
                                            title={language==='EN'?'Room information':'Thông tin phòng'}
                                            content={<RoomInfo onClose={handleOpenInfoPopover} ref={inputRef}/>}
                                            open={roomInfo}
                                        >
                                            <SettingOutlined onClick={() => {
                                                setRoomInfo(prevState => !prevState)
                                                inputRef?.current?.reset()
                                            }}/>
                                        </Popover>
                                    </div>
                                    <div>{selectedRoom.description}</div>
                                </div>
                                <div className='d-flex align-items-center'>
                                    <UserAddOutlined style={{fontSize: 20, paddingRight: 10}}
                                                     onClick={() => setInviteMembers(true)}
                                    />
                                    <Avatar.Group maxCount={3}>
                                        {members?.map(member => (
                                            <Avatar key={member.uid} src={member.photoURL}>
                                                {member.photoURL? '' : member.displayName.charAt(0).toUpperCase()}
                                            </Avatar>
                                        ))}
                                    </Avatar.Group>
                                </div>
                            </div>

                            {/*Message*/}
                            <div style={{height: 'calc(100vh - 164px)', overflow: 'auto'}} className={`px-3 ${darkMode ? 'dark-mode-bg' : null}`}>
                                {messages && messages.map(message => (
                                    <Message
                                        key={message.id}
                                        myMessage={message.uid === uid}
                                        displayName={message.displayName}
                                        photoUrl={message.photoURL}
                                        text={message.content === '' ? null : message.content}
                                        creatAt={formatDate(message.createAt?.seconds)}
                                        imgURL={message?.imgURL || null}
                                    />
                                ))}
                            </div>
                            {/*Text field*/}
                            <div className='d-flex align-items-center px-3' style={{height: 70,backgroundColor: darkMode ? '#ccc' : null}}>
                                <InputEmoji
                                    value={message}
                                    placeholder={language==='EN'?'Enter your message':'Nhập tin nhắn'}
                                    onChange={handleChangeInput}
                                    onEnter={handleSendMessage}
                                >
                                </InputEmoji>
                                {
                                    image && <div style={{height: 65,width:120, borderRadius: 5}}
                                                  className='d-flex position-relative align-items-center justify-content-center ms-1 ms-lg-3'>
                                        <Image
                                            style={{borderRadius: 10}}
                                            src={imgURL} alt='Image'
                                        />
                                        <CloseOutlined
                                            style={{color: 'black',fontSize: 14,fontWeight: "bold", position: 'absolute', top: 0, right: 0}}
                                            onClick={() => setImage(null)}
                                        />
                                    </div>
                                }
                                <div className='d-flex align-items-center'>
                                    <input
                                        type='file' id='file' style={{display: 'none'}}
                                        onChange={handleChangeImage}
                                    />
                                    <label htmlFor='file'>
                                        <PictureOutlined style={{fontSize: 24, fontWeight: 400, opacity: 0.6}}/>
                                    </label>
                                    <Button
                                        className='ms-3'
                                        onClick={handleSendMessage}
                                        disabled={message === '' && image === null}
                                        loading={sending}
                                    >
                                        {language==='EN'?'Send':'Gửi'}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ):(
                        <div>
                            {/*Room info*/}
                            <div className={`d-flex justify-content-between align-items-center px-3 ${darkMode ? 'dark-mode-text dark-mode-bg' : null}`} style={{borderBottom: '1px solid #ccc', height: 70}}>
                                <div className='d-flex align-items-center me-3 text-truncate' style={{maxWidth: 200, fontSize: 20, fontWeight: 'bold'}}>
                                    {friend.displayName}
                                </div>
                                <Avatar size={"large"} src={friend.photoURL}>
                                    {friend.photoURL?'':friend.displayName.charAt(0).toUpperCase()}
                                </Avatar>
                            </div>

                            {/*Message*/}
                            <div style={{height: 'calc(100vh - 164px)', overflow: 'auto'}} className={`px-3 ${darkMode ? 'dark-mode-bg' : null}`}>
                                {messages && messages.map(message => (
                                    <Message
                                        key={message.id}
                                        myMessage={message.uid === uid}
                                        displayName={message.displayName}
                                        photoUrl={message.photoURL}
                                        text={message.content === '' ? null : message.content}
                                        creatAt={formatDate(message.createAt?.seconds)}
                                        imgURL={message?.imgURL || null}
                                    />
                                ))}
                            </div>
                            {/*Text field*/}
                            <div className='d-flex align-items-center px-3' style={{height: 70,backgroundColor: darkMode ? '#ccc' : null}}>
                                <InputEmoji
                                    value={message}
                                    placeholder={language==='EN'?'Enter your message':'Nhập tin nhắn'}
                                    onChange={handleChangeInput}
                                    onEnter={handleSendMessage}
                                >
                                </InputEmoji>
                                {
                                    image && <div style={{height: 65,width:120, borderRadius: 5}}
                                                  className='d-flex position-relative align-items-center justify-content-center ms-1 ms-lg-3'>
                                        <Image
                                            style={{borderRadius: 10}}
                                            src={imgURL} alt='Image'
                                        />
                                        <CloseOutlined
                                            style={{color: 'black',fontSize: 14,fontWeight: "bold", position: 'absolute', top: 0, right: 0}}
                                            onClick={() => setImage(null)}
                                        />
                                    </div>
                                }
                                <div className='d-flex align-items-center'>
                                    <input
                                        type='file' id='file' style={{display: 'none'}}
                                        onChange={handleChangeImage}
                                    />
                                    <label htmlFor='file'>
                                        <PictureOutlined style={{fontSize: 24, fontWeight: 400, opacity: 0.6}}/>
                                    </label>
                                    <Button
                                        className='ms-3'
                                        onClick={handleSendMessage}
                                        disabled={message === '' && image === null}
                                        loading={sending}
                                    >
                                        {language==='EN'?'Send':'Gửi'}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))
                }
                {
                    !selectedRoom && <div className={`d-flex justify-content-center align-items-center ${darkMode?'bg-black text-white':null}`} style={{height: 'calc(100vh - 24px)'}}>
                        <div style={{fontSize: 24, display: 'flex', alignItems: 'center'}}>
                            <div>{language==='EN'?'Select any room to start conversation':'Chọn một phòng để bắt đầu trò chuyện'}</div>
                            <AntCloudOutlined style={{marginLeft: 10, fontSize: 36}}/>
                        </div>
                    </div>
                }
            </div>
        </div>
    );
};

export default ChatSpace;
