import React from 'react';
import { render } from 'react-dom';

import Popup from './Popup';
import './index.scss';

chrome.storage.local.get({ config: {} }).then(({ config }) => {
    if (config.theme !== 'auto') {
        document.body.className = config.theme;
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.body.className = 'dark';
    }
});
      
render(<Popup />, window.document.querySelector('#app'));