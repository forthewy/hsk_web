package com.jane.hskweb.npc;

import com.jane.hskweb.model.NpcData;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

@Component
public class NpcDataProvider {

    private final Map<String, NpcData> npcMap = Map.of(
            "student",
            new NpcData(
                    "student",
                    "小明",
                    "학교에 다니는 학생",
                    List.of("친근하게 말한다"),
                    List.of("학교", "친구", "숙제")
            ),

            "teacher",
            new NpcData(
                    "teacher",
                    "王老师",
                    "학교 선생님",
                    List.of("친절하다"),
                    List.of("학교", "공부")
            )
    );

    public NpcData getNpc(String npcId) {
        NpcData npc = npcMap.get(npcId);

        if (npc == null) {
            throw new IllegalArgumentException("존재하지 않는 NPC입니다: " + npcId);
        }

        return npc;
    }
}