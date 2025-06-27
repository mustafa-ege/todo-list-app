import { useState } from 'react';

const SearchBar = ({ onSearch }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        onSearch(value);
    };

    const handleClearSearch = () => {
        setSearchTerm('');
        onSearch('');
    };

    return (
        <div className="search-bar">
            <div className="search-input-container">
                <input
                    type="text"
                    className="search-input"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    placeholder="Search tasks by title or description..."
                />
                {searchTerm && (
                    <button
                        type="button"
                        className="clear-search-btn"
                        onClick={handleClearSearch}
                        title="Clear search"
                    >
                        ✕
                    </button>
                )}
            </div>
        </div>
    );
};

export default SearchBar;
