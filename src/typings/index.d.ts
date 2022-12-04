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
