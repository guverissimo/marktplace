import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProduct } from '../contexts/ProductContext';
import {
  Container,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  TextField,
  InputAdornment,
  CircularProgress,
  Alert,
  Button,
  MenuItem,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

const Products: React.FC = () => {
  const navigate = useNavigate();
  const { products, loading, error, searchProducts, getProductsByCategory } = useProduct();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const categories = [
    'Eletrônicos',
    'Roupas',
    'Alimentos',
    'Livros',
    'Esportes',
    'Casa',
    'Beleza',
    'Outros',
  ];

  useEffect(() => {
    if (searchTerm) {
      searchProducts(searchTerm);
    } else if (selectedCategory) {
      getProductsByCategory(selectedCategory);
    }
  }, [searchTerm, selectedCategory, searchProducts, getProductsByCategory]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedCategory(e.target.value);
  };

  return (
    <Container maxWidth="lg">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Produtos
        </Typography>
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Buscar produtos"
              value={searchTerm}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              select
              label="Categoria"
              value={selectedCategory}
              onChange={handleCategoryChange}
            >
              <MenuItem value="">Todas as categorias</MenuItem>
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {loading ? (
          <CircularProgress />
        ) : products.length === 0 ? (
          <Typography>Nenhum produto encontrado.</Typography>
        ) : (
          <Grid container spacing={3}>
            {products.map((product) => (
              <Grid item xs={12} sm={6} md={4} key={product.id}>
                <Card>
                  <CardMedia
                    component="img"
                    height="200"
                    image={product.imageUrl}
                    alt={product.name}
                  />
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {product.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {product.description}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      Preço: R$ {product.price.toFixed(2)}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      Estoque: {product.stock}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Categoria: {product.category}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Vendedor: {product.userName}
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      sx={{ mt: 2 }}
                      onClick={() => navigate(`/product/${product.id}`)}
                    >
                      Ver Detalhes
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Paper>
    </Container>
  );
};

export default Products; 