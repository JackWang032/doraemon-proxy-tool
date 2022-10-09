import { serverUrl } from '../const'
export default function request (input: RequestInfo, init?: RequestInit | undefined){
    if (typeof input === 'string') {
        input = serverUrl + input;
    }
    return fetch(input, init).then(res => {
        return res.json();
    })
}