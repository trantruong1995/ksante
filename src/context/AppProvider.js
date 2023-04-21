import React, {createContext, useContext, useMemo, useState} from 'react';
import {AuthContext} from "./AuthProvider";
import {useFireStore} from "../hooks/useFireStore";

export const AppContext = createContext()

const AppProvider = ({children}) => {

    //get uid from auth context
    const {user: {uid}} = useContext(AuthContext)

    // state for trigger modal
    const [addRoom,setAddRoom] = useState(false)
    const [inviteMembers,setInviteMembers] = useState(false)
    const [findUserInRoom,setFindUserInRoom] = useState(false)
    const [findFriend,setFindFriend] = useState(false)
    const [createAccount,setCreateAccount] = useState(false)
    const [addTodo,setAddTodo] = useState(false)

    // state for dark mode and language
    const [language,setLanguage] = useState('EN')
    const [darkMode,setDarkMode] = useState(false)

    // state for current room
    const [selectedRoomId,setSelectedRoomId] = useState('')
    const [todoId,setTodoId] = useState('')

    // get all rooms of user
    const roomCondition = useMemo(() => {
        return {
            fieldName: 'members',
            operator: 'array-contains',
            compareValue: uid
        }
    },[uid])
    const rooms = useFireStore('rooms',roomCondition)

    // get selected room
    const selectedRoom = rooms.find(room => room.id === selectedRoomId);

    // get members in selected room
    const memberCondition = useMemo(() => {
        return {
            fieldName: 'uid',
            operator: 'in',
            compareValue: selectedRoom?.members
        }
    },[selectedRoom?.members])
    const members = useFireStore('users',memberCondition)

    // get user detail
    const userCondition = useMemo(() => {
        return {
            fieldName: 'uid',
            operator: '==',
            compareValue: uid
        }
    },[uid])
    const userDetail = useFireStore('users',userCondition)[0]
    // get list friend uid
    const friendUids = userDetail?.friends

    // get friends detail
    const friendCondition = useMemo(() => {
        return {
            fieldName: 'friends',
            operator: 'array-contains',
            compareValue: uid
        }
    },[uid])
    const friends = useFireStore('users',friendCondition)

    // get todo list
    const todoCondition = useMemo(() => {
        return {
            fieldName: 'from',
            operator: '==',
            compareValue: uid
        }
    },[uid])
    const todos = useFireStore('todos',todoCondition)

    // get assigned list
    const assignedCondition = useMemo(() => {
        return {
            fieldName: 'assignTo',
            operator: 'array-contains',
            compareValue: uid
        }
    },[uid])
    const assigneds = useFireStore('todos',assignedCondition)

    // get selected todo
    const selectedTodo = [...todos,...assigneds].find(todo => todo.id === todoId)

    return (
        <AppContext.Provider
            value={{
                rooms,friendUids,friends,userDetail,
                selectedRoomId,setSelectedRoomId,
                selectedRoom,members,
                addRoom,setAddRoom,
                inviteMembers,setInviteMembers,
                findUserInRoom,setFindUserInRoom,
                findFriend,setFindFriend,
                createAccount,setCreateAccount,
                language,setLanguage,darkMode,setDarkMode,
                todos,addTodo,setAddTodo,assigneds,
                todoId,setTodoId,selectedTodo
            }}
        >
            {children}
        </AppContext.Provider>
    );
};

export default AppProvider;
