import React, { createContext, useState, useEffect, useCallback } from 'react';
import { 
  getProducts, 
  getProductById, 
  createProduct, 
  updateProduct, 
  deleteProduct 
} from '../services/api';

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch products');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchProductById = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProductById(id);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to fetch product');
      console.error('Error fetching product:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };


  const addProduct = async (productData) => {
    setLoading(true);
    setError(null);
    try {
      const newProduct = await createProduct(productData);
      setProducts(prevProducts => [...prevProducts, newProduct]);
      return newProduct;
    } catch (err) {
      setError(err.message || 'Failed to add product');
      console.error('Error adding product:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };


  const updateProductById = async (id, productData) => {
    setLoading(true);
    setError(null);
    try {
      const updatedProduct = await updateProduct(id, productData);
      setProducts(prevProducts => 
        prevProducts.map(product => 
          product.id === id ? updatedProduct : product
        )
      );
      return updatedProduct;
    } catch (err) {
      setError(err.message || 'Failed to update product');
      console.error('Error updating product:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeProduct = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await deleteProduct(id);
      setProducts(prevProducts => 
        prevProducts.filter(product => product.id !== id)
      );
    } catch (err) {
      setError(err.message || 'Failed to delete product');
      console.error('Error deleting product:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <ProductContext.Provider
      value={{
        products,
        loading,
        error,
        fetchProducts,
        fetchProductById,
        addProduct,
        updateProductById,
        removeProduct
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export default ProductProvider;