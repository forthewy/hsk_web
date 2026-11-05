import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

export default function Layout() {
  const location = useLocation();
  const isChatPage = location.pathname === "/chat";

  return (
    <div className="h-screen flex flex-col">
      <Header />

      <main
        className={
          "flex-1 min-h-0 w-full overflow-hidden bg-background"
        }
      >
        <Outlet />
      </main>
      {!isChatPage && <Footer />}
    </div>
  );
}