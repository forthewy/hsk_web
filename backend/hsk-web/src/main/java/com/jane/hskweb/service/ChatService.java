package com.jane.hskweb.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.jane.hskweb.ChatMessageInfo;
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

    public NpcChatResponse Chat(ChatMessageInfo chatMessageInfo) {

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
        } catch (JsonProcessingException e) {
            throw new IllegalStateException("Gemini 응답 JSON 변환 실패", e);
        }
    }
}
