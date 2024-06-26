import React from 'react';
import { useEffect, useState } from 'react';
import {
    EnterOutlined,
    LinkOutlined,
    SettingOutlined,
    SyncOutlined,
} from '@ant-design/icons';
import {
    Card,
    Col,
    Empty,
    message,
    Modal,
    Row,
    Space,
    Switch,
    Tooltip,
} from 'antd';
import { cloneDeep, isEmpty } from 'lodash';
import { POPUP_SIZE_TYPE, doraemonUrl } from '@/const';
import api from '@/api';
import './Popup.scss';

message.config({
    top: 30,
    duration: 2,
    maxCount: 3,
    rtl: true,
});

const POPUP_SIZE = {
    [POPUP_SIZE_TYPE.SMALL]: [320, 380],
    [POPUP_SIZE_TYPE.DEFAULT]: [416, 494],
    [POPUP_SIZE_TYPE.LARGE]: [512, 608],
};

const Popup = () => {
    const [ip, setIp] = useState<string>('');
    const [proxyServers, setProxyServers] = useState<TProxyServer[]>([]);
    const [config, setConfig] = useState<Partial<IConfig>>({});
    const [refreshLoading, setLoading] = useState<boolean>(false);

    // 每次打开popup先使用缓存渲染，再请求最新数据
    useEffect(() => {
        chrome.storage.local
            .get({ proxyServers: [], ip: '', config: {} })
            .then((res) => {
                setProxyServers(res.proxyServers);
                setIp(res.ip);
                setConfig(res.config);
                const isAutoIp = res.config.ipGetMode !== 'fixed';
                isAutoIp ? getLocalIp() : getProxyServers();
            });
    }, []);

    // 代理规则变更时计算当前开启的规则数量并展示在badge中
    useEffect(() => {
        if (isEmpty(config)) return;
        let ruleOpenCount = 0;
        proxyServers.forEach((server) => {
            server.rules.forEach((rule) => {
                if (rule.status === 1) ruleOpenCount++;
            });
        });
        chrome.action.setBadgeText({ text: '' + ruleOpenCount });
    }, [proxyServers]);

    const getLocalIp = async () => {
        const res = await api.getLocalIp();
        const { proxyServers } = await chrome.storage.local.get({
            proxyServers: [],
        });
        if (res.success) {
            const currentIp = res.data?.localIp || '';
            const callback = async () => {
                setIp(currentIp);
                await chrome.storage.local.set({ ip: currentIp });
                getProxyServers();
            };
            let { ip: oldIp } = await chrome.storage.local.get({ ip: '' });
            if (currentIp !== oldIp && oldIp) {
                Modal.confirm({
                    title: `检测到ip发生变化，是否更新所有规则至当前ip(${currentIp})下?`,
                    okText: '确定',
                    cancelText: '取消',
                    onOk() {
                        let promises: Promise<any>[] = [];
                        for (const proxyServer of proxyServers) {
                            if (proxyServer.rules?.length) {
                                for (const rule of proxyServer.rules) {
                                    const request = api.updateRuleIp({
                                        id: rule.id,
                                        ip: currentIp,
                                    });
                                    promises.push(request);
                                }
                            }
                        }
                        return Promise.all(promises).then(() => {
                            callback();
                        });
                    },
                    onCancel: () => {
                        callback();
                    },
                });
            } else {
                callback();
            }
        }
    };

    const getProxyServers = async () => {
        const { ip } = await chrome.storage.local.get('ip');
        try {
            const res = await api.getProxyServers({ userIP: ip });
            if (res.success) {
                const serverList = res.data || [];
                setProxyServers(serverList);
                await chrome.storage.local.set({
                    proxyServers: serverList,
                });
            }
        } catch (error) {
            message.error('获取最新数据失败,可尝试关闭vpn,错误信息：' + error);
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
            .catch((error) => {
                message.error('更新失败,错误信息:' + error);
            });
    };

    // 刷新ip地址
    const refreshIpAddress = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
        }, 700);
        if (config.ipGetMode !== 'fixed') {
            getLocalIp().then(() => {
                message.success('刷新ip成功');
            });
        } else {
            getProxyServers();
        }
    };

    // 打开配置页
    const openOptionPage = () => {
        chrome.runtime.openOptionsPage();
    };

    const getSize = () => {
        if (config.size?.type === POPUP_SIZE_TYPE.AUTO) {
            return {
                width: 416,
                minHeight: 300,
                maxHeight: 494,
            };
        }
        if (config.size?.type === POPUP_SIZE_TYPE.CUSTOM) {
            return {
                width: config.size.width,
                height: config.size.height,
            };
        }
        const [width, height] =
            POPUP_SIZE[config.size?.type || POPUP_SIZE_TYPE.DEFAULT];
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
                    url: `${doraemonUrl}?projectId=${serverId}`,
                    active: true,
                    index: index,
                });
            });
    };

    if (isEmpty(config)) return null;

    return (
        <div className="container" style={getSize()}>
            <div className="header">
                <p>
                    你的ip: {ip}{' '}
                    <Tooltip title="刷新ip并获取最新数据" placement="right">
                        <SyncOutlined
                            className={refreshLoading ? 'refresh-loading' : ''}
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
                                <Col
                                    className="rule-remark"
                                    title={rule.remark}
                                >
                                    {rule.remark || '--'}
                                </Col>
                                <Col className="rule-actions">
                                    <Space size={8}>
                                        <Tooltip title={`访问${rule.target}`}>
                                            <LinkOutlined
                                                onClick={() =>
                                                    window.open(
                                                        rule.target + '/portal'
                                                    )
                                                }
                                            />
                                        </Tooltip>
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
                                    </Space>
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
