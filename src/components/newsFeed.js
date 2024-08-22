import React, { useState, useEffect } from "react";
import {
  fetchNewsAPI,
  fetchGuardianAPI,
  fetchNYTAPI,
} from "../services/newsServices";
import Search from "./search";
import Filter from "./filter";
import Pagination from "react-paginate";
import {
  Card,
  CardContent,
  Typography,
  CardMedia,
  Button,
  Container,
  Grid,
} from "@mui/material";
import { styled } from "@mui/system";

// Styled Pagination Component
const StyledPagination = styled(Pagination)({
  display: "flex",
  justifyContent: "center",
  marginTop: "20px",
  "& .page-item": {
    margin: "0 5px",
  },
  "& .page-link": {
    padding: "10px 20px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    cursor: "pointer",
    textDecoration: "none",
    color: "#007bff",
    backgroundColor: "white",
  },
  "& .page-link:hover": {
    backgroundColor: "#e9ecef",
    color: "#0056b3",
  },
  "& .active .page-link": {
    backgroundColor: "#007bff",
    color: "white",
    border: "1px solid #007bff",
  },
  "& .previous, & .next": {
    padding: "10px 20px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    cursor: "pointer",
  },
  "& .previous:hover, & .next:hover": {
    backgroundColor: "#e9ecef",
    color: "#0056b3",
  },
  "& .disabled .page-link": {
    cursor: "not-allowed",
    color: "#ccc",
  },
});

// Styled Article Card
const StyledCard = styled(Card)({
  display: "flex",
  flexDirection: "column",
  height: "100%",
  borderRadius: "8px",
  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
  transition: "transform 0.2s, box-shadow 0.2s",
  "&:hover": {
    transform: "scale(1.02)",
    boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.2)",
  },
});

const NewsFeed = () => {
  const [articles, setArticles] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [articlesPerPage] = useState(10);
  const [filters, setFilters] = useState({
    query: "",
    date: "",
    categories: "",
    sources: "",
  });

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const query = filters.query || "";
        const newsAPIResults = await fetchNewsAPI(query, filters);
        const guardianAPIResults = await fetchGuardianAPI(query, filters);
        const nytAPIResults = await fetchNYTAPI(query, filters);

        // Debug API Results
        console.log("News API Results:", newsAPIResults);
        console.log("Guardian API Results:", guardianAPIResults);
        console.log("NYT API Results:", nytAPIResults);

        // Map Guardian articles to match the format of other APIs
        const formattedGuardianResults = guardianAPIResults.map((article) => ({
          id: article.id || article.webUrl || article.webPublicationDate,
          sectionId: article.sectionId || "",
          sectionName: article.sectionName || "",
          webPublicationDate: article.webPublicationDate || "",
          webTitle:
            article.webTitle ||
            (article.fields && article.fields.headline) ||
            "",
          webUrl: article.webUrl || "",
          apiUrl: article.apiUrl || "",
          fields: {
            headline:
              (article.fields && article.fields.headline) || "No headline",
            standfirst:
              (article.fields && article.fields.standfirst) || "No standfirst",
            trailText:
              (article.fields && article.fields.trailText) || "No trail text",
            byline: (article.fields && article.fields.byline) || "Unknown",
            main: (article.fields && article.fields.main) || "No main content",
            body: (article.fields && article.fields.body) || "No body content",
            // Choose the first image if available
            thumbnail:
              (article.fields && article.fields.thumbnail) ||
              (article.fields &&
                article.fields.image &&
                article.fields.image[0]) || // Assuming image is an array
              "", // Ensure image URL is present
          },
          urlToImage:
            article.fields?.thumbnail || article.fields?.image?.[0] || "", // Choose the first image if available
          source: "Guardian", // Add source information
        }));

        const allResults = [
          ...nytAPIResults.map((article) => ({
            ...article,
            source: "NYT", // Add source information
          })),
          ...newsAPIResults.map((article) => ({
            ...article,
            source: "NewsAPI", // Add source information
          })),
          ...formattedGuardianResults,
        ];

        // Filter articles to ensure necessary fields are present
        const filteredArticles = allResults.filter(
          (article) =>
            (article.fields?.headline || article.title) &&
            (article.fields?.trailText || article.description) &&
            (article.webUrl || article.url)
        );

        console.log("Filtered Articles:", filteredArticles);

        setArticles(filteredArticles);
      } catch (error) {
        console.error("Error fetching articles:", error);
      }
    };

    fetchArticles();
  }, [filters]);

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  const startIndex = currentPage * articlesPerPage;
  const endIndex = startIndex + articlesPerPage;
  const currentArticles = articles.slice(startIndex, endIndex);

  return (
    <Container>
      <Search onSearch={(query) => setFilters({ ...filters, query })} />
      <Filter filters={filters} setFilters={setFilters} />

      <Grid container spacing={3} mt={3}>
        {currentArticles.map((article) => (
          <Grid item xs={12} sm={6} md={4} key={article.id}>
            <StyledCard>
              {article.urlToImage && (
                <CardMedia
                  component="img"
                  height="140"
                  image={article.urlToImage}
                  alt={article?.fields?.headline || article.title || "No Image"}
                />
              )}
              <CardContent sx={{ flex: "1 0 auto" }}>
                <Typography gutterBottom variant="h6" component="div">
                  {article?.fields?.headline || article?.title || "No Headline"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {article?.fields?.trailText ||
                    article?.description ||
                    "No Description"}
                </Typography>
                <Typography variant="body2" color="text.secondary" mt={2}>
                  <strong>Author:</strong>{" "}
                  {article?.fields?.byline || "Unknown"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Published At:</strong>{" "}
                  {new Date(
                    article?.webPublicationDate || article?.publishedAt
                  ).toLocaleDateString() || "Unknown Date"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Source:</strong> {article.source || "Unknown Source"}
                </Typography>
              </CardContent>
              <Button
                size="small"
                href={article.webUrl || article.url}
                target="_blank"
                rel="noopener noreferrer"
                variant="contained"
                color="primary"
                sx={{ m: 2 }}
              >
                Read More
              </Button>
            </StyledCard>
          </Grid>
        ))}
      </Grid>

      <StyledPagination
        pageCount={Math.ceil(articles.length / articlesPerPage)}
        onPageChange={handlePageClick}
        containerClassName="pagination"
        pageClassName="page-item"
        pageLinkClassName="page-link"
        previousClassName="page-item previous"
        previousLinkClassName="page-link"
        nextClassName="page-item next"
        nextLinkClassName="page-link"
        breakClassName="page-item"
        breakLinkClassName="page-link"
        activeClassName="active"
      />
    </Container>
  );
};

export default NewsFeed;
