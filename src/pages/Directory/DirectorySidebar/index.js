import React, {useContext} from 'react';
import SidebarMenu from "../../../components/SidebarMenu";
import {AuthContext} from "../../../context/AuthProvider";
import {TeamOutlined, UserOutlined} from "@ant-design/icons";
import {AppContext} from "../../../context/AppProvider";

const DirectorySidebar = ({setMode}) => {

    const {user: {displayName}} = useContext(AuthContext)
    const {language,rooms,friendUids,darkMode} = useContext(AppContext)
    const publicRooms = rooms.filter(room => room.type !== 'personal')

    return (
        <div className='row p-0 m-0 h-100'>
            <div className='col-lg-2 col-3 p-0 m-0' style={{backgroundColor: '#1677FF'}}>
                <SidebarMenu/>
            </div>
            <div className='col-lg-10 col-9 p-0 m0' style={{borderRight: '1px solid #ccc'}}>
                <div style={{backgroundColor: '#ccc',textAlign: 'center', height: 24}} className='text-truncate'>{displayName}</div>
                <div className={`${darkMode?'dark-mode-bg dark-mode-text':null}`} style={{height: 'calc(100vh - 24px)'}}>
                    <div className='p-3 d-flex align-items-center justify-content-center text-truncate' style={{fontSize: 20}} onClick={() => setMode('Friends')}>
                        <UserOutlined style={{marginRight: 10}}/>
                        <div className='d-none d-sm-block me-1'>
                            {language==='EN'?'All friends':'Bạn bè'}
                        </div>
                        {`(${friendUids?.length})`}
                    </div>
                    <div className='p-3 d-flex align-items-center justify-content-center text-truncate' style={{fontSize: 20}} onClick={() => setMode('Groups')}>
                        <TeamOutlined style={{marginRight: 10}}/>
                        <div className='d-none d-sm-block me-1'>
                            {language==='EN'?'All groups ':'Nhóm'}
                        </div>
                        {`(${publicRooms?.length})`}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DirectorySidebar;
