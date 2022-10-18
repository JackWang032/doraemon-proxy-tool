import React from 'react';
import { render } from 'react-dom';

import Popup from './Popup';
import './index.scss';
(() => {
  const isDarkTheme = window.matchMedia("(prefers-color-scheme: dark)").matches;
  import(`antd/dist/antd.${isDarkTheme ? 'dark.' : ''}css`);
})();


render(<Popup />, window.document.querySelector('#app'));