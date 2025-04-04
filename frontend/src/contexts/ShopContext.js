import React, { createContext, useState, useEffect, useContext, useCallback, useRef } from 'react';
import { shopApi, productApi } from '../services/api';
import { AuthContext } from './AuthContext';
import { debounce } from 'lodash';
import { useNavigate } from 'react-router-dom';

export const ShopContext = createContext();

export const ShopProvider = ({ children }) => {
    const { currentUser, isAuthenticated } = useContext(AuthContext);
    const [myShop, setMyShop] = useState(null);
    const [shopProducts, setShopProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [fetchingProducts, setFetchingProducts] = useState(false);
    const hasInitializedRef = useRef(false);
    const navigate = useNavigate();

    const fetchShopProducts = useCallback(async (shopId) => {
        if (fetchingProducts) return;
        
        setFetchingProducts(true);
        try {
            const response = await productApi.getProductsByShop(shopId);
            const productsWithShopId = [...response.data];
            productsWithShopId._shopId = shopId;
            setShopProducts(productsWithShopId);
        } catch (err) {
            console.error('Error fetching shop products:', err);
            setError('Failed to fetch shop products');
        } finally {
            setFetchingProducts(false);
        }
    }, []);  


    const fetchMyShop = useCallback(async () => {
        if (loading) return;

        setLoading(true);
        setError(null);
        try {
            const response = await shopApi.getMyShop();

            if (response.data && response.data.message === "No shop exists for this user") {
                setMyShop(null);
                console.log('No shop found. Redirecting to create shop page.');
                navigate('/create-shop');
            } else {
                setMyShop(response.data);
                if (response.data && response.data.id) {
                    fetchShopProducts(response.data.id);
                }
            }
        } catch (err) {
            console.error('Error fetching shop:', err);
            setError('Failed to fetch shop information');
        } finally {
            setLoading(false);
        }
    }, [navigate, fetchShopProducts]);

    useEffect(() => {
        if (isAuthenticated && currentUser && !hasInitializedRef.current) {
            const debouncedFetch = debounce(() => {
                fetchMyShop();
                hasInitializedRef.current = true;
            }, 300);

            debouncedFetch();
            return () => debouncedFetch.cancel();
        } else if (!isAuthenticated) {
            setMyShop(null);
            setShopProducts([]);
            hasInitializedRef.current = false;
        }
    }, [isAuthenticated, currentUser, fetchMyShop]);

    const createShop = useCallback(async (shopData) => {
        setLoading(true);
        setError(null);
        try {
            const userData = JSON.parse(localStorage.getItem('user'));
            if (!userData) {
                throw new Error("Please log in again to create a shop");
            }
            
            shopData = {
                ...shopData,
                ownerId: userData.id
            };
            
            console.log('Creating shop with data:', shopData);
            const response = await shopApi.createShop(shopData);
            console.log('Shop creation successful:', response.data);
            setMyShop(response.data);
            return response.data;
        } catch (err) {
            console.error('Shop creation error details:', err);
            const errorMessage = err.response?.data?.message || 'Failed to create shop';
            setError(errorMessage);
            
            if (errorMessage.includes("User not found")) {
                setError("Your account information has changed. Please log out and log in again.");
            }
            
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    const updateShop = useCallback(async (shopId, shopData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await shopApi.updateShop(shopId, shopData);
            setMyShop(response.data);
            return response.data;
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to update shop';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    updateShop.uploadLogo = async (shopId, formData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await shopApi.uploadLogo(shopId, formData);
            return response.data;
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to upload logo';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const addProduct = useCallback(async (productData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await productApi.createProduct(productData);
            setShopProducts(prevProducts => {
                const newProducts = [...prevProducts, response.data];
                if (prevProducts._shopId) newProducts._shopId = prevProducts._shopId;
                return newProducts;
            });
            return response.data;
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to add product';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    const updateProduct = useCallback(async (productId, productData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await productApi.updateProduct(productId, productData);
            setShopProducts(prevProducts => {
                const newProducts = prevProducts.map(product =>
                    product.id === productId ? response.data : product
                );
                if (prevProducts._shopId) newProducts._shopId = prevProducts._shopId;
                return newProducts;
            });
            return response.data;
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to update product';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteProduct = useCallback(async (productId) => {
        setLoading(true);
        setError(null);
        try {
            await productApi.deleteProduct(productId);
            setShopProducts(prevProducts => {
                const newProducts = prevProducts.filter(product => product.id !== productId);
                if (prevProducts._shopId) newProducts._shopId = prevProducts._shopId;
                return newProducts;
            });
            return true;
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to delete product';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    const contextValue = {
        myShop,
        shopProducts,
        loading,
        error,
        fetchMyShop,
        fetchShopProducts,
        createShop,
        updateShop,
        addProduct,
        updateProduct,
        deleteProduct,
        hasShop: !!myShop,
    };

    return (
        <ShopContext.Provider value={contextValue}>
            {children}
        </ShopContext.Provider>
    );
};

export default ShopProvider;

