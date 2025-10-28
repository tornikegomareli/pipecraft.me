import { SECTIONS } from "./config";
import type { GitHubRepo } from "./github";
import { SITE_CONFIG } from "./site-config";
import type { Post, Section } from "./types";

export function generateHtmlLayout(title: string, content: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <link rel="icon" type="image/png" href="/favicon.png">
    <link rel="shortcut icon" type="image/png" href="/favicon.png">
    <link rel="stylesheet" id="highlight-light" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/styles/github.min.css">
    <link rel="stylesheet" id="highlight-dark" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/styles/github-dark.min.css" disabled>
    <script src="https://unpkg.com/htmx.org@2.0.3"></script>
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            console.log('HTMX boost enabled');

            const savedTheme = localStorage.getItem('theme') || 'light';
            const isDark = savedTheme === 'dark';
            if (isDark) {
                document.body.classList.add('dark-theme');
            }
            updateThemeButton();
            updateHighlightTheme(isDark);
        });

        function toggleTheme() {
            const body = document.body;
            const isDark = body.classList.toggle('dark-theme');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            updateThemeButton();
            updateHighlightTheme(isDark);
        }

        function updateThemeButton() {
            const button = document.querySelector('.theme-toggle');
            if (button) {
                const isDark = document.body.classList.contains('dark-theme');
                button.textContent = isDark ? 'Light ☀️' : 'Dark 🌙';
            }
        }

        function updateHighlightTheme(isDark) {
            const lightTheme = document.getElementById('highlight-light');
            const darkTheme = document.getElementById('highlight-dark');
            if (lightTheme && darkTheme) {
                lightTheme.disabled = isDark;
                darkTheme.disabled = !isDark;
            }
        }
    </script>
    <style>
        body {
            font-family: monospace;
            line-height: 1.6;
            max-width: 800px;
            margin: 40px auto;
            padding: 0 20px;
            background: #fff;
            color: #333;
            transition: background-color 0.3s ease, color 0.3s ease;
        }
        body.dark-theme {
            background: #1a1a1a;
            color: #e0e0e0;
        }
        h1, h2, h3 { font-weight: normal; }
        h1 { font-size: 1.5em; margin: 0; }
        h2 { font-size: 1.2em; margin-top: 1.5em; margin-bottom: 0.5em; }
        h3 { font-size: 1.1em; }
        a { color: #0000ff; cursor: pointer; }
        a:visited { color: #551a8b; }
        body.dark-theme a { color: #6b9eff; }
        body.dark-theme a:visited { color: #b58bff; }
        .site-header { margin-bottom: 2em; border-bottom: 1px solid #ddd; padding-bottom: 1em; position: relative; }
        body.dark-theme .site-header { border-bottom-color: #444; }
        .site-header p { margin: 0.3em 0; }
        .links { font-size: 0.9em; }
        .theme-toggle {
            position: absolute;
            top: 0;
            right: 0;
            background: none;
            border: 1px solid #333;
            color: #333;
            padding: 6px 12px;
            cursor: pointer;
            font-family: monospace;
            font-size: 0.9em;
            border-radius: 4px;
            transition: all 0.3s ease;
        }
        .theme-toggle:hover {
            background: #f0f0f0;
        }
        body.dark-theme .theme-toggle {
            border-color: #e0e0e0;
            color: #e0e0e0;
        }
        body.dark-theme .theme-toggle:hover {
            background: #333;
        }
        .content-wrapper { display: flex; gap: 4em; }
        .column { flex: 1; }
        .section { margin-bottom: 2em; }
        .post-list { }
        .post-item { margin-bottom: 0.3em; font-size: 0.9em; }
        .post-meta { color: #666; font-size: 0.9em; }
        body.dark-theme .post-meta { color: #999; }
        .post-navigation { margin-bottom: 2em; }
        pre {
            background: #f4f4f4;
            padding: 1em;
            overflow-x: auto;
        }
        body.dark-theme pre {
            background: #2a2a2a;
        }
        code { font-family: monospace; }
        img { max-width: 100%; height: auto; }
        .header { margin-bottom: 3em; }
        .header a { text-decoration: none; color: inherit; }
        .empty-section { color: #666; font-style: italic; }
        body.dark-theme .empty-section { color: #999; }
        .loading { opacity: 0.5; }
        #content { min-height: 400px; }
        .htmx-swapping { opacity: 0.6; transition: opacity 200ms ease-in; }
        .htmx-settling { opacity: 1; transition: opacity 200ms ease-in; }
        @media (max-width: 768px) {
            .content-wrapper { flex-direction: column; gap: 2em; }
            .theme-toggle { position: static; margin-top: 1em; display: inline-block; }
        }
    </style>
</head>
<body hx-boost="true">
    <div class="site-header">
      <button class="theme-toggle" onclick="toggleTheme()">Dark 🌙</button>
      <h1><a href="/">${SITE_CONFIG.name}</a></h1>
      <p>${SITE_CONFIG.title}. ${SITE_CONFIG.description}</p>
      <p class="links">
        <a href="mailto:${SITE_CONFIG.links.email}">Email</a> |
        <a href="https://github.com/${SITE_CONFIG.links.github}">GitHub</a> |
        <a href="https://linkedin.com/in/${SITE_CONFIG.links.linkedin}">LinkedIn</a> |
        <a href="https://twitter.com/${SITE_CONFIG.links.twitter}">Twitter</a>
      </p>
    </div>
    <div id="content">
        ${content}
    </div>
</body>
</html>`;
}

export function generateIndexContent(postsBySection: Record<Section, Post[]>, githubRepos: GitHubRepo[]): string {
  const leftColumnSections = ["posts"];
  const rightColumnSections = ["projects", "talks"];

  const generateNewsletterSection = () => {
    return `
      <div class="section">
        <h2>Newsletter - Bit by Bit</h2>
        <div class="newsletter-content">
          <p style="margin-bottom: 1em;">Interesting & Technical things which was farming my mind during the week.</p>
          <div style="margin-bottom: 1em;">
            <a href="https://tornikegomareli.substack.com/" target="_blank" rel="noopener noreferrer" style="background: #EB5B00; color: white; padding: 8px 16px; text-decoration: none; display: inline-block;">Subscribe</a>
          </div>
        </div>
      </div>
    `;
  };

  const generatePodcastSection = () => {
    return `
      <div class="section">
        <h2>Devtherapy Podcast</h2>
        <div class="podcast-content">
          <p style="margin-bottom: 1em;">A podcast about deep engineering talks, career growth, engineering stories.</p>
          <div style="margin-bottom: 1em;">
            <a href="https://www.youtube.com/@Devtherapy" target="_blank" rel="noopener noreferrer" style="background: #EB5B00; color: white; padding: 8px 16px; text-decoration: none; display: inline-block;">Subscribe on YouTube</a>
          </div>
          <div style="margin-bottom: 1em;">
            <a href="https://devtherapy.ge/" target="_blank" rel="noopener noreferrer">Visit Website</a>
          </div>
        </div>
      </div>
    `;
  };

  const generateSectionHtml = (section: Section) => {
    // Special handling for projects section
    if (section === "projects") {
      const projectsHtml =
        githubRepos.length === 0
          ? `<p class="empty-section">No projects yet.</p>`
          : githubRepos
              .map((repo) => {
                const stars = repo.stargazers_count > 0 ? ` ⭐ ${repo.stargazers_count}` : "";
                const lang = repo.language ? ` · ${repo.language}` : "";
                return `
                <div class="post-item">
                  <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer">${repo.name}</a>${stars}${lang}
                  ${repo.description ? `<div class="post-meta">${repo.description}</div>` : ""}
                </div>
              `;
              })
              .join("");

      return `
        <div class="section">
          <h2>Projects</h2>
          <div class="post-list" id="projects-list">
            ${projectsHtml}
          </div>
        </div>
      `;
    }

    // Regular handling for other sections
    const posts = postsBySection[section];
    const sectionConfig = SECTIONS[section];

    const postsHtml =
      posts.length === 0
        ? `<p class="empty-section">No ${sectionConfig.title.toLowerCase()} yet.</p>`
        : posts
            .map((post) => {
              const dateStr = new Date(post.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              });
              return `<div class="post-item">${dateStr} - <a href="/${section}/${post.slug}">${post.title}</a></div>`;
            })
            .join("");

    return `
      <div class="section">
        <h2>${sectionConfig.title}</h2>
        <div class="post-list" id="${section}-list">
          ${postsHtml}
        </div>
      </div>
    `;
  };

  const leftColumn =
    generateNewsletterSection() + leftColumnSections.map((s) => generateSectionHtml(s as Section)).join("");
  const rightColumn =
    generatePodcastSection() + rightColumnSections.map((s) => generateSectionHtml(s as Section)).join("");

  return `
    <div class="content-wrapper">
      <div class="column">
        ${leftColumn}
      </div>
      <div class="column">
        ${rightColumn}
      </div>
    </div>
  `;
}

export function generatePostContent(post: Post): string {
  return `
    <div class="post-navigation">
        <a href="/">← Back to index</a>
    </div>
    <article>
        <h1>${post.title}</h1>
        <div class="post-meta">${new Date(post.date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}</div>
        ${post.content}
    </article>
  `;
}
