import React, {useContext, useEffect, useRef} from 'react';
import {Avatar, Image, Typography} from "antd";
import {AppContext} from "../../../context/AppProvider";

const Message = ({text,displayName,photoUrl,creatAt,myMessage,imgURL}) => {

    const ref = useRef()
    const {darkMode} = useContext(AppContext)

    useEffect(() => {
        ref?.current?.scrollIntoView({behavior: 'smooth'})
    },[text])

    return (
        <div ref={ref} className={myMessage ? 'd-flex justify-content-end' : null} style={{width: '100%'}}>
            {myMessage ? (
                <div style={{marginBottom: 15, textAlign: 'right'}}>
                    <div className='d-flex align-items-center justify-content-end'>
                        <Typography.Text style={{color: '#a7a7a7', marginRight: 10, fontSize: 11}}>{creatAt}</Typography.Text>
                        <Avatar size='small' src={photoUrl}>
                            {photoUrl ? '' : displayName.charAt(0).toUpperCase()}
                        </Avatar>
                    </div>
                    {text && <div style={{marginRight: 30,padding: '3px 10px',textAlign: 'center',marginTop: 5,display: 'inline-block', maxWidth: '80%', backgroundColor: 'rgb(95,170,255)', borderRadius: 10}}>
                        <Typography className={`${darkMode ? 'dark-mode-text' : null}`}>{text}</Typography>
                    </div>}
                    {imgURL && <div style={{marginRight: 30, marginTop: 15, maxHeight: 120, maxWidth: 237,borderRadius:10, overflow: 'hidden'}}>
                            <Image
                                style={{objectFit: 'cover'}}
                                src={imgURL}
                            />
                    </div>}
                </div>
            ) : (
                <div style={{marginBottom: 15}}>
                    <div className='d-flex align-items-center'>
                        <Avatar size='small' src={photoUrl}>
                            {photoUrl ? '' : displayName.charAt(0).toUpperCase()}
                        </Avatar>
                        <Typography.Text style={{ marginLeft: 5, fontWeight: 'bold'}} className={`${darkMode ? 'dark-mode-text' : null}`}>{displayName}</Typography.Text>
                        <Typography.Text style={{color: '#a7a7a7', marginLeft: 10, fontSize: 11}}>{creatAt}</Typography.Text>
                    </div>
                    {text && <div style={{marginLeft: 30,padding: '3px 10px',marginTop: 5,textAlign:'center',display: 'inline-block', maxWidth: '80%' ,backgroundColor: 'rgb(95,170,255)', borderRadius: 10}}>
                        <Typography className={`${darkMode ? 'text-white' : null}`}>{text}</Typography>
                    </div>}
                    {imgURL &&
                        <div style={{marginLeft: 30, marginTop: 15, maxHeight: 120, maxWidth: 237,borderRadius:10, overflow: 'hidden'}}>
                            <Image
                                style={{objectFit: 'cover'}}
                                src={imgURL}
                            />
                        </div>
                    }
                </div>
            )}
        </div>
    );
};

export default Message;