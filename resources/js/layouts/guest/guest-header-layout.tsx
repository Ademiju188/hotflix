import GuestContent from '@/components/guest-content';
import GuestFooter from '@/components/guest-footer';
import GuestShell from '@/components/guest-shell';
import * as React from 'react';
import GuestHeader from '@/components/guest-header';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { usePage } from '@inertiajs/react';

interface GuestContentProps {
    children: React.ReactNode;
    onSearch?: (searchTerm: string) => void;
}

export default function GuestHeaderLayout({ children, onSearch  }: GuestContentProps) {
    const { flash, errors }: any = usePage().props;
    const [searchTerm, setSearchTerm] = React.useState('');

    React.useEffect(() => {
        // Display success flash messages
        if (flash?.message?.success) {
            toast.success(flash.message.success);
        }

        // Display error flash messages
        if (flash?.message?.error) {
            toast.error(flash.message.error);
        }

        // Display validation errors
        if (errors && Object.keys(errors).length > 0) {
            // Display general form error if exists
            if (errors.message) {
                toast.error(errors.message);
            }

            // Display individual field errors
            Object.entries(errors).forEach(([field, message]) => {
                // Skip the general message since we already displayed it
                if (field !== 'message') {
                    // Replace underscores with spaces and capitalize first letter
                    const formattedField = field
                        .replace(/_/g, ' ')
                        .replace(/\b\w/g, char => char.toUpperCase());

                    toast.error(`${formattedField}: ${message}`, {
                        toastId: `validation-error-${field}` // Prevent duplicates
                    });
                }
            });
        }
    }, [flash, errors]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (onSearch && searchTerm.trim()) {
            onSearch(searchTerm);
        }
    };

    return (
        <GuestShell>
            <GuestHeader
                onSearchSubmit={handleSearch}
                searchValue={searchTerm}
                onSearchChange={(e) => setSearchTerm(e.target.value)}
            />
            <ToastContainer
                position="top-right"
                autoClose={9000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />
            <GuestContent>{children}</GuestContent>
            <GuestFooter />
        </GuestShell>
    );
}
