import {doraemonUrl} from '../const'
export default function request (reqParam: RequestInfo){
    if (typeof reqParam === 'object') {
        (reqParam as RequestInfo)['url'] = doraemonUrl + reqParam['url'];
    } else {
        reqParam = doraemonUrl + reqParam
    }
    return fetch(reqParam).then(res => {
        return res.json();
    })
}