package cn.arorms.sdd.data.service;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;

/**
 * Service for managing agent interactions using a chat client.
 * @version 1.0 2025-09-11
 */
@Service
public class AgentService {
    private final ChatClient chatClient;
    public AgentService(ChatClient chatClient) {
        this.chatClient = chatClient;
    }

    private final String conversationId = "default";

    public String generate(String prompt) {
        return this.chatClient
                .prompt()
                .user(prompt)
                .call()
                .content();
    }

    public Flux<String> chat(String prompt) {
        return this.chatClient
                .prompt()
                .user(prompt)
                .stream()
                .content();
    }
}
