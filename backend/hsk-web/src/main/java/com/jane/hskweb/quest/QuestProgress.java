package com.jane.hskweb.quest;

import com.jane.hskweb.model.QuestStatus;
import lombok.Getter;
import lombok.Setter;

import java.util.HashMap;
import java.util.Map;

@Getter
public class QuestProgress {

    private final String questId;

    @Setter
    private QuestStatus status;

    private final Map<String, String> collectedFacts = new HashMap<>();

    public QuestProgress(String questId) {
        this.questId = questId;
        this.status = QuestStatus.NOT_STARTED;
    }
}