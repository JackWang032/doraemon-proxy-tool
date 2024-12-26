import request from '@/api/request';

export default {
    // 获取本机ip地址
    getLocalIp: () => {
        return request<{ localIp: string }>('/api/github/get-local-ip');
    },

    // 获取本机的所有代理服务
    getProxyServers: (params: { userIP: string }) => {
        return request<IProxyServer[]>(
            '/api/proxy-server/get-project-list-by-user-ip',
            {
                method: 'POST',
                headers: { 'content-type': 'application/json;charset=UTF-8' },
                body: JSON.stringify(params),
            }
        );
    },

    // 更新规则启用状态
    updateRuleStatus: (params: { id: number; status: number }) => {
        return request('/api/proxy-server/update-rule-status', {
            method: 'POST',
            headers: { 'content-type': 'application/json;charset=UTF-8' },
            body: JSON.stringify(params),
        });
    },

    // 更新规则的ip
    updateRuleIp: (params: { id: number; ip: string }) => {
        return request('/api/proxy-server/update-rule', {
            method: 'POST',
            headers: { 'content-type': 'application/json;charset=UTF-8' },
            body: JSON.stringify(params),
        });
    },

    // 获取环境列表
    getEnvList: (params?) => {
        const urlParams = new URLSearchParams(params);
        return request<IEnvInfo[]>(
            `/api/env-management/env-list?${urlParams}`,
            {
                method: 'GET',
                headers: { 'content-type': 'application/json;charset=UTF-8' },
            }
        );
    },

    getTagList: () => {
        return request<{ count: number; data: ITagInfo[] }>(
            `/api/tags/get-all-tag-list`,
            {
                method: 'GET',
                headers: { 'content-type': 'application/json;charset=UTF-8' },
            }
        );
    },
};
