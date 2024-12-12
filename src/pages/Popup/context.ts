import React from "react";
import { initStorage } from "../Background";

type DispatchStorage =
    | Partial<IStorageCache>
    | ((prev: IStorageCache) => IStorageCache);

type DispatchUserState = 
    | Partial<IStorageCache['clientUserState']>
    | ((prev: IStorageCache['clientUserState']) => IStorageCache['clientUserState']);

export type StorageCacheContextProps = IStorageCache & {
    updateStorage: (dispatchStorage: DispatchStorage) => void;
    updateUserState: (dispatchUserState: DispatchUserState) => void;
};

export const StorageCacheContext =
    React.createContext<StorageCacheContextProps>({
        ...initStorage,
        updateStorage: () => {},
        updateUserState: () => {},
    });