import { useState, useEffect } from "react"
import useSWR from "swr"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import {
  Megaphone,
  Loader2,
  Plus,
  Trash2,
  LogOut,
  Save,
  X,
  Pin,
  Eye,
  EyeOff,
} from "lucide-react"
import {
  adminApi,
  getAdminToken,
  clearAdminToken,
  startIdleWatcher,
} from "@/lib/adminClient"
import {
  TAG_OPTIONS,
  APP_OPTIONS,
  TAG_META,
  type Announcement,
  type AnnouncementTag,
  type AnnouncementApp,
} from "@/lib/announcements"

const formSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  date: z.string().min(1, "Date is required"),
  body: z.string().max(50000),
  tag: z.enum(["update", "release", "maintenance", "security", "general"]),
  app: z.enum(["flick", "latch", "both", "ecosystem"]),
  pinned: z.boolean(),
  published: z.boolean(),
})

interface FormData {
  title: string
  date: string
  body: string
  tag: AnnouncementTag
  app: AnnouncementApp
  pinned: boolean
  published: boolean
}

function toDatetimeLocal(iso: string): string {
  const d = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

function fromDatetimeLocal(local: string): string {
  return new Date(local).toISOString()
}

function formatDateShort(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "2-digit",
  })
}

const inputClass =
  "w-full px-3 py-2 bg-white/[0.02] text-[#F5F5F5] text-sm border border-white/10 focus:border-[var(--accent)]/40 focus:outline-none transition-colors rounded-none"
const labelClass =
  "block text-label text-[#6A6A70] mb-1.5"

