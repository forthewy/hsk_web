package com.jane.hskweb.model;

import lombok.Getter;
import lombok.Setter;

import java.util.HashMap;
import java.util.Map;

@Getter
@Setter
public class SessionMemory {
    private String topic;

    private Map<String, String> facts = new HashMap<>();

    private String lastNpcQuestion;
}
