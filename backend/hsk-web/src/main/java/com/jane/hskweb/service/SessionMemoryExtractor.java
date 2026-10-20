package com.jane.hskweb.service;

import tools.jackson.databind.ObjectMapper;
import com.jane.hskweb.model.SessionMemory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class SessionMemoryExtractor {

    private final GeminiService geminiService;
    private final ObjectMapper objectMapper;

    public SessionMemory extract(
            String playerMessage,
            SessionMemory currentMemory
    ) {
        String prompt = """
                너는 대화를 이어가기 위해 필요한
                임시 정보를 추출하는 JSON 추출기이다.
                
                        현재 세션 메모리:
                %s
                
                플레이어의 새로운 발화:
                %s
                
                규칙:
                - 플레이어의 발화에서 확인된 사실만 추출하세요.
                - 현재 대화 주제와 관련된 사실만 추출하세요.
                - 기존 topic과 facts를 참고하여
                  새로운 발화가 어떤 정보를 의미하는지 판단하세요.
                - 추출할 정보가 없으면 facts는 빈 객체 {}로 출력하세요.
                - 기존 facts와 일치하지 않는 정보를 제공하면 같은 키값으로 새로운 value 를 입력한다.
                - 결과는 반드시 JSON 객체 하나만 출력하세요.
                - 플레이어의 이름은 반드시 "name" 키로 추출한다.
                - 플레이어가 좋아하는 대상은 반드시 "preference" 키로 추출한다.
                
                        출력 형식:
                {
                    "topic": "현재 대화 주제 또는 null",
                        "facts": {}
                }
                
                JSON 출력:
                """.formatted(
                objectMapper.writeValueAsString(currentMemory),
                playerMessage
        );


        String response = geminiService.generate(prompt);

        String cleanedResponse = response
                .replace("```json", "")
                .replace("```", "")
                .trim();

        SessionMemory extracted =
                objectMapper.readValue(cleanedResponse, SessionMemory.class);

        // 기존 facts 유지, 새로 추출한 facts로 갱신
        Map<String, String> mergedFacts =
                new HashMap<>(currentMemory.getFacts());

        if (extracted.getFacts() != null) {
            mergedFacts.putAll(extracted.getFacts());
        }

        currentMemory.setFacts(mergedFacts);

        // 주제가 추출된 경우에만 갱신
        if (extracted.getTopic() != null) {
            currentMemory.setTopic(extracted.getTopic());
        }
        // lastNpcQuestion은 건드리지 않고 return
        return currentMemory;
    }
}
