package com.ecommerce.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
public class JwtTokenFilter extends OncePerRequestFilter {

    private final JwtTokenProvider jwtTokenProvider;
    private final CustomUserDetailsService customUserDetailsService;

    public JwtTokenFilter(JwtTokenProvider jwtTokenProvider, CustomUserDetailsService customUserDetailsService) {
        this.jwtTokenProvider = jwtTokenProvider;
        this.customUserDetailsService = customUserDetailsService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        
        String token = resolveToken(request);
        System.out.println("JWT Filter - Request URI: " + request.getRequestURI());
        System.out.println("JWT Filter - Token present: " + (token != null));
        
        try {
            if (token != null) {
                boolean isValid = jwtTokenProvider.validateToken(token);
                System.out.println("JWT Filter - Token valid: " + isValid);
                
                if (isValid) {
                    String username = jwtTokenProvider.getUsername(token);
                    System.out.println("JWT Filter - Username: " + username);
                    
                    if (username != null) {
                        UserDetails userDetails = customUserDetailsService.loadUserByUsername(username);
                        Authentication auth = jwtTokenProvider.getAuthentication(token, userDetails);
                        
                        if (auth != null) {
                            SecurityContextHolder.getContext().setAuthentication(auth);
                            System.out.println("JWT Filter - Authentication set in context");
                        }
                    }
                }
            }
        } catch (Exception e) {
            System.out.println("JWT Filter - Exception: " + e.getMessage());
            SecurityContextHolder.clearContext();
        }
        
        filterChain.doFilter(request, response);
    }

    private String resolveToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        
        return null;
    }
}