import React, { useState } from 'react';
import { fetchNewsAPI, fetchGuardianAPI, fetchNYTAPI } from '../services/newsServices';
import Search from './search';
import Filter from './filter';

const NewsFeed = () => {
    const [articles, setArticles] = useState([]);
    const [filters, setFilters] = useState({ date: '', categories: '', sources: '' });

    const handleSearch = (query) => {
        Promise.all([
            fetchNewsAPI(query, filters),
            fetchGuardianAPI(query, filters),
            fetchNYTAPI(query, filters),
        ])
            .then((results) => {
                const mergedArticles = results.flatMap((result) => result.data.articles || result.data.response.results || result.data.response.docs);
                setArticles(mergedArticles);
            })
            .catch((error) => console.error('Error fetching articles:', error));
    };

    return (
        <div>
            <Search onSearch={handleSearch} />
            <Filter filters={filters} setFilters={setFilters} />
            <div>
                {articles.map((article, index) => (
                    <div key={index}>
                        <h2>{article.title}</h2>
                        <p>{article.description}</p>
                        <a href={article.url} target="_blank" rel="noopener noreferrer">Read more</a>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NewsFeed;
