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
    const repos: GitHubRepo[] = [];

    for (const repoName of PINNED_REPOS.slice(0, limit)) {
      try {
        const response = await fetch(
          `https://api.github.com/repos/${username}/${repoName}`,
          {
            headers: {
              Accept: "application/vnd.github.v3+json",
              "User-Agent": "pipecraft-blog",
            },
          },
        );
        if (response.ok) {
          repos.push(await response.json());
        }
      } catch {
        // skip failed repos
      }
    }

    cachedRepos = repos;
    lastFetched = now;
    return repos;
  } catch {
    return [];
  }
}
