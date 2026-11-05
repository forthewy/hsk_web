
import { Link } from "react-router-dom";

export default function Header() {
    return (
        <header className="h-16 bg-primary-lightest px-6 flex items-center justify-between">
            {/* 로고 */}
            <Link
                to="/"
                className="text-xl font-bold hover:text-deep-primary transition"
            >
                HSK AI Chat
            </Link>

            {/* 메뉴 */}
            <nav className="flex items-center gap-6">
                <Link
                    to="/chat"
                    className="rounded-lg bg-primary px-4 py-2 font-semibold text-white"
                >
                    회화 시작하기 →
                </Link>
            </nav>
        </header>
    );
}
