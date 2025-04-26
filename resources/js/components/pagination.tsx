import React from 'react';
import { Link } from '@inertiajs/react';

interface PaginationProps {
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
    meta?: {
        current_page: number;
        from: number;
        last_page: number;
        per_page: number;
        to: number;
        total: number;
    };
}

const Pagination: React.FC<PaginationProps> = ({ links, meta }) => {
    // Don't show pagination if there's only 1 page
    if (links.length <= 3 || !meta || meta.last_page <= 1) return null;

    // Get the page numbers to display (current page ± 2)
    const getPageNumbers = () => {
        const current = meta.current_page;
        const last = meta.last_page;
        const delta = 2;
        const range = [];

        for (let i = Math.max(2, current - delta); i <= Math.min(last - 1, current + delta); i++) {
            range.push(i);
        }

        if (current - delta > 2) {
            range.unshift('...');
        }
        if (current + delta < last - 1) {
            range.push('...');
        }

        range.unshift(1);
        if (last > 1) range.push(last);

        return range;
    };

    return (
        <div className="col-12">
            <div className="main__paginator">
                {meta && (
                    <span className="main__paginator-pages">
                        {meta.from}-{meta.to} of {meta.total}
                    </span>
                )}

                <ul className="main__paginator-list">
                    {links[0].url && (
                        <li>
                            <Link
                                href={links[0].url}
                                preserveScroll
                                className="flex items-center"
                            >
                                <i className="ti ti-chevron-left"></i>
                                <span>Prev</span>
                            </Link>
                        </li>
                    )}
                    {links[links.length - 1].url && (
                        <li>
                            <Link
                                href={links[links.length - 1].url}
                                preserveScroll
                                className="flex items-center"
                            >
                                <span>Next</span>
                                <i className="ti ti-chevron-right"></i>
                            </Link>
                        </li>
                    )}
                </ul>

                <ul className="paginator">
                    {links[0].url && (
                        <li className="paginator__item paginator__item--prev">
                            <Link href={links[0].url} preserveScroll>
                                <i className="ti ti-chevron-left"></i>
                            </Link>
                        </li>
                    )}

                    {getPageNumbers().map((page, index) => (
                        <li
                            key={index}
                            className={`paginator__item ${
                                page === meta?.current_page ? 'paginator__item--active' : ''
                            } ${
                                page === '...' ? 'paginator__item--ellipsis' : ''
                            }`}
                        >
                            {page === '...' ? (
                                <span>...</span>
                            ) : (
                                <Link
                                    href={links[page].url}
                                    preserveScroll
                                >
                                    {page}
                                </Link>
                            )}
                        </li>
                    ))}

                    {links[links.length - 1].url && (
                        <li className="paginator__item paginator__item--next">
                            <Link href={links[links.length - 1].url} preserveScroll>
                                <i className="ti ti-chevron-right"></i>
                            </Link>
                        </li>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default Pagination;
