import useSWR from "swr"
import { fetchJson, latestReleaseUrl, type GitHubRepo } from "@/lib/github"
import type { GitHubRelease } from "@/hooks/useGitHubReleases"

export function useGitHubRelease(repo: GitHubRepo) {
  const { data, error } = useSWR<GitHubRelease>(latestReleaseUrl(repo), fetchJson<GitHubRelease>, {
    refreshInterval: 30 * 60 * 1000,
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    dedupingInterval: 60 * 1000,
  })

  return {
    version: data?.tag_name ?? null,
    isLoading: !data && !error,
    error,
  }
}
