import React, {createContext, useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {auth} from "../firebase/config";
import {Spin} from "antd";

export const AuthContext = createContext();

const AuthProvider = ({children}) => {

    const [user,setUser] = useState({displayName: '',photoURL: '',email: '',uid: ''})
    const [isLoading,setIsLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (user) {
                const {displayName,photoURL,email,uid} = user
                setUser({displayName,photoURL,email,uid})
                setIsLoading(false)

            }else {
                setUser({displayName: '',photoURL: '',email: '',uid: ''})
                setIsLoading(false)
                navigate('/login')
            }
        })
        return () => {
            unsubscribe()
        }
    },[navigate])

    return (
        <AuthContext.Provider value={{user}}>
            {
                isLoading ? <div className='d-flex justify-content-center mt-5'><Spin size="large" /></div> : children
            }
        </AuthContext.Provider>
    );
};

export default AuthProvider;