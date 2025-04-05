import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProduct } from '../contexts/ProductContext';
import { useAuth } from '../contexts/AuthContext';
import {
  Container,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  CircularProgress,
  Alert,
  IconButton,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';

const MyProducts: React.FC = () => {
  const navigate = useNavigate();
  const { userProducts, loading, error, deleteProduct } = useProduct();
  const { token } = useAuth();

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  const handleEdit = (id: number) => {
    navigate(`/edit-product/${id}`);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      try {
        await deleteProduct(id);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Erro ao excluir produto:', err);
      }
    }
  };

  if (!token) {
    return null;
  }

  return (
    <Container maxWidth="lg">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Meus Produtos
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/new-product')}
          sx={{ mb: 3 }}
        >
          Novo Produto
        </Button>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {loading ? (
          <CircularProgress />
        ) : userProducts.length === 0 ? (
          <Typography>Você ainda não cadastrou nenhum produto.</Typography>
        ) : (
          <Grid container spacing={3}>
            {userProducts.map((product) => (
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
                    <Typography variant="body2" color="text.secondary">
                      Categoria: {product.category}
                    </Typography>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                      <IconButton
                        color="primary"
                        onClick={() => handleEdit(product.id)}
                        aria-label="editar"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(product.id)}
                        aria-label="excluir"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </div>
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

export default MyProducts; 