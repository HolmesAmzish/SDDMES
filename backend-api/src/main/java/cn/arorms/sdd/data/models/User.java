package cn.arorms.sdd.data.models;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

import cn.arorms.sdd.data.enums.Role;

@Data @Entity @Table(name = "users")
public class User {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "username", unique = true, nullable = false)
    private String username;

    @Column(name = "password", nullable = false)
    private String password;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "role")
    @Enumerated(EnumType.STRING)
    private Role role;
}
