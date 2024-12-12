import React, { useEffect, useState } from 'react';
import { Space, Tag } from 'antd';
import api from '@/api';

const EnvFilter = ({ value, onChange }) => {
    const [tagList, setTagList] = useState<ITagInfo[]>([]);

    const getTagList = () => {
        api.getTagList().then((res) => {
            if (res.success) {
                const { data } = res.data || {};
                setTagList(data);
            }
        });
    };

    const handleChange = (tag: number, checked: boolean) => {
        const nextSelectedTags = checked
            ? [...value, tag]
            : value.filter((t) => t !== tag);
        onChange(nextSelectedTags);
    };

    useEffect(() => {
        getTagList();
    }, []);

    return (
        <Space size={4} style={{ marginBottom: 16 }} wrap>
            {tagList.map((tag) => (
                <Tag.CheckableTag
                    key={tag.id}
                    checked={value.includes(tag.id)}
                    onChange={(checked) => handleChange(tag.id, checked)}
                >
                    {tag.tagName}
                </Tag.CheckableTag>
            ))}
        </Space>
    );
};

export default EnvFilter;
