package com.ecommerce.controller;

import com.ecommerce.dto.ProductDto;
import com.ecommerce.security.JwtTokenProvider;
import com.ecommerce.service.ProductService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/products")
public class ProductController {
    
    private final ProductService productService;
    private final JwtTokenProvider jwtTokenProvider;
    
    public ProductController(ProductService productService, JwtTokenProvider jwtTokenProvider) {
        this.productService = productService;
        this.jwtTokenProvider = jwtTokenProvider;
    }
    
    @GetMapping
    public ResponseEntity<List<ProductDto>> getAllProducts() {
        List<ProductDto> products = productService.getAllProducts();
        return ResponseEntity.ok(products);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ProductDto> getProductById(@PathVariable Long id) {
        ProductDto product = productService.getProductById(id);
        return ResponseEntity.ok(product);
    }
    
    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<ProductDto>> getProductsByCategory(@PathVariable Long categoryId) {
        List<ProductDto> products = productService.getProductsByCategory(categoryId);
        return ResponseEntity.ok(products);
    }
    
    @GetMapping("/featured")
    public ResponseEntity<List<ProductDto>> getFeaturedProducts() {
        List<ProductDto> products = productService.getFeaturedProducts();
        return ResponseEntity.ok(products);
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<ProductDto>> searchProducts(@RequestParam String keyword) {
        List<ProductDto> products = productService.searchProducts(keyword);
        return ResponseEntity.ok(products);
    }
    
    @PostMapping
    public ResponseEntity<ProductDto> createProduct(@Valid @RequestBody ProductDto productDto, HttpServletRequest request) {
        Long userId = getUserIdFromRequest(request);
        ProductDto createdProduct = productService.createProduct(productDto, userId);
        return new ResponseEntity<>(createdProduct, HttpStatus.CREATED);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ProductDto> updateProduct(@PathVariable Long id, @Valid @RequestBody ProductDto productDto, HttpServletRequest request) {
        Long userId = getUserIdFromRequest(request);
        ProductDto updatedProduct = productService.updateProduct(id, productDto, userId);
        return ResponseEntity.ok(updatedProduct);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id, HttpServletRequest request) {
        Long userId = getUserIdFromRequest(request);
        productService.deleteProduct(id, userId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/shop/{shopId}")
    public ResponseEntity<List<ProductDto>> getProductsByShop(@PathVariable Long shopId) {
        try {
            List<ProductDto> products = productService.getProductsByShop(shopId);
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            // Log the error for debugging
            System.err.println("Error fetching products for shop " + shopId + ": " + e.getMessage());
            // Return empty list instead of error to avoid client-side issues
            return ResponseEntity.ok(List.of());
        }
    }

    private Long getUserIdFromRequest(HttpServletRequest request) {
        String token = resolveToken(request);
        if (token == null) {
            return null;
        }
        return jwtTokenProvider.getUserId(token);
    }
    
    private String resolveToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}
