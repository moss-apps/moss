import { useState, type FormEvent } from "react"
import { Link } from "react-router"
import { motion } from "framer-motion"
import {
  ArrowLeft,
  Mail,
  Code2,
  MessageCircle,
  Coffee,
  ShieldAlert,
  Send,
} from "lucide-react"
import { PlasmaWave } from "@/components/PlasmaWave"
import { panelStyle } from "@/lib/announcements"

const EMAIL = "moss_apps@proton.me"

const CHANNELS = [
  {
    icon: Mail,
    label: "Email",
    value: EMAIL,
    href: `mailto:${EMAIL}`,
    description: "General questions, feedback, and press.",
    external: false,
  },
  {
    icon: Code2,
    label: "GitHub",
    value: "github.com/moss-apps",
    href: "https://github.com/moss-apps",
    description: "Source code, releases, and issue tracking.",
    external: true,
  },
  {
    icon: MessageCircle,
    label: "Discord",
    value: "Moss community server",
    href: "https://discord.gg/5hgcrdnKY6",
    description: "Chat with the community and the developers.",
    external: true,
  },
  {
    icon: Coffee,
    label: "Ko-fi",
    value: "ko-fi.com/ultraelectronica",
    href: "https://ko-fi.com/ultraelectronica",
    description: "Support ongoing development.",
    external: true,
  },
  {
    icon: ShieldAlert,
    label: "Security",
    value: "Private disclosure",
    href: "mailto:moss_apps@proton.me",
    description: "Report vulnerabilities privately — never in a public issue.",
    external: false,
  },
]

const inputClass =
  "w-full px-3 py-2 bg-white/[0.02] text-[#F5F5F5] text-sm border border-white/10 focus:border-[var(--accent)]/40 focus:outline-none transition-colors rounded-none placeholder:text-[#5A5A60]"

export function Contact() {
  const [name, setName] = useState("")
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    const mailSubject = subject.trim() || `Message from ${name.trim() || "the website"}`
    const body = [
      message.trim(),
      "",
      "—",
      name.trim() ? `From: ${name.trim()}` : "",
    ]
      .filter(Boolean)
      .join("\n")
    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(body)}`
  }

  return (
    <main className="relative min-h-screen pt-28 sm:pt-32 pb-20 px-4 sm:px-6 bg-[#0A0A0B]">
      <title>Contact — Moss Laboratories</title>
      <meta
        name="description"
        content="Get in touch with Moss Laboratories — email, GitHub, Discord, and private security disclosure."
      />
      <PlasmaWave />

      <div className="relative z-10 max-w-5xl mx-auto">
        <Link
          to="/"
          className="inline-flex items-center gap-2 mb-6 text-sm text-[#8A8A90] hover:text-[#F5F5F5] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Moss
        </Link>

        <div className="mb-8 sm:mb-10">
          <div className="flex items-center gap-3 mb-3">
            <Mail className="w-6 h-6 text-[var(--accent)]" />
            <h1 className="font-display text-4xl sm:text-5xl font-medium tracking-tight text-[#F5F5F5]">
              Contact
            </h1>
          </div>
          <p className="text-[#8A8A90] max-w-xl leading-relaxed">
            Questions, bug reports, or just want to say hello — pick whichever
            channel suits you. We read everything.
          </p>
        </div>

        <div className="grid lg:grid-cols-[1fr_360px] gap-6 items-start">
          {/* Composer */}
          <motion.section
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="relative py-6 sm:py-8 px-0 sm:px-8"
            style={{
              ...panelStyle,
              backgroundImage:
                "radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          >
            <h2 className="font-display text-2xl font-medium tracking-tight text-[#F5F5F5] mb-2">
              Send a message
            </h2>
            <p className="text-sm text-[#8A8A90] leading-relaxed mb-7">
              This opens your default mail client with everything prefilled —
              nothing is stored or sent from this page.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="contact-name" className="text-label block mb-2">
                    Name
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="contact-subject" className="text-label block mb-2">
                    Subject
                  </label>
                  <input
                    id="contact-subject"
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="What's this about?"
                    className={inputClass}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="contact-message" className="text-label block mb-2">
                  Message
                </label>
                <textarea
                  id="contact-message"
                  required
                  rows={7}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write your message…"
                  className={`${inputClass} resize-y custom-scrollbar`}
                />
              </div>
              <div className="flex flex-wrap items-center gap-4 pt-1">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-md bg-[var(--accent)] text-[#0A0A0B] hover:brightness-110 transition-[filter] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
                >
                  <Send className="w-4 h-4" />
                  Open in mail app
                </button>
                <span className="font-mono text-xs text-[#6A6A70]">
                  To: {EMAIL}
                </span>
              </div>
            </form>
          </motion.section>

          {/* Channels */}
          <aside className="space-y-3">
            {CHANNELS.map((channel, index) => (
              <motion.a
                key={channel.label}
                href={channel.href}
                target={channel.external ? "_blank" : undefined}
                rel={channel.external ? "noopener noreferrer" : undefined}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="group flex items-start gap-3 p-4 border border-white/10 hover:border-[var(--accent)]/40 transition-colors"
              >
                <channel.icon className="w-4 h-4 text-[var(--accent)] mt-0.5 shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm text-[#F5F5F5]">{channel.label}</p>
                  <p className="font-mono text-xs text-[#8A8A90] truncate mt-0.5 group-hover:text-[var(--accent)] transition-colors">
                    {channel.value}
                  </p>
                  <p className="text-xs text-[#6A6A70] leading-relaxed mt-1.5">
                    {channel.description}
                  </p>
                </div>
              </motion.a>
            ))}
          </aside>
        </div>
      </div>
    </main>
  )
}
