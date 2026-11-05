
export default function Footer() {
    return (
        <footer className="shrink-0 bg-gray py-5">
            <div className="flex items-center justify-between font-semibold px-8">
                <div>
                    <p>AI 기반 중국어 회화 연습 서비스</p>
                </div>

                <div className="flex items-center">
                    <a
                        href="https://github.com/forthewy/hsk_web"
                        target="_blank"
                        rel="noopener noreferrer"
                        className=" font-bold hover:text-gray-900"
                    >
                        GitHub
                    </a>
                    <span>© 2026 forthewy. All rights reserved.</span>
                </div>
            </div>
        </footer>
    );
}