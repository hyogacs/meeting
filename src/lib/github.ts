export interface GitHubRepo {
  full_name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  updated_at: string;
}

export async function fetchUserRepos(
  accessToken: string
): Promise<GitHubRepo[]> {
  const res = await fetch(
    "https://api.github.com/user/repos?sort=updated&per_page=30",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github.v3+json",
      },
    }
  );

  if (!res.ok) {
    throw new Error(`GitHub API error: ${res.status}`);
  }

  return res.json();
}

export async function fetchRepoReadme(
  accessToken: string,
  repoFullName: string
): Promise<string | null> {
  const res = await fetch(
    `https://api.github.com/repos/${repoFullName}/readme`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github.v3.raw",
      },
    }
  );

  if (!res.ok) return null;
  return res.text();
}
