import React, {useState} from 'react';
import Content from "./Content";
import DirectorySidebar from "./DirectorySidebar";

const Directory = () => {

    const [mode,setMode] = useState('Friends')

    function handleSetMode(e){
        setMode(e)
    }

    return (
        <div className='row p-0 m-0' style={{height: '100vh'}}>
            <div className='col-4 p-0 m-0'>
                <DirectorySidebar setMode={handleSetMode}/>
            </div>
            <div className='col-8 p-0 m-0'>
                <Content data={mode}/>
            </div>
        </div>
    );
};

export default Directory;
