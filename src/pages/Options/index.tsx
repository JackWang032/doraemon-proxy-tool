import React from 'react';
import { render } from 'react-dom';
import Options from './Options';
import './index.scss';

(() => {
    const isDarkTheme = window.matchMedia(
        '(prefers-color-scheme: dark)'
    ).matches;
    import(`antd/dist/antd.${isDarkTheme ? 'dark.' : ''}css`);
})();

const Root = () => {
    return (
        <Options />
    );
};
render(<Root />, window.document.querySelector('#app'));
