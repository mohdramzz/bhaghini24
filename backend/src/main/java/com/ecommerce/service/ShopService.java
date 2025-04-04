package com.ecommerce.service;

import com.ecommerce.dto.ShopDto;
import com.ecommerce.exception.InvalidRequestException;
import com.ecommerce.exception.ResourceNotFoundException;
import com.ecommerce.model.Shop;
import com.ecommerce.model.User;
import com.ecommerce.repository.ShopRepository;
import com.ecommerce.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ShopService {
    
    private final ShopRepository shopRepository;
    private final UserRepository userRepository;
    
    @Value("${file.upload-dir:uploads}")
    private String uploadDir;
    
    @Value("${server.port}")
    private String serverPort;
    
    @Value("${server.address:localhost}")
    private String serverAddress;
    
    public ShopService(ShopRepository shopRepository, UserRepository userRepository) {
        this.shopRepository = shopRepository;
        this.userRepository = userRepository;
    }
    
    public List<ShopDto> getAllShops() {
        return shopRepository.findAll().stream()
                .map(this::mapShopToDto)
                .collect(Collectors.toList());
    }
    
    public ShopDto getShopById(Long id) {
        Shop shop = shopRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Shop", "id", id));
        
        return mapShopToDto(shop);
    }
    
    public ShopDto getShopByOwnerId(Long ownerId) {
        Shop shop = shopRepository.findByOwnerId(ownerId)
                .orElseThrow(() -> new ResourceNotFoundException("Shop", "ownerId", ownerId));
        
        return mapShopToDto(shop);
    }
    
    public ShopDto createShop(ShopDto shopDto, Long userId) {
        System.out.println("ShopService.createShop called with userId: " + userId);
        
        Shop shop = new Shop();
        shop.setName(shopDto.getName());
        shop.setDescription(shopDto.getDescription());
        shop.setAddress(shopDto.getAddress());
        shop.setLogoUrl(shopDto.getLogoUrl());
        
        if (userId != null) {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

            shopRepository.findByOwnerId(userId).ifPresent(s -> {
                throw new InvalidRequestException("User already has a shop");
            });
            
            shop.setOwner(user);
        }
        
        shopRepository.findByName(shopDto.getName()).ifPresent(s -> {
            throw new InvalidRequestException("Shop name already exists");
        });
        
        Shop savedShop = shopRepository.save(shop);
        
        return mapShopToDto(savedShop);
    }
    
    public ShopDto updateShop(Long id, ShopDto shopDto, Long userId) {
        Shop shop = shopRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Shop", "id", id));
        
        if (!shop.getOwner().getId().equals(userId)) {
            throw new InvalidRequestException("User is not authorized to update this shop");
        }

        if (!shop.getName().equals(shopDto.getName())) {
            shopRepository.findByName(shopDto.getName()).ifPresent(s -> {
                if (!s.getId().equals(id)) {
                    throw new InvalidRequestException("Shop name already exists");
                }
            });
        }
        
        shop.setName(shopDto.getName());
        shop.setDescription(shopDto.getDescription());
        shop.setAddress(shopDto.getAddress());
        
        if (shopDto.getLogoUrl() != null && !shopDto.getLogoUrl().equals(shop.getLogoUrl())) {
            shop.setLogoUrl(shopDto.getLogoUrl());
        }
        
        Shop updatedShop = shopRepository.save(shop);
        
        return mapShopToDto(updatedShop);
    }
    
    public Map<String, String> uploadShopLogo(Long shopId, MultipartFile file) throws IOException {
        Shop shop = shopRepository.findById(shopId)
                .orElseThrow(() -> new ResourceNotFoundException("Shop", "id", shopId));
        
        File uploadDirFile = new File(uploadDir + "/shops/" + shopId);
        if (!uploadDirFile.exists()) {
            uploadDirFile.mkdirs();
        }
        

        String originalFilename = StringUtils.cleanPath(file.getOriginalFilename());
        String fileExtension = "";
        if (originalFilename.contains(".")) {
            fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }
        String filename = UUID.randomUUID().toString() + fileExtension;
        

        Path targetLocation = Paths.get(uploadDir + "/shops/" + shopId + "/" + filename);
        Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
        

        String fileUrl = "/images/shops/" + shopId + "/" + filename;
        shop.setLogoUrl(fileUrl);
        shopRepository.save(shop);
        

        String fullFileUrl = "http://" + serverAddress + ":" + serverPort + fileUrl;
        
        Map<String, String> result = new HashMap<>();
        result.put("logoUrl", fileUrl);
        result.put("fullLogoUrl", fullFileUrl);
        
        return result;
    }
    
    private ShopDto mapShopToDto(Shop shop) {
        ShopDto shopDto = new ShopDto();
        shopDto.setId(shop.getId());
        shopDto.setName(shop.getName());
        shopDto.setDescription(shop.getDescription());
        shopDto.setAddress(shop.getAddress());
        shopDto.setLogoUrl(shop.getLogoUrl());
        shopDto.setOwnerId(shop.getOwner().getId());
        shopDto.setOwnerName(shop.getOwner().getFirstName() + " " + shop.getOwner().getLastName());
        
        return shopDto;
    }
}






