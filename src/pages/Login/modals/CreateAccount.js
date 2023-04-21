import React, {useContext, useEffect, useState} from 'react';
import {Input, Modal} from "antd";
import {AppContext} from "../../../context/AppProvider";
import addAvatar from '../../../icon/addAvatar.png';
import {CloseOutlined} from "@ant-design/icons";

import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import {auth} from "../../../firebase/config";
import {addDocument, generateKeywords, uploadFile} from "../../../firebase/service";
import {useNavigate} from "react-router-dom";


const CreateAccount = () => {
    const navigate = useNavigate()
    const {createAccount,setCreateAccount,language} = useContext(AppContext)
    const [avatar,setAvatar] = useState(null)
    const [avatarURL,setAvatarURL] = useState(null)
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    const [displayName,setDisplayName] = useState('')
    const [formError,setFormError] = useState(false)
    const [loading,setLoading] = useState(false)
    const [signUpError,setSignUpError] = useState(false)

    function handlePreviewAvatar(e){
        setAvatar(e.target.files[0])
        setAvatarURL(URL.createObjectURL(e.target.files[0]))
    }
    useEffect(() => {
        return () => {
            avatarURL && URL.revokeObjectURL(avatarURL)
        }
    },[avatar, avatarURL])

    async function handleOk(){

        if (email === '' || password === '' || displayName === ''  || avatar === null){
            setFormError(true)
        }else {
            setFormError(false)
            try {
                setLoading(true)
                const res = await createUserWithEmailAndPassword(auth,email,password)
                const photoURL = await uploadFile(avatar)

                await updateProfile(res.user,{
                    displayName: displayName,
                    photoURL: photoURL
                })

                const newUser = {
                    displayName: displayName,
                    email: email,
                    photoURL: photoURL,
                    uid: res?.user?.uid,
                    providerId: res?.user?.providerId,
                    keywords: generateKeywords(displayName.toLowerCase())
                }
                await addDocument('users',newUser)

            }catch (e){
                setSignUpError(true)
                console.log(e)
            }
            setLoading(false)
            navigate('/')
        }

    }
    function handleCancel(){
        setAvatar(null)
        setAvatarURL(null)
        setEmail('')
        setPassword('')
        setDisplayName('')
        setFormError(false)
        setCreateAccount(false)
    }

    return (
        <div>
            <Modal
                title={language==='EN'?'Create new account':'Tạo mới tài khoản'}
                open={createAccount}
                onOk={handleOk}
                okText={language==='EN'?'Signup':'Đăng kí'}
                cancelText={language==='EN'?'Cancel':'Hủy'}
                onCancel={handleCancel}
                confirmLoading={loading}
            >
                {formError && <h4 className='text-danger text-center'>
                    {language==='EN'?'Some fields have error. Please check !!!':'Vui lòng kiểm tra lại thông tin'}
                </h4>}
                {signUpError && <h4 className='text-danger text-center'>
                    {language==='EN'?'Sign up fail. Please check again !!!':'Đăng kí thất bại, vui lòng thử lại sau'}
                </h4>}
                {avatar && <div style={{height: 100}} className='d-flex align-items-center justify-content-center'>
                    <div style={{width: 100,height: 100, overflow: 'hidden', position: 'relative'}}>
                        <CloseOutlined style={{position: "absolute", top: 0, right: 0, color: 'black', fontSize: 20}}
                            onClick={() => {
                                setAvatarURL(null)
                                setAvatar(null)
                            }}
                        />
                        <img style={{width: '100%',height: '100%',borderRadius: '50%'}} src={avatarURL} alt=''/>
                    </div>
                </div>}
                <label htmlFor='email' className='ps-1 pb-1'>{language==='EN'?'Your email':'Email của bạn'}</label>
                <Input
                    id='email'
                    className='mb-3'
                    type='email'
                    value={email}
                    placeholder={language==='EN'?'Enter your email':'Nhập email của bạn'}
                    onChange={e => setEmail(e.target.value)}
                />
                <label htmlFor='displayName' className='ps-1 pb-1'>{language==='EN'?'Your full name':'Tên của bạn'}</label>
                <Input
                    id='displayName'
                    className='mb-3'
                    value={displayName}
                    placeholder={language==='EN'?'Enter your name':'Nhập tên của bạn'}
                    onChange={e => setDisplayName(e.target.value)}
                />
                <label htmlFor='password' className='ps-1 pb-1'>{language==='EN'?'Password':'Mật khẩu'}</label>
                <Input
                    id='password'
                    className='mb-3'
                    type='password'
                    value={password}
                    placeholder={language==='EN'?'Enter password':'Nhập mật khẩu'}
                    onChange={e => setPassword(e.target.value)}
                />
                <input
                    id='file'
                    type='file'
                    hidden
                    onChange={handlePreviewAvatar}
                />
                <label htmlFor='file'>
                    <img src={addAvatar} alt='' style={{width: 50, height: 50}}/>
                </label>

            </Modal>
        </div>
    );
};

export default CreateAccount;