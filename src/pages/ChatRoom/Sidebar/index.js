import React, {useContext} from 'react';
import RoomList from "./RoomList";
import {AuthContext} from "../../../context/AuthProvider";
import SidebarMenu from "../../../components/SidebarMenu";

const SideBar = () => {

    const {user: {displayName}} = useContext(AuthContext)
    return (
        <div className='row p-0 m-0 h-100'>
            <div className='col-lg-2 col-3 p-0 m-0' style={{backgroundColor: '#1677FF'}}>
                <SidebarMenu/>
            </div>
            <div className='col-lg-10 col-9 p-0 m0' style={{borderRight: '1px solid #ccc'}}>
                <div style={{backgroundColor: '#ccc',textAlign: 'center', height: 24}}>{displayName}</div>
                <RoomList/>
            </div>
        </div>
    );
};

export default SideBar;