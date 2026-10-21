import { Outlet, useLocation } from "react-router-dom";

export default function Layout() {
  const location = useLocation();
  const isChatPage = location.pathname === "/chat";

  return (
    <div className="h-screen flex flex-col">
      <header className="h-16 bg-primary-light py-4">
        <h1>HSK AI Chat</h1>
      </header>

      <main className="flex-1 min-h-0 w-full overflow-hidden">
        <Outlet />
      </main>

      {!isChatPage && (
        <footer className="h-20 shrink-0 bg-gray">
          FOOTER
        </footer>
      )}
    </div>
  );
}