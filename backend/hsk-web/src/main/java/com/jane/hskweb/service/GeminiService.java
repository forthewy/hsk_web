package com.jane.hskweb.service;

import com.google.genai.Client;
import com.google.genai.gaos.models.interactions.*;
import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GeminiService {

    private final Client client;

    public GeminiService() {
        this.client = new Client();
    }

    public String generate(String prompt) {

        try {
            System.out.println("Gemini 호출 시작");

            CreateModelInteraction params =
                    CreateModelInteraction.builder()
                            .model(Model.GEMINI36_FLASH)
                            .input(InteractionsInput.of(prompt))
                            .build();

            Interaction interaction = client.interactions
                    .create(CreateInteractionRequestBody.of(params))
                    .interaction()
                    .orElseThrow(() ->
                            new IllegalStateException("Gemini 응답이 없습니다.")
                    );

            System.out.println("Gemini 호출 성공");

            for (Step step : interaction.steps().orElse(List.of())) {

                if (step instanceof ModelOutputStep modelOutput) {

                    for (Content content : modelOutput.content().orElse(List.of())) {

                        if (content instanceof TextContent textContent) {
                            String text = textContent.text()
                                    .orElseThrow(() ->
                                            new IllegalStateException("텍스트가 비어 있습니다.")
                                    );

                            System.out.println("NPC 응답: " + text);

                            return text;
                        }
                    }
                }
            }

            throw new IllegalStateException("Gemini 응답에서 텍스트를 찾지 못했습니다.");

        } catch (Exception e) {
            System.out.println("Gemini 호출 실패");
            e.printStackTrace();
            throw e;
        }
    }

}