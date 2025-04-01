package cn.arorms.sdd.dataserver.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

/**
 * DeepSeekController.java
 * @version 1.0 2025-03-18
 * @author Cacc
 * @since 2025-01-18
 */
@RestController
@RequestMapping("/api/ai")
public class DeepSeekController {

    private final String DEEPSEEK_URL = "https://api.deepseek.com/chat/completions"; // DeepSeek的API地址
    private final String API_KEY = "sk-9bab5ed6e8164eaf8dc500ac875e5129"; // 你的API密钥
    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper(); // 用于解析JSON

    @PostMapping("/analyze")
    public ResponseEntity<?> analyzeData(@RequestBody AnalyzeRequest request) {
        String prompt = request.getPrompt();

        // 调用DeepSeek的API
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", "Bearer " + API_KEY);

        // 构造请求体
        String requestBody = String.format(
                "{\"model\": \"deepseek-chat\", \"messages\": [{\"role\": \"user\", \"content\": \"%s\"}], \"stream\": false}",
                prompt
        );
        HttpEntity<String> entity = new HttpEntity<>(requestBody, headers);

        try {
            // 发送请求
            ResponseEntity<String> response = restTemplate.postForEntity(DEEPSEEK_URL, entity, String.class);

            if (response.getStatusCode() == HttpStatus.OK) {
                // 解析DeepSeek的JSON响应
                String responseBody = response.getBody();
                JsonNode jsonNode = objectMapper.readTree(responseBody);
                String aiResponse = jsonNode.path("choices").get(0).path("message").get("content").asText(); // 提取content字段

                // 返回给前端
                return ResponseEntity.ok(new AnalyzeResponse(aiResponse));
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("AI 请求失败");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("错误: " + e.getMessage());
        }
    }

    // 请求体类
    public static class AnalyzeRequest {
        private String prompt;

        public String getPrompt() {
            return prompt;
        }

        public void setPrompt(String prompt) {
            this.prompt = prompt;
        }
    }

    // 响应体类（字段名保持response，与前端一致）
    public static class AnalyzeResponse {
        private String response;

        public AnalyzeResponse(String response) {
            this.response = response;
        }

        public String getResponse() {
            return response;
        }

        public void setResponse(String response) {
            this.response = response;
        }
    }
}