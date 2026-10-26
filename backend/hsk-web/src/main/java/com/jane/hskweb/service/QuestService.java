package com.jane.hskweb.service;

import com.jane.hskweb.model.ChatMessageInfo;
import com.jane.hskweb.model.ChatMode;
import com.jane.hskweb.quest.QuestStatus;
import com.jane.hskweb.quest.QuestDataProvider;
import com.jane.hskweb.quest.QuestDefinition;
import com.jane.hskweb.quest.QuestProgress;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class QuestService {

    private final QuestDataProvider questDataProvider;

    // 퀘스트 모드 확인
    public QuestProgress prepareQuest(ChatMessageInfo request) {

        // 일반 대화시 null
        if (request.getChatMode() != ChatMode.QUEST) {
            return null;
        }

        String questId = request.getQuestId();

        if (questId == null || questId.isBlank()) {
            throw new IllegalArgumentException("퀘스트 ID가 필요합니다.");
        }

        QuestDefinition quest = questDataProvider.getQuest(questId);

        if (!quest.npcId().equals(request.getNpc())) {
            throw new IllegalArgumentException("퀘스트와 NPC가 일치하지 않습니다.");
        }

        QuestProgress progress = request.getQuestProgress();

        if (progress == null) {
            progress = new QuestProgress(questId);
        }

        if (!progress.getQuestId().equals(questId)) {
            throw new IllegalArgumentException("퀘스트 ID가 일치하지 않습니다.");
        }

        startQuest(progress);

        return progress;
    }


    public List<String> getRequiredFacts(QuestProgress progress) {

        if (progress == null) {
            return List.of();
        }

        return questDataProvider
                .getQuest(progress.getQuestId())
                .requiredFacts();
    }

    public String getNextRequiredFact(QuestProgress progress) {

        if (progress == null ||
                progress.getStatus() == QuestStatus.COMPLETED) {
            return null;
        }

        return getRequiredFacts(progress).stream()
                .filter(key -> {
                    String value = progress.getCollectedFacts().get(key);
                    return value == null || value.isBlank();
                })
                .findFirst()
                .orElse(null);
    }

    // 퀘스트 시작
    public void startQuest(QuestProgress progress) {
        if (progress.getStatus() == QuestStatus.NOT_STARTED) {
            progress.setStatus(QuestStatus.IN_PROGRESS);
        }
    }

    // 퀘스트 상태 업데이트
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