import React from 'react';
import './Options.css';
import {Input} from 'antd'
import 'antd/dist/antd.css'
interface Props {
  title: string;
}

const Options: React.FC<Props> = ({ title }: Props) => {
  return <div className="OptionsContainer">{title} 
  </div>;
};

export default Options;
