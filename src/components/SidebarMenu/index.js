import React, {useContext, useState} from 'react';
import {Avatar, Popover, Switch} from "antd";
import {AuthContext} from "../../context/AuthProvider";
import {auth} from "../../firebase/config";
import {
    AccountBookOutlined, LogoutOutlined,
    MessageOutlined,
    ScheduleOutlined,
    SettingOutlined
} from "@ant-design/icons";
import {NavLink} from "react-router-dom";
import './style.css';
import {AppContext} from "../../context/AppProvider";

const SidebarMenu = () => {

    const {user} = useContext(AuthContext)
    const {language,setLanguage,darkMode,setDarkMode} = useContext(AppContext)
    const [open,setOpen] = useState(false)
    const [setting,setSetting] = useState(false)

    function handleOpenChange(){
        setOpen(prevState => !prevState)
    }
    function handleOpenSetting() {
        setSetting(prevState => !prevState)
    }
    function handleChangeDarkMode(){
        setDarkMode(pre => !pre)
    }
    function handleChangeLanguage(){
        setLanguage(language === 'EN' ? 'VI' : 'EN')
    }

    return (
        <div style={{height: '100vh'}} className='d-flex flex-column'>
            <div className='border-bottom border-white border-2 py-3 w-100 d-flex justify-content-center align-items-center'>
                <Popover
                    content={
                        <div className='py-2' style={{borderRadius: 10}}>
                            <div>{user?.displayName}</div>
                            <div>{user?.email}</div>
                            <hr/>
                            <div className='d-flex justify-content-center align-items-center' style={{cursor: 'pointer'}} onClick={() => auth.signOut()}>
                                <LogoutOutlined style={{paddingRight: 10, fontSize: 20}} className='text-danger'/>
                                {language==='EN'?'Logout':'Đăng xuất'}
                            </div>
                        </div>
                    }
                    title={language==='EN'?'User information':'Thông tin người dùng'}
                    trigger="click"
                    placement='rightTop'
                    open={open}
                    onOpenChange={handleOpenChange}
                >
                    <Avatar size="large" src={user?.photoURL}>
                        {user?.photoURL ? '' : user?.displayName.charAt(0).toUpperCase()}
                    </Avatar>
                </Popover>
            </div>
            <div className={`sidebar-menu row m-0 p-0 pt-3 pb-3 overflow-auto`} style={{flex: 1}}>
                <div className='d-flex flex-column align-items-center'>
                    <NavLink to={'/'}
                         className={({ isActive, isPending }) =>
                             isActive ? (darkMode ? "text-white" : "text-black") : (darkMode ? 'text-black' : 'text-white')
                         }
                    >
                        <MessageOutlined className='my-2'/>
                    </NavLink>
                    <NavLink to={'/directory'}
                             className={({ isActive, isPending }) =>
                                 isActive ? (darkMode ? "text-white" : "text-black") : (darkMode ? 'text-black' : 'text-white')
                             }
                    >
                        <AccountBookOutlined className='my-2'/>
                    </NavLink>
                    <NavLink to={'/todo'}
                             className={({ isActive, isPending }) =>
                                 isActive ? (darkMode ? "text-white" : "text-black") : (darkMode ? 'text-black' : 'text-white')
                             }
                    >
                        <ScheduleOutlined className='my-2'/>
                    </NavLink>
                </div>
                <div className={`d-flex flex-column justify-content-end align-items-center ${darkMode ? 'text-black' : 'text-white'} `}>
                    <Popover
                        trigger='click'
                        placement='right'
                        open={setting}
                        onOpenChange={handleOpenSetting}
                        content={<div className='d-flex flex-column'>
                            <label className='mb-2'>
                                {language==='EN'?'Dark mode: ':'Chế độ tối: '}<Switch onChange={handleChangeDarkMode} defaultChecked={false}/>
                            </label>
                            <label>
                                {language==='EN'?'Language: ':'Ngôn ngữ: '}<Switch checkedChildren="EN" unCheckedChildren="VI" defaultChecked
                                                  onChange={handleChangeLanguage}
                            />
                            </label>
                            <hr/>
                            <div className='d-flex justify-content-center align-items-center' style={{cursor: 'pointer'}} onClick={() => auth.signOut()}>
                                <LogoutOutlined style={{paddingRight: 10, fontSize: 20}} className='text-danger'/>
                                {language==='EN'?'Logout':'Đăng xuất'}
                            </div>
                        </div>}
                    >
                        <SettingOutlined className='my-2'/>
                    </Popover>
                </div>
            </div>
        </div>
    );
};

export default SidebarMenu;