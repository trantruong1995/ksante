import {formatRelative} from "date-fns";

// format date function
export function formatDate(seconds){
    let result = ''
    if (seconds){
        result = formatRelative(new Date(seconds*1000),new Date())
        result = result.charAt(0).toUpperCase() + result.slice(1)
    }
    return result
}
