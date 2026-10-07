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
            <h2>장소</h2>
            <div className="grid grid-cols-2 bg-gray-200">
                <button
                    className={`w-full py-3 rounded ${place === "school"
                            ? "bg-background text-primary-light font-bold"
                            : "text-slate-500 hover:bg-white"
                        }`}
                    onClick={() => setPlace("school")}
                >
                    학교
                </button>
                <button
                    className={`w-full rounded py-3 ${place === "cafe"
                            ? "bg-background text-primary-light font-bold "
                            : "text-slate-500 hover:bg-white"
                        }`}
                    onClick={() => setPlace("cafe")}
                >
                    카페
                </button>
            </div>
        </div >

        <div>
            <h2>대화 상대</h2>
            
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
