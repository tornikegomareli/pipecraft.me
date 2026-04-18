export default function About() {
  return (
    <div className="about">
      <div className="intro" style={{ marginBottom: 32 }}>
        <h1>About</h1>
      </div>
      <p className="lead">
        I&rsquo;m a software engineer from Georgia, working mostly on iOS and Swift for over a decade.
      </p>
      <p>
        I write essays about craft and thinking, record the Devtherapy podcast with engineers I admire, and quietly
        obsess over concurrency, runtime behavior, and the shape of good abstractions.
      </p>
      <p>
        This site is intentionally small. No tracking, no cookies, no autoplay. Just writing, and the occasional code
        snippet.
      </p>
      <div className="contacts">
        <span className="k">email</span>
        <a href="mailto:tornike.gomareli@gmail.com">tornike.gomareli@gmail.com</a>
        <span className="k">github</span>
        <a href="https://github.com/tornikegomareli" target="_blank" rel="noreferrer">
          @tornikegomareli
        </a>
        <span className="k">twitter</span>
        <a href="https://twitter.com/tornikegomareli" target="_blank" rel="noreferrer">
          @tornikegomareli
        </a>
        <span className="k">linkedin</span>
        <a href="https://linkedin.com/in/tornikegomareli" target="_blank" rel="noreferrer">
          /in/tornikegomareli
        </a>
        <span className="k">podcast</span>
        <a href="https://www.youtube.com/@Devtherapy" target="_blank" rel="noreferrer">
          devtherapy
        </a>
      </div>
    </div>
  );
}
