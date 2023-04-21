import {useEffect, useState} from "react";

export function useDebounce(value,delay){
    const [debounceValue,setDebounceValue] = useState(value)

    useEffect(()=>{
        const handle = setTimeout(() => setDebounceValue(value),delay)

        return () => clearTimeout(handle)

    },[delay, value])

    return debounceValue
}