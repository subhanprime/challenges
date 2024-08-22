import axios from 'axios';

const API_KEY_NEWSAPI = 'b3282a10afe54c7fb0aff90dfcb3efca';
const API_KEY_GUARDIAN = '38c3bf9f-51d4-4632-ac54-9d15ba0afd5e';
const API_KEY_NYT = 'DPoY7OV9l38YLyPjLGianY6UnjcJA0Fg';

const axiosInstance = axios.create({
    timeout: 10000, // Set a timeout for requests
});

// Helper function to build query strings
const buildQueryString = (params) => {
    return Object.keys(params)
        .filter((key) => params[key]) // Filter out undefined or null values
        .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
        .join('&');
};

// Fetch articles from NewsAPI
export const fetchNewsAPI = async (query, filters = {}) => {
    const params = {
        q: query,
        from: filters.date,
        sources: filters.sources,
        language: filters.language || 'en',
        sortBy: filters.sortBy || 'relevancy',
        apiKey: API_KEY_NEWSAPI,
    };

    const url = `https://newsapi.org/v2/everything?${buildQueryString(params)}`;

    try {
        const response = await axiosInstance.get(url);
        return response.data?.articles || []; // Safe access
    } catch (error) {
        console.error('Error fetching data from NewsAPI:', error.message);
        return [];
    }
};

// Fetch articles from The Guardian
export const fetchGuardianAPI = async (query, filters = {}) => {
    const params = {
        q: query,
        section: filters.categories,
        'from-date': filters.fromDate || '2023-01-01',
        'to-date': filters.toDate || new Date().toISOString().split('T')[0],
        'show-fields': 'all',
        'api-key': API_KEY_GUARDIAN,
    };

    const url = `https://content.guardianapis.com/search?${buildQueryString(params)}`;

    try {
        const response = await axiosInstance.get(url);
        return response.data?.response?.results || []; // Safe access
    } catch (error) {
        console.error('Error fetching data from The Guardian:', error.message);
        return [];
    }
};

// Fetch articles from New York Times
export const fetchNYTAPI = async (query, filters = {}) => {
    const params = {
        q: query,
        fq: filters.categories,
        begin_date: filters.fromDate ? filters.fromDate.replace(/-/g, '') : '20230101',
        end_date: filters.toDate ? filters.toDate.replace(/-/g, '') : new Date().toISOString().split('T')[0].replace(/-/g, ''),
        'api-key': API_KEY_NYT,
    };

    const url = `https://api.nytimes.com/svc/search/v2/articlesearch.json?${buildQueryString(params)}`;

    try {
        const response = await axiosInstance.get(url);
        return response.data?.response?.docs || []; // Safe access
    } catch (error) {
        console.error('Error fetching data from New York Times:', error.message);
        return [];
    }
};
