import { SITE_CONFIG } from "./site-config";

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
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

const PREFERRED_REPOS = ["gitdiff", "swift-lru-cache", "Overlayer", "DeepSwiftSeek", "Talkify"];

export async function getTopRepositories(limit = 5): Promise<GitHubRepo[]> {
  const now = Date.now();

  // Return cached data if it's still fresh
  if (cachedRepos && now - lastFetched < CACHE_DURATION) {
    return cachedRepos;
  }

  try {
    const username = SITE_CONFIG.links.github;
    const selectedRepos: GitHubRepo[] = [];

    // Fetch each preferred repository individually
    for (const repoName of PREFERRED_REPOS) {
      try {
        const response = await fetch(`https://api.github.com/repos/${username}/${repoName}`, {
          headers: {
            Accept: "application/vnd.github.v3+json",
            "User-Agent": "tornikegomareli-blog",
          },
        });

        if (response.ok) {
          const repo: GitHubRepo = await response.json();
          selectedRepos.push(repo);
        } else {
          console.warn(`Could not fetch repo ${repoName}:`, response.statusText);
        }
      } catch (err) {
        console.error(`Error fetching ${repoName}:`, err);
      }
    }

    cachedRepos = selectedRepos;
    lastFetched = now;

    return cachedRepos;
  } catch (error) {
    console.error("Error fetching GitHub repositories:", error);
    return [];
  }
}
