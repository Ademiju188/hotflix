import '../../css/main.css';

interface GuestShellProps {
    children: React.ReactNode;
    variant?: 'header' | 'sidebar';
}
export default function GuestShell({ children, variant }: GuestShellProps) {
    return (
        <>
            {children}
        </>
    );
}
