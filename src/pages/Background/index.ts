import request from '@/api/request';

const getLocalIp = async () => {
    const localData = await chrome.storage.local.get('config');
    const { config } = localData;
    if (config?.ipGetMode === 'auto') {
        const res = await request('/api/github/get-local-ip');
        if (res.success) {
            const ip = res.data?.localIp || '';
            chrome.storage.local.set({ ip });
        }
    }
};

getLocalIp()

chrome.runtime.onInstalled.addListener(async () => {
    await chrome.storage.local.set({
        proxyServers: [],
        config: {
            ipGetMode: 'auto', // ip获取方式 auto 自动获取， fixed 固定ip
            size: 'default', // popup大小 small, default, large, auto
            theme: 'light',
        },
    });
    getLocalIp()
});
