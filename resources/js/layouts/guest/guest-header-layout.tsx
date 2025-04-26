import GuestContent from '@/components/guest-content';
import GuestFooter from '@/components/guest-footer';
import GuestShell from '@/components/guest-shell';
import * as React from 'react';
import GuestHeader from '@/components/guest-header';

interface GuestContentProps {
    children: React.ReactNode;
}

export default function GuestHeaderLayout({ children }: GuestContentProps) {
    return (
        <GuestShell>
            <GuestHeader />
            <GuestContent>{children}</GuestContent>
            <GuestFooter />
        </GuestShell>
    );
}
