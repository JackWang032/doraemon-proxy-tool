import {doraemonUrl} from '../const'
export default function request (input: RequestInfo, init?: RequestInit | undefined){
    if (typeof input === 'string') {
        input = doraemonUrl + input;
    }
    return fetch(input, init).then(res => {
        return res.json();
    })
}