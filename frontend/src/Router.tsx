import { BrowserRouter, Routes, Route } from "react-router-dom";
import Chat from "./pages/Chat";
import Layout from "./components/layout/Layout";

export default function() {
    return(
        <BrowserRouter>
        <Routes>
            <Route element={<Layout />}>
                <Route path="/chat" element={<Chat/>}></Route>
            </Route>
        </Routes>
        </BrowserRouter>
    )
}