import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

const REPOS = {
  Latch: "moss-apps/Latch",
  Flick: "moss-apps/Flick",
} as const

export function useGitHubRelease(repo: keyof typeof REPOS) {
  const { data, error } = useSWR(
    `https://api.github.com/repos/${REPOS[repo]}/releases/latest`,
    fetcher,
    {
      refreshInterval: 30 * 60 * 1000,
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      dedupingInterval: 60 * 1000,
    },
  )

  return {
    version: (data?.tag_name as string) ?? null,
    isLoading: !data && !error,
    error,
  }
}
