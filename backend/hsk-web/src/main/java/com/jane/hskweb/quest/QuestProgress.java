package com.jane.hskweb.quest;

import lombok.Getter;
import lombok.Setter;

import java.util.HashMap;
import java.util.Map;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

@Getter
public class QuestProgress {

    private final String questId;

    @Setter
    private QuestStatus status;

    private final Map<String, String> collectedFacts = new HashMap<>();

    @JsonCreator
    public QuestProgress(@JsonProperty("questId") String questId) {
        this.questId = questId;
        this.status = QuestStatus.NOT_STARTED;
    }

    @JsonProperty("collectedFacts")
    public void setCollectedFacts(Map<String, String> facts) {
        this.collectedFacts.clear();

        if (facts != null) {
            this.collectedFacts.putAll(facts);
        }
    }
}