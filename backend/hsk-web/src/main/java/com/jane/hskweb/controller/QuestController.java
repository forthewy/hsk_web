package com.jane.hskweb.controller;

import com.jane.hskweb.quest.QuestDataProvider;
import com.jane.hskweb.quest.QuestDefinition;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/quests")
@RequiredArgsConstructor
public class QuestController {

    private final QuestDataProvider questDataProvider;

    @GetMapping
    public List<QuestDefinition> getQuests() {
        return questDataProvider.getAllQuests();
    }
}