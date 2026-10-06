package com.jane.hskweb;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    @PostMapping("/user_talk")
    public String chat(@RequestBody ChatMessageInfo chatMessageInfo) {
        System.out.println(chatMessageInfo.getLevel() + chatMessageInfo.getMessage() + chatMessageInfo.getNpc() );

        return "你好! {level}";
    }
}
