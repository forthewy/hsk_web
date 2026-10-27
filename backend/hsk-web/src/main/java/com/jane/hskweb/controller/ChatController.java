package com.jane.hskweb.controller;

import com.jane.hskweb.model.ChatMessageInfo;
import com.jane.hskweb.model.NpcChatResponse;
import com.jane.hskweb.npc.NpcData;
import com.jane.hskweb.npc.NpcDataProvider;
import com.jane.hskweb.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;
    private final NpcDataProvider npcDataProvider;


    @PostMapping("/user_talk")
    public NpcChatResponse chat(@RequestBody ChatMessageInfo chatMessageInfo) {

        return chatService.chat(chatMessageInfo);
    }

    // npc 인삿말 가져오기
    @GetMapping("/{npcId}")
    public NpcData getNpc(@PathVariable String npcId) {
        return npcDataProvider.getNpc(npcId);
    }
}
}
