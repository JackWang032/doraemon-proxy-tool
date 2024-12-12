import { serverUrl } from '../const';
// todo 重新封装
export default function request<T>(
    input: RequestInfo,
    init?: RequestInit | undefined
) {
    if (typeof input === 'string') {
        input = serverUrl + input;
    }
    return fetch(input, init).then((res) => {
        if (res.status === 200) return res.json() as Promise<IFetchResponse<T>>;
        else return Promise.reject(res.statusText);
    });
}
