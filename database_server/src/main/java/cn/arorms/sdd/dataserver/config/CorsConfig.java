package cn.arorms.sdd.dataserver.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")  // 允许的路径
                        .allowedOrigins("http://localhost:5500", "http://your-frontend-domain.com") // 允许的前端域名
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")  // 允许的HTTP方法
                        .allowedHeaders("*")  // 允许的请求头
                        .allowCredentials(true)  // 允许携带凭证（如 cookies）
                        .maxAge(3600);  // 预检请求缓存时间
            }
        };
    }
}