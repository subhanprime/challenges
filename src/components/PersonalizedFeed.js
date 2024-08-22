import React, { useState, useEffect } from 'react';
import Filter from './filter';

const PersonalizedFeed = () => {
    const [preferences, setPreferences] = useState({
        sources: localStorage.getItem('sources') || '',
        categories: localStorage.getItem('categories') || '',
    });

    useEffect(() => {
        localStorage.setItem('sources', preferences.sources);
        localStorage.setItem('categories', preferences.categories);
    }, [preferences]);

    return (
        <div>
            <Filter filters={preferences} setFilters={setPreferences} />
            {/* Render personalized articles here */}
        </div>
    );
};

export default PersonalizedFeed;
