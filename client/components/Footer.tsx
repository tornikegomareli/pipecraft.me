export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="site">
      <span>© {year} tornike gomareli</span>
      <span>
        <a
          href="https://github.com/tornikegomareli"
          target="_blank"
          rel="noreferrer"
        >
          github
        </a>
        {"  ·  "}
        <a
          href="https://tornikegomareli.substack.com/"
          target="_blank"
          rel="noreferrer"
        >
          newsletter
        </a>
        {"  ·  "}
        <a href="/rss.xml">rss</a>
      </span>
    </footer>
  );
}
