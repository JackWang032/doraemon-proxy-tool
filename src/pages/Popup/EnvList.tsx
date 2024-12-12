import React, { useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Button, Collapse, Divider, message, Space, Tooltip } from 'antd';
import { CopyOutlined, LinkOutlined } from '@ant-design/icons';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import EnvFilter from './EnvFilter';
import { StorageCacheContext } from './context';
import api from '@/api';
import useMemorizeScroll from './useMemorizeScroll';

const CopySpan = ({ text }) => {
    return (
        <span>
            <span style={{ marginRight: 4 }}>{text}</span>
            <CopyToClipboard
                text={text}
                onCopy={() => message.success('复制成功')}
            >
                <CopyOutlined style={{ color: '#1677ff' }} />
            </CopyToClipboard>
        </span>
    );
};

const LinkifyText = ({ text }) => {
    const linkify = (inputText) => {
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const parts = inputText.split(urlRegex);
        return parts.map((part, index) => {
            if (urlRegex.test(part)) {
                return (
                    <a
                        href={part}
                        key={index}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {part}
                    </a>
                );
            }
            return part;
        });
    };

    const linkifyText = useMemo(() => {
        return linkify(text);
    }, [text]);

    return linkifyText;
};

const EnvList: React.FC<{}> = () => {
    const scrollContainer = useRef<HTMLDivElement>(null);

    const {
        updateStorage,
        updateUserState,
        clientUserState,
        envList: cachedEnvList,
    } = useContext(StorageCacheContext);

    const [envList, setEnvList] = useState<IEnvInfo[]>(cachedEnvList || []);
    const [selectedTags, setSelectedTags] = useState<number[]>(clientUserState.selectedTags);
    const [activePanelKey, setActivePanelKey] = useState<string>(clientUserState.activePanelKey || '');

    const formatHost = (hostIpStr: string) => {
        return hostIpStr
            .split(/\s+/)
            .filter(Boolean)
            .map((hostIp, i) => <CopySpan key={hostIp + i} text={hostIp} />);
    };

    const getEnvList = (tags) => {
        const params = tags?.length ? { tags } : {};
        api.getEnvList(params).then((res) => {
            if (res.success) {
                const envList = res.data || [];
                setEnvList(envList);
                updateStorage({
                    envList,
                });
            }
        });
    };

    const jumpToEnv = (url: string) => {
        chrome.tabs
            .query({ active: true, currentWindow: true })
            .then((tabs) => {
                const tab = tabs[0];
                const index = (tab?.index || 0) + 1;
                chrome.tabs.create({
                    url,
                    active: true,
                    index: index,
                });
            });
    };

    useEffect(() => {
        getEnvList(clientUserState.selectedTags);
    }, [clientUserState]);

    useMemorizeScroll(scrollContainer, {
        getMemorizedScroll: () => clientUserState.envScrollTop || 0,
        memorize: (scrollTop) => {
            updateUserState({ envScrollTop: scrollTop });
        },
    })

    return (
        <div key='env-list' className='scroll-wrapper' ref={scrollContainer}>
            <EnvFilter
                value={selectedTags}
                onChange={(value) => {
                    setSelectedTags(value);
                    getEnvList(value);
                    updateUserState({ selectedTags: value });
                }}
            />
            <Collapse
                collapsible="header"
                accordion
                activeKey={activePanelKey}
                onChange={(key) => {
                    setActivePanelKey(key[0]);
                    updateUserState({ activePanelKey: key[0] });
                }}
                items={envList.map((envInfo) => {
                    return {
                        key: envInfo.id,
                        label: (
                            <span style={{ fontWeight: 500 }}>
                                {envInfo.envName}
                            </span>
                        ),
                        extra: (
                            <Tooltip
                                title={'访问' + envInfo?.url}
                                placement="right"
                            >
                                <Button
                                    type="link"
                                    size="small"
                                    onClick={() => jumpToEnv(envInfo.url)}
                                >
                                    <LinkOutlined />
                                </Button>
                            </Tooltip>
                        ),
                        children: (
                            <>
                                {envInfo.hostIp && (
                                    <>
                                        <Divider>主机IP</Divider>
                                        <div>
                                            <Space size={10} wrap>
                                                {formatHost(envInfo.hostIp)}
                                            </Space>
                                        </div>
                                    </>
                                )}
                                {(envInfo.uicUsername || envInfo.uicPasswd) && (
                                    <>
                                        <Divider>UIC账号密码</Divider>
                                        <div>
                                            {envInfo.uicUsername && (
                                                <p>
                                                    <CopySpan
                                                        text={
                                                            envInfo.uicUsername
                                                        }
                                                    />
                                                </p>
                                            )}
                                            {envInfo.uicPasswd && (
                                                <p>
                                                    <CopySpan
                                                        text={envInfo.uicPasswd}
                                                    />
                                                </p>
                                            )}
                                        </div>
                                    </>
                                )}
                                {envInfo.remark && (
                                    <>
                                        <Divider>备注</Divider>
                                        <div style={{ wordBreak: 'break-all' }}>
                                            <LinkifyText
                                                text={envInfo.remark}
                                            />
                                        </div>
                                    </>
                                )}
                            </>
                        ),
                    };
                })}
            />
        </div>
    );
};

export default EnvList;
