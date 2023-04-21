import React, {useContext} from 'react';
import {Input, Tooltip} from "antd";
import {AppContext} from "../../context/AppProvider";
import {UserAddOutlined} from "@ant-design/icons";

const FindFriend = ({onFilter}) => {

    const {language,darkMode,setFindFriend} = useContext(AppContext)

    return (
        <div className={`d-flex align-items-center p-3 border-bottom ${darkMode?'dark-mode-text dark-mode-bg':null}`} style={{height: 70}}>
            <Input
                placeholder={language==='EN'?'Enter friend name':'Tên bạn bè cần tìm kiếm'}
                onChange={(e) => onFilter(e.target.value)}
            >
            </Input>
            <Tooltip
                title={language==='EN'?'Add new friend':'Tìm bạn mới'}
            >
                <UserAddOutlined style={{fontSize: 24, marginLeft: 10}}
                    onClick={() => setFindFriend(pre => !pre)}
                />
            </Tooltip>
        </div>
    );
};

export default FindFriend;