function LoginForm({ onSuccess }: { onSuccess: () => void }) {
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const ok = await adminApi.auth(password)
      if (ok) {
        setPassword("")
        onSuccess()
      } else {
        setError("Invalid password")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="relative pt-28 sm:pt-32 pb-20 px-4 sm:px-6 min-h-screen">
      <title>Admin — Moss Laboratories</title>
      <div className="max-w-sm mx-auto">
        <div className="flex items-center gap-3 mb-8 justify-center">
          <Megaphone className="w-6 h-6 text-[var(--accent)]" />
          <h1 className="font-display text-2xl font-medium tracking-tight text-[#F5F5F5]">
            Admin
          </h1>
        </div>
        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-4"
          style={{
            borderTop: "1px solid transparent",
            borderBottom: "1px solid transparent",
            borderImage:
              "linear-gradient(to right, transparent 0%, rgba(255,255,255,0.12) 15%, rgba(255,255,255,0.12) 85%, transparent 100%) 1",
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        >
          <div>
            <label className={labelClass} htmlFor="password">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`${inputClass} pr-10`}
                autoFocus
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-[#6A6A70] hover:text-[#F5F5F5] transition-colors"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={loading || !password}
            className="w-full px-4 py-2 text-sm font-medium text-[#0A0A0B] bg-[var(--accent)] disabled:opacity-40 transition-opacity"
          >
            {loading ? "Verifying…" : "Login"}
          </button>
        </form>
      </div>
    </main>
  )
}

function AnnouncementForm({
  initial,
  saving,
  onSave,
  onDelete,
  onCancel,
}: {
  initial: Announcement | null
  saving: boolean
  onSave: (data: FormData) => void
  onDelete: (() => void) | null
  onCancel: () => void
}) {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initial?.title ?? "",
      date: initial ? toDatetimeLocal(initial.date) : toDatetimeLocal(new Date().toISOString()),
      body: initial?.body ?? "",
      tag: initial?.tag ?? "update",
      app: initial?.app ?? "both",
      pinned: initial?.pinned ?? false,
      published: initial?.published ?? false,
    },
  })

  useEffect(() => {
    reset({
      title: initial?.title ?? "",
      date: initial ? toDatetimeLocal(initial.date) : toDatetimeLocal(new Date().toISOString()),
      body: initial?.body ?? "",
      tag: initial?.tag ?? "update",
      app: initial?.app ?? "both",
      pinned: initial?.pinned ?? false,
      published: initial?.published ?? false,
    })
  }, [initial, reset])

  const bodyValue = watch("body")
  const publishedValue = watch("published")

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-medium text-[#F5F5F5]">
          {initial ? "Edit" : "New Announcement"}
        </h2>
        <button
          onClick={onCancel}
          className="p-1.5 text-[#8A8A90] hover:text-[#F5F5F5] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <form onSubmit={handleSubmit(onSave)} className="space-y-4">
        <div>
          <label className={labelClass}>Title</label>
          <input {...register("title")} className={inputClass} />
          {errors.title && (
            <p className="text-xs text-red-400 mt-1">{errors.title.message}</p>
          )}
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Date</label>
            <input
              type="datetime-local"
              {...register("date")}
              className={inputClass}
            />
            {errors.date && (
              <p className="text-xs text-red-400 mt-1">{errors.date.message}</p>
            )}
          </div>

          <div>
            <label className={labelClass}>Tag</label>
            <select {...register("tag")} className={inputClass}>
              {TAG_OPTIONS.map((opt) => (
                <option key={opt.key} value={opt.key}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>App</label>
            <select {...register("app")} className={inputClass}>
              {APP_OPTIONS.map((opt) => (
                <option key={opt.key} value={opt.key}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end gap-4 pb-1">
            <label className="flex items-center gap-2 text-sm text-[#8A8A90] cursor-pointer">
              <input
                type="checkbox"
                {...register("pinned")}
                className="w-4 h-4 accent-[var(--accent)]"
              />
              <Pin className="w-3.5 h-3.5" />
              Pinned
            </label>
            <label className="flex items-center gap-2 text-sm text-[#8A8A90] cursor-pointer">
              <input
                type="checkbox"
                {...register("published")}
                className="w-4 h-4 accent-[var(--accent)]"
              />
              {publishedValue ? (
                <Eye className="w-3.5 h-3.5" />
              ) : (
                <EyeOff className="w-3.5 h-3.5" />
              )}
              Published
            </label>
          </div>
        </div>

        <div>
          <label className={labelClass}>Body (Markdown)</label>
          <textarea
            {...register("body")}
            rows={8}
            className={`${inputClass} font-mono text-xs resize-y`}
            placeholder="Write announcement body in markdown…"
          />
        </div>

        {bodyValue && (
          <div>
            <span className={labelClass}>Preview</span>
            <div
              className="changelog-prose p-4 max-h-64 overflow-y-auto custom-scrollbar"
              style={{
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  a: ({ ...props }) => (
                    <a {...props} target="_blank" rel="noopener noreferrer" />
                  ),
                }}
              >
                {bodyValue}
              </ReactMarkdown>
            </div>
          </div>
        )}

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#0A0A0B] bg-[var(--accent)] disabled:opacity-40 transition-opacity"
          >
            {saving ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Save className="w-3.5 h-3.5" />
            )}
            Save
          </button>
          {onDelete && (
            <button
              type="button"
              onClick={onDelete}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:text-red-300 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete
            </button>
          )}
        </div>
      </form>
    </div>
  )
}

export function Admin() {
  const [authed, setAuthed] = useState(() => !!getAdminToken())
  const [saveError, setSaveError] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showNew, setShowNew] = useState(false)
  const [saving, setSaving] = useState(false)

  const { data: items = [], error: loadError, isLoading: loading, mutate } =
    useSWR(authed ? "admin-announcements" : null, () => adminApi.list(), {
      onError: (err) => {
        if (err instanceof Error && err.message === "Authentication failed") {
          setAuthed(false)
        }
      },
    })

  useEffect(() => {
    if (!authed) return
    const cleanup = startIdleWatcher(() => {
      setAuthed(false)
      setEditingId(null)
      setShowNew(false)
    })
    return cleanup
  }, [authed])

  const handleSave = async (data: FormData) => {
    setSaving(true)
    setSaveError(null)
    try {
      const input = {
        ...data,
        date: fromDatetimeLocal(data.date),
      }
      if (editingId) {
        await adminApi.update(editingId, input)
      } else {
        await adminApi.create(input)
      }
      setEditingId(null)
      setShowNew(false)
      await mutate()
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : "Save failed")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!editingId) return
    if (!confirm("Delete this announcement? This cannot be undone.")) return
    setSaving(true)
    setSaveError(null)
    try {
      await adminApi.remove(editingId)
      setEditingId(null)
      await mutate()
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : "Delete failed")
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = () => {
    clearAdminToken()
    setAuthed(false)
    setEditingId(null)
    setShowNew(false)
  }

  if (!authed) {
    return <LoginForm onSuccess={() => setAuthed(true)} />
  }

  const editing = items.find((i) => i.id === editingId) ?? null
  const displayError =
    saveError || (loadError instanceof Error ? loadError.message : null)

  return (
    <main className="relative pt-28 sm:pt-32 pb-20 px-4 sm:px-6 min-h-screen">
      <title>Admin — Moss Laboratories</title>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Megaphone className="w-6 h-6 text-[var(--accent)]" />
            <h1 className="font-display text-2xl sm:text-3xl font-medium tracking-tight text-[#F5F5F5]">
              Admin Panel
            </h1>
          </div>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 px-3 py-1.5 text-sm text-[#8A8A90] hover:text-[#F5F5F5] transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>

        {displayError && (
          <div className="mb-6 p-3 text-sm text-red-400 border border-red-400/20 bg-red-400/[0.04]">
            {displayError}
          </div>
        )}

        <div className="grid lg:grid-cols-[320px_1fr] gap-6 items-start">
          <aside className="space-y-2">
            <button
              onClick={() => {
                setShowNew(true)
                setEditingId(null)
              }}
              className={`w-full flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-all ${
                showNew
                  ? "bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/30"
                  : "text-[#8A8A90] hover:text-[#F5F5F5] border border-white/10 hover:border-white/20"
              }`}
            >
              <Plus className="w-4 h-4" />
              New Announcement
            </button>

            <div className="text-label text-[#6A6A70] pt-2 px-1">
              All Entries ({items.length})
            </div>

            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-6 h-6 text-[var(--accent)] animate-spin" />
              </div>
            ) : (
              <div className="space-y-1 max-h-[60vh] overflow-y-auto custom-scrollbar">
                {items.map((item) => {
                  const isActive = item.id === editingId
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setEditingId(item.id)
                        setShowNew(false)
                      }}
                      className={`w-full text-left px-3 py-2.5 transition-all ${
                        isActive
                          ? "text-[var(--accent)] bg-[var(--accent)]/5"
                          : "text-[#8A8A90] hover:text-[#F5F5F5] hover:bg-white/[0.02]"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{
                            backgroundColor: item.published
                              ? TAG_META[item.tag].color
                              : "#3A3A40",
                          }}
                        />
                        <span className="text-sm truncate font-medium">
                          {item.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1 ml-4">
                        <span className="text-[10px] font-mono text-[#6A6A70]">
                          {formatDateShort(item.date)}
                        </span>
                        {item.pinned && (
                          <Pin className="w-2.5 h-2.5 text-[var(--accent)]" />
                        )}
                        {!item.published && (
                          <span className="text-[10px] font-mono uppercase tracking-wider text-[#6A6A70]">
                            draft
                          </span>
                        )}
                      </div>
                    </button>
                  )
                })}
                {items.length === 0 && (
                  <p className="text-sm text-[#6A6A70] px-3 py-4">
                    No announcements yet.
                  </p>
                )}
              </div>
            )}
          </aside>

          <section className="min-w-0">
            {showNew || editing ? (
              <div
                className="p-6 sm:p-8"
                style={{
                  borderTop: "1px solid transparent",
                  borderBottom: "1px solid transparent",
                  borderImage:
                    "linear-gradient(to right, transparent 0%, rgba(255,255,255,0.12) 15%, rgba(255,255,255,0.12) 85%, transparent 100%) 1",
                  backgroundImage:
                    "radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)",
                  backgroundSize: "24px 24px",
                }}
              >
                <AnnouncementForm
                  initial={editing}
                  saving={saving}
                  onSave={handleSave}
                  onDelete={editing ? handleDelete : null}
                  onCancel={() => {
                    setEditingId(null)
                    setShowNew(false)
                  }}
                />
              </div>
            ) : (
              <div
                className="p-12 text-center"
                style={{
                  borderTop: "1px solid transparent",
                  borderBottom: "1px solid transparent",
                  borderImage:
                    "linear-gradient(to right, transparent 0%, rgba(255,255,255,0.12) 15%, rgba(255,255,255,0.12) 85%, transparent 100%) 1",
                }}
              >
                <p className="text-[#8A8A90]">
                  Select an announcement to edit, or create a new one.
                </p>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  )
}
