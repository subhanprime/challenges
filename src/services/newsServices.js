import axios from "axios";

// Define API keys
const API_KEY_NEWSAPI = "b3282a10afe54c7fb0aff90dfcb3efca";
const API_KEY_GUARDIAN = "38c3bf9f-51d4-4632-ac54-9d15ba0afd5e";
const API_KEY_NYT = "DPoY7OV9l38YLyPjLGianY6UnjcJA0Fg";

// Create an instance of axios with a default timeout
const axiosInstance = axios.create({
  timeout: 10000, // Set a timeout for requests
});

// Normalize NYT article format
const normalizeNYTArticle = (article) => {
  const imageUrl = article.multimedia?.find(
    (media) => media.subtype === "mobileMasterAt3x"
  )?.url;
  return {
    title: article.headline?.main || article.headline?.kicker || "No Title",
    description: article.snippet || article.lead_paragraph || "No Description",
    url: article.web_url || article.uri,
    urlToImage: imageUrl ? `https://www.nytimes.com/${imageUrl}` : "",
    author: article.byline?.original || "Unknown",
    publishedAt: article.pub_date || new Date().toISOString(),
  };
};

// Fetch articles from NewsAPI
// Helper function to build query strings from parameters
const buildQueryString = (params) => {
  return Object.keys(params)
    .filter((key) => params[key] !== undefined && params[key] !== null) // Filter out undefined or null values
    .map(
      (key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
    )
    .join("&");
};

// Fetch articles from NewsAPI
export const fetchNewsAPI = async (query = "", filters = {}) => {
  const today = new Date().toISOString().split("T")[0];
  const maxDate = "2024-07-21"; // NewsAPI limit for historical data
  const minDate = "2024-07-22"; // One day after the maxDate to handle boundary issues

  // Ensure 'from' and 'to' dates are within the allowed range
  const fromDate = filters.fromDate
    ? filters.fromDate < minDate
      ? minDate
      : filters.fromDate
    : minDate;
  const toDate = filters.toDate
    ? filters.toDate <= today
      ? filters.toDate
      : today
    : today;

  // Default values for parameters if not provided
  const defaultParams = {
    q: query || "trump", // Default query to a common term if not provided
    from: fromDate,
    to: toDate,
    sources: filters.sources || "", // Default to empty string if not provided
    language: filters.language || "en",
    sortBy: filters.sortBy || "relevancy",
  };

  // Ensure at least one required parameter is provided
  if (!defaultParams.q && !defaultParams.sources) {
    console.error(
      "Error: Required parameters are missing. Please provide a query or sources."
    );
    return [];
  }

  const params = {
    ...defaultParams,
    apiKey: API_KEY_NEWSAPI,
  };

  const url = `https://newsapi.org/v2/everything?${buildQueryString(params)}`;

  try {
    const response = await axiosInstance.get(url);

    // Handle specific status code indicating an upgrade is needed
    if (response.status === 426) {
      console.error(
        "Error: Upgrade Required (426). The API request requires an upgrade."
      );
      return []; // Handle the case where upgrade is needed
    }

    // Check for valid data in the response
    if (!response.data || !response.data.articles) {
      console.error("No data returned from NewsAPI.");
      return [];
    }

    // Ensure articles array is always returned
    return response.data.articles || [];
  } catch (error) {
    // Log error with more details and return an empty array
    console.error(
      "Error fetching data from NewsAPI:",
      error.response?.data || error.message
    );
    return [];
  }
};

// Fetch articles from The Guardian
export const fetchGuardianAPI = async (
  query = "world",
  filters = {
    categories: "",
    fromDate: "2023-01-01",
    toDate: new Date().toISOString().split("T")[0],
  }
) => {
  // Build parameters for the API request
  const params = {
    q: query,
    section: filters.categories || undefined, // Omit 'section' if empty or undefined
    "from-date": filters.fromDate,
    "to-date": filters.toDate,
    "show-fields": "all",
    "api-key": API_KEY_GUARDIAN,
  };

  // Construct the URL with query parameters
  const url = `https://content.guardianapis.com/search?${buildQueryString(
    params
  )}`;

  try {
    // Make the API request
    const response = await axios.get(url);
    console.log(
      "guardian response==============================",
      response.data.response.results
    );

    // Check for valid data in the response
    if (
      !response.data ||
      !response.data.response ||
      !response.data.response.results
    ) {
      console.error("No data returned from The Guardian.");
      return [];
    }

    // Return the results from the response
    return response.data.response.results.map((result) => ({
      id: result.id,
      sectionId: result.sectionId,
      sectionName: result.sectionName,
      webPublicationDate: result.webPublicationDate,
      webTitle: result.webTitle,
      webUrl: result.webUrl,
      apiUrl: result.apiUrl,
      fields: {
        headline: result.fields.headline,
        standfirst: result.fields.standfirst,
        trailText: result.fields.trailText,
        byline: result.fields.byline,
        main: result.fields.main,
        body: result.fields.body,
      },
    }));
  } catch (error) {
    // Handle errors and log them
    console.error(
      "Error fetching data from The Guardian:",
      error.response?.data || error.message
    );
    return [];
  }
};

// Fetch articles from New York Times
export const fetchNYTAPI = async (
  query = "technology",
  filters = {
    categories: "",
    fromDate: "2023-01-01",
    toDate: new Date().toISOString().split("T")[0],
  }
) => {
  // Build parameters for the API request
  const params = {
    q: query,
    fq: filters.categories,
    begin_date: filters.fromDate
      ? filters.fromDate.replace(/-/g, "")
      : "20230101",
    end_date: filters.toDate
      ? filters.toDate.replace(/-/g, "")
      : new Date().toISOString().split("T")[0].replace(/-/g, ""),
    "api-key": API_KEY_NYT,
  };

  // Construct the URL with query parameters
  const url = `https://api.nytimes.com/svc/search/v2/articlesearch.json?${buildQueryString(
    params
  )}`;
  console.log("fetchNYTAPI===============================", url);

  try {
    // Make the API request
    const response = await axiosInstance.get(url);

    console.log(
      "fetchNYTAPI===============================",
      response?.data?.response?.docs
    );
    // Handle specific status code indicating an upgrade is needed
    if (response.status === 426) {
      console.error(
        "Error: Upgrade Required (426). The API request requires an upgrade."
      );
      return [];
    }
    // Check for valid data in the response
    if (
      !response.data ||
      !response.data.response ||
      !response.data.response.docs
    ) {
      console.error("No data returned from New York Times.");
      return [];
    }
    // Normalize and return the documents from the response
    return response.data.response.docs.map(normalizeNYTArticle);
  } catch (error) {
    // Handle errors and log them
    console.error("Error fetching data from New York Times:", error.message);
    return [];
  }
};
