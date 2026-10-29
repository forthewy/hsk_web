package com.jane.hskweb.controller;

import com.jane.hskweb.model.ChatMessageInfo;
import com.jane.hskweb.model.NpcChatResponse;
import com.jane.hskweb.npc.NpcData;
import com.jane.hskweb.npc.NpcDataProvider;
import com.jane.hskweb.service.ChatService;
import com.jane.hskweb.usageLimit.AnonymousUserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;
    private final NpcDataProvider npcDataProvider;
    private final AnonymousUserService anonymousUserService;


    @PostMapping("/user_talk")
    public NpcChatResponse chat(
            @RequestBody ChatMessageInfo chatMessageInfo,
            HttpServletRequest request,
            HttpServletResponse response
    ) {
        String anonymousId =
                anonymousUserService.getOrCreateId(request, response);

        String ip = request.getRemoteAddr();

        return chatService.chat(
                chatMessageInfo,
                anonymousId,
                ip
        );
    }

    // npc 인삿말 가져오기
    @GetMapping("/{npcId}")
    public NpcData getNpc(@PathVariable String npcId) {
        return npcDataProvider.getNpc(npcId);
    }
}
