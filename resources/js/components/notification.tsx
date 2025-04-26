// components/Notification.tsx
import { useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type FlashMessage = {
    success?: string;
    error?: string;
    info?: string;
    warning?: string;
};

type FlashProps = {
    flash: {
        message: FlashMessage;
    };
};

const Notification: React.FC<FlashProps> = ({ flash }) => {
    useEffect(() => {
        // Check if flash.message exists and has content
        if (flash?.message) {
            const { success, error, info, warning } = flash.message;

            if (success) {
                toast.success(success);
            }

            if (error) {
                toast.error(error);
            }

            if (info) {
                toast.info(info);
            }

            if (warning) {
                toast.warning(warning);
            }
        }
    }, [flash]);

    return (
        <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
        />
    );
};

export default Notification;
