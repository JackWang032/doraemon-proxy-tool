import React from 'react';
import { InfoCircleOutlined } from '@ant-design/icons';
import { Tooltip, TooltipProps } from 'antd';

const IconToolTip: React.FC<TooltipProps> = (props: TooltipProps) => {
    return (
        <Tooltip color="blue" {...props}>
            <InfoCircleOutlined style={{ marginLeft: 5 }} />
        </Tooltip>
    );
};

export default IconToolTip;
