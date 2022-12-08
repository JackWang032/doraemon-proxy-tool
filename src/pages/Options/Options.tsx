import React, { useEffect, useState } from 'react';
import {
    Collapse,
    Divider,
    Form,
    Input,
    Radio,
} from 'antd';
import IconToolTip from './IconToolTip';
import { useForm } from 'antd/es/form/Form';
import { isEmpty } from 'lodash';
import './Options.scss';

interface IProps {}
const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
};
const Panel = Collapse.Panel;

const Options: React.FC<IProps> = () => {
    const [ip, setIp] = useState<string>('');
    const [config, setConfig] = useState<any>();
    const [form] = useForm();

    useEffect(() => {
        chrome.storage.local
            .get({ ip: '', config: {} })
            .then((res) => {
                setIp(res.ip);
                setConfig(res.config);
            });
    }, []);

    useEffect(() => {
        if (isEmpty(config)) return
        if (config.theme !== 'auto') {
            document.body.className = config.theme;
        } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.body.className = 'dark';
        }
    }, [config]);

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
                                <Radio value="auto">自适应</Radio>
                            </Radio.Group>
                        </Form.Item>
                    </div>
                </Form>
            )}
        </div>
    );
};

export default Options;
