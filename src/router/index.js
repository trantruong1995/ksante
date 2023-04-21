import {createBrowserRouter, Outlet} from "react-router-dom";
import Login from "../pages/Login/Login";
import AuthProvider from "../context/AuthProvider";
import Chat from "../pages/ChatRoom";
import AppProvider from "../context/AppProvider";
import AddRoom from "../pages/ChatRoom/modals/AddRoom";
import InviteMembers from "../pages/ChatRoom/modals/InviteMembers";
import FindUserInRoom from "../pages/ChatRoom/modals/FindUserInRoom";
import CreateAccount from "../pages/Login/modals/CreateAccount";
import Directory from "../pages/Directory";
import Todo from "../pages/Todo";
import FindFriend from "../pages/Directory/modal/FindFriend";
import AddTodo from "../pages/Todo/Modals/AddTodo";

const AuthLayout = () => {
    return <AuthProvider>
        <AppProvider>
            <Outlet/>
            <AddRoom/>
            <InviteMembers/>
            <FindUserInRoom/>
            <CreateAccount/>
            <FindFriend/>
            <AddTodo/>
        </AppProvider>
    </AuthProvider>
}

export default createBrowserRouter([
    {
        element: <AuthLayout/>,
        children: [
            {
                element: <Login/>,
                path: '/login'
            },
            {
                element: <Chat/>,
                path: '/'
            },
            {
                element: <Directory/>,
                path: '/directory'
            },
            {
                element: <Todo/>,
                path: '/todo'
            },
        ]
    }
])
