import { SITE_CONFIG } from "./config";

export interface GitHubRepo {
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  language: string | null;
  updated_at: string;
}

let cachedRepos: GitHubRepo[] | null = null;
let lastFetched = 0;
const CACHE_DURATION = 60 * 60 * 1000;

const PINNED_REPOS = [
  "swift-pretextkit",
  "gitdiff",
  "swiftlings",
  "swift-lru-cache",
  "instant-swift-sdk",
  "doom-raylib-zig",
];

export async function getTopRepositories(
  limit = 6,
): Promise<GitHubRepo[]> {
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

// Pre-warm the cache at startup
getTopRepositories();
