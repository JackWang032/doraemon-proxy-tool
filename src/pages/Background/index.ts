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
    const res = await api.getProxyServers({ userIP: ip });
    if (res.success) {
        const serverList = res.data || [];
        await chrome.storage.local.set({
            proxyServers: serverList,
        });
    }
};

const getDevopsUrl = async (urlStr?: string) => {
    if (!urlStr) return '';
    const {
        config: { matchUrls },
    } = (await chrome.storage.local.get('config')) || {};
    const url = new URL(urlStr);

    if (!matchUrls || !new RegExp(matchUrls).test(url.hostname)) return '';

    if (
        ['dev', 'local'].some((prefix) => url.hostname.startsWith(prefix)) ||
        (url.port !== '80' && url.port !== '')
    ) {
        url.hostname = url.hostname.replace(/dev.|local./, '');
        url.port = '80';
    } else {
        url.hostname = 'dev.' + url.hostname;
        url.port = '8080';
    }

    return url.toString();
};

const handleContextMenuClick = async (info, tab?: chrome.tabs.Tab) => {
    if (!tab) return;

    const url = await getDevopsUrl(tab.url);
    if (!url) return;

    if (info.menuItemId === 'devops_new_tab') {
        chrome.tabs.create({
            url,
            index: tab.index + 1,
        });
    } else if (info.menuItemId === 'devops_current_tab') {
        await chrome.tabs.remove(tab.id!);
        chrome.tabs.create({
            url,
            index: tab.index,
        });
    }
};

const registerContectMenus = () => {
    chrome.contextMenus.create({
        id: 'devops',
        title: '环境跳转',
        contexts: ['page'],
    });
    chrome.contextMenus.create({
        id: 'devops_new_tab',
        parentId: 'devops',
        title: '新标签页打开',
        contexts: ['page'],
    });
    chrome.contextMenus.create({
        id: 'devops_current_tab',
        parentId: 'devops',
        title: '当前页打开',
        contexts: ['page'],
    });
    chrome.contextMenus.onClicked.addListener(handleContextMenuClick);
};

// 插件安装时初始化
chrome.runtime.onInstalled.addListener(async () => {
    await chrome.storage.local.set({
        proxyServers: [],
        config: {
            ipGetMode: 'auto', // ip获取方式 auto 自动获取， fixed 固定ip
            size: { type: POPUP_SIZE_TYPE.DEFAULT, width: null, height: null }, // popup大小 small, default, large, auto, custom
            theme: 'auto', // light, dark, auto
            devopsInjectEnabled: true, // 是否开启devops开发环境代码注入
            matchUrls:
                '(.devops.dtstack.cn$)|(^([a-zA-Z0-9]+.)?[0-9]+x.dtstack.cn$)', // 代码注入匹配规则
            quickLogin: {
                enabled: true,
                username: '',
                password: '',
                jumpProductPath: '/portal',
                defaultTenantId: '1',
            },
        },
    });
    registerContectMenus();
    getLocalIp().then(getProxyServers);
});

// 每次浏览器启动时
chrome.runtime.onStartup.addListener(async () => {
    let ruleOpenCount = 0;
    const { proxyServers, config } = await chrome.storage.local.get({
        proxyServers: [],
        config: {},
    });
    proxyServers.forEach((server) => {
        server.rules.forEach((rule) => {
            if (rule.status === 1) ruleOpenCount++;
        });
    });
    chrome.action.setBadgeText({ text: '' + ruleOpenCount });
    config.ipGetMode !== 'fixed' && getLocalIp();
});

chrome.runtime.onMessage.addListener((request) => {
    if (request.action === 'openOptionPage') {
        chrome.runtime.openOptionsPage();
    }
});
