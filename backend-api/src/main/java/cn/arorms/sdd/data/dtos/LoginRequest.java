package cn.arorms.sdd.data.dtos;

/**
 * LoginRequest Data transfer object
 * @version 1.0 2025-06-22
 * @author Amzish
 */
public class LoginRequest {
    private String username;
    private String password;

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}