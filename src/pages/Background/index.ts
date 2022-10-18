import request from '@/api/request';
chrome.storage.local.get('config').then((res) => {
    const config = res.config;
    if (config.ipGetMode === 'auto') {
        request('/api/github/get-local-ip').then((res) => {
            if (res.success) {
                const ip = res.data?.localIp || '';
                chrome.storage.local.set({ ip });
            }
        });
    }
});

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({
        proxyServers: [],
        config: {
            ipGetMode: 'auto', // ip获取方式 auto 自动获取， fixed 固定ip
            size: 'default', // popup大小 small, default, large, auto
            theme: 'light',
        },
    });
});
