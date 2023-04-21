import React, {useContext} from 'react';
import {AuthContext} from "../../../context/AuthProvider";
import {Form, Input, Modal} from "antd";
import {addDocument} from "../../../firebase/service";
import {AppContext} from "../../../context/AppProvider";

const AddRoom = () => {

    const {addRoom,setAddRoom,language} = useContext(AppContext)
    const {user: {uid}} = useContext(AuthContext)

    const [form] = Form.useForm()

    async function handleOk(){
        if (form.getFieldValue('name') === '')
            return
        // Add data to firebase
        await addDocument('rooms',{...form.getFieldsValue(),members: [uid]})
        // Reset form
        form.resetFields()
        // Close modal
        setAddRoom(false)
    }
    function handleCancel(){
        form.resetFields()
        setAddRoom(false)
    }

    return (
        <div>
            <Modal
                title={language==='EN'?'Create room':'Tạo phòng'}
                open={addRoom}
                onOk={handleOk}
                onCancel={handleCancel}
                okText={language==='EN'?'Create':'Tạo mới'}
                cancelText={language==='EN'?'Cancel':'Hủy'}
            >
                <Form form={form} layout='vertical'>
                    <Form.Item label='Room name' name='name'>
                        <Input placeholder={language==='EN'?'Enter room name':'Nhập tên phòng'} />
                    </Form.Item>
                    <Form.Item label='Room description' name='description'>
                        <Input.TextArea placeholder={language==='EN'?'Enter room description':'Nhập mô tả phòng'} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};


export default AddRoom;