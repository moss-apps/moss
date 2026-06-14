import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

const REPOS = {
  Latch: "moss-apps/Latch",
  Flick: "moss-apps/Flick",
} as const

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
}

export function useGitHubReleases(repo: keyof typeof REPOS) {
  const { data, error, isLoading } = useSWR<GitHubRelease[]>(
    `https://api.github.com/repos/${REPOS[repo]}/releases?per_page=100`,
    fetcher,
    {
      refreshInterval: 30 * 60 * 1000,
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      dedupingInterval: 60 * 1000,
    },
  )

  const releases = data?.filter((r) => !r.draft).sort(
    (a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime(),
  )

  return {
    releases: releases ?? [],
    isLoading,
    error,
  }
}
