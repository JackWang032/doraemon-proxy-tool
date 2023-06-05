type TProxyServer = {
    serverId: number;
    serverName: string;
    serverAddress: string;
    rules: any[];
};

type TProxyDataResponse = {
    success: boolean;
    data: TProxyServer | null
}

interface IConfig {
    ipGetMode: 'auto' | 'fixed';
    size: { type: any; width: number | null; height: number | null };
    theme: 'auto' | 'dark' | 'auto';
}