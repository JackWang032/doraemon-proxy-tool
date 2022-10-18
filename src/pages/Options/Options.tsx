import React, { useEffect, useState } from 'react';
import {
    Badge,
    Col,
    Collapse,
    Divider,
    Empty,
    Form,
    Input,
    List,
    Modal,
    Radio,
    Row,
} from 'antd';
import { Link } from 'react-router-dom';
import IconToolTip from './IconToolTip';
import { DeleteTwoTone } from '@ant-design/icons';
import { useForm } from 'antd/es/form/Form';
import './Options.scss';

interface IProps {}
const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
};
const Panel = Collapse.Panel;

const Options: React.FC<IProps> = () => {
    const [servers, setServers] = useState<TProxyServer[]>([]);
    const [ip, setIp] = useState<string>('');
    const [config, setConfig] = useState<any>();
    const [form] = useForm();

    useEffect(() => {
        chrome.storage.local
            .get({ proxyServers: [], ip: '', config: {} })
            .then((res) => {
                setServers(res.proxyServers);
                setIp(res.ip);
                setConfig(res.config);
            });
    }, []);

    useEffect(() => {
        document.body.className = config?.theme === 'dark' ? 'dark' : '';
    }, [config]);

    const deleteProxyServer = (server: TProxyServer) => {
        Modal.confirm({
            title: '提示',
            content: `确认删除代理服务 "${server.serverName}"? 删除后可以重新抓取`,
            onOk: () => {
                const newServers = servers.filter(
                    (item) => item.serverId !== server.serverId
                );
                setServers(newServers);
                chrome.storage.local.set({ proxyServers: newServers });
            },
        });
    };

    const handleFormChange = (changedValues: any) => {
        if (changedValues.ip) {
            setIp(changedValues.ip);
            chrome.storage.local.set({ ip: changedValues.ip });
        }
        const newConfig = Object.assign({}, config);
        if (changedValues.ipGetMode) {
            newConfig.ipGetMode = changedValues.ipGetMode;
        }
        if (changedValues.size) {
            newConfig.size = changedValues.size;
        }
        if (changedValues.theme) {
            newConfig.theme = changedValues.theme;
        }
        setConfig(newConfig);
        chrome.storage.local.set({ config: newConfig });
    };

    return (
        <div className="container">
            <header>
                <div className="title">系统设置</div>
                <Link to={'/document'}>使用帮助</Link>
            </header>

            <Divider />
            {config && (
                <Form
                    form={form}
                    {...formItemLayout}
                    style={{ width: '60%', minWidth: 650 }}
                    onValuesChange={handleFormChange}
                >
                    <div className="option-item">
                        <div className="option-title">IP设置</div>
                        <Form.Item
                            name="ip"
                            label="当前ip地址"
                            initialValue={ip}
                        >
                            <Input
                                style={{ width: 250 }}
                                disabled={config.ipGetMode === 'auto'}
                            />
                        </Form.Item>
                        <Form.Item
                            name="ipGetMode"
                            label="ip获取方式"
                            initialValue={config.ipGetMode}
                        >
                            <Radio.Group>
                                <Radio value="auto">
                                    自动获取
                                    <IconToolTip title="每次启动浏览器时获取" />
                                </Radio>
                                <br />
                                <Radio value="fixed">
                                    固定IP
                                    <IconToolTip title="将当前ip设为固定ip" />
                                </Radio>
                            </Radio.Group>
                        </Form.Item>
                    </div>
                    <div className="option-item">
                        <div className="option-title">外观</div>
                        <Form.Item
                            name="size"
                            label="Popup大小"
                            initialValue={config.size}
                        >
                            <Radio.Group>
                                <Radio value="small">小</Radio>
                                <Radio value="default">默认</Radio>
                                <Radio value="large">大</Radio>
                                <Radio value="auto">自适应</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item
                            name="theme"
                            label="主题"
                            initialValue={config.theme}
                        >
                            <Radio.Group>
                                <Radio value="dark">暗色</Radio>
                                <Radio value="light">亮色</Radio>
                            </Radio.Group>
                        </Form.Item>
                    </div>
                    <div className="option-item">
                        <div className="option-title">代理服务配置</div>
                        <Collapse expandIconPosition="end">
                            {servers.map((server) => (
                                <Panel
                                    header={
                                        <>
                                            <span className="server-name">
                                                {server.serverName}
                                            </span>
                                            <span className="server-address">
                                                代理服务地址
                                                {server.serverAddress}
                                            </span>
                                        </>
                                    }
                                    key={server.serverId}
                                    extra={
                                        <DeleteTwoTone
                                            onClick={(e) => {
                                                deleteProxyServer(server);
                                                e.stopPropagation();
                                            }}
                                        />
                                    }
                                >
                                    <List
                                        header={
                                            <Row style={{ width: '100%' }}>
                                                <Col span={8}>规则</Col>
                                                <Col span={12}>代理目标</Col>
                                                <Col span={4}>启用状态</Col>
                                            </Row>
                                        }
                                        bordered
                                        rowKey="id"
                                        dataSource={server.rules}
                                        renderItem={(item) => (
                                            <List.Item>
                                                <Row style={{ width: '100%' }}>
                                                    <Col span={8}>
                                                        {item.remark}
                                                    </Col>
                                                    <Col span={12}>
                                                        {item.target}
                                                    </Col>
                                                    <Col span={4}>
                                                        {item.status === 1 ? (
                                                            <Badge status="success" />
                                                        ) : (
                                                            <Badge status="error" />
                                                        )}
                                                    </Col>
                                                </Row>
                                            </List.Item>
                                        )}
                                    />
                                </Panel>
                            ))}
                        </Collapse>
                        {!servers.length && (
                            <Empty
                                style={{
                                    padding: '24px 0',
                                }}
                                description={
                                    <span>
                                        未添加代理服务，点击
                                        <a
                                            href="http://doraemon.dtstack.com/page/proxy-server"
                                            target="_blink"
                                        >
                                            此处
                                        </a>
                                        去添加
                                    </span>
                                }
                            ></Empty>
                        )}
                    </div>
                </Form>
            )}
        </div>
    );
};

export default Options;
