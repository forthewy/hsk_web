
interface ChatInputProps {
  message: string;
  onMessageChange: (message: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  questCompleted: boolean;
}

export default function ChatInput({
  message,
  onMessageChange,
  onSubmit,
  isLoading,
  questCompleted
}: ChatInputProps) {

  return (
    <form
      className="border-lg flex shadow-lg"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <input
        className="flex-1 text-xl bg-white rounded-lg outline-none pl-3 py-5 disabled:bg-gray-100 disabled:cursor-not-allowed"
        placeholder={
          questCompleted
            ? "완료된 퀘스트입니다"
            : "대화를 입력해주세요"
        }
        value={message}
        onChange={(e) => onMessageChange(e.target.value)}
        disabled={isLoading || questCompleted}
      />

      <button
        type="submit"
        disabled={isLoading || questCompleted || !message.trim()}
        className="bg-primary-light text-white rounded-r w-20 hover:bg-primary disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {questCompleted ? "완료" : isLoading ? "대기 중" : "입력"}
      </button>
    </form>
  );
}
