package com.jane.hskweb.service;

import com.google.genai.Client;
import com.google.genai.gaos.models.interactions.CreateModelInteraction;
import com.google.genai.gaos.models.interactions.Interaction;
import com.google.genai.gaos.models.interactions.InteractionsInput;
import com.google.genai.gaos.models.interactions.Model;
import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
import org.springframework.stereotype.Service;

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
                            .model(Model.GEMINI38_FLASH)
                            .input(InteractionsInput.of(prompt))
                            .build();

            Interaction interaction = client.interactions
                    .create(CreateInteractionRequestBody.of(params))
                    .interaction()
                    .orElseThrow(() ->
                            new IllegalStateException("Gemini 응답이 없습니다.")
                    );

            System.out.println("Gemini 호출 성공");

            return interaction.outputText().orElse("");

        } catch (Exception e) {
            System.out.println("Gemini 호출 실패");
            e.printStackTrace();
            throw e;
        }
  }
}