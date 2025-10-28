import { SECTIONS } from "./config";
import { SITE_CONFIG } from "./site-config";
import type { Post, Section } from "./types";

export function generateLayout(title: string, content: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <link rel="stylesheet" id="highlight-light" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/styles/github.min.css">
    <link rel="stylesheet" id="highlight-dark" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/styles/github-dark.min.css" disabled>
    <script>
        document.addEventListener('DOMContentLoaded', function() {
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
        a { color: #0000ff; }
        a:visited { color: #551a8b; }
        body.dark-theme a { color: #6b9eff; }
        body.dark-theme a:visited { color: #b58bff; }
        .site-header { margin-bottom: 2em; border-bottom: 1px solid #ddd; padding-bottom: 1em; display: flex; align-items: flex-start; gap: 1em; position: relative; }
        body.dark-theme .site-header { border-bottom-color: #444; }
        .site-header img { width: 80px; height: 80px; border-radius: 4px; }
        .site-header-info { flex: 1; }
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
        @media (max-width: 768px) {
            .content-wrapper { flex-direction: column; gap: 2em; }
            .site-header { flex-direction: column; }
            .theme-toggle { position: static; margin-top: 1em; display: inline-block; }
        }
    </style>
</head>
<body>
    ${content}
</body>
</html>`;
}

export function generateIndexPage(postsBySection: Record<Section, Post[]>): string {
  const headerHtml = `
    <div class="site-header">
      <button class="theme-toggle" onclick="toggleTheme()">Dark 🌙</button>
      <img src="/pic.jpeg" alt="${SITE_CONFIG.name}">
      <div class="site-header-info">
        <h1>${SITE_CONFIG.name}</h1>
        <p>${SITE_CONFIG.title}. ${SITE_CONFIG.description}</p>
        <p class="links">
          <a href="mailto:${SITE_CONFIG.links.email}">Email</a> |
          <a href="https://github.com/${SITE_CONFIG.links.github}">GitHub</a> |
          <a href="https://linkedin.com/in/${SITE_CONFIG.links.linkedin}">LinkedIn</a> |
          <a href="https://twitter.com/${SITE_CONFIG.links.twitter}">Twitter</a>
        </p>
      </div>
    </div>
  `;

  const leftColumnSections = ["posts"];
  const rightColumnSections = ["projects", "talks"];

  const generateSectionHtml = (section: Section) => {
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
              return `<div class="post-item">${dateStr} - <a href="/${section}/${post.slug}/">${post.title}</a></div>`;
            })
            .join("");

    return `
      <div class="section">
        <h2>${sectionConfig.title}</h2>
        <div class="post-list">
          ${postsHtml}
        </div>
      </div>
    `;
  };

  const leftColumn = leftColumnSections.map((s) => generateSectionHtml(s as Section)).join("");
  const rightColumn = rightColumnSections.map((s) => generateSectionHtml(s as Section)).join("");

  const content = `
    ${headerHtml}
    <div class="content-wrapper">
      <div class="column">
        ${leftColumn}
      </div>
      <div class="column">
        ${rightColumn}
      </div>
    </div>
  `;

  return generateLayout(SITE_CONFIG.name, content);
}

export function generatePostPage(post: Post): string {
  const content = `
    <button class="theme-toggle" onclick="toggleTheme()" style="position: fixed; top: 20px; right: 20px;">Dark 🌙</button>
    <div class="header">
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

  return generateLayout(post.title, content);
}
