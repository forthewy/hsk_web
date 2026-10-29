type LevelSelectorProps = {
    level: number;
    onChange: (level: number) => void;

};

export default function LevelSelector({ level, onChange }: LevelSelectorProps) {

    return (
        <div className="h-20 bg-background px-6 py-3 items-center">
            <div className="flex justify-between ">
                {[1, 2, 3, 4, 5, 6].map((levelItem) => (
                    <button
                        key={levelItem}
                        onClick={() => onChange(levelItem)}
                        className={
                            level === levelItem
                                ? "bg-primary-light text-white  font-semibold px-6 py-2 m-2 rounded whitespace-nowrap"
                                : "bg-gray font-semibold px-6 py-2 m-2 rounded whitespace-nowrap"
                        }
                    >
                        HSK {levelItem}급
                    </button>
                ))}
            </div>
        </div>
    )
}