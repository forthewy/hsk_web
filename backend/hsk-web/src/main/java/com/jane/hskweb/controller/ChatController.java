package com.jane.hskweb.controller;

import com.jane.hskweb.model.ChatMessageInfo;
import com.jane.hskweb.model.NpcChatResponse;
import com.jane.hskweb.npc.NpcData;
import com.jane.hskweb.npc.NpcRepository;
import com.jane.hskweb.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;
    private final NpcRepository npcDataProvider;


    @PostMapping("/user_talk")
    public NpcChatResponse chat(@RequestBody ChatMessageInfo chatMessageInfo) {

        return chatService.chat(chatMessageInfo);
    }

    // npc 들 가져오기
    @GetMapping("/npcs")
    public List<NpcData> getNpcs() {
        return npcDataProvider.getNpcs();
    }
}
