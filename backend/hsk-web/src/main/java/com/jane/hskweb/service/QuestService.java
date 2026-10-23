package com.jane.hskweb.service;

import com.jane.hskweb.quest.QuestStatus;
import com.jane.hskweb.quest.QuestDataProvider;
import com.jane.hskweb.quest.QuestDefinition;
import com.jane.hskweb.quest.QuestProgress;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class QuestService {

    private final QuestDataProvider questDataProvider;

    public void startQuest(QuestProgress progress) {
        if (progress.getStatus() == QuestStatus.NOT_STARTED) {
            progress.setStatus(QuestStatus.IN_PROGRESS);
        }
    }

    public void updateFacts(
            QuestProgress progress,
            Map<String, String> newFacts
    ) {
        if (progress.getStatus() != QuestStatus.IN_PROGRESS) {
            return;
        }

        QuestDefinition quest =
                questDataProvider.getQuest(progress.getQuestId());

        // 퀘스트에 정의된 fact만 저장
        for (String key : quest.requiredFacts()) {
            String value = newFacts.get(key);

            if (value != null && !value.isBlank()) {
                progress.getCollectedFacts().put(key, value);
            }
        }

        // 모든 필수 fact가 채워졌는지 확인
        boolean completed = quest.requiredFacts().stream()
                .allMatch(key -> {
                    String value = progress.getCollectedFacts().get(key);
                    return value != null && !value.isBlank();
                });

        if (completed) {
            progress.setStatus(QuestStatus.COMPLETED);
        }
    }
}