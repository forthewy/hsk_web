package com.jane.hskweb.quest;

import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

@Component
public class QuestDataProvider {

    private final Map<String, QuestDefinition> quests = Map.of(

            "exam_schedule",
            new QuestDefinition(
                    "exam_schedule",
                    "teacher",
                    "school",
                    "시험 일정 알아내기",
                    "선생님에게 시험 날짜와 시간을 물어보세요.",
                    Map.of(
                            "examDate", "11월 10일",
                            "examTime", "오전 9시"
                    ),
                    List.of("examDate", "examTime")
            ),

            "coffee_order",
            new QuestDefinition(
                    "coffee_order",
                    "cafe_clerk",
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