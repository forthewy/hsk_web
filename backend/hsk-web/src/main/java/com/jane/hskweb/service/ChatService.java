package com.jane.hskweb.service;

import com.jane.hskweb.model.SessionMemory;
import tools.jackson.databind.ObjectMapper;
import tools.jackson.core.JacksonException;
import com.jane.hskweb.model.ChatMessageInfo;
import com.jane.hskweb.model.NpcChatResponse;
import com.jane.hskweb.model.NpcData;
import com.jane.hskweb.npc.NpcDataProvider;
import com.jane.hskweb.npc.NpcPromptBuilder;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final GeminiService geminiService;
    private final NpcDataProvider npcDataProvider;
    private final NpcPromptBuilder npcPromptBuilder;
    private final ObjectMapper objectMapper;
    private final SessionMemoryExtractor sessionMemoryExtractor;

    public NpcChatResponse Chat(ChatMessageInfo chatMessageInfo) {
        System.out.println("SessionMemory: "
                + chatMessageInfo.getSessionMemory().getFacts());

        SessionMemory updatedMemory = sessionMemoryExtractor.extract(
                chatMessageInfo.getMessage(),
                chatMessageInfo.getSessionMemory()
        );

        System.out.println("추출된 기억: " + updatedMemory.getFacts());

        // NPC 정보 조회
        NpcData npc = npcDataProvider.getNpc(
                chatMessageInfo.getNpc()
        );

        // 프롬프트 생성
        String prompt = npcPromptBuilder.buildNpcPrompt(
                npc,
                chatMessageInfo.getMessage()
        );
        String response = geminiService.generate(prompt);
        System.out.println("최종 Gemini 응답: " + response);

        // JSON 문자열 → Java 객체
        try {
            return objectMapper.readValue(response, NpcChatResponse.class);
        } catch (JacksonException e) {
            throw new IllegalStateException("Gemini 응답 JSON 변환 실패", e);
        }
    }
}
