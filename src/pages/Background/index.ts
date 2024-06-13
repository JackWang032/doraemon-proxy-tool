import api from '@/api';
import { POPUP_SIZE_TYPE } from '@/const';

const getLocalIp = async () => {
    const res = await api.getLocalIp();
    if (res.success) {
        const ip = res.data?.localIp || '';
        await chrome.storage.local.set({ ip });
    }
};

const getProxyServers = async () => {
    const { ip } = await chrome.storage.local.get('ip');
    const res = await api.getProxyServers({userIP: ip});
        if (res.success) {
            const serverList = res.data || [];
            await chrome.storage.local.set({
                proxyServers: serverList
            })
        }
}

// 插件安装时初始化
chrome.runtime.onInstalled.addListener(async () => {
    await chrome.storage.local.set({
        proxyServers: [],
        config: {
            ipGetMode: 'auto', // ip获取方式 auto 自动获取， fixed 固定ip
            size: { type: POPUP_SIZE_TYPE.DEFAULT, width: null, height: null }, // popup大小 small, default, large, auto, custom
            theme: 'auto', // light, dark, auto
            devopsInjectEnabled: true, // 是否开启devops开发环境代码注入
        },
    });
    getLocalIp().then(getProxyServers)
});

// 每次浏览器启动时
chrome.runtime.onStartup.addListener(async () => {
    let ruleOpenCount = 0;
    const { proxyServers, config } = await chrome.storage.local.get({
        proxyServers: [],
        config: {}
    });
    proxyServers.forEach((server) => {
        server.rules.forEach((rule) => {
            if (rule.status === 1) ruleOpenCount++;
        });
    });
    chrome.action.setBadgeText({ text: '' + ruleOpenCount });
    config.ipGetMode !== 'fixed' && getLocalIp()
});
