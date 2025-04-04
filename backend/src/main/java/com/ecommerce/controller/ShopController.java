package com.ecommerce.controller;

import com.ecommerce.dto.ShopDto;
import com.ecommerce.exception.ResourceNotFoundException;
import com.ecommerce.security.JwtTokenProvider;
import com.ecommerce.service.ShopService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.Map;
import java.util.Collections;
import java.util.HashMap;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import java.util.List;
import java.io.IOException;

@RestController
@RequestMapping("/shops")
public class ShopController {
    
    private final ShopService shopService;
    private final JwtTokenProvider jwtTokenProvider;
    
    public ShopController(ShopService shopService, JwtTokenProvider jwtTokenProvider) {
        this.shopService = shopService;
        this.jwtTokenProvider = jwtTokenProvider;
    }
    
    @GetMapping
    public ResponseEntity<List<ShopDto>> getAllShops() {
        List<ShopDto> shops = shopService.getAllShops();
        return ResponseEntity.ok(shops);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ShopDto> getShopById(@PathVariable Long id) {
        ShopDto shop = shopService.getShopById(id);
        return ResponseEntity.ok(shop);
    }
    
    @GetMapping("/my-shop")
    public ResponseEntity<?> getMyShop(HttpServletRequest request) {
        try {
            Long userId = getUserIdFromRequest(request);
            System.out.println("Getting shop for user ID: " + userId);
            ShopDto shop = shopService.getShopByOwnerId(userId);
            return ResponseEntity.ok(shop);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.ok(Map.of("message", "No shop exists for this user", "shopExists", false));
        } catch (Exception e) {
            System.out.println("Error in getMyShop: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @PostMapping
    public ResponseEntity<?> createShop(@Valid @RequestBody ShopDto shopDto, HttpServletRequest request) {
        try {
    
            System.out.println("Received shop creation request with data: " + shopDto);
            System.out.println("ownerId in request: " + shopDto.getOwnerId());
            
     
            Long userId = shopDto.getOwnerId(); 
            
            if (userId == null) {

                String userIdHeader = request.getHeader("X-User-Id");
                if (userIdHeader != null && !userIdHeader.isEmpty()) {
                    try {
                        userId = Long.parseLong(userIdHeader);
                        System.out.println("Using userId from header: " + userId);
                    } catch (NumberFormatException e) {
                        System.out.println("Invalid X-User-Id header");
                    }
                }
            }
            
            if (userId == null) {

                userId = getUserIdFromRequest(request);
                System.out.println("Using userId from JWT: " + userId);
            }
            
            System.out.println("Final userId being used: " + userId);
            

            ShopDto createdShop = shopService.createShop(shopDto, userId);
            return new ResponseEntity<>(createdShop, HttpStatus.CREATED);
        } catch (Exception e) {
            System.out.println("Error in create shop: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("message", "Failed to create shop: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ShopDto> updateShop(@PathVariable Long id, @Valid @RequestBody ShopDto shopDto, HttpServletRequest request) {
        Long userId = getUserIdFromRequest(request);
        ShopDto updatedShop = shopService.updateShop(id, shopDto, userId);
        return ResponseEntity.ok(updatedShop);
    }
    
    @PostMapping("/{id}/upload-logo")
    public ResponseEntity<?> uploadLogo(@PathVariable Long id, @RequestParam("file") MultipartFile file, HttpServletRequest request) {
        try {
            Long userId = getUserIdFromRequest(request);
            if (userId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "User not authenticated"));
            }
            
        
            ShopDto shop = shopService.getShopById(id);
            if (!shop.getOwnerId().equals(userId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("message", "Not authorized to update this shop"));
            }
            
     
            Map<String, String> result = shopService.uploadShopLogo(id, file);
            return ResponseEntity.ok(result);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("message", "Failed to upload logo: " + e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("message", "Error: " + e.getMessage()));
        }
    }

    private Long getUserIdFromRequest(HttpServletRequest request) {
        String token = resolveToken(request);
        if (token != null) {
            try {
                return jwtTokenProvider.getUserId(token);
            } catch (Exception e) {
                System.err.println("Error extracting user ID from token: " + e.getMessage());
            }
        }
        
        String userIdHeader = request.getHeader("X-User-Id");
        if (userIdHeader != null && !userIdHeader.isEmpty()) {
            try {
                return Long.parseLong(userIdHeader);
            } catch (NumberFormatException e) {
                System.err.println("Invalid X-User-Id header: " + e.getMessage());
            }
        }
        
        return null;
    }

    private String resolveToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}






