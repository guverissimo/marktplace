import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import api from '../services/api';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  imageUrl: string;
  userId: number;
  userName: string;
  createdAt: string;
}

interface ProductContextData {
  products: Product[];
  userProducts: Product[];
  loading: boolean;
  error: string | null;
  createProduct: (product: Omit<Product, 'id' | 'userId' | 'userName' | 'createdAt'>) => Promise<void>;
  updateProduct: (id: number, product: Omit<Product, 'id' | 'userId' | 'userName' | 'createdAt'>) => Promise<void>;
  deleteProduct: (id: number) => Promise<void>;
  getProductById: (id: number) => Promise<Product>;
  searchProducts: (name: string) => Promise<void>;
  getProductsByCategory: (category: string) => Promise<void>;
  getUserProducts: () => Promise<void>;
}

const ProductContext = createContext<ProductContextData>({} as ProductContextData);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [userProducts, setUserProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  useEffect(() => {
    if (token) {
      getUserProducts();
    }
  }, [token]);

  const createProduct = async (product: Omit<Product, 'id' | 'userId' | 'userName' | 'createdAt'>) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.post('/products', product);
      setUserProducts([...userProducts, response.data]);
    } catch (err) {
      setError('Erro ao criar produto');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (id: number, product: Omit<Product, 'id' | 'userId' | 'userName' | 'createdAt'>) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.put(`/products/${id}`, product);
      setUserProducts(userProducts.map(p => p.id === id ? response.data : p));
    } catch (err) {
      setError('Erro ao atualizar produto');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      await api.delete(`/products/${id}`);
      setUserProducts(userProducts.filter(p => p.id !== id));
    } catch (err) {
      setError('Erro ao excluir produto');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getProductById = async (id: number): Promise<Product> => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/products/${id}`);
      return response.data;
    } catch (err) {
      setError('Erro ao buscar produto');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const searchProducts = async (name: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/products/search?name=${name}`);
      setProducts(response.data.content);
    } catch (err) {
      setError('Erro ao buscar produtos');
    } finally {
      setLoading(false);
    }
  };

  const getProductsByCategory = async (category: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/products/category/${category}`);
      setProducts(response.data.content);
    } catch (err) {
      setError('Erro ao buscar produtos por categoria');
    } finally {
      setLoading(false);
    }
  };

  const getUserProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/products/user');
      setUserProducts(response.data.content);
    } catch (err) {
      setError('Erro ao buscar produtos do usuário');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        userProducts,
        loading,
        error,
        createProduct,
        updateProduct,
        deleteProduct,
        getProductById,
        searchProducts,
        getProductsByCategory,
        getUserProducts,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProduct = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProduct must be used within a ProductProvider');
  }
  return context;
}; 