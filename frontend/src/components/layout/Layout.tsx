import { Outlet } from "react-router-dom";

export default function Layout() {
    return (
    <div className="min-h-screen flex flex-col">
    <header className="h-16 bg-primary-light py-4">
        <h1>HSK AI Chat</h1>
      </header>

      <main className="flex-1 w-full max-w-5xl mx-auto">
        <Outlet />
      </main>

      <footer className="h-20 bg-gray">
        FOOTER
      </footer>
    </div>
  );
}