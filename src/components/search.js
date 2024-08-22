import React, { useState } from "react";
import { TextField, Button, Grid } from "@mui/material";
import { styled } from "@mui/system";

// Styled components
const StyledTextField = styled(TextField)({
  "& .MuiInputBase-root": {
    borderRadius: 20,
    border: "1px solid #ddd",
    backgroundColor: "#f9f9f9",
    padding: "0 10px",
  },
  "& .MuiOutlinedInput-notchedOutline": {
    border: "none",
  },
});

const StyledButton = styled(Button)({
  borderRadius: 20,
  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
  textTransform: "none",
  padding: "8px 20px",
  "&:hover": {
    backgroundColor: "#0056b3",
    boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.15)",
  },
});

const Search = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    if (onSearch) onSearch(query);
  };

  return (
    <Grid container spacing={2} alignItems="center" justifyContent="center">
      <Grid item xs={12} sm={8} md={6} lg={4}>
        <StyledTextField
          fullWidth
          placeholder="Search for news..."
          variant="outlined"
          size="small"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </Grid>
      <Grid item xs={12} sm={4} md={3} lg={2}>
        <StyledButton
          fullWidth
          variant="contained"
          color="primary"
          onClick={handleSearch}
        >
          Search
        </StyledButton>
      </Grid>
    </Grid>
  );
};

export default Search;
