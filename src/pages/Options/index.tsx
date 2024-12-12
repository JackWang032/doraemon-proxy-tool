import React from 'react';
import { render } from 'react-dom';
import Options from './Options';
import './index.scss';

const Root = () => {
    return <Options />;
};
render(<Root />, window.document.querySelector('#app'));
