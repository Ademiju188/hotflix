import { SharedData } from '@/types';
import '../../css/welcome.css'
import { useEffect, useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';

export default function Welcome({ pricingPlans }: PricingPlanPros) {

    const { auth } = usePage<SharedData>().props;

    const [processing, setProcessing] = useState(false);
    const [processingPlanId, setProcessingPlanId] = useState<number | null>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const classes = [
        'plan',
        'plan plan--orange',
        'plan plan--red'
    ];

    useEffect(() => {
        const handleClick = (e) => {
            const targetId = e.currentTarget.getAttribute('href');
            if (targetId.startsWith('#')) {
                e.preventDefault();
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        };

        const links = document.querySelectorAll('#nav-links a[href^="#"]');
        links.forEach(link => {
            link.addEventListener('click', handleClick);
        });

        return () => {
            links.forEach(link => {
                link.removeEventListener('click', handleClick);
            });
        };
    }, []);

    const handlePlan = async (plan: PricingPlans) => {
        setProcessing(true);
        setProcessingPlanId(plan.id);
        await router.post(route('process-subscription', plan.uuid), {}, {
            preserveScroll: true,
            onError: (err) => {
                setProcessing(false);
                setProcessingPlanId(null);
            }
        });
    }


    return (
        <div className='bg-black text-white font-sans'>

            <header className="flex flex-col md:flex-row md:justify-between md:items-center p-4">
                <div className="flex items-center justify-between w-full md:w-auto">
                    <img src="/assets/frontend/img/logo.png" alt="ReelsBinge Logo" className="h-10" />
                    <button
                        className="md:hidden text-white focus:outline-none transition-transform duration-300"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        <div className={`w-6 flex flex-col gap-1 ${isMenuOpen ? 'items-center' : ''}`}>
                            <span className={`block h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-1.5 w-6' : 'w-6'}`}></span>
                            <span className={`block h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? 'opacity-0' : 'w-6'}`}></span>
                            <span className={`block h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-1.5 w-6' : 'w-6'}`}></span>
                        </div>
                    </button>
                </div>
                <nav
                    id="nav-links"
                    className={`${isMenuOpen ? 'flex' : 'hidden'}
                    flex-col md:flex md:flex-row md:items-center
                    gap-6 text-white mt-2 md:mt-0
                        transition-all duration-300 ease-in-out
                    `}
                >
                    <a
                        href="#home"
                        className="hover:text-red-400 scroll-smooth py-2 md:py-0"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        Home
                    </a>
                    <a
                        href="#pricing"
                        className="hover:text-red-400 scroll-smooth py-2 md:py-0"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        Pricing
                    </a>
                    <a
                        href="#faq"
                        className="hover:text-red-400 scroll-smooth py-2 md:py-0"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        FAQ
                    </a>
                    <a
                        href="#contact"
                        className="hover:text-red-400 scroll-smooth py-2 md:py-0"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        Contact
                    </a>
                    <Link
                        href={route('login')}
                        className="hover:text-red-400 md:hidden scroll-smooth py-2"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        Login
                    </Link>
                </nav>
            </header>

            <section className="text-center px-4 py-12">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">No Coins. No Limits. Just Pure Binge</h1>
                <p className="text-lg max-w-2xl mx-auto mb-8">
                    Watch 1,000+ short series from your favorite creators — all in one place.
                    One-click subscription, new episodes every week.
                </p>
                <div className="flex justify-center mb-10">
                    <Link href={route('login')} className="bg-[#B52022] hover:bg-red-600 text-white font-bold py-3 px-6 rounded-xl cursor-pointer">WATCH NOW</Link>
                </div>
                <div className="flex flex-wrap justify-center gap-8 mb-12">
                    <div className="text-center">
                        <div className="text-3xl">🔓</div>
                        <p className="text-sm mt-2">All episodes fully unlocked</p>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl">🎭</div>
                        <p className="text-sm mt-2">Stories from every platform</p>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl">💳</div>
                        <p className="text-sm mt-2">One flat subscription</p>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl">💰</div>
                        <p className="text-sm mt-2">No coins. No daily limits</p>
                    </div>
                </div>
            </section>

            <section className="px-4 mb-12">
                <h2 className="text-2xl font-semibold text-center mb-6">Featured Dramas</h2>
                <div className="flex overflow-x-auto gap-6 pb-2">
                    {/* <div className="text-center">
                        <img src="1.jpg" alt="Love and Betrayal" className="h-40 rounded-xl">
                            <p className="mt-2 text-sm">Love and Betrayal</p>
                    </div>
                    <div className="text-center">
                        <img src="2.jpg" alt="The Seductress" className="h-40 rounded-xl">
                            <p className="mt-2 text-sm">The Seductress</p>
                    </div>
                    <div className="text-center">
                        <img src="3.jpg" alt="Broken Vows" className="h-40 rounded-xl">
                            <p className="mt-2 text-sm">Broken Vows</p>
                    </div>
                    <div className="text-center">
                        <img src="4.jpg" alt="Dangerous Affair" className="h-40 rounded-xl">
                            <p className="mt-2 text-sm">Dangerous Affair</p>
                    </div>
                    <div className="text-center">
                        <img src="5.jpg" alt="Falling for You" className="h-40 rounded-xl">
                            <p className="mt-2 text-sm">Falling for You</p>
                    </div> */}
                </div>
            </section>

            <section id="pricing" className="bg-[#B52022] py-12 px-4 scroll-mt-24">
                <h2 className="text-2xl font-bold text-center mb-6">Choose Your Access Plan</h2>
                <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
                    {pricingPlans.data.map((plan, index) => {
                        return (
                            <div key={plan.id} className="bg-white text-black rounded-xl p-6 text-center">
                                <p className="text-xl font-bold">{plan.plan_type.name}</p>
                                <p className="text-2xl font-bold my-2">${plan.price}</p>
                                <button
                                    className="bg-[#B52022] text-white py-2 px-4 rounded-full font-semibold cursor-pointer"
                                    onClick={e => handlePlan(plan)}
                                    disabled={processingPlanId === plan.id || processingPlanId !== null}
                                >
                                    {processingPlanId === plan.id ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                            Processing...
                                        </>
                                    ) : (
                                        'START WATCHING NOW'
                                    )}
                                </button>
                            </div>
                        )
                    })}
                </div>

                <div className="mt-10 max-w-4xl mx-auto text-white text-center">
                    <p className="italic mb-4">"I used to spend $30/week on coins. This is way better." <br /> <strong>— Anna, NY</strong>
                    </p>
                    <p className="italic">"All episodes. No stress. Just binge." <br /> <strong>— Jare, Berlin</strong></p>
                </div>
            </section>

            <section id="faq" className="bg-black py-12 px-4 scroll-mt-24">
                <h2 className="text-2xl font-bold text-center mb-6">Frequently Asked Questions</h2>
                <div className="max-w-3xl mx-auto space-y-6">
                    <div>
                        <h3 className="font-semibold text-lg">Do I need to buy coins to watch?</h3>
                        <p className="text-sm text-gray-300">Nope! All content is unlocked with your subscription. No coins, ever.</p>
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg">What devices are supported?</h3>
                        <p className="text-sm text-gray-300">You can watch on mobile, tablet, or any browser-enabled device.</p>
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg">How often is new content added?</h3>
                        <p className="text-sm text-gray-300">Every week! We update our library with fresh short series.</p>
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg">Can I cancel anytime?</h3>
                        <p className="text-sm text-gray-300">Yes, cancel your subscription anytime without any hidden fees.</p>
                    </div>
                </div>
            </section>

            <footer className="bg-[#111] text-center text-white py-6">
                <p className="text-sm text-gray-300 mb-4">Trusted by 10,000+ binge-watchers worldwide. Updated weekly. No hidden fees.
                </p>
                <div className="mb-4">
                    <a href="#" className="mx-2 text-xl hover:text-red-400"><i className="ti ti-brand-facebook"></i></a>
                    <a href="#" className="mx-2 text-xl hover:text-red-400"><i className="ti ti-brand-instagram"></i></a>
                    <a href="#" className="mx-2 text-xl hover:text-red-400"><i className="ti ti-brand-twitter"></i></a>
                    <a href="#" className="mx-2 text-xl hover:text-red-400"><i className="ti ti-brand-youtube"></i></a>
                </div>
                <p className="text-sm text-gray-400">&copy; 2025 ReelsBinge. All rights reserved.</p>
            </footer>
        </div>
    )
}
