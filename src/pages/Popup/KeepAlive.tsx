import React, { Suspense, useContext, useEffect, useRef } from 'react';

export interface KeepAliveProps {
    active: boolean;
    children: React.ReactElement;
}

const KeepAliveContext = React.createContext<{
    registerActiveEffect: (effectCallback) => void;
    registerDeactiveEffect: (effectCallback) => void;
}>({
    registerActiveEffect: () => undefined,
    registerDeactiveEffect: () => undefined,
});

export const useActiveEffect = (callback) => {
    const { registerActiveEffect } = useContext(KeepAliveContext);

    useEffect(() => {
        registerActiveEffect?.(callback);
    }, []);
};

export const useDeactiveEffect = (callback) => {
    const { registerDeactiveEffect } = useContext(KeepAliveContext);

    useEffect(() => {
        registerDeactiveEffect?.(callback);
    }, []);
};

const Wrapper = ({ children, active }: KeepAliveProps) => {
    const resolveRef = useRef<((...args) => void) | null>();

    if (active) {
        resolveRef.current && resolveRef.current();
        resolveRef.current = null;
    } else {
        throw new Promise((resolve) => {
            resolveRef.current = resolve;
        });
    }

    return children;
};

const KeepAlive: React.FC<KeepAliveProps> = ({ active, children }) => {
    const activeEffects = useRef<(() => void)[]>([]);
    const deactiveEffects = useRef<(() => void)[]>([]);

    const registerActiveEffect = (callback) => {
        activeEffects.current.push(() => {
            callback();
        });
    };

    const registerDeactiveEffect = (callback) => {
        deactiveEffects.current.push(() => {
            callback();
        });
    };

    useEffect(() => {
        if (active) {
            activeEffects.current.forEach((effect) => {
                effect();
            });
        } else {
            deactiveEffects.current.forEach((effect) => {
                effect();
            });
        }
    }, [active]);

    return (
        <KeepAliveContext.Provider value={{ registerActiveEffect, registerDeactiveEffect }}>
            <Suspense fallback={null}>
                <Wrapper active={active}>{children}</Wrapper>
            </Suspense>
        </KeepAliveContext.Provider>
    );
};

export default KeepAlive;
