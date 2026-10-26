package com.jane.hskweb.npc;

import com.jane.hskweb.model.PlayerMemory;
import com.jane.hskweb.model.SessionMemory;
import com.jane.hskweb.quest.QuestProgress;
import org.springframework.stereotype.Component;
import com.jane.hskweb.quest.QuestDefinition;

import java.util.stream.Collectors;

@Component
public class NpcPromptBuilder {

    public String buildRolePrompt(NpcData npc) {

        String personalities = npc.personalities()
                .stream()
                .map(p -> "- " + p)
                .collect(Collectors.joining("\n"));

        return """
            당신은 %s입니다.
            
            역할:
            %s

            성격:
            %s
            """.formatted(
                npc.name(),
                npc.role(),
                personalities
        );
    }

    public String buildOutputPrompt() {
        return """
                반드시 JSON 객체 하나만 출력하세요.

                필드
                - reply: NPC가 말하는 중국어
                - translation: reply를 한국어로 번역한 문장

                예시
                {
                  "reply": "你好。",
                  "translation": "안녕하세요."
                }
                """;
    }

    public String buildNpcPrompt(
            NpcData npc,
            String playerMessage,
            SessionMemory updatedMemory,
            PlayerMemory playerMemory,
            String questPrompt
    ) {
        return """
        ===== ROLE =====
        당신은 중국어 학습을 위한 npc입니다.
        
        %s
                
        %s

        ===== MEMORY =====
        현재 대화에서 확인된 정보입니다.
        이전에 확인된 정보를 기억하고 대화를 이어가세요.
        확인되지 않은 정보는 만들어내지 마세요.
        
        플레이어의 발화가 짧거나 생략되어 있다면
        마지막 NPC 질문과 현재 대화 기억을 참고하여 해석하세요.

        대화 주제: %s
        현재 대화 기억: %s
        마지막 NPC 질문: %s
        플레이어 장기 기억: %s

        ===== OUTPUT =====
        %s

        ===== PLAYER =====
        %s

        ===== NPC =====
        """.formatted(
                buildRolePrompt(npc),
                questPrompt,
                updatedMemory.getTopic(),
                updatedMemory.getFacts(),
                updatedMemory.getLastNpcQuestion(),
                playerMemory.getFacts(),
                buildOutputPrompt(),
                playerMessage
        );
    }

    public String buildQuestPrompt(
            QuestDefinition quest,
            QuestProgress progress,
            String nextRequiredFact
    ) {
        return """
            ===== QUEST =====
            현재 퀘스트: %s

            목표: %s

            NPC가 알고 있는 정보:
            %s

            이미 수집한 정보:
            %s

            다음 질문 대상:
            %s

            규칙:
            - 다음 질문 대상이 있으면 해당 정보를 얻기 위한 질문을 우선하세요.
            - 한 번에 하나의 질문만 하세요.
            - 이미 수집한 정보는 다시 질문하지 마세요.
            - 다음 질문 대상이 없으면 퀘스트를 자연스럽게 마무리하세요.
            - 퀘스트와 관계없는 질문에도 NPC의 성격에 맞춰 자연스럽게 대답하세요.

            """.formatted(
                quest.title(),
                quest.description(),
                quest.npcFacts(),
                progress.getCollectedFacts(),
                nextRequiredFact == null ? "없음 (퀘스트 완료)" : nextRequiredFact
        );
    }
}
