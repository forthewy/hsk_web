package com.jane.hskweb.quest;

import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

@Component
public class QuestDataProvider {

    private final Map<String, QuestDefinition> quests = Map.of(

            "self_introduction",
            new QuestDefinition(
                    "self_introduction",
                    "teacher",
                    "school",
                    "자기소개하기",
                    "선생님에게 이름, 출신 국가, 취미를 소개하세요.",
                    Map.of(),
                    List.of("name", "country", "hobby")
            ),

            "coffee_order",
            new QuestDefinition(
                    "coffee_order",
                    "clerk",
                    "cafe",
                    "커피 주문하기",
                    "점원에게 원하는 커피를 주문하세요.",
                    Map.of(),
                    List.of("drink", "temperature", "orderConfirmed")
            )
    );

    public QuestDefinition getQuest(String questId) {
        QuestDefinition quest = quests.get(questId);

        if (quest == null) {
            throw new IllegalArgumentException("존재하지 않는 퀘스트입니다.");
        }

        return quest;
    }

    public List<QuestDefinition> getAllQuests() {
        return List.copyOf(quests.values());
    }
}