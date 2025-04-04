import axios from 'axios';

const API_URL = 'http://localhost:8081';


const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000
});

api.interceptors.request.use(
  (config) => {
    console.log('Making request to:', config.url);
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log('Received response from:', response.config.url, response.data);
    return response;
  },
  (error) => {
    console.error('API Error:', error);
    
    if (error.response) {
      console.error('Error status:', error.response.status);
      console.error('Error data:', error.response.data);
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Request setup error:', error.message);
    }
    
    return Promise.reject(error);
  }
);


const withRetry = async (apiCall, retries = 3, delay = 1000) => {
  try {
    return await apiCall();
  } catch (error) {
    if (retries === 0 || (error.response && error.response.status < 500)) throw error;
    await new Promise(resolve => setTimeout(resolve, delay));
    return withRetry(apiCall, retries - 1, delay * 2);
  }
};


export const productApi = {
  getAllProducts: () => {
    console.log('Calling getAllProducts');
    return api.get('/products');
  },
  getFeaturedProducts: () => {
    console.log('Calling getFeaturedProducts');
    return api.get('/products/featured');
  },
  getProductById: (id) => api.get(`/products/${id}`),
  getProductsByCategory: (categoryId) => api.get(`/products/category/${categoryId}`),
  searchProducts: (keyword) => api.get(`/products/search?keyword=${keyword}`),
  getProductsByShop: (shopId) => withRetry(() => api.get(`/products/shop/${shopId}`)),
  createProduct: (productData) => api.post('/products', productData),
  updateProduct: (id, productData) => api.put(`/products/${id}`, productData),
  deleteProduct: (id) => api.delete(`/products/${id}`),
  uploadImage: async (file) => {
    console.log('Uploading product image');
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'product');
    
    try {
      const response = await fetch('http://localhost:8081/api/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Image upload failed: ' + response.statusText);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error uploading product image:', error);
      throw error;
    }
  },
  uploadMultipleImages: async (files) => {
    console.log('Uploading multiple product images');
    
    const uploadPromises = [];
    const uploadResults = [];
    
    for (const file of files) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'product');
      
      uploadPromises.push(
        fetch('http://localhost:8081/api/upload', {
          method: 'POST',
          body: formData,
          credentials: 'include'
        })
        .then(response => {
          if (!response.ok) {
            throw new Error('Image upload failed: ' + response.statusText);
          }
          return response.json();
        })
        .then(data => {
          uploadResults.push(data.url);
          return data.url;
        })
      );
    }
    
    try {
      await Promise.all(uploadPromises);
      return { urls: uploadResults };
    } catch (error) {
      console.error('Error uploading multiple product images:', error);
      throw error;
    }
  }
};

export const categoryApi = {
  getAllCategories: () => {
    console.log('Calling getAllCategories');
    return api.get('/categories');
  },
  getCategoryById: (id) => api.get(`/categories/${id}`),
};

export const authApi = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  signup: (firstName, lastName, email, password) => api.post('/auth/signup', { firstName, lastName, email, password }),
};

export const orderApi = {
  createOrder: (orderData) => {
    const userId = JSON.parse(localStorage.getItem('user'))?.id;
    return api.post('/orders', orderData, {
      headers: { 'X-User-Id': userId }
    });
  },
  getUserOrders: () => {
    const userId = JSON.parse(localStorage.getItem('user'))?.id;
    return api.get('/orders', {
      headers: { 'X-User-Id': userId }
    });
  },
  getOrderById: (orderId) => {
    const userId = JSON.parse(localStorage.getItem('user'))?.id;
    return api.get(`/orders/${orderId}`, {
      headers: { 'X-User-Id': userId }
    });
  },
  getOrderByNumber: (orderNumber) => {
    const userId = JSON.parse(localStorage.getItem('user'))?.id;
    return api.get(`/orders/number/${orderNumber}`, {
      headers: { 'X-User-Id': userId }
    });
  }
};

export const paymentApi = {
  processPayment: (paymentData) => {
    const userId = JSON.parse(localStorage.getItem('user'))?.id;
    return api.post('/payments', paymentData, {
      headers: { 'X-User-Id': userId }
    });
  },
  getPaymentStatus: (paymentId) => api.get(`/payments/${paymentId}/status`),
  getPaymentByOrderId: (orderId) => api.get(`/payments/order/${orderId}`),
};


export const shopApi = {
  getAllShops: () => api.get('/shops'),
  getShopById: (id) => api.get(`/shops/${id}`),
  getMyShop: () => withRetry(() => api.get('/shops/my-shop')),
  createShop: (shopData) => {
    const token = localStorage.getItem('token');
    console.log('Creating shop with token:', token);
    

    let userId = null;
    if (token) {
      try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const payload = JSON.parse(window.atob(base64));
        userId = payload.userId;
        console.log('Extracted userId from token:', userId);
        
        shopData = {
          ...shopData,
          ownerId: userId
        };
        console.log('Modified shopData with ownerId:', shopData);
      } catch (e) {
        console.error('Error decoding token:', e);
      }
    }
    
    return api.post('/shops', shopData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'X-User-Id': userId ? userId.toString() : ''
      }
    });
  },
  updateShop: (id, shopData) => api.put(`/shops/${id}`, shopData),
  uploadLogo: (shopId, formData) => {
    return api.post(`/shops/${shopId}/upload-logo`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });
  }
};

export default {
  product: productApi,
  category: categoryApi,
  auth: authApi,
  order: orderApi,
  payment: paymentApi,
  shop: shopApi,
};