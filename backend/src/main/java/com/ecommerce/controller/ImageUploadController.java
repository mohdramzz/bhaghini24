
package com.ecommerce.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*", allowCredentials = "true")
public class ImageUploadController {

    @Value("${file.upload-dir:uploads}")
    private String baseUploadDir;
    
    private final String STATIC_UPLOAD_DIR = System.getProperty("user.dir") + "/src/main/resources/static/uploads/";
    
    @PostMapping("/api/upload")
    public ResponseEntity<Map<String, String>> uploadImage(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "type", defaultValue = "general") String type) {
        
        try {
            System.out.println("Uploading file: " + file.getOriginalFilename() + " of type: " + type);
            
            String filename = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            
            String subDirectory = "";
            String urlPrefix = "/uploads/";
            
            if ("shop".equals(type)) {
                subDirectory = "shops/";
                urlPrefix = "/images/shops/";
                
                File shopsDir = new File(baseUploadDir + "/shops");
                if (!shopsDir.exists()) {
                    boolean created = shopsDir.mkdirs();
                    System.out.println("Created shops directory: " + created);
                }
                
                Path shopFilePath = Paths.get(baseUploadDir + "/shops/", filename);
                Files.copy(file.getInputStream(), shopFilePath, StandardCopyOption.REPLACE_EXISTING);
                System.out.println("Saved file to: " + shopFilePath);
            } 
            else if ("product".equals(type)) {
                subDirectory = "products/";
                urlPrefix = "/images/products/";
                
                File productsDir = new File(baseUploadDir + "/products");
                if (!productsDir.exists()) {
                    productsDir.mkdirs();
                }

                Path productFilePath = Paths.get(baseUploadDir + "/products/", filename);
                Files.copy(file.getInputStream(), productFilePath, StandardCopyOption.REPLACE_EXISTING);
            }
            
            File baseDirectory = new File(STATIC_UPLOAD_DIR);
            if (!baseDirectory.exists()) {
                boolean created = baseDirectory.mkdirs();
                System.out.println("Created base directory: " + created);
            }
            
            File directory = new File(STATIC_UPLOAD_DIR + subDirectory);
            if (!directory.exists()) {
                boolean created = directory.mkdirs();
                System.out.println("Created subdirectory: " + created);
            }
            
            Path filePath = Paths.get(STATIC_UPLOAD_DIR + subDirectory, filename);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            System.out.println("Saved file to static resources: " + filePath);
            
            Map<String, String> response = new HashMap<>();
            response.put("url", "http://localhost:8081" + urlPrefix + filename);
            
            System.out.println("Returning URL: " + "http://localhost:8081" + urlPrefix + filename);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace(); 
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
    
    @PostMapping("/api/upload/multiple")
    public ResponseEntity<Map<String, Object>> uploadMultipleImages(
            @RequestParam("files") MultipartFile[] files,
            @RequestParam(value = "type", defaultValue = "general") String type) {
        
        List<String> uploadedUrls = new ArrayList<>();
        Map<String, Object> response = new HashMap<>();
        
        try {
            for (MultipartFile file : files) {
                System.out.println("Uploading file: " + file.getOriginalFilename() + " of type: " + type);
                
                String filename = System.currentTimeMillis() + "_" + file.getOriginalFilename();
                
                String subDirectory = "";
                String urlPrefix = "/uploads/";
                
                if ("shop".equals(type)) {
                    subDirectory = "shops/";
                    urlPrefix = "/images/shops/";
                    
                    File shopsDir = new File(baseUploadDir + "/shops");
                    if (!shopsDir.exists()) {
                        shopsDir.mkdirs();
                    }
                    
                    Path shopFilePath = Paths.get(baseUploadDir + "/shops/", filename);
                    Files.copy(file.getInputStream(), shopFilePath, StandardCopyOption.REPLACE_EXISTING);
                } 
                else if ("product".equals(type)) {
                    subDirectory = "products/";
                    urlPrefix = "/images/products/";
                    
                    File productsDir = new File(baseUploadDir + "/products");
                    if (!productsDir.exists()) {
                        productsDir.mkdirs();
                    }

                    Path productFilePath = Paths.get(baseUploadDir + "/products/", filename);
                    Files.copy(file.getInputStream(), productFilePath, StandardCopyOption.REPLACE_EXISTING);
                }
                
                File baseDirectory = new File(STATIC_UPLOAD_DIR);
                if (!baseDirectory.exists()) {
                    baseDirectory.mkdirs();
                }
                
                File directory = new File(STATIC_UPLOAD_DIR + subDirectory);
                if (!directory.exists()) {
                    directory.mkdirs();
                }
                
                Path filePath = Paths.get(STATIC_UPLOAD_DIR + subDirectory, filename);
                Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
                
                String fullUrl = "http://localhost:8081" + urlPrefix + filename;
                uploadedUrls.add(fullUrl);
            }
            
            response.put("urls", uploadedUrls);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace(); 
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}