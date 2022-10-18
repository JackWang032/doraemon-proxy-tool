import React from 'react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import doc from '@/assets/md/doc.md';
import { Divider } from 'antd';
import './markdown.scss';

const Document: React.FC<any> = () => {
    return (
        <div className="container">
            <header>
                <div className="title">使用帮助</div>
                <Link to={'/'}>返回</Link>
            </header>
            <Divider />
            <div className="markdown-wrapper markdown-content">
                <ReactMarkdown
                    transformImageUri={(src) => {
                        return chrome.runtime.getURL(src);
                    }}
                >
                    {doc}
                </ReactMarkdown>
            </div>
        </div>
    );
};

export default Document;
