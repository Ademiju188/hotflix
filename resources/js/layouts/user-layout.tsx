import { Head, usePage } from '@inertiajs/react';
// import '../../css/admin.css';
// import '../../css/dashboard.css';
import Header from '@/pages/user/components/header';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect } from 'react';
import useDynamicCss from '@/hooks/useDynamicCss';

interface UserLayoutProps {
    children: React.ReactNode;
    title: string
}

export default function UserLayout({ children, title }: UserLayoutProps) {
    useDynamicCss('/assets/backend/css/admin.css');
    useDynamicCss('/assets/backend/css/dashboard.css');

    const { flash, errors }: any = usePage().props;

    useEffect(() => {
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

    return (
        <>
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
            <Head title={title} />
            <Header />
            {children}
        </>
    )
};
