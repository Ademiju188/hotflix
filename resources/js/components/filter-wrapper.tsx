import React, { useEffect, useRef, useState } from 'react';
import SlimSelect from 'slim-select';

interface FilterWrapperProps {
    categories: {
        data: Array<{
            id: number;
            name: string;
            slug: string;
        }>;
    };
    filters?: {
        category?: string;
        sort?: string;
        search?: string;
    };
    onFilterChange: (filters: { category?: string; sort?: string; search?: string }) => void;
}

const FilterWrapper: React.FC<FilterWrapperProps> = ({
    categories,
    filters = {},
    onFilterChange
}) => {
    const [filterSideBar, setFilterSideBar] = useState(false);
    const [localFilters, setLocalFilters] = useState({
        category: filters.category || '',
        sort: filters.sort || ''
    });

    // Refs for select elements
    const genreSelectDesktopRef = useRef<HTMLSelectElement>(null);
    const sortSelectDesktopRef = useRef<HTMLSelectElement>(null);
    const genreSelectMobileRef = useRef<HTMLSelectElement>(null);
    const sortSelectMobileRef = useRef<HTMLSelectElement>(null);

    // Refs for SlimSelect instances
    const genreSelectDesktop = useRef<SlimSelect | null>(null);
    const sortSelectDesktop = useRef<SlimSelect | null>(null);
    const genreSelectMobile = useRef<SlimSelect | null>(null);
    const sortSelectMobile = useRef<SlimSelect | null>(null);

    // Initialize SlimSelect instances
    useEffect(() => {
        // Desktop selects
        if (genreSelectDesktopRef.current) {
            genreSelectDesktop.current = new SlimSelect({
                select: genreSelectDesktopRef.current,
                settings: {
                    showSearch: false,
                    placeholderText: 'All Categories',
                }
            });
        }

        if (sortSelectDesktopRef.current) {
            sortSelectDesktop.current = new SlimSelect({
                select: sortSelectDesktopRef.current,
                settings: {
                    showSearch: false,
                    placeholderText: 'Relevance',
                }
            });
        }

        // Mobile selects
        if (genreSelectMobileRef.current) {
            genreSelectMobile.current = new SlimSelect({
                select: genreSelectMobileRef.current,
                settings: {
                    showSearch: false,
                    placeholderText: 'All Categories',
                }
            });
        }

        if (sortSelectMobileRef.current) {
            sortSelectMobile.current = new SlimSelect({
                select: sortSelectMobileRef.current,
                settings: {
                    showSearch: false,
                    placeholderText: 'Relevance',
                }
            });
        }

        // Cleanup function
        return () => {
            [genreSelectDesktop.current, sortSelectDesktop.current, genreSelectMobile.current, sortSelectMobile.current].forEach(select => {
                if (select) {
                    select.destroy();
                }
            });
        };
    }, []);

    // Sync select values when localFilters change
    // useEffect(() => {
    //     if (genreSelectDesktop.current) {
    //         genreSelectDesktop.current.set(localFilters.category);
    //     }
    //     if (sortSelectDesktop.current) {
    //         sortSelectDesktop.current.set(localFilters.sort);
    //     }
    //     if (genreSelectMobile.current) {
    //         genreSelectMobile.current.set(localFilters.category);
    //     }
    //     if (sortSelectMobile.current) {
    //         sortSelectMobile.current.set(localFilters.sort);
    //     }
    // }, [localFilters]);

    const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setLocalFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const applyFilters = () => {
        onFilterChange(localFilters);
        setFilterSideBar(false);
    };

    return (
        <>
            {/* Desktop Filter */}
            <div className="filter filter--fixed">
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <div className="filter__content">
                                <button
                                    className="filter__menu"
                                    type="button"
                                    onClick={() => setFilterSideBar(true)}
                                >
                                    <i className="ti ti-filter"></i>Filter
                                </button>

                                <div className="filter__items">
                                    <select
                                        ref={genreSelectDesktopRef}
                                        className="filter__select"
                                        name="category"
                                        id="filter__genre_desktop"
                                        value={localFilters.category}
                                        onChange={handleFilterChange}
                                    >
                                        <option value="">All Categories</option>
                                        {categories.data.map(category => (
                                            <option key={category.id} value={category.slug}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>

                                    <select
                                        ref={sortSelectDesktopRef}
                                        className="filter__select"
                                        name="sort"
                                        id="filter__sort_desktop"
                                        value={localFilters.sort}
                                        onChange={handleFilterChange}
                                    >
                                        <option value="">Relevance</option>
                                        <option value="newest">Newest</option>
                                        <option value="oldest">Oldest</option>
                                    </select>
                                </div>

                                <button
                                    className="filter__btn"
                                    type="button"
                                    onClick={applyFilters}
                                >
                                    Apply
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Filter Sidebar */}
            <div className={`mfilter ${filterSideBar ? 'mfilter--active' : ''}`}>
                <div className="mfilter__head">
                    <h6 className="mfilter__title">Filter</h6>
                    <button
                        className="mfilter__close"
                        type="button"
                        onClick={() => setFilterSideBar(false)}
                    >
                        <i className="ti ti-x"></i>
                    </button>
                </div>

                <div className="mfilter__select-wrap">
                    <div className="sign__group">
                        <select
                            ref={genreSelectMobileRef}
                            className="filter__select"
                            name="category"
                            id="filter__genre_mobile"
                            value={localFilters.category}
                            onChange={handleFilterChange}
                        >
                            <option value="">All Categories</option>
                            {categories.data.map(category => (
                                <option key={category.id} value={category.slug}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="sign__group">
                        <select
                            ref={sortSelectMobileRef}
                            className="filter__select"
                            name="sort"
                            id="filter__sort_mobile"
                            value={localFilters.sort}
                            onChange={handleFilterChange}
                        >
                            <option value="">Relevance</option>
                            <option value="newest">Newest</option>
                            <option value="oldest">Oldest</option>
                        </select>
                    </div>
                </div>

                <button
                    className="mfilter__apply"
                    type="button"
                    onClick={applyFilters}
                >
                    Apply
                </button>
            </div>
        </>
    );
};

export default FilterWrapper;
