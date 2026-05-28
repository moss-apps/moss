import { Mail } from "lucide-react"

export function Footer() {
  return (
    <footer className="relative py-12 md:py-16 px-4 sm:px-6 brutal-border-t">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 lg:gap-12 mb-16">
          {/* Brand */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/assets/moss_logo.svg"
                alt=""
                className="w-7 h-7"
              />
              <span className="font-display font-medium text-lg text-[#F5F5F5]">
                Moss
              </span>
            </div>
            <p className="text-sm text-[#8A8A90] max-w-sm leading-relaxed">
              An ecosystem of secure, open-source creative tools by Ultra
              Electronica. Built without compromise.
            </p>
          </div>

          {/* Links */}
          <div className="space-y-4">
            <div className="text-label">Ecosystem</div>
            <ul className="space-y-2">
              <li>
                <a href="#ecosystem" className="text-sm text-[#8A8A90] hover:text-[#F5F5F5] transition-colors">
                  Overview
                </a>
              </li>
              <li>
                <a href="#latch" className="text-sm text-[#8A8A90] hover:text-[#F5F5F5] transition-colors">
                  Latch
                </a>
              </li>
              <li>
                <a href="#flick" className="text-sm text-[#8A8A90] hover:text-[#F5F5F5] transition-colors">
                  Flick
                </a>
              </li>
              <li>
                <a href="#integration" className="text-sm text-[#8A8A90] hover:text-[#F5F5F5] transition-colors">
                  Integration
                </a>
              </li>
              <li>
                <a
                  href="https://play.google.com/store/apps/details?id=com.mossapps.flick"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[#8A8A90] hover:text-[#F5F5F5] transition-colors"
                >
                  Get Flick
                </a>
              </li>
              <li>
                <a
                  href="mailto:moss_apps@proton.me?subject=Latch%20Closed%20Beta%20Access"
                  className="text-sm text-[#8A8A90] hover:text-[#F5F5F5] transition-colors"
                >
                  Join Latch Beta
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/moss-apps/Flick/releases"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[#8A8A90] hover:text-[#F5F5F5] transition-colors"
                >
                  Flick Releases
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/moss-apps/Latch/releases"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[#8A8A90] hover:text-[#F5F5F5] transition-colors"
                >
                  Latch Releases
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <div className="text-label">Connect</div>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://github.com/moss-apps"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[#8A8A90] hover:text-[#F5F5F5] transition-colors inline-flex items-center gap-1.5"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href="mailto:moss_apps@proton.me"
                  className="text-sm text-[#8A8A90] hover:text-[#F5F5F5] transition-colors inline-flex items-center gap-1.5"
                >
                  <Mail className="w-3.5 h-3.5" />
                  Email
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 brutal-border-t">
          <div className="text-label">
            <span className="text-[#8A8A90]">
              © {new Date().getFullYear()} Moss Laboratories. Open source under MIT.
            </span>
          </div>
          <div className="flex items-center gap-1 text-label">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
            <span className="text-[#8A8A90]">All systems nominal</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
