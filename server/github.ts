import { SITE_CONFIG } from "./config";

export interface GitHubRepo {
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  updated_at: string;
}

export interface ContributionDay {
  date: string;
  count: number;
  level: number;
}

let cachedRepos: GitHubRepo[] | null = null;
let lastFetched = 0;
const CACHE_DURATION = 60 * 60 * 1000;

let cachedContributions: ContributionDay[] | null = null;
let contributionsFetchedAt = 0;

const PINNED_REPOS = ["swift-pretextkit", "Aurora", "gitdiff", "doom-raylib-zig", "Xarji", "instant-swift-sdk"];

export async function getTopRepositories(limit = 6): Promise<GitHubRepo[]> {
  const now = Date.now();
  if (cachedRepos && now - lastFetched < CACHE_DURATION) {
    return cachedRepos;
  }

  try {
    const username = SITE_CONFIG.links.github;

    // Fetch all repos in parallel instead of sequentially
    const results = await Promise.allSettled(
      PINNED_REPOS.slice(0, limit).map((repoName) =>
        fetch(`https://api.github.com/repos/${username}/${repoName}`, {
          headers: {
            Accept: "application/vnd.github.v3+json",
            "User-Agent": "pipecraft-blog",
          },
        }).then((r) => (r.ok ? r.json() : null)),
      ),
    );

    const repos = results
      .map((r) => (r.status === "fulfilled" ? r.value : null))
      .filter((r): r is GitHubRepo => r !== null);

    cachedRepos = repos;
    lastFetched = now;
    return repos;
  } catch {
    return [];
  }
}

export async function getContributions(): Promise<ContributionDay[]> {
  const now = Date.now();
  if (cachedContributions && now - contributionsFetchedAt < CACHE_DURATION) {
    return cachedContributions;
  }

  try {
    const username = SITE_CONFIG.links.github;
    const res = await fetch(`https://github-contributions-api.jogruber.de/v4/${username}?y=last`, {
      headers: { "User-Agent": "pipecraft-blog" },
    });
    if (!res.ok) return cachedContributions || [];
    const json = await res.json();
    const days: ContributionDay[] = json.contributions || [];

    cachedContributions = days;
    contributionsFetchedAt = now;
    return days;
  } catch {
    return cachedContributions || [];
  }
}

// Pre-warm the cache at startup
getTopRepositories();
getContributions();
