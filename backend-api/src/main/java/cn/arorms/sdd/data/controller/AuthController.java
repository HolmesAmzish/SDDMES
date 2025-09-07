package cn.arorms.sdd.data.controller;

import cn.arorms.sdd.data.dtos.LoginRequest;
import cn.arorms.sdd.data.dtos.RegisterRequest;
import cn.arorms.sdd.data.models.User;
import cn.arorms.sdd.data.security.JwtProvider;
import cn.arorms.sdd.data.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController @RequestMapping("/api/auth")
public class AuthController {
    private static final Logger log = LoggerFactory.getLogger(AuthController.class);

    private UserService userService;
    private JwtProvider jwtProvider;
    private PasswordEncoder passwordEncoder;

    public AuthController(
            UserService userService,
            JwtProvider jwtProvider,
            PasswordEncoder passwordEncoder
    ) {
        this.userService = userService;
        this.jwtProvider = jwtProvider;
        this.passwordEncoder = passwordEncoder;
    }

    // Login controller
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        String username = request.getUsername();
        log.info("login user: {}", username);
        User user = userService.getUserByUsername(username);
        if (!passwordMatches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid username or password");
        }

        String token = jwtProvider.generateToken(user.getUsername());

        return ResponseEntity.ok()
                .header("Authorization", "Bearer " + token)
                .build();
    }

    // Register controller
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        User user = userService.registerUser(
                request.getUsername(),
                request.getEmail(),
                request.getPassword()
        );

        String token = jwtProvider.generateToken(user.getUsername());

        return ResponseEntity.ok()
                .header("Authorization", "Bearer " + token)
                .body("注册成功");
    }

    // Compare the encoded password
    private boolean passwordMatches(String raw, String encoded) {
        return passwordEncoder.matches(raw, encoded);
    }

}
