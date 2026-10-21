package com.jane.hskweb;

import com.jane.hskweb.quest.QuestDefinition;
import com.jane.hskweb.quest.QuestDataProvider;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class QuestDataProviderTest {

    private final QuestDataProvider provider = new QuestDataProvider();

    @Test
     void 퀘스트_조회_테스트() {
        QuestDefinition quest = provider.getQuest("exam_schedule");

        assertEquals("exam_schedule", quest.id());
        assertEquals("teacher", quest.npcId());
        assertEquals(2, quest.requiredFacts().size());
    }

    @Test
    void 존재하지_않는_퀘스트_조회() {
        assertThrows(
                IllegalArgumentException.class,
                () -> provider.getQuest("unknown")
        );
    }
}