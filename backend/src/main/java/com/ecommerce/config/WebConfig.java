package com.ecommerce.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Path;
import java.nio.file.Paths;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${file.upload-dir:uploads}")
    private String uploadDir;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        Path shopUploadDir = Paths.get(uploadDir + "/shops");
        String shopUploadPath = shopUploadDir.toFile().getAbsolutePath();
        registry.addResourceHandler("/images/shops/**")
                .addResourceLocations("file:" + shopUploadPath + "/");

        Path productUploadDir = Paths.get(uploadDir + "/products");
        String productUploadPath = productUploadDir.toFile().getAbsolutePath();
        registry.addResourceHandler("/images/products/**")
                .addResourceLocations("file:" + productUploadPath + "/");
                
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:src/main/resources/static/uploads/");
    }
}