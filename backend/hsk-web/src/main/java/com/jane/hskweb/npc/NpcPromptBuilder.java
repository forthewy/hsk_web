package com.jane.hskweb.npc;

import com.jane.hskweb.model.NpcData;
import org.springframework.stereotype.Component;

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

    public String buildMustPrompt() {
        return """
                당신은 중국어로 말합니다.
                """;
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
            String npcName,
            String playerMessage
    ) {
        return """
                ===== ROLE =====
                %s

                ===== MUST =====
                %s

                ===== OUTPUT =====
                %s

                ===== PLAYER =====
                %s

                ===== NPC =====
                """.formatted(
                buildRolePrompt(npcName),
                buildMustPrompt(),
                buildOutputPrompt(),
                playerMessage
        );
    }
}
