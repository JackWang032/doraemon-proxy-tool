import React from 'react';
import { useEffect, useState } from 'react';
import {
    EnterOutlined,
    SettingOutlined,
    SyncOutlined,
} from '@ant-design/icons';
import './Popup.scss';
import { Card, Col, Empty, message, Row, Switch, Tooltip } from 'antd';
import { cloneDeep, isEmpty } from 'lodash';
import { doraemonUrls } from '@/const';
import api from '@/api';

const POPUP_SIZE = {
    small: [320, 380],
    default: [416, 494],
    large: [512, 608],
};

const Popup = () => {
    const [ip, setIp] = useState<string>('');
    const [proxyServers, setProxyServers] = useState<TProxyServer[]>([]);
    const [config, setConfig] = useState<any>({});

    // 每次打开popup先使用缓存渲染，再请求最新数据
    useEffect(() => {
        chrome.storage.local
            .get({ proxyServers: [], ip: '', config: {} })
            .then((res) => {
                setProxyServers(res.proxyServers);
                setIp(res.ip);
                setConfig(res.config);
            });
        getProxyServers();
    }, []);

    useEffect(() => {
        if (isEmpty(config)) return;
        if (config.theme !== 'auto') {
            document.body.className = config.theme;
        } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.body.className = 'dark';
        }
    }, [config]);

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

    const getProxyServers = async () => {
        const { ip } = await chrome.storage.local.get('ip');
        try {
            const res = await api.getProxyServers({ userIP: ip });
            if (res.success) {
                const serverList = res.data || [];
                await chrome.storage.local.set({
                    proxyServers: serverList,
                });
                setProxyServers(serverList);
            }
        } catch (error) {
            message.error('获取最新数据失败 ' + error);
        }
    };

    // 更新规则启用状态
    const updateRuleStatus = (
        serverId: number,
        ruleId: number,
        checked: boolean
    ) => {
        if (!ruleId) return;
        api.updateRuleStatus({ id: ruleId, status: checked ? 1 : 0 })
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

    // 刷新ip地址
    const refreshIpAddress = async () => {
        const res = await api.getLocalIp();
        if (res.success) {
            const newIp = res.data?.localIp || '';
            if (newIp !== ip) {
                await chrome.storage.local.set({ ip: newIp });
                setIp(newIp);
                getProxyServers();
            }
            message.success({ content: '刷新ip成功', duration: 1 });
        }
    };

    // 打开配置页
    const openOptionPage = () => {
        chrome.runtime.openOptionsPage();
    };

    const getSize = () => {
        if (config.size === 'auto') {
            return {
                width: 416,
                minHeight: 300,
                maxHeight: 494,
            };
        }
        const [width, height] = POPUP_SIZE[config.size || 'default'];
        return {
            width,
            height,
        };
    };

    // 跳转至指定项目
    const jumpToProject = (serverId: number) => {
        chrome.tabs
            .query({ active: true, currentWindow: true })
            .then((tabs) => {
                const tab = tabs[0];
                const index = (tab?.index || 0) + 1;
                chrome.tabs.create({
                    url: `${doraemonUrls[0]}?projectId=${serverId}`,
                    active: true,
                    index: index,
                });
            });
    };

    return (
        <div className="container" style={getSize()}>
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
                <p>
                    <SettingOutlined
                        style={{ marginRight: 12, cursor: 'pointer' }}
                        onClick={openOptionPage}
                    />
                </p>
            </div>
            <div className="content">
                {proxyServers.map((proxyServer) => (
                    <Card
                        key={proxyServer.serverId}
                        className="card-server"
                        title={
                            <div className="server-title">
                                <span title={proxyServer.serverName}>
                                    {proxyServer.serverName}
                                </span>
                                <div className="server-title-actions">
                                    <Tooltip title="快速跳转至该项目">
                                        <EnterOutlined
                                            onClick={() =>
                                                jumpToProject(
                                                    proxyServer.serverId
                                                )
                                            }
                                        />
                                    </Tooltip>
                                </div>
                            </div>
                        }
                        bordered={false}
                        headStyle={{
                            height: 38,
                            minHeight: 38,
                            lineHeight: '38px',
                        }}
                    >
                        {proxyServer.rules.map((rule) => (
                            <Row
                                key={rule.id}
                                className="row-rule-item"
                                justify="space-between"
                                align="middle"
                            >
                                <Col>{rule.remark || '此规则无备注信息'}</Col>
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
