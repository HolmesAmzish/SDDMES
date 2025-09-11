package cn.arorms.sdd.data.controller;

import cn.arorms.sdd.data.service.AgentService;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Flux;

/**
 * Controller for handling agent-related requests.
 * @version 1.0 2025-09-11
 */
@RestController
@RequestMapping("/api/agent")
public class AgentController {

    private AgentService agentService;

    public AgentController(AgentService agentService) {
        this.agentService = agentService;
    }

    @GetMapping("/generate")
    public String generate(@RequestParam String prompt) {
        return this.agentService.generate(prompt);
    }

    @GetMapping(value = "/chat", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<String> chat(@RequestParam String prompt) {
        return this.agentService.chat(prompt);
    }
}
