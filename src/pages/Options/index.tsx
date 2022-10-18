import React, { useEffect } from 'react';
import { render } from 'react-dom';
import { Routes, HashRouter, Route } from 'react-router-dom';
import Options from './Options';
import Document from './Document';
import './index.scss';
(() => {
    const isDarkTheme = window.matchMedia(
        '(prefers-color-scheme: dark)'
    ).matches;
    import(`antd/dist/antd.${isDarkTheme ? 'dark.' : ''}css`);
})();
chrome.storage.local.get({ config: {} }).then((data) => {
    if (data.config.theme === 'dark') {
        document.body.className = 'dark';
    }
});
const Root = () => {
    return (
        <HashRouter>
            <Routes>
                <Route path="/" element={<Options />}></Route>
                <Route path="/document" element={<Document />}></Route>
            </Routes>
        </HashRouter>
    );
};
render(<Root />, window.document.querySelector('#app'));
