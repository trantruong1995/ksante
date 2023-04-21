import React, {useContext, useMemo, useState} from 'react';
import {Avatar, Form, Modal, Select, Spin} from "antd";
import {AppContext} from "../../../context/AppProvider";
import {doc} from "firebase/firestore";
import {db} from "../../../firebase/config";
import {fetchUserList, updateDocument} from "../../../firebase/service";
import {useDebounce} from "../../../hooks/useDebounce";

const InviteMembers = () => {

    const {inviteMembers,setInviteMembers,selectedRoomId,selectedRoom,language} = useContext(AppContext)

    const [form] = Form.useForm()
    const [options,setOption] = useState([])
    const [value,setValue] = useState([])
    const [search,setSearch] = useState('')
    const [fetching,setFetching] = useState(false)

    const debounced = useDebounce(search,500)

    function handleOnSearch(e) {
        setSearch(e)
        setFetching(true)
    }

    async function handleOk(){

        // update room members
        const roomRef = doc(db,'rooms',selectedRoomId)
        await updateDocument(roomRef,{members: [...selectedRoom?.members, ...value]})

        // reset form
        form.resetFields()
        setValue([])
        setOption([])
        setSearch('')
        setInviteMembers(false)
    }

    function handleCancel(){
        form.resetFields()
        setValue([])
        setOption([])
        setSearch('')
        setInviteMembers(false)
    }

    useMemo(() => {

        if (!debounced.trim()){
            setOption([])
            setFetching(false)
            return;
        }

        // get list users from api
        fetchUserList(debounced,selectedRoom?.members).then(data => {
            setOption(data)
            setFetching(false)
        })

        setFetching(false)
    },[debounced])

    const Options = options.map(opt => (
        <Select.Option key={opt.value} value={opt.value} title={opt.label}>
            <Avatar size='small' src={opt.photoURL}>
                {opt.photoURL ? '' : opt.label?.charAt(0)?.toUpperCase()}
            </Avatar>
            {` ${opt.label}`}
        </Select.Option>
    ))

    return (
        <div>
            <Modal
                title={language==='EN'?'Invite members':'Mời thêm thành viên'}
                open={inviteMembers}
                onOk={handleOk}
                onCancel={handleCancel}
                okText={language==='EN'?'Invite':'Mời'}
                cancelText={language==='EN'?'Cancel':'Hủy'}
            >
                <Form
                    form={form}
                    layout='vertical'
                >
                    <Select
                        style={{width: '100%'}}
                        mode='multiple'
                        filterOption={false}
                        allowClear
                        value={value}
                        maxLength={5}
                        placeholder={language==='EN'?'Enter member name':'Nhập tên thành viên'}
                        onChange={(newValue) => setValue(newValue)}
                        onSearch={handleOnSearch}
                        notFoundContent={fetching ? <div style={{width: '100%', textAlign: 'center'}}><Spin size='small'/></div> : null}
                    >
                        {
                            Options
                        }
                    </Select>
                </Form>
            </Modal>
        </div>
    );
};

export default InviteMembers;
