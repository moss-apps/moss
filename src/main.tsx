import "@/lib/zodConfig"
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter, Routes, Route } from "react-router"
import { Layout } from "@/components/Layout"
import { ErrorBoundary } from "@/components/ErrorBoundary"
import { Home } from "@/pages/Home"
import { Changelog } from "@/pages/Changelog"
import { Downloads } from "@/pages/Downloads"
import { Announcements } from "@/pages/Announcements"
import { AnnouncementDetail } from "@/pages/AnnouncementDetail"
import { Community } from "@/pages/Community"
import { Admin } from "@/pages/Admin"
import { AppPage } from "@/pages/AppPage"
import { Contact } from "@/pages/Contact"
import { Search } from "@/pages/Search"
import { NotFound } from "@/pages/NotFound"
import { APPS } from "@/lib/apps"
import "./index.css"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ErrorBoundary>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/changelog" element={<Changelog />} />
            <Route path="/downloads" element={<Downloads />} />
            <Route path="/announcements" element={<Announcements />} />
            <Route path="/announcements/:id" element={<AnnouncementDetail />} />
            <Route path="/community" element={<Community />} />
            <Route path="/community/:slug" element={<Community />} />
            <Route path="/flick" element={<AppPage app={APPS.flick} />} />
            <Route path="/latch" element={<AppPage app={APPS.latch} />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/search" element={<Search />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </ErrorBoundary>
    </BrowserRouter>
  </StrictMode>,
)
