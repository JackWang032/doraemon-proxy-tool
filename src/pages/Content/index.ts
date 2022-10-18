import $ from 'jquery';
console.log('Doraemon Content Script Works! ' + new Date().toLocaleString());

// 获取当前展开server下的所有规则
const getRules = async () => {
    const { ip: localIp } = await chrome.storage.local.get({ ip: '' });

    const rules = $(
        '.ant-table-expanded-row:not([style="display: none;"]) .ant-table-tbody tr'
    );
    const ruleDataList: any[] = [];

    rules.each((i, el) => {
        const ruleId = Number(el.dataset.rowKey);
        const columns: HTMLElement[] = Array.prototype.slice.call(el.children);

        // 从dom解构出代理规则的具体数据
        const [
            ruleIndexEl,
            ruleIpEl,
            ruleTargetEl,
            ruleRemarkEl,
            ruleStatusEl,
        ] = columns;

        const ruleIp = ruleIpEl.textContent,
            ruleTargetUrl = ruleTargetEl.textContent,
            ruleRemark = ruleRemarkEl.textContent;

        if (ruleIp !== localIp) return;

        // 规则是否开启
        const isRuleOpen =
            ruleStatusEl.children[0].getAttribute('aria-checked') === 'true';

        ruleDataList.push({
            id: ruleId,
            ip: ruleIp,
            target: ruleTargetUrl,
            remark: ruleRemark,
            status: isRuleOpen ? 1 : 0,
        });
    });

    return ruleDataList;
};

const getProxyDataFromDom = async () => {
    const serverEl = $(
        '.ant-table-expanded-row:not([style="display: none;"])'
    ).prev()?.[0];
    if (!serverEl) return { success: false, data: null };
    
    const serverId = Number(serverEl.dataset.rowKey);
    const serverName = serverEl.children[2].textContent!;
    const serverAddress = serverEl.children[3].querySelector('.ant-typography')?.childNodes[0].textContent || '';
    const rules = await getRules();

    const serverInfo: TProxyServer = {
        serverId,
        serverName,
        serverAddress,
        rules,
    };

    return {
        success: true,
        data: serverInfo
    };
};

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.type === 'fetchProxySetting') {
        getProxyDataFromDom().then((data: TProxyDataResponse) => {
            sendResponse(data);
        });

        // 异步时需返回true避免通信端口被关闭
        return true;
    }
});

