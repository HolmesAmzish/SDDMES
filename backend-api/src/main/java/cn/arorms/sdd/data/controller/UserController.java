package cn.arorms.sdd.data.controller;

import cn.arorms.sdd.data.models.User;
import cn.arorms.sdd.data.service.UserService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/user")
public class UserController {
    private UserService userService;
    public UserController(UserService userService) {
        this.userService = userService;
    }

    public List<User> getAllUsers() {
        return userService.getAll();
    }

    public User getUserById(Long id) {
        return userService.getById(id);
    }
}
