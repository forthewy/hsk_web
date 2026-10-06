type PlaceNpcSelectorProps = {
    place: string;
    npc: string;
    setPlace: (place: string) => void;
    setNpc: (npc: string) => void;
}

export default function PlaceNpcSelector({
    place,
    npc,
    setPlace,
    setNpc,
}: PlaceNpcSelectorProps) {
    return <>
        <div>
            <div>장소</div>

            <button onClick={() => setPlace("school")}>
                학교
            </button>

            <button onClick={() => setPlace("cafe")}>
                카페
            </button>
        </div>

        <div>
            <div>대화 상대</div>

            {place === "school" && (
                <>
                    <button onClick={() => setNpc("teacher")}>
                        선생님
                    </button>

                    <button onClick={() => setNpc("student")}>
                        학생
                    </button>
                </>
            )}

            {place === "cafe" && (
                <button onClick={() => setNpc("clerk")}>
                    점원
                </button>
            )}
        </div>
    </>
}
