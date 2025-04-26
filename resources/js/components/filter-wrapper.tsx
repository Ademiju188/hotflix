import React, { useEffect, useRef } from 'react';
import SlimSelect from 'slim-select';

interface FilterWrapperProps {
    // Add any props you need
}

const FilterWrapper: React.FC<FilterWrapperProps> = () => {
    // Refs for select elements
    const genreSelectRef = useRef<HTMLSelectElement>(null);
    const qualitySelectRef = useRef<HTMLSelectElement>(null);
    const rateSelectRef = useRef<HTMLSelectElement>(null);
    const sortSelectRef = useRef<HTMLSelectElement>(null);

    // Initialize SlimSelect instances
    useEffect(() => {
        if (genreSelectRef.current) {
            new SlimSelect({
                select: genreSelectRef.current,
                settings: {
                    showSearch: false, // Disable search if not needed
                    placeholderText: 'All genres',
                }
            });
        }

        if (qualitySelectRef.current) {
            new SlimSelect({
                select: qualitySelectRef.current,
                settings: {
                    showSearch: false,
                    placeholderText: 'Any quality',
                }
            });
        }

        if (rateSelectRef.current) {
            new SlimSelect({
                select: rateSelectRef.current,
                settings: {
                    showSearch: false,
                    placeholderText: 'Any rating',
                }
            });
        }

        if (sortSelectRef.current) {
            new SlimSelect({
                select: sortSelectRef.current,
                settings: {
                    showSearch: false,
                    placeholderText: 'Relevance',
                }
            });
        }

        // Cleanup function
        return () => {
            // Destroy SlimSelect instances if needed
        };
    }, []);

    return (
        <div className="filter filter--fixed">
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <div className="filter__content">
                            <button className="filter__menu" type="button">
                                <i className="ti ti-filter"></i>Filter
                            </button>

                            <div className="filter__items">
                                <select
                                    ref={genreSelectRef}
                                    className="filter__select"
                                    name="genre"
                                    id="filter__genre"
                                >
                                    <option value="0">All genres</option>
                                    <option value="1">Action/Adventure</option>
                                    <option value="2">Animals</option>
                                    {/* ... other genre options ... */}
                                </select>

                                <select
                                    ref={qualitySelectRef}
                                    className="filter__select"
                                    name="quality"
                                    id="filter__quality"
                                >
                                    <option value="0">Any quality</option>
                                    <option value="1">HD 1080</option>
                                    <option value="2">HD 720</option>
                                    <option value="3">DVD</option>
                                    <option value="4">TS</option>
                                </select>

                                <select
                                    ref={rateSelectRef}
                                    className="filter__select"
                                    name="rate"
                                    id="filter__rate"
                                >
                                    <option value="0">Any rating</option>
                                    <option value="1">from 3.0</option>
                                    <option value="2">from 5.0</option>
                                    <option value="3">from 7.0</option>
                                    <option value="4">Golder Star</option>
                                </select>

                                <select
                                    ref={sortSelectRef}
                                    className="filter__select"
                                    name="sort"
                                    id="filter__sort"
                                >
                                    <option value="0">Relevance</option>
                                    <option value="1">Newest</option>
                                    <option value="2">Oldest</option>
                                </select>
                            </div>

                            <button className="filter__btn" type="button">Apply</button>
                            <span className="filter__amount">Showing 18 of 1713</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FilterWrapper;
