import { SITE_CONFIG } from "./site-config";

export interface GitHubRepo {
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  language: string | null;
  updated_at: string;
}

interface GraphQLRepo {
  name: string;
  description: string | null;
  url: string;
  stargazerCount: number;
  primaryLanguage: {
    name: string;
  } | null;
  updatedAt: string;
}

let cachedRepos: GitHubRepo[] | null = null;
let lastFetched = 0;
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

export async function getTopRepositories(limit = 6): Promise<GitHubRepo[]> {
  const now = Date.now();

  // Return cached data if it's still fresh
  if (cachedRepos && now - lastFetched < CACHE_DURATION) {
    return cachedRepos;
  }

  try {
    const username = SITE_CONFIG.links.github;

    // Use GitHub GraphQL API to fetch pinned repositories
    const query = `
      query {
        user(login: "${username}") {
          pinnedItems(first: ${limit}, types: REPOSITORY) {
            nodes {
              ... on Repository {
                name
                description
                url
                stargazerCount
                primaryLanguage {
                  name
                }
                updatedAt
              }
            }
          }
        }
      }
    `;

    const response = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "tornikegomareli-blog",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      console.error("GitHub API response error:", response.statusText);
      return [];
    }

    const data = await response.json();

    if (data.errors) {
      console.error("GitHub GraphQL errors:", data.errors);
      return [];
    }

    const pinnedRepos: GraphQLRepo[] = data.data?.user?.pinnedItems?.nodes || [];

    // Transform GraphQL response to match our interface
    cachedRepos = pinnedRepos.map((repo: GraphQLRepo) => ({
      name: repo.name,
      description: repo.description,
      html_url: repo.url,
      stargazers_count: repo.stargazerCount,
      language: repo.primaryLanguage?.name || null,
      updated_at: repo.updatedAt,
    }));

    lastFetched = now;
    return cachedRepos;
  } catch (error) {
    console.error("Error fetching GitHub repositories:", error);
    return [];
  }
}
