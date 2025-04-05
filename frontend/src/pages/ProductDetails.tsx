import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useProduct } from '../contexts/ProductContext';
import { useAuth } from '../contexts/AuthContext';
import {
  Container,
  Paper,
  Typography,
  Grid,
  Button,
  CircularProgress,
  Alert,
  Divider,
  Box,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';

const ProductDetails: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { getProductById, loading, error } = useProduct();
  const { token } = useAuth();
  const [product, setProduct] = useState<any>(null);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const data = await getProductById(Number(id));
        setProduct(data);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Erro ao carregar produto:', err);
        navigate('/products');
      }
    };

    if (id) {
      loadProduct();
    }
  }, [id, getProductById, navigate]);

  const handleBack = () => {
    navigate('/products');
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg">
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <Container maxWidth="lg">
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={handleBack}
        sx={{ mt: 2 }}
      >
        Voltar
      </Button>
      <Paper elevation={3} sx={{ p: 4, mt: 2 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Box
              component="img"
              src={product.imageUrl}
              alt={product.name}
              sx={{
                width: '100%',
                height: 'auto',
                maxHeight: 400,
                objectFit: 'contain',
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h4" gutterBottom>
              {product.name}
            </Typography>
            <Typography variant="h5" color="primary" gutterBottom>
              R$ {product.price.toFixed(2)}
            </Typography>
            <Typography variant="body1" paragraph>
              {product.description}
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Estoque
                </Typography>
                <Typography variant="body1">
                  {product.stock} unidades
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Categoria
                </Typography>
                <Typography variant="body1">
                  {product.category}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">
                  Vendedor
                </Typography>
                <Typography variant="body1">
                  {product.userName}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">
                  Data de Cadastro
                </Typography>
                <Typography variant="body1">
                  {new Date(product.createdAt).toLocaleDateString()}
                </Typography>
              </Grid>
            </Grid>
            <Box sx={{ mt: 4 }}>
              {token ? (
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  size="large"
                >
                  Comprar
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  size="large"
                  onClick={() => navigate('/login')}
                >
                  Faça login para comprar
                </Button>
              )}
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default ProductDetails; 