// hooks/useDynamicCss.ts
import { useEffect } from 'react';

const useDynamicCss = (href: string) => {
    useEffect(() => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        link.dataset.dynamic = 'true';
        document.head.appendChild(link);

        return () => {
            const existing = document.querySelector(`link[href="${href}"]`);
            if (existing) existing.remove();
        };
    }, [href]);
};

export default useDynamicCss;
