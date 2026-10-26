package com.jane.hskweb.service;

import tools.jackson.databind.ObjectMapper;
import com.jane.hskweb.model.SessionMemory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class SessionMemoryExtractor {

    private final GeminiService geminiService;
    private final ObjectMapper objectMapper;

    public SessionMemory extract(
            String playerMessage,
            SessionMemory currentMemory,
            List<String> requiredFacts

    ) {

        String questRules = "";

        if (requiredFacts != null && !requiredFacts.isEmpty()) {
            questRules = """
            현재 퀘스트에서 수집해야 하는 정보:
            %s

            - 위 목록에 있는 정보를 우선 추출하세요.
            - 추출한 정보는 반드시 목록에 지정된 키 이름으로 반환하세요.
            - 필수 정보에 해당하는 사실은 다른 키 이름으로 중복 추출하지 마세요.
            - 한 번의 발화에서 여러 정보가 확인되면 모두 추출하세요.
            """.formatted(requiredFacts);
        }


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
                - 추출할 정보가 없으면 facts는 빈 객체 {}로 출력하세요.
                - 기존 facts와 일치하지 않는 정보를 제공하면 같은 키값으로 새로운 value 를 입력한다.
                - 결과는 반드시 JSON 객체 하나만 출력하세요.
                - 플레이어의 이름은 반드시 "name" 키로 추출한다.
                    
                     %s
                
                        출력 형식:
                {
                    "topic": "현재 대화 주제 또는 null",
                        "facts": {}
                }
                
                JSON 출력:
                """.formatted(
                objectMapper.writeValueAsString(currentMemory),
                playerMessage,
                questRules
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
