import { Outlet } from "react-router-dom";

export default function Layout() {
    return (
    <div className="min-h-screen flex flex-col">
    <header className="h-16 bg-red-300">
        <h1>HSK AI Chat</h1>
      </header>

      <main className="flex-1 w-full max-w-5xl mx-auto bg-blue-200">
        <Outlet />
      </main>

      <footer className="h-20 bg-green-300">
        FOOTER
      </footer>
    </div>
  );
}