package com.jane.hskweb.service;

import com.jane.hskweb.model.*;
import tools.jackson.databind.ObjectMapper;
import tools.jackson.core.JacksonException;
import com.jane.hskweb.npc.NpcDataProvider;
import com.jane.hskweb.npc.NpcPromptBuilder;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

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

        PlayerMemory playerMemory = chatMessageInfo.getPlayerMemory();

        for (String key : List.of("name", "preference")) {
            String value = updatedMemory.getFacts().get(key);

            if (value != null && !value.isBlank()) {
                playerMemory.getFacts().put(key, value);
            }
        }

        System.out.println("추출된 기억: " + updatedMemory.getFacts());

        // NPC 정보 조회
        NpcData npc = npcDataProvider.getNpc(
                chatMessageInfo.getNpc()
        );

        // 프롬프트 생성
        String prompt = npcPromptBuilder.buildNpcPrompt(
                npc,
                chatMessageInfo.getMessage(),
                updatedMemory,
                playerMemory
        );

        String response = geminiService.generate(prompt);
        System.out.println("최종 Gemini 응답: " + response);

        try {

            String cleanedResponse = response
                    .replace("```json", "")
                    .replace("```", "")
                    .trim();

            NpcChatResponse result =
                    objectMapper.readValue(cleanedResponse, NpcChatResponse.class);

            updateLastNpcQuestion(updatedMemory, result.getReply());

            result.setSessionMemory(updatedMemory);
            result.setPlayerMemory(playerMemory);

            System.out.println("PlayerMemory: " + playerMemory.getFacts());

            return result;

        } catch (JacksonException e) {
            throw new IllegalStateException("Gemini 응답 JSON 변환 실패", e);
        }
    }

    // 마지막 질문 업데이트
    private void updateLastNpcQuestion(
            SessionMemory memory,
            String npcReply
    ) {
            if (npcReply.contains("?") || npcReply.contains("？")) {
                memory.setLastNpcQuestion(npcReply);
            }
    }
}

