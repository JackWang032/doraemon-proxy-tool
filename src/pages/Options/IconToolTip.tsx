import React from 'react';
import { InfoCircleOutlined } from '@ant-design/icons';
import { Tooltip, TooltipProps } from 'antd';

const IconTooltip: React.FC<TooltipProps> = (props: TooltipProps) => {
    return (
        <Tooltip color="blue" {...props}>
            <InfoCircleOutlined style={{ marginLeft: 5 }} />
        </Tooltip>
    );
};

export default IconTooltip;
