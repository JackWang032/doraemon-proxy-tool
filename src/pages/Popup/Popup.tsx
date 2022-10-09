import React from 'react';
import { useEffect, useState } from 'react';
import { ReloadOutlined, SyncOutlined } from '@ant-design/icons';
import './Popup.scss';
import { Card, Col, Empty, message, Row, Switch, Tooltip } from 'antd';
import 'antd/dist/antd.css';
import request from '../../api/request';
import { cloneDeep } from 'lodash';
import { doraemonUrls } from '../../const';

type TProxyServer = {
    serverId: number;
    serverName: string;
    rules: any[];
};

const getproxyServers = async () => {
    const { proxyServers } = await chrome.storage.local.get({
        proxyServers: [],
    });
    return proxyServers;
};

const Popup = () => {
    const [ip, setIp] = useState<string>('');
    const [proxyServers, setProxyServers] = useState<TProxyServer[]>([]);

    // 每次打开popup都会从缓存中读取配置
    useEffect(() => {
        chrome.storage.local.get({ proxyServers: [] }).then((res) => {
            setProxyServers(res.proxyServers);
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
        if (!doraemonUrls.includes(tab.url!)) {
            message.info('请先打开doraemon代理页');
            return;
        }

        chrome.tabs.sendMessage(
            tab.id!,
            { type: 'fetchProxySetting' },
            async (responese: any) => {
                if (!responese) return message.info('内容脚本未注入，请重新打开哆啦A梦页面')
                const { success, data: proxyData } = responese;
                if (success) {
                    const proxyServers = await getproxyServers();
                    const oldProxyData = proxyServers.find(
                        (item) => item.serverId === proxyData.serverId
                    );
                    // 已存在该代理服务则更新为最新的
                    if (oldProxyData) {
                        oldProxyData['serverName'] = proxyData['serverName'];
                        oldProxyData['rules'] = proxyData['rules'];
                    } else {
                        proxyServers.push(proxyData);
                    }
                    setProxyServers(proxyServers);
                    chrome.storage.local.set({ proxyServers });
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
                    chrome.storage.local.set({ proxyServers: clone });
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
                    chrome.storage.local.set({ proxyServers: clone });
                    message.success('刷新成功');
                }
            }
        );
    };

    // 刷新ip地址
    const refreshIpAddress = () => {
        request('/api/github/get-local-ip').then((res) => {
            if (res.success) {
                const ip = res.data?.localIp || '';
                chrome.storage.local.set({ ip });
                setIp(ip);
                message.success({ content: '刷新ip成功', duration: 1 });
            }
        });
    };

    return (
        <div className="App">
            <div className="header">
                <p>
                    你的ip: {ip}{' '}
                    <Tooltip title="重新获取ip">
                        <SyncOutlined
                            style={{ cursor: 'pointer' }}
                            onClick={refreshIpAddress}
                        />
                    </Tooltip>
                </p>
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
                        {!proxyServer.rules?.length && (
                            <Empty
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                                description="还没有代理规则哦"
                            >
                                可以尝试点击右上角刷新
                            </Empty>
                        )}
                    </Card>
                ))}
                {!proxyServers?.length && (
                    <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        style={{ marginTop: '20%' }}
                        description="还没有代理服务哦"
                    >
                        点击
                        <a
                            target="_blank"
                            href="http://doraemon.dtstack.com/page/proxy-server"
                        >
                            此处
                        </a>
                        去添加
                    </Empty>
                )}
            </div>
        </div>
    );
};

export default Popup;
