import React from 'react';
import { useEffect, useState } from 'react';
import { ReloadOutlined } from '@ant-design/icons';
import './Popup.scss';
import { Card, Col, message, Row, Switch } from 'antd';
import 'antd/dist/antd.css';
import request from '../../api/request';
import { cloneDeep } from 'lodash';

type TProxyServer = {
    serverId: number;
    serverName: string;
    rules: any[];
};

const getProxySettings = async () => {
    const { proxySettings } = await chrome.storage.local.get({
        proxySettings: [],
    });
    return proxySettings;
};

const Popup = () => {
    const [ip, setIp] = useState<string>('');
    const [proxyServers, setProxyServers] = useState<TProxyServer[]>([]);

    // 每次打开popup都会从缓存中读取配置
    useEffect(() => {
        chrome.storage.local.get({ proxySettings: [] }).then((res) => {
            setProxyServers(res.proxySettings);
        });
    }, []);

    // 代理规则变更时计算当前开启的规则数量并展示在badge中
    useEffect(() => {
        let ruleOpenCount = 0;
        proxyServers.forEach((server) => {
            server.rules.forEach((rule) => {
                if (rule.status === 1) ruleOpenCount++;
            });
        });
        chrome.action.setBadgeText({ text: '' + ruleOpenCount });
    }, [proxyServers]);

    chrome.storage.local.get('ip').then((res) => {
        setIp(res.ip);
    });

    // 通知内容脚本抓取代理页面数据
    const fetchProxy = async () => {
        const tabs = await chrome.tabs.query({
            active: true,
            currentWindow: true,
        });

        const tab = tabs[0];
        if (
            ![
                'http://172.16.100.225:7001/page/proxy-server',
                'http://doraemon.dtstack.com/page/proxy-server',
            ].includes(tab.url!)
        ) {
            message.info('请先打开doraemon代理页');
            return;
        }

        chrome.tabs.sendMessage(
            tab.id!,
            { type: 'fetchProxySetting' },
            async (proxyData) => {
                if (proxyData) {
                    const proxySettings = await getProxySettings();
                    const oldProxyData = proxySettings.find(
                        (item) => item.serverId === proxyData.serverId
                    );
                    // 已存在该代理服务则更新为最新的
                    if (oldProxyData) {
                        oldProxyData['serverName'] = proxyData['serverName'];
                        oldProxyData['rules'] = proxyData['rules'];
                    } else {
                        proxySettings.push(proxyData);
                    }
                    setProxyServers(proxySettings);
                    chrome.storage.local.set({ proxySettings });
                    message.success(
                        '已更新 ' + proxyData.serverName + ' 中的规则'
                    );
                } else {
                    message.info('未抓取到有效数据');
                }
            }
        );
    };

    // 更新规则启用状态
    const updateRuleStatus = (
        serverId: number,
        ruleId: number,
        checked: boolean
    ) => {
        if (!ruleId) return;
        request('/api/proxy-server/update-rule-status', {
            method: 'POST',
            headers: { 'content-type': 'application/json;charset=UTF-8' },
            body: JSON.stringify({ id: ruleId, status: checked ? 1 : 0 }),
        })
            .then(async (res) => {
                if (res.success?.[0] === 1) {
                    message.success('更新成功');

                    const clone = cloneDeep(proxyServers);
                    // 更新同步到storage
                    const rule = clone
                        .find((item) => item.serverId === serverId)
                        ?.rules?.find((rule) => rule.id === ruleId);
                    if (rule) {
                        rule.status = checked ? 1 : 0;
                    }
                    setProxyServers(clone);
                    chrome.storage.local.set({ proxySettings: clone });
                } else {
                    message.error('更新失败');
                }
            })
            .catch(() => {
                message.error('更新失败');
            });
    };

    // 直接从请求接口来刷新规则列表
    const refreshServer = (serverId: number) => {
        request(`/api/proxy-server/rule-list?proxy_server_id=${serverId}`).then(
            (res) => {
                if (res.success) {
                    const rules = res.data?.data || [];
                    // 只保留自己的规则
                    const filterRules = rules.filter((rule) => rule.ip === ip);
                    const clone = cloneDeep(proxyServers);
                    const server = clone.find(
                        (server) => server.serverId === serverId
                    );
                    server.rules = filterRules;
                    setProxyServers(clone);
                    chrome.storage.local.set({ proxySettings: clone });
                    message.success('刷新成功');
                }
            }
        );
    };

    return (
        <div className="App">
            <div className="header">
                <p>你的ip: {ip}</p>
                <span className="btn-fetch" onClick={fetchProxy}>
                    抓取
                </span>
            </div>
            <div className="content">
                {proxyServers.map((proxyServer) => (
                    <Card
                        key={proxyServer.serverId}
                        title={
                            <div className="server-title">
                                <span>{proxyServer.serverName}</span>
                                <ReloadOutlined
                                    onClick={() =>
                                        refreshServer(proxyServer.serverId)
                                    }
                                />
                            </div>
                        }
                        bordered={false}
                        style={{ marginBottom: 18 }}
                        headStyle={{
                            height: 38,
                            minHeight: 38,
                            lineHeight: '38px',
                        }}
                    >
                        {proxyServer.rules.map((rule) => (
                            <Row
                                key={rule.id}
                                justify="space-between"
                                style={{ marginBottom: 10 }}
                            >
                                <Col>{rule.remark}</Col>
                                <Col>
                                    <Switch
                                        checked={rule.status === 1}
                                        onChange={(checked) => {
                                            updateRuleStatus(
                                                proxyServer.serverId,
                                                rule.id,
                                                checked
                                            );
                                        }}
                                    />
                                </Col>
                            </Row>
                        ))}
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default Popup;
