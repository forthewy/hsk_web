import { BrowserRouter, Routes, Route } from "react-router-dom";
import Chat from "./pages/chat/Chat";
import Layout from "./components/layout/Layout";
import Guide from "./pages/guide/Guide";

export default function() {
    return(
        <BrowserRouter>
        <Routes>
            <Route element={<Layout />}>
                <Route path="/" element={<Guide/>}></Route>
                <Route path="/chat" element={<Chat/>}></Route>
            </Route>
        </Routes>
        </BrowserRouter>
    )
}