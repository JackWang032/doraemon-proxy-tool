// 哆啦A梦后端接口地址
export const serverUrl = 'http://172.16.100.225:7001'

// 哆啦A梦访问地址
export const doraemonUrl = 'http://172.16.100.225:7001/page/proxy-server'

export enum POPUP_SIZE_TYPE {
    DEFAULT = 1,
    SMALL,
    LARGE,
    AUTO,
    CUSTOM
}

export enum POPUP_TAB {
    PROXY = 'proxy',
    ENV = 'env'
}