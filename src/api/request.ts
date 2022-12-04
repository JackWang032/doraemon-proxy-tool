import { serverUrl } from '../const'
// todo 重新封装
export default function request (input: RequestInfo, init?: RequestInit | undefined){
    if (typeof input === 'string') {
        input = serverUrl + input;
    }
    return fetch(input, init).then(res => {
        if (res.status === 200) return res.json();
        else return Promise.reject(res.statusText)
    })
}