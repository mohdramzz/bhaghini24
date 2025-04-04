// package com.ecommerce.model;

// import lombok.AllArgsConstructor;
// import lombok.Data;
// import lombok.NoArgsConstructor;

// import javax.persistence.*;
// import javax.validation.constraints.NotBlank;
// import javax.validation.constraints.NotNull;
// import javax.validation.constraints.PositiveOrZero;
// import javax.validation.constraints.Size;
// import java.math.BigDecimal;
// import java.time.LocalDateTime;

// @Entity
// @Table(name = "products")
// @Data
// @NoArgsConstructor
// @AllArgsConstructor
// public class Product {

//     @Id
//     @GeneratedValue(strategy = GenerationType.IDENTITY)
//     private Long id;

//     @NotBlank
//     @Size(max = 100)
//     private String name;

//     @Size(max = 500)
//     private String description;

//     @NotNull
//     @PositiveOrZero
//     private BigDecimal price;

//     private String imageUrl;

//     @NotNull
//     @PositiveOrZero
//     private Integer stockQuantity;

//     @ManyToOne
//     @JoinColumn(name = "category_id", nullable = true)
//     private Category category;

//     private boolean featured;

//     private LocalDateTime createdAt;
//     private LocalDateTime updatedAt;

//     @PrePersist
//     protected void onCreate() {
//         this.createdAt = LocalDateTime.now();
//         this.updatedAt = LocalDateTime.now();
//     }

//     @PreUpdate
//     protected void onUpdate() {
//         this.updatedAt = LocalDateTime.now();
//     }

//     @ManyToOne
//     @JoinColumn(name = "shop_id", nullable = false)
//     private Shop shop;
// }




package com.ecommerce.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.PositiveOrZero;
import javax.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "products")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 100)
    private String name;

    @Size(max = 500)
    private String description;

    @NotNull
    @PositiveOrZero
    private BigDecimal price;

    // Keep original imageUrl for backward compatibility
    private String imageUrl;
    
    // Add collection for additional images
    @ElementCollection
    @CollectionTable(name = "product_images", joinColumns = @JoinColumn(name = "product_id"))
    @Column(name = "image_url")
    private List<String> additionalImages = new ArrayList<>();

    @NotNull
    @PositiveOrZero
    private Integer stockQuantity;

    @ManyToOne
    @JoinColumn(name = "category_id", nullable = true)
    private Category category;

    private boolean featured;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    @ManyToOne
    @JoinColumn(name = "shop_id", nullable = false)
    private Shop shop;
}