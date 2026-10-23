package com.jane.hskweb.service;

import com.jane.hskweb.model.*;
import com.jane.hskweb.npc.NpcData;
import com.jane.hskweb.quest.QuestDataProvider;
import com.jane.hskweb.quest.QuestDefinition;
import com.jane.hskweb.quest.QuestProgress;
import lombok.extern.slf4j.Slf4j;
import tools.jackson.databind.ObjectMapper;
import tools.jackson.core.JacksonException;
import com.jane.hskweb.npc.NpcDataProvider;
import com.jane.hskweb.npc.NpcPromptBuilder;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ChatService {

    private final GeminiService geminiService;
    private final NpcDataProvider npcDataProvider;
    private final NpcPromptBuilder npcPromptBuilder;
    private final ObjectMapper objectMapper;
    private final SessionMemoryExtractor sessionMemoryExtractor;
    private final QuestDataProvider questDataProvider;
    private final QuestService questService;

    public NpcChatResponse chat(ChatMessageInfo chatMessageInfo) {

        log.debug("SessionMemory 기존: {}", chatMessageInfo.getSessionMemory());

        // 퀘스트 프롬프트 조회
        String questPrompt = getQuestPrompt(chatMessageInfo);

        QuestProgress questProgress = null;

        if (chatMessageInfo.getChatMode() == ChatMode.QUEST) {
            questProgress = chatMessageInfo.getQuestProgress();

            if (questProgress == null) {
                questProgress = new QuestProgress(chatMessageInfo.getQuestId());
            }

            if (!questProgress.getQuestId().equals(chatMessageInfo.getQuestId())) {
                throw new IllegalArgumentException("퀘스트 ID가 일치하지 않습니다.");
            }

            questService.startQuest(questProgress);
        }



        // 메모리 추출 (제미나이)
        SessionMemory updatedMemory = sessionMemoryExtractor.extract(
                chatMessageInfo.getMessage(),
                chatMessageInfo.getSessionMemory()
        );
        log.debug("SessionMemory 추출 결과: {}", updatedMemory.getFacts());

        PlayerMemory playerMemory = chatMessageInfo.getPlayerMemory();

        if (questProgress != null) {
            questService.updateFacts(
                    questProgress,
                    updatedMemory.getFacts()
            );

            log.debug("퀘스트 진행 상태: {}, 수집 정보: {}",
                    questProgress.getStatus(),
                    questProgress.getCollectedFacts());
        }

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
                playerMemory,
                questPrompt
        );
        String response = geminiService.generate(prompt);

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
            result.setQuestProgress(questProgress);

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

    // 퀘스트 프롬프트
    private String getQuestPrompt(ChatMessageInfo chatMessageInfo) {

        if (chatMessageInfo.getChatMode() != ChatMode.QUEST) {
            return "";
        }

        String questId = chatMessageInfo.getQuestId();

        if (questId == null || questId.isBlank()) {
            throw new IllegalArgumentException(
                    "퀘스트 대화에는 questId가 필요합니다."
            );
        }

        QuestDefinition quest = questDataProvider.getQuest(questId);

        if (!quest.npcId().equals(chatMessageInfo.getNpc())) {
            throw new IllegalArgumentException(
                    "퀘스트와 NPC가 일치하지 않습니다."
            );
        }

        return npcPromptBuilder.buildQuestPrompt(quest);
    }
}

