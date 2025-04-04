// package com.ecommerce.dto;

// import lombok.AllArgsConstructor;
// import lombok.Data;
// import lombok.NoArgsConstructor;

// import javax.validation.constraints.NotBlank;
// import javax.validation.constraints.NotNull;
// import javax.validation.constraints.PositiveOrZero;
// import javax.validation.constraints.Size;
// import java.math.BigDecimal;

// @Data
// @NoArgsConstructor
// @AllArgsConstructor
// public class ProductDto {
//     private Long id;
    
//     @NotBlank(message = "Product name is required")
//     @Size(max = 100, message = "Product name cannot exceed 100 characters")
//     private String name;
    
//     @Size(max = 500, message = "Description cannot exceed 500 characters")
//     private String description;
    
//     @NotNull(message = "Price is required")
//     @PositiveOrZero(message = "Price must be zero or positive")
//     private BigDecimal price;
    
//     private String imageUrl;
    
//     @NotNull(message = "Stock quantity is required")
//     @PositiveOrZero(message = "Stock quantity must be zero or positive")
//     private Integer stockQuantity;
    
//     private Long categoryId;
    
//     private String categoryName;
    
//     private boolean featured;

//     private Long shopId;

//     private String shopName;


//     public Long getShopId() {
//         return shopId;
//     }
    
//     public void setShopId(Long shopId) {
//         this.shopId = shopId;
//     }
    
//     public String getShopName() {
//         return shopName;
//     }
    
//     public void setShopName(String shopName) {
//         this.shopName = shopName;
//     }

// }




package com.ecommerce.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.PositiveOrZero;
import javax.validation.constraints.Size;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductDto {
    private Long id;
    
    @NotBlank(message = "Product name is required")
    @Size(max = 100, message = "Product name cannot exceed 100 characters")
    private String name;
    
    @Size(max = 500, message = "Description cannot exceed 500 characters")
    private String description;
    
    @NotNull(message = "Price is required")
    @PositiveOrZero(message = "Price must be zero or positive")
    private BigDecimal price;
    
    private String imageUrl;
    
    private List<String> additionalImages = new ArrayList<>();
    
    @NotNull(message = "Stock quantity is required")
    @PositiveOrZero(message = "Stock quantity must be zero or positive")
    private Integer stockQuantity;
    
    private Long categoryId;
    
    private String categoryName;
    
    private boolean featured;

    private Long shopId;

    private String shopName;


    public Long getShopId() {
        return shopId;
    }
    
    public void setShopId(Long shopId) {
        this.shopId = shopId;
    }
    
    public String getShopName() {
        return shopName;
    }
    
    public void setShopName(String shopName) {
        this.shopName = shopName;
    }
}