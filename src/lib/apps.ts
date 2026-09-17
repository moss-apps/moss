import {
  AudioWaveform,
  EyeOff,
  FolderOpen,
  HardDrive,
  Headphones,
  Lock,
  Radio,
  Timer,
  type LucideIcon,
} from "lucide-react"

export interface AppFeature {
  icon: LucideIcon
  label: string
  desc: string
}

export interface AppInfo {
  slug: "flick" | "latch"
  repo: "Flick" | "Latch"
  name: string
  tagline: string
  label: string
  description: string
  logo: string
  banner: string
  color: string
  playUrl: string
  releasesUrl: string
  siteUrl?: string
  features: AppFeature[]
  bullets: string[]
  mockups: string[]
  screenNames: string[]
  callouts: { title: string; description: string }[]
}

export const APPS: Record<"flick" | "latch", AppInfo> = {
  latch: {
    slug: "latch",
    repo: "Latch",
    name: "Latch",
    tagline: "Secure Media Vault",
    label: "Secure vault",
    description:
      "Your photos, videos, and documents locked behind AES-256 encryption that even we can't break. Decoy mode, biometric unlock, folder vaults, and automatic data destruction.",
    logo: "/assets/logos/latch_logo.svg",
    banner: "/assets/latch_banner.png",
    color: "#4F8CFF",
    playUrl:
      "https://play.google.com/store/apps/details?id=com.mossapps.locker",
    releasesUrl: "https://github.com/moss-apps/Latch/releases",
    features: [
      { icon: Lock, label: "AES-256 Encryption", desc: "Military-grade file protection" },
      { icon: EyeOff, label: "Decoy Mode", desc: "Plausible deniability layer" },
      { icon: Timer, label: "Auto-Kill", desc: "Timed self-destruct triggers" },
      { icon: FolderOpen, label: "Folder Vaults", desc: "Organized secure containers" },
    ],
    bullets: ["AES-256 encryption", "Decoy mode", "Auto-kill triggers"],
    mockups: [
      "/assets/mockups/latch_one.png",
      "/assets/mockups/latch_two.png",
      "/assets/mockups/latch_three.png",
      "/assets/mockups/latch_four.png",
      "/assets/mockups/latch_five.png",
      "/assets/mockups/latch_six.png",
    ],
    screenNames: [
      "Lock Screen",
      "Security Settings",
      "Audio Player",
      "Gallery Vault",
      "Folder Backup",
      "More Settings",
    ],
    callouts: [
      { title: "Lock Screen", description: "Biometric unlock with vault dashboard at a glance." },
      { title: "Security Settings", description: "Configure encryption, access rules, and threat responses." },
      { title: "Audio Player", description: "Built-in player with Flick as external output option." },
      { title: "Gallery Vault", description: "Hide photos and doubles as a folder explorer." },
      { title: "Folder Backup", description: "Automated backups with screenshot protection enabled." },
      { title: "More Settings", description: "Additional preferences and advanced configuration." },
    ],
  },
  flick: {
    slug: "flick",
    repo: "Flick",
    name: "Flick",
    tagline: "Audiophile Player",
    label: "Music player",
    description:
      "An audiophile music player that respects your ears and your files. UAC 2.0 USB DAC support, bit-perfect lossless playback, and a minimal interface that gets out of the way.",
    logo: "/assets/logos/flick_logo.svg",
    banner: "/assets/flick_banner.png",
    color: "#14B8A6",
    playUrl: "https://play.google.com/store/apps/details?id=com.mossapps.flick",
    releasesUrl: "https://github.com/moss-apps/Flick/releases",
    siteUrl: "https://www.flick-player.site/",
    features: [
      { icon: AudioWaveform, label: "Lossless Playback", desc: "FLAC, ALAC, WAV, DSD" },
      { icon: HardDrive, label: "UAC 2.0", desc: "USB Audio Class support" },
      { icon: Headphones, label: "Hi-Res Audio", desc: "Up to 32-bit / 384kHz" },
      { icon: Radio, label: "Gapless", desc: "Seamless album playback" },
    ],
    bullets: ["UAC 2.0 DAC output", "Lossless playback", "Tactile interface"],
    mockups: [
      "/assets/mockups/flick_one.png",
      "/assets/mockups/flick_two.png",
      "/assets/mockups/flick_three.png",
      "/assets/mockups/flick_four.png",
      "/assets/mockups/flick_five.png",
      "/assets/mockups/flick_six.png",
    ],
    screenNames: [
      "Equalizer",
      "Now Playing",
      "Library",
      "Full Screen Player",
      "UAC 2.0 Preferences",
      "Flick Replay",
    ],
    callouts: [
      { title: "Equalizer", description: "Fine-tune your sound with precision frequency controls." },
      { title: "Now Playing", description: "Minimal interface that gets out of the way." },
      { title: "Library", description: "Your collection, beautifully organized. No cloud required." },
      { title: "Full Screen Player", description: "Immersive playback with album art and controls." },
      { title: "UAC 2.0 Preferences", description: "USB Audio Class settings up to 32-bit / 384kHz." },
      { title: "Flick Replay", description: "Revisit your listening history and favorite moments." },
    ],
  },
}
