import React, { useEffect } from 'react';
import { Link } from '@inertiajs/react';

const GuestFooter = () => {
    // Proper React way to handle the scroll-to-top functionality
    const handleScrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    // If you need to add the event listener after component mounts
    useEffect(() => {
        const backButton = document.querySelector('.footer__back');
        if (backButton) {
            backButton.addEventListener('click', handleScrollToTop);

            // Cleanup function to remove the event listener
            return () => {
                backButton.removeEventListener('click', handleScrollToTop);
            };
        }
    }, []);

    // Better alternative: Use React's onClick handler directly
    return (
        <footer className="footer">
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <div className="footer__content">
                            <Link href="/" className="footer__logo">
                                <img src="/assets/frontend/img/logo.svg" alt="HotFlix Logo" />
                            </Link>

                            <span className="footer__copyright">
                                © HOTFLIX, 2019—2024 <br />
                                Create by <a href="https://themeforest.net/user/dmitryvolkov/portfolio" target="_blank" rel="noopener noreferrer">Dmitry Volkov</a>
                            </span>

                            <nav className="footer__nav">
                                <Link href="/about">About Us</Link>
                                <Link href="/contacts">Contacts</Link>
                                <Link href="/privacy">Privacy policy</Link>
                            </nav>

                            <button
                                className="footer__back"
                                type="button"
                                onClick={handleScrollToTop}
                                aria-label="Scroll to top"
                            >
                                <i className="ti ti-arrow-narrow-up"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default GuestFooter;
