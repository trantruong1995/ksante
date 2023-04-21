import React, {useContext, useState} from 'react';
import {Avatar, Form, Input, Modal, Select, Spin} from "antd";
import {AppContext} from "../../../context/AppProvider";
import {AuthContext} from "../../../context/AuthProvider";
import {addDocument} from "../../../firebase/service";

const AddTodo = () => {

    const {user} = useContext(AuthContext)
    const {addTodo,setAddTodo,language,friends} = useContext(AppContext)
    const [error,setError] = useState(false)
    const [loading,setLoading] = useState(false)

    const [form] = Form.useForm()
    const modalData = {
        error: {EN: 'Any field has error please check', VI: 'Tên và mô tả không được để trống'},
        title: {EN: 'Create new todo', VI: 'Tạo nhắc nhở mới'},
        ok: {EN: 'Create', VI: 'Tạo'},
        cancel: {EN: 'Cancel', VI: 'Hủy'},
        nameLb: {EN: 'Todo name', VI: 'Tên công việc'},
        namePl: {EN: 'Enter todo name', VI: 'Nhập tên công việc'},
        descriptionLb: {EN: 'Todo description', VI: 'Mô tả công việc'},
        descriptionPl: {EN: 'Enter Todo description', VI: 'Nhập mô tả công việc'},
        deadlineLb: {EN: 'Dead line', VI: 'Hạn hoàn thành'},
        assignTo: {EN: 'Assign to', VI: 'Phân công cho'}
    }

    // generate list member to assign
    const options = friends.map(friend => ({
        value: friend.uid,
        label: friend.displayName,
        photoURL: friend.photoURL,
    }))
    const Options = options.map(opt => (
        <Select.Option key={opt.value} value={opt.value} title={opt.label}>
            <Avatar size='small' src={opt.photoURL}>
                {opt.photoURL ? '' : opt.label?.charAt(0)?.toUpperCase()}
            </Avatar>
            {` ${opt.label}`}
        </Select.Option>
    ))

    // handle add new todo
    async function handleAddTodo(){
        // set animation
        setError(false)
        setLoading(true)

        // valid form info
        const name = form.getFieldValue('name')
        const description = form.getFieldValue('description')
        const deadline = form.getFieldValue('deadline')
        let assignTo = form.getFieldValue('assignTo')
        assignTo = assignTo === undefined ? [] : assignTo

        if (name === undefined || name === '' || description === undefined || description === '' || deadline === undefined){
            setError(true)
            setLoading(false)
            return
        }

        // add new doc to firebase
        await addDocument('todos',{
            from: user.uid,
            status: 'create',
            name,description,deadline,assignTo
        })

        // close animation, reset form value, close modal
        setLoading(false)
        form.resetFields()
        setAddTodo(false)
    }

    return (
        <Modal
            open={addTodo}
            title={language==='EN' ? modalData.title.EN : modalData.title.VI}
            okText={language==='EN' ? modalData.ok.EN : modalData.ok.VI}
            cancelText={language==='EN' ? modalData.cancel.EN : modalData.cancel.VI}
            onOk={handleAddTodo}
            onCancel={() => setAddTodo(false)}
        >
            {/*animation and form error notification*/}
            {error && <p className='text-danger text-center'>{language==='EN'?modalData.error.EN:modalData.error.VI}</p>}
            {loading && <div className='d-flex align-items-center justify-content-center'><Spin size={"large"}></Spin></div>}

            {/*Form*/}
            <Form form={form} layout='vertical'>
                <Form.Item label={language==='EN'?modalData.nameLb.EN:modalData.nameLb.VI} name='name'>
                    <Input placeholder={language==='EN'?modalData.namePl.EN:modalData.namePl.VI} />
                </Form.Item>
                <Form.Item label={language==='EN'?modalData.descriptionLb.EN:modalData.descriptionLb.VI} name='description'>
                    <Input.TextArea placeholder={language==='EN'?modalData.descriptionPl.EN:modalData.descriptionPl.VI} />
                </Form.Item>
                <Form.Item label={language==='EN'?modalData.deadlineLb.EN:modalData.deadlineLb.VI} name='deadline'>
                    <Input type='date'></Input>
                </Form.Item>
                <Form.Item label={language==='EN'?modalData.assignTo.EN:modalData.assignTo.VI} name='assignTo'>
                    <Select
                        showSearch
                        mode='multiple'
                        allowClear
                        filterOption={(input, option) =>
                            (option?.title ?? '').toLowerCase().includes(input.toLowerCase())
                        }
                    >
                        <Select.Option value={user.uid}>
                            <div className='text-success'>Me</div>
                        </Select.Option>
                        {Options}
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default AddTodo;
