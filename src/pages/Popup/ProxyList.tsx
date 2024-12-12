import React, { useContext, useEffect, useRef, useState } from 'react';
import { doraemonUrl } from '@/const';
import { EnterOutlined, LinkOutlined } from '@ant-design/icons';
import { HappyProvider } from '@ant-design/happy-work-theme';
import {
    Button,
    Card,
    Col,
    Empty,
    message,
    Row,
    Space,
    Switch,
    Tooltip,
} from 'antd';
import api from '@/api';
import { cloneDeep } from 'lodash';
import { StorageCacheContext } from './context';
import useMemorizeScroll from './useMemorizeScroll';

interface IProps {
    ip: string;
}

const ProxyList: React.FC<IProps> = ({ ip }) => {
    const scrollContainer = useRef<HTMLDivElement>(null);

    const {
        updateStorage,
        clientUserState,
        updateUserState,
        proxyServers: cachedProxyServers,
    } = useContext(StorageCacheContext);

    const [proxyServers, setProxyServers] = useState<IProxyServer[]>(
        cachedProxyServers || []
    );

    const getProxyServers = () => {
        if (!ip) return;
        api.getProxyServers({ userIP: ip })
            .then((res) => {
                if (res.success) {
                    const proxyServers = res.data || [];
                    setProxyServers(proxyServers);
                    updateStorage({ proxyServers });
                }
            })
            .catch((error) => {
                message.error(
                    '获取最新数据失败,可尝试关闭vpn,错误信息：' + error
                );
            });
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
                    // 先乐观更新
                    const newProxyServers = cloneDeep(proxyServers);
                    const rule = newProxyServers
                        .find((item) => item.serverId === serverId)
                        ?.rules?.find((rule) => rule.id === ruleId);

                    if (rule) {
                        rule.status = checked ? 1 : 0;
                    }

                    setProxyServers(newProxyServers);
                    message.success('更新成功');

                    getProxyServers();
                } else {
                    message.error('更新失败');
                }
            })
            .catch((error) => {
                message.error('更新失败,错误信息:' + error);
            });
    };

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

    useEffect(() => {
        getProxyServers();
    }, [ip]);

    useMemorizeScroll(scrollContainer, {
        getMemorizedScroll: () => clientUserState.proxyScrollTop || 0,
        memorize: (scrollTop) => {
            updateUserState({ proxyScrollTop: scrollTop });
        },
    });

    return (
        <div key='p-list' className="scroll-wrapper" ref={scrollContainer}>
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
                                            jumpToProject(proxyServer.serverId)
                                        }
                                    />
                                </Tooltip>
                            </div>
                        </div>
                    }
                    bordered={false}
                >
                    {proxyServer.rules.map((rule) => (
                        <Row
                            key={rule.id}
                            className="row-rule-item"
                            justify="space-between"
                            align="middle"
                        >
                            <Col className="rule-remark" title={rule.remark}>
                                {rule.remark || '--'}
                            </Col>
                            <Col className="rule-actions">
                                <Space size={8}>
                                    <Tooltip title={`访问${rule.target}`}>
                                        <Button
                                            type="default"
                                            variant="link"
                                            size="small"
                                            onClick={() =>
                                                window.open(
                                                    rule.target + '/portal'
                                                )
                                            }
                                        >
                                            <LinkOutlined />
                                        </Button>
                                    </Tooltip>
                                    <HappyProvider>
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
                                    </HappyProvider>
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
    );
};

export default ProxyList;
