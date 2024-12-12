import React, { useEffect, useState, useContext } from 'react';
import { StorageCacheContext } from './context';
import {
    SettingOutlined,
    SyncOutlined,
} from '@ant-design/icons';
import { Button, message, Modal, Segmented, Space, Tooltip } from 'antd';
import { isEmpty } from 'lodash';
import { POPUP_SIZE_TYPE, POPUP_TAB } from '@/const';
import api from '@/api';
import ProxyList from './ProxyList';
import EnvList from './EnvList';
import KeepAlive from './KeepAlive';
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

const openOptionPage = () => {
    chrome.runtime.openOptionsPage();
};

const Popup = () => {
    const [ip, setIp] = useState<string>('');
    const [config, setConfig] = useState<Partial<IConfig>>({});
    const [refreshLoading, setLoading] = useState<boolean>(false);
    const [tab, setTab] = useState<POPUP_TAB>(POPUP_TAB.PROXY);

    const { updateStorage, updateUserState, clientUserState, ...cachedState } =
        useContext(StorageCacheContext);

    const getLocalIp = async () => {
        const res = await api.getLocalIp();
        const { proxyServers } = await chrome.storage.local.get({
            proxyServers: [],
        });
        if (!res.success) return;

        const currentIp = res.data?.localIp || '';
        const callback = async () => {
            setIp(currentIp);
            updateStorage({ ip: currentIp });
        };
        const { ip: oldIp } = await chrome.storage.local.get({ ip: '' });

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
        }
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

    useEffect(() => {
        const { ip, config } = cachedState;
        setIp(ip);
        setConfig(config);

        // revalidate
        const isAutoIp = config.ipGetMode !== 'fixed';
        isAutoIp && getLocalIp();
    }, [JSON.stringify(cachedState)]);

    useEffect(() => {
        if (isEmpty(clientUserState?.activeTab)) return;
        setTab(clientUserState.activeTab);
    }, [clientUserState]);

    if (isEmpty(config)) return null;

    return (
        <div className="container" style={getSize()}>
            <div className="header">
                <div>
                    <Space size={4}>
                        你的ip: {ip}
                        <Tooltip title="刷新ip" placement="right">
                            <SyncOutlined
                                className={
                                    refreshLoading ? 'refresh-loading' : ''
                                }
                                style={{ cursor: 'pointer' }}
                                onClick={refreshIpAddress}
                            />
                        </Tooltip>
                    </Space>
                </div>
                <div>
                    <Space size={8}>
                        <Segmented
                            options={[
                                { label: '代理', value: POPUP_TAB.PROXY },
                                { label: '环境', value: POPUP_TAB.ENV },
                            ]}
                            value={tab}
                            onChange={async (value) => {
                                setTab(value as POPUP_TAB);
                                updateUserState({
                                    activeTab: value as POPUP_TAB,
                                });
                            }}
                        />
                        <Button type="link">
                            <SettingOutlined onClick={openOptionPage} />
                        </Button>
                    </Space>
                </div>
            </div>
            <div className="content">
                <KeepAlive active={tab === POPUP_TAB.PROXY}>
                    <ProxyList ip={ip} />
                </KeepAlive>
                <KeepAlive active={tab === POPUP_TAB.ENV}>
                    <EnvList />
                </KeepAlive>
            </div>
        </div>
    );
};

export default Popup;
