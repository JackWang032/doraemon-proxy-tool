import { theme } from "antd";

export const getThemeAlgorithm = (themeConfig?: IConfig['theme']) => {
    switch (themeConfig) {
        case 'dark':
            return theme.darkAlgorithm;
        case 'light':
            return theme.defaultAlgorithm;
        case 'compact':
            const sysThemeAlgorithm = window.matchMedia('(prefers-color-scheme: dark)').matches ? theme.darkAlgorithm : theme.defaultAlgorithm;
            return [sysThemeAlgorithm, theme.compactAlgorithm];
        case 'auto': 
            return window.matchMedia('(prefers-color-scheme: dark)').matches ? theme.darkAlgorithm : theme.defaultAlgorithm;
        default:
            return theme.defaultAlgorithm;
    }
}

export const getThemeType = (themeConfig?: IConfig['theme']): 'light' | 'dark' => {
    switch (themeConfig) {
        case 'dark':
            return 'dark';
        case 'light':
            return 'light';
        case 'compact':
        case 'auto':
            return window.matchMedia('(prefers-color-scheme: dark)').matches
                ? 'dark'
                : 'light';
        default:
            return 'light';
    }
};