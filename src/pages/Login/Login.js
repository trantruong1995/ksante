import React, {useContext, useState} from 'react';
import './style.css';
import {GoogleAuthProvider,FacebookAuthProvider,signInWithPopup, signInWithEmailAndPassword} from 'firebase/auth';
import {Button, Input, Switch} from "antd";
import {auth} from "../../firebase/config";
import {addDocument, generateKeywords} from "../../firebase/service";
import {useNavigate} from "react-router-dom";
import {AuthContext} from "../../context/AuthProvider";
import {
    FacebookFilled, GoogleOutlined,
    LeftCircleFilled, LoginOutlined, RightCircleFilled
} from "@ant-design/icons";
import {AppContext} from "../../context/AppProvider";

const Login = () => {

    const navigate = useNavigate()
    const {user: {uid}} = useContext(AuthContext)
    const {setCreateAccount,language,setLanguage} = useContext(AppContext)
    const googleProvider = new GoogleAuthProvider();
    const facebookProvider = new FacebookAuthProvider();

    const [accountMode,setAccountMode] = useState(false)
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    const [err,setErr] = useState(false)
    const [loading,setLoading] = useState(false)

    function handleChangeLanguage(){
        setLanguage(language === 'EN' ? 'VI' : 'EN')
    }

    async function handleLogin(provider){
        const res = await signInWithPopup(auth,provider)
        const {_tokenResponse,user} = res;

        if (_tokenResponse?.isNewUser){
            const newUser = {
                displayName: user.displayName,
                email: user.email,
                photoURL: user.photoURL,
                uid: user.uid,
                providerId: _tokenResponse.providerId,
                keywords: generateKeywords(user.displayName.toLowerCase())
            }
            await addDocument('users',newUser)
        }
        setErr(false)
        navigate('/')
    }

    async function handleLoginWithUsername(){
        setLoading(true)
        try {
            await signInWithEmailAndPassword(auth, email, password);
            setLoading(false)
            setErr(false)
            navigate("/")
        } catch (err) {
            setLoading(false)
            setErr(true)
            console.log(err)
        }
    }

    return (
        <div className='login-container'>
            <div className='login-table col-lg-4'>
                {uid === '' ? (accountMode ?
                    (
                        <div className='text-center px-md-5 px-4 pt-3 position-relative'>
                            <LeftCircleFilled
                                style={{fontSize: 32, position: 'absolute', top: 10, left: 10, color: 'green', cursor: "pointer"}}
                                onClick={() => {
                                    setAccountMode(false)
                                    setErr(false)
                                }}
                            />
                            <h2 className='mb-4'>{language==='EN'?'Sign up To Simple':'Đăng nhập vào Simple'}</h2>
                            {err && <h3 className='text-danger mb-4'>{language==='EN'?'Oops! Something went wrong :((':'Oops! Có lỗi xảy ra, vui lòng thử lại.'}</h3>}
                            <Input
                                type='email'
                                style={{marginBottom: 20}}
                                placeholder={language==='EN'?'Your email':'Email của bạn'}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <Input
                                type='password'
                                style={{marginBottom: 20}}
                                placeholder={language==='EN'?'Your password':'Mật khẩu của bạn'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />

                            <Button
                                style={{width: '70%',marginBottom: 20}}
                                onClick={() => handleLoginWithUsername()}
                                loading={loading}
                                disabled={email === '' || password === ''}
                            >
                                <LoginOutlined style={{fontSize: 24, color: "darkblue"}}/>
                                {language==='EN'?'Longin':'Đăng nhập'}
                            </Button>
                            </div>
                    ) : (
                        <div className='text-center px-md-5 px-4 pt-3 position-relative d-flex flex-column'>
                            <h2 className='mb-5'>{language==='EN'?'Sign up To Simple':'Đăng nhập vào Simple'}</h2>
                            <Button
                                style={{marginBottom: 20}}
                                onClick={() => handleLogin(googleProvider)}
                            >
                                <GoogleOutlined style={{fontSize: 24, color: "orangered"}}/>
                                {language==='EN'?'Login with Google':'Đăng nhập bằng Google'}
                            </Button>
                            <Button
                                style={{marginBottom: 20}}
                                onClick={() => handleLogin(facebookProvider)}
                            >
                                <FacebookFilled style={{fontSize: 24, color: 'darkblue'}}/>
                                {language==='EN'?'Login with Facebook':'Đăng nhập bằng facebook'}
                            </Button>
                            <Button
                                style={{marginBottom: 40}}
                                onClick={() => setAccountMode(true)}
                            >
                                <LoginOutlined style={{fontSize: 24, color: 'darkgreen'}}/>
                                {language==='EN'?'Login with your account':'Đăng nhập bằng tài khoản của bạn'}
                            </Button>
                            <p style={{cursor: "pointer"}}
                                onClick={() => setCreateAccount(true)}
                            >{language==='EN'?'Create new account?':'Tạo mới tài khoản?'}</p><br/>
                            <label className='position-absolute' style={{bottom: 10, right: 10}}>
                                {language==='EN'?'Language: ':'Ngôn ngữ: '}
                                <Switch checkedChildren="EN" unCheckedChildren="VI" defaultChecked onChange={handleChangeLanguage}/>
                            </label>
                        </div>
                    )
                ) : (
                    <div className='text-center px-md-5 px-4 pt-3'>
                        <h2 className='mb-5'>{language==='EN'?'You have login':'Bạn đã đăng nhập'}</h2>
                        <Button
                                danger
                                style={{width: '70%',marginBottom: 20, cursor: "pointer"}}
                                onClick={() => auth.signOut()}
                        >
                            <RightCircleFilled style={{fontSize: 24,color: 'red'}}/>
                            {language==='EN'?'Logout':'Đăng xuất'}
                        </Button>
                        <Button
                                style={{width: '70%', marginBottom: 40, cursor: "pointer"}}
                                onClick={() => navigate('/')}
                        >
                            <LeftCircleFilled style={{fontSize: 24,color: 'green'}}/>
                            {language==='EN'?'Return to homepage':'Quay lại trang chủ'}
                        </Button>
                    </div>
                )}

            </div>
        </div>
    );
};

export default Login;
