import request from "../../api/request";
request('/api/github/get-local-ip').then(res => {
    if (res.success) {
        const ip = res.data?.localIp || '';
        chrome.storage.local.set({ip})
    }
})
chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({ proxyServers: [] });
})