package com.jane.hskweb.service;

import com.jane.hskweb.ChatMessageInfo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final GeminiService geminiService;

    public String Chat(ChatMessageInfo chatMessageInfo) {

        String prompt = "";
//        return prompt;
        return geminiService.generate(prompt);
    }
}
