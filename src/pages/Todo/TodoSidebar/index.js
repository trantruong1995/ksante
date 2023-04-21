import React, {useContext, useState} from 'react';
import SidebarMenu from "../../../components/SidebarMenu";
import {AuthContext} from "../../../context/AuthProvider";
import {AppContext} from "../../../context/AppProvider";
import {Input} from "antd";
import {
    CheckOutlined,
    FileAddOutlined,
    ReconciliationOutlined,
    SearchOutlined,
    TeamOutlined,
    UserOutlined
} from "@ant-design/icons";
import {formatDate} from "../../../util/converter";

const TodoSidebar = () => {

    const {user} = useContext(AuthContext)
    const {darkMode,todos,assigneds,language,setAddTodo,setTodoId} = useContext(AppContext)

    // filter duplicate item to get all todos
    const all = [...todos,...assigneds].filter((thing, index, self) =>
            index === self.findIndex((t) => JSON.stringify(t) === JSON.stringify(thing))
    );

    // state for search and filter
    const [search,setSearch] = useState('')
    const [tab,setTab] = useState('all')

    // filter by tab
    const tabFilters = tab === 'all' ? all : (tab === 'mine' ? todos : assigneds)

    // filter by search
    const result = search === '' ? tabFilters
        : tabFilters.filter(tabFilter => tabFilter.name.toLowerCase().includes(search.toLowerCase()))

    // handle view todo detail
    function handleViewTodo(todoId){
        setTodoId(todoId)
    }

    return (
        <div className='row p-0 m-0 h-100'>
            {/*Sidebar menu*/}
            <div className='col-lg-2 col-3 p-0 m-0' style={{backgroundColor: '#1677FF'}}>
                <SidebarMenu/>
            </div>
            {/*Sidebar*/}
            <div className='col-lg-10 col-9 p-0 m0' style={{borderRight: '1px solid #ccc'}}>
                <div style={{backgroundColor: '#ccc',textAlign: 'center', height: 24}} className='text-truncate'>
                    {user?.displayName}
                </div>

                {/*Todo content*/}
                <div className={`${darkMode?'dark-mode-bg dark-mode-text':null}`} style={{height: 'calc(100vh - 24px)'}}>

                    {/*Search todo*/}
                    <div style={{padding: 10}}>
                        <Input
                            size={"large"}
                            placeholder={language==='EN'?'Todo name':'Tên công việc'}
                            prefix={<SearchOutlined/>}
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>

                    {/*Todo list*/}
                    <div style={{textAlign: 'center', backgroundColor: `${darkMode?'#000':'#ccc'}`, borderTopLeftRadius: 10,borderTopRightRadius: 10}}>

                        {/*Add new todo*/}
                        <div className='d-flex align-items-center justify-content-center py-2'
                             onClick={() => setAddTodo(pre => !pre)}
                        >
                            <div className='me-2'>{language==='EN'?'New todo':'Tạo mới'}</div>
                            <FileAddOutlined/>
                        </div>

                        {/*Todo tab*/}
                        <div className='row p-0 m-0 ' style={{fontSize: 14}}>
                            <div className={`col p-2 m-0 ${tab === 'all' ? ('bg-white text-black')
                                :(darkMode?'dark-mode-bg dark-mode-text' : 'text-black bg-gray')}`}
                                 style={{borderTopRightRadius: 10, borderTopLeftRadius: 10,fontSize: 16}}
                                 onClick={() => setTab('all')}
                            >
                                <ReconciliationOutlined />
                            </div>
                            <div className={`col p-2 m-0 ${tab === 'mine' ? ('bg-white text-black')
                                :(darkMode?'dark-mode-bg dark-mode-text':'text-black bg-gray')}`}
                                 style={{borderTopRightRadius: 10, borderTopLeftRadius: 10,fontSize: 16}}
                                 onClick={() => setTab('mine')}
                            >
                                <UserOutlined/>
                            </div>
                            <div className={`col p-2 m-0 ${tab === 'assigned' ? ('bg-white text-black')
                                :(darkMode?'dark-mode-bg dark-mode-text':'text-black bg-gray')}`}
                                 style={{borderTopRightRadius: 10, borderTopLeftRadius: 10,fontSize: 16}}
                                 onClick={() => setTab('assigned')}
                            ><TeamOutlined/>
                            </div>
                        </div>

                        {/*Todo items*/}
                        <div className={`p-2 text-start overflow-auto ${darkMode?'dark-mode-text dark-mode-bg':'bg-white'}`}
                             style={{height: 'calc(100vh - 24px - 60px - 40px - 37px)'}}>
                            {result && result.map(todo => (
                                <div className='mt-2 border-bottom' key={todo.id}
                                    onClick={() => handleViewTodo(todo.id)}
                                >
                                    <div className='d-flex justify-content-between align-items-center'>
                                        <div className={`fw-bold text-truncate d-flex align-items-center
                                            ${todo?.status === 'done'?'text-success':null}
                                            ${todo?.status === 'process'?'text-primary':null}
                                            ${todo?.status === 'delay'?'text-danger':null}`}
                                        >
                                            {todo.name}
                                            {todo?.status === 'done'? <CheckOutlined className='text-success ms-2'/> : null}
                                        </div>
                                        <div style={{fontSize: 11, opacity: 0.8}} className='d-none d-md-block'>
                                            {formatDate(todo.createAt?.seconds)}
                                        </div>
                                    </div>
                                    <div>
                                        <div className='w-100 text-truncate'>{todo.description}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TodoSidebar;
