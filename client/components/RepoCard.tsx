interface RepoCardProps {
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  language: string | null;
}

export default function RepoCard({
  name,
  description,
  html_url,
  stargazers_count,
  language,
}: RepoCardProps) {
  return (
    <a
      href={html_url}
      target="_blank"
      rel="noopener noreferrer"
      className="repo-card"
    >
      <div className="repo-card-header">
        <span className="repo-card-name">{name}</span>
        {stargazers_count > 0 && (
          <span className="repo-card-stars">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            {stargazers_count}
          </span>
        )}
      </div>
      {description && <p className="repo-card-desc">{description}</p>}
      {language && <span className="repo-card-lang">{language}</span>}
    </a>
  );
}
