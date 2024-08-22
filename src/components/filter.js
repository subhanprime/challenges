import React from "react";
import { TextField, Grid, Typography, Box } from "@mui/material";
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

const FilterSection = styled(Box)({
  marginBottom: 16,
});

const Filter = ({ filters, setFilters }) => {
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <FilterSection>
      <Typography variant="h6" gutterBottom>
        Filters
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <StyledTextField
            fullWidth
            label="Date"
            variant="outlined"
            name="date"
            value={filters.date}
            onChange={handleChange}
            type="date"
            InputLabelProps={{ shrink: true }}
            size="small"
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StyledTextField
            fullWidth
            label="Categories"
            variant="outlined"
            name="categories"
            value={filters.categories}
            onChange={handleChange}
            size="small"
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StyledTextField
            fullWidth
            label="Sources"
            variant="outlined"
            name="sources"
            value={filters.sources}
            onChange={handleChange}
            size="small"
          />
        </Grid>
      </Grid>
    </FilterSection>
  );
};

export default Filter;
