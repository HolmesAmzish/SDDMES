package cn.arorms.sdd.data.config;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.advisor.MessageChatMemoryAdvisor;
import org.springframework.ai.chat.memory.ChatMemory;
import org.springframework.ai.openai.OpenAiChatModel;
import org.springframework.ai.openai.OpenAiChatOptions;
import org.springframework.ai.openai.api.OpenAiApi;
import org.springframework.ai.tool.ToolCallbackProvider;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

@Configuration
public class ChatClientConfig {
    @Value("${spring.ai.openai.api-key}")
    private String apiKey;

    @Value("${spring.ai.openai.chat.base-url}")
    private String apiBaseUrl;

    @Bean
    public OpenAiApi openAiApi() {
        MultiValueMap<String, String> headers = new LinkedMultiValueMap<>();
        headers.add("Accept", "application/json");

        return OpenAiApi.builder()
                .baseUrl(apiBaseUrl)
                .apiKey(apiKey)
                .headers(headers)
                .build();
    }

    @Bean
    public OpenAiChatModel defaultChatModel(OpenAiApi openAiApi) {
        OpenAiChatOptions defaultOptions = OpenAiChatOptions.builder()
                .model("Qwen/Qwen3-30B-A3B-Instruct-2507")
                .temperature(0.7)
                .build();
        return OpenAiChatModel.builder()
                .openAiApi(openAiApi())
                .defaultOptions(defaultOptions)
                .build();
    }
    @Bean
    public ChatClient defaultChatClient(
//            ToolCallbackProvider tools,
            ChatMemory chatMemory,
            @Qualifier("defaultChatModel") OpenAiChatModel defaultChatModel
    ) {
        return ChatClient.builder(defaultChatModel)
//                .defaultToolCallbacks(tools)
                .defaultAdvisors(MessageChatMemoryAdvisor.builder(chatMemory).build())
                .build();
    }
}
