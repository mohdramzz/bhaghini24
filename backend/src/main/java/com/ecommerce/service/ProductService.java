package com.ecommerce.service;

import com.ecommerce.dto.ProductDto;
import com.ecommerce.exception.InvalidRequestException;
import com.ecommerce.exception.ResourceNotFoundException;
import com.ecommerce.model.Category;
import com.ecommerce.model.Product;
import com.ecommerce.model.Shop;
import com.ecommerce.repository.CategoryRepository;
import com.ecommerce.repository.ProductRepository;
import com.ecommerce.repository.ShopRepository;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductService {
    
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ShopRepository shopRepository;
    
    public ProductService(ProductRepository productRepository, CategoryRepository categoryRepository, ShopRepository shopRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.shopRepository = shopRepository;
    }
    
    public List<ProductDto> getAllProducts() {
        return productRepository.findAll().stream()
                .map(this::mapProductToDto)
                .collect(Collectors.toList());
    }
    
    public ProductDto getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));
        
        return mapProductToDto(product);
    }
    
    public List<ProductDto> getProductsByCategory(Long categoryId) {
        if (!categoryRepository.existsById(categoryId)) {
            throw new ResourceNotFoundException("Category", "id", categoryId);
        }
        
        return productRepository.findByCategoryId(categoryId).stream()
                .map(this::mapProductToDto)
                .collect(Collectors.toList());
    }
    
    public List<ProductDto> getFeaturedProducts() {
        return productRepository.findByFeatured(true).stream()
                .map(this::mapProductToDto)
                .collect(Collectors.toList());
    }
    
    public List<ProductDto> searchProducts(String keyword) {
        return productRepository.searchProducts(keyword).stream()
                .map(this::mapProductToDto)
                .collect(Collectors.toList());
    }
    
    public ProductDto createProduct(ProductDto productDto, Long userId) {

        Shop shop = shopRepository.findByOwnerId(userId)
                .orElseThrow(() -> new InvalidRequestException("User does not have a shop"));
        
        Product product = new Product();
        product.setName(productDto.getName());
        product.setDescription(productDto.getDescription());
        product.setPrice(productDto.getPrice());
        product.setImageUrl(productDto.getImageUrl());
        product.setStockQuantity(productDto.getStockQuantity());
        product.setFeatured(productDto.isFeatured());
        product.setShop(shop); 
        
        Product savedProduct = productRepository.save(product);
        
        return mapProductToDto(savedProduct);
    }
    
    public ProductDto updateProduct(Long id, ProductDto productDto, Long userId) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));
        
        
        if (!product.getShop().getOwner().getId().equals(userId)) {
            throw new InvalidRequestException("User is not authorized to update this product");
        }
        
        product.setName(productDto.getName());
        product.setDescription(productDto.getDescription());
        product.setPrice(productDto.getPrice());
        product.setImageUrl(productDto.getImageUrl());
        product.setStockQuantity(productDto.getStockQuantity());
        product.setFeatured(productDto.isFeatured());
        
        Product updatedProduct = productRepository.save(product);
        
        return mapProductToDto(updatedProduct);
    }
    
    public void deleteProduct(Long id, Long userId) {
        if (!productRepository.existsById(id)) {
            throw new ResourceNotFoundException("Product", "id", id);
        }

        Product product = productRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));
    
        if (!product.getShop().getOwner().getId().equals(userId)) {
            throw new InvalidRequestException("User is not authorized to delete this product");
        }
        
        productRepository.deleteById(id);
    }


    public List<ProductDto> getProductsByShop(Long shopId) {
        if (!shopRepository.existsById(shopId)) {
            throw new ResourceNotFoundException("Shop", "id", shopId);
        }
        
        return productRepository.findByShopId(shopId).stream()
                .map(this::mapProductToDto)
                .collect(Collectors.toList());
    }
    

    private ProductDto mapProductToDto(Product product) {
        ProductDto productDto = new ProductDto();
        productDto.setId(product.getId());
        productDto.setName(product.getName());
        productDto.setDescription(product.getDescription());
        productDto.setPrice(product.getPrice());
        productDto.setImageUrl(product.getImageUrl());
        productDto.setStockQuantity(product.getStockQuantity());
        productDto.setFeatured(product.isFeatured());

        if (product.getShop() != null) {
            productDto.setShopId(product.getShop().getId());
            productDto.setShopName(product.getShop().getName());
        }
        
        return productDto;
    }
}

