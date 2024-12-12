import React from 'react';
import { render } from 'react-dom';
import Popup from './Popup';
import { StorageCacheContext, StorageCacheContextProps } from './context';
import { ConfigProvider, ThemeConfig } from 'antd';
import { getThemeAlgorithm, getThemeType } from '@/utils';
import { merge } from 'lodash';
import './index.scss';

const LIGHT_THEME_COMPONENTS_CONFIG: ThemeConfig['components'] = {
    Collapse: {
        colorFillAlter: '#fff',
        colorBorder: '#f2f2f2',
        colorBgContainer: '#f8f8f8b3',
    },
    Segmented: {
        trackBg: '#212121',
        itemSelectedBg: '#363636',
        itemSelectedColor: '#fff',
        colorText: '#fff',
        itemColor: '#8c8c8c',
    },
};

const DARK_THEME_COMPONENTS_CONFIG: ThemeConfig['components'] = {
    Card: {
        colorBgContainer: '#171717d6',
    },
    Collapse: {
        colorBgContainer: '#171717d6'
    }
};

const COMMON_THEME_COMPONENTS_CONFIG: ThemeConfig['components'] = {
    Divider: {
        fontSizeLG: 14,
    },
    Card: {
        headerHeight: 40,
        paddingLG: 16,
    },
};

class AsyncStorageUpdater {
    updateTaskQueue: Function[] = [];
    isTaskRunning = false;

    addUpdateTask(task) {
        this.updateTaskQueue.push(task);
        if (!this.isTaskRunning) this.startTask();
    }

    async startTask() {
        this.isTaskRunning = true;
        while (this.updateTaskQueue.length) {
            const task = this.updateTaskQueue.shift()!;
            await task();
        }
        this.isTaskRunning = false;
    }
}

const asyncStorageUpdater = new AsyncStorageUpdater();

chrome.storage.local.get().then((store) => {
    if (!['auto', 'compact'].includes(store.config?.theme)) {
        document.body.className = store.config.theme;
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.body.className = 'dark';
    }

    const contextValue: StorageCacheContextProps = {
        ...(store as IStorageCache),
        updateStorage: (dispatchStorage) => {
            const updateTask = async () => {
                if (typeof dispatchStorage === 'function') {
                    const currentValues =
                        (await chrome.storage.local.get()) as IStorageCache;
                    const nextValues = {
                        ...currentValues,
                        ...dispatchStorage(currentValues),
                    };
                    await chrome.storage.local.set(nextValues);
                } else {
                    await chrome.storage.local.set(dispatchStorage);
                }
            };
            asyncStorageUpdater.addUpdateTask(updateTask);
        },
        updateUserState: (dispatchUserState) => {
            const updateTask = async () => {
                const { clientUserState } = await chrome.storage.local.get({
                    clientUserState: {},
                });
                const values =
                    typeof dispatchUserState === 'function'
                        ? dispatchUserState(clientUserState)
                        : dispatchUserState;
                const nextValues = {
                    ...clientUserState,
                    ...values,
                };
                await chrome.storage.local.set({
                    clientUserState: nextValues,
                });
            };
            asyncStorageUpdater.addUpdateTask(updateTask);
        },
    };

    render(
        <ConfigProvider
            theme={{
                algorithm: getThemeAlgorithm(store.config?.theme),
                components: merge(
                    COMMON_THEME_COMPONENTS_CONFIG,
                    getThemeType(store.config?.theme) === 'dark'
                        ? DARK_THEME_COMPONENTS_CONFIG
                        : LIGHT_THEME_COMPONENTS_CONFIG
                ),
            }}
        >
            <StorageCacheContext.Provider value={contextValue}>
                <Popup />
            </StorageCacheContext.Provider>
        </ConfigProvider>,
        window.document.querySelector('#app')
    );
});
