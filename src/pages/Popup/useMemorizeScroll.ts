import { throttle } from 'lodash';
import { useEffect, useLayoutEffect, useRef } from 'react';

export type MemorizeScrollHook = (
    scrollElement: React.RefObject<HTMLElement>,
    {
        getMemorizedScroll,
        memorize,
    }: {
        getMemorizedScroll: () => number;
        memorize: (scrollTop: number) => void;
    }
) => void;

const useMemorizeScroll: MemorizeScrollHook = (
    scrollElement,
    { getMemorizedScroll, memorize }
) => {
    const isMounted = useRef(false);
    useLayoutEffect(() => {
        setTimeout(() => {
            if (scrollElement.current) {
                scrollElement.current.scrollTo({
                    top: getMemorizedScroll(),
                });
            }
        }, 50);
    }, []);

    useEffect(() => {
        const handleScroll = (e) => {
            isMounted.current && memorize(e.target.scrollTop);
        }
        const throttleScroll = throttle(handleScroll, 400);
        scrollElement.current?.addEventListener('scroll', throttleScroll);

        isMounted.current = true;
        
        return () => {
            scrollElement.current?.removeEventListener('scroll', throttleScroll);
            scrollElement.current && memorize(scrollElement.current.scrollTop)
            isMounted.current = false;
        }
    }, [])
}

export default useMemorizeScroll;