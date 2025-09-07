package cn.arorms.sdd.data.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

/**
 * JwtProvider
 * @version 1.0 2025-06-20
 * @author Amzish
 */
@Component
public class JwtProvider {
    // Set token key
    private static final String SECRET_KEY = "BlessedIsHeThatWatchethAndKeepethHisGarments";
    // Set expiration to seven days
    private static final long EXPIRATION = 3600 * 24 * 7;

    /**
     * Generate token with username
     */
    public String generateToken(String username) {
        Claims claims = Jwts.claims().subject(username).build();
        Date now = new Date();
        Date validity = new Date(now.getTime() + EXPIRATION * 1000);
        Key key = Keys.hmacShaKeyFor(SECRET_KEY.getBytes());
        return Jwts.builder().claims(claims).issuedAt(now).expiration(validity)
                .signWith(key)
                .compact();
    }

    /**
     * Get username from token
     */
    public String getUsernameFromToken(String token) {
        return Jwts.parser()
                .setSigningKey(SECRET_KEY)
                .build().parseSignedClaims(token).getPayload()
                .getSubject();
    }

    /**
     * Validate the token
     */
    public boolean validateToken(String token, String username) {
        try {
            String extractedUsername = getUsernameFromToken(token);
            return (extractedUsername.equals(username) && !isTokenExpired(token));
        } catch (JwtException e) {
            return false;
        }
    }

    /**
     * Check the token expiration
     */
    private boolean isTokenExpired(String token) {
        Date expirationDate = Jwts.parser()
                .setSigningKey(SECRET_KEY)
                .build().parseSignedClaims(token).getPayload()
                .getExpiration();

        return expirationDate.before(new Date());
    }
}