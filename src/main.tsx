import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter, Routes, Route } from "react-router"
import { Layout } from "@/components/Layout"
import { Home } from "@/pages/Home"
import { Changelog } from "@/pages/Changelog"
import { Downloads } from "@/pages/Downloads"
import "./index.css"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/changelog" element={<Changelog />} />
          <Route path="/downloads" element={<Downloads />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
