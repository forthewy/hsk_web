package com.jane.hskweb.controller;

import com.jane.hskweb.ChatMessageInfo;
import com.jane.hskweb.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @PostMapping("/user_talk")
    public String chat(@RequestBody ChatMessageInfo chatMessageInfo) {

         String response = chatService.Chat(chatMessageInfo);

        return response;
    }
}
