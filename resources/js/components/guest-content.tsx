import * as React from 'react';

interface GuestContentProps {
    children: React.ReactNode;
}

export default function GuestContent({ children, ...props }: GuestContentProps) {
    return <>{children}</>;
}
