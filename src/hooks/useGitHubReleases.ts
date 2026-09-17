import useSWR from "swr"
import { fetchJson, releasesUrl, type GitHubRepo } from "@/lib/github"

export interface GitHubRelease {
  id: number
  tag_name: string
  name: string | null
  body: string | null
  published_at: string
  prerelease: boolean
  draft: boolean
  html_url: string
  author: {
    login: string
    avatar_url: string
    html_url: string
  }
  assets: {
    id: number
    name: string
    download_count: number
    created_at: string
  }[]
}

export function useGitHubReleases(repo: GitHubRepo) {
  const { data, error, isLoading } = useSWR<GitHubRelease[]>(
    releasesUrl(repo),
    fetchJson<GitHubRelease[]>,
    {
      refreshInterval: 30 * 60 * 1000,
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      dedupingInterval: 60 * 1000,
    },
  )

  const releases = (Array.isArray(data) ? data : [])
    .filter((r) => !r.draft)
    .sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime())

  return {
    releases,
    isLoading,
    error,
  }
}
