import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter, Routes, Route } from "react-router"
import { Layout } from "@/components/Layout"
import { Home } from "@/pages/Home"
import { Changelog } from "@/pages/Changelog"
import { Downloads } from "@/pages/Downloads"
import { Announcements } from "@/pages/Announcements"
import { AnnouncementDetail } from "@/pages/AnnouncementDetail"
import { Community } from "@/pages/Community"
import { Admin } from "@/pages/Admin"
import "./index.css"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/changelog" element={<Changelog />} />
          <Route path="/downloads" element={<Downloads />} />
          <Route path="/announcements" element={<Announcements />} />
          <Route path="/announcements/:id" element={<AnnouncementDetail />} />
          <Route path="/community" element={<Community />} />
          <Route path="/community/:slug" element={<Community />} />
          <Route path="/admin" element={<Admin />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
