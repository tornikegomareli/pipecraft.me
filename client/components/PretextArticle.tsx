import { useCallback, useEffect, useRef } from "react";

/**
 * PretextArticle: enhances article content with pretext-powered text layout.
 *
 * After the article HTML is injected, this component:
 * 1. Finds images with float directives (alt text containing |float-left or |float-right)
 * 2. Uses pretext's layoutNextLine to flow adjacent paragraph text around those images
 * 3. Re-renders the paragraph as absolutely-positioned lines that wrap the image
 * 4. Re-layouts on resize (only the pure-arithmetic layout() call — no DOM measurement)
 *
 * Markdown syntax:
 *   ![caption|float-right](image.png)   → image floats right, text wraps left
 *   ![caption|float-left](image.png)    → image floats left, text wraps right
 *   ![caption](image.png)               → normal image, no pretext layout
 */

type PretextModule = typeof import("@chenglou/pretext");

interface FloatImage {
  img: HTMLImageElement;
  side: "left" | "right";
  paragraph: HTMLParagraphElement;
  originalText: string;
}

// Detect float directives from the alt attribute set by markdown
// marked renders ![text|float-right](url) → <img alt="text|float-right" src="url">
function parseFloatDirective(
  img: HTMLImageElement,
): { side: "left" | "right"; caption: string } | null {
  const alt = img.alt || "";
  if (alt.includes("|float-right")) {
    return { side: "right", caption: alt.replace("|float-right", "").trim() };
  }
  if (alt.includes("|float-left")) {
    return { side: "left", caption: alt.replace("|float-left", "").trim() };
  }
  return null;
}

const FONT = '400 17px "Inter", -apple-system, BlinkMacSystemFont, sans-serif';
const LINE_HEIGHT = 30;
const IMG_PADDING = 20; // gap between image and text

function getCircleIntervalForBand(
  imgLeft: number,
  imgRight: number,
  _bandTop: number,
  _bandBottom: number,
): [number, number] {
  return [imgLeft - IMG_PADDING, imgRight + IMG_PADDING];
}

export default function PretextArticle({
  html,
}: {
  html: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pretextRef = useRef<PretextModule | null>(null);
  const floatsRef = useRef<FloatImage[]>([]);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  const doLayout = useCallback(() => {
    const pretext = pretextRef.current;
    const container = containerRef.current;
    if (!pretext || !container) return;

    const containerWidth = container.clientWidth;

    for (const float of floatsRef.current) {
      const { img, side, paragraph, originalText } = float;

      // Get image dimensions
      const imgWidth = img.naturalWidth
        ? Math.min(img.clientWidth || 300, containerWidth * 0.45)
        : Math.min(300, containerWidth * 0.45);
      const imgHeight = img.clientHeight || 200;

      // Position the image
      img.style.width = `${imgWidth}px`;
      img.style.position = "absolute";
      img.style.top = "0px";
      if (side === "right") {
        img.style.left = `${containerWidth - imgWidth}px`;
      } else {
        img.style.left = "0px";
      }

      // Prepare text
      const prepared = pretext.prepareWithSegments(originalText, FONT);

      // Layout text line by line, routing around image
      let cursor = { segmentIndex: 0, graphemeIndex: 0 };
      let y = 0;
      const lines: { text: string; x: number; y: number }[] = [];

      while (true) {
        let lineX = 0;
        let lineWidth = containerWidth;

        // If line is within image height, reduce available width
        if (y + LINE_HEIGHT > 0 && y < imgHeight + IMG_PADDING) {
          const [blockLeft, blockRight] = getCircleIntervalForBand(
            side === "left" ? 0 : containerWidth - imgWidth,
            side === "left" ? imgWidth : containerWidth,
            y,
            y + LINE_HEIGHT,
          );

          if (side === "left") {
            lineX = blockRight;
            lineWidth = containerWidth - blockRight;
          } else {
            lineWidth = blockLeft;
            lineX = 0;
          }
        }

        if (lineWidth < 60) {
          y += LINE_HEIGHT;
          if (y > 2000) break;
          continue;
        }

        const line = pretext.layoutNextLine(prepared, cursor, lineWidth);
        if (line === null) break;

        lines.push({ text: line.text, x: lineX, y });
        cursor = line.end;
        y += LINE_HEIGHT;
      }

      // Render: clear paragraph, set relative positioning, add lines as spans
      paragraph.style.position = "relative";
      paragraph.style.minHeight = `${Math.max(y, imgHeight + IMG_PADDING)}px`;
      paragraph.style.font = FONT;
      paragraph.style.lineHeight = `${LINE_HEIGHT}px`;

      // Keep image, remove text nodes and old spans
      const existingSpans = paragraph.querySelectorAll(".pretext-wrap-line");
      for (const span of existingSpans) span.remove();
      // Remove bare text nodes
      for (const child of Array.from(paragraph.childNodes)) {
        if (child.nodeType === Node.TEXT_NODE) child.remove();
      }

      for (const line of lines) {
        const span = document.createElement("span");
        span.className = "pretext-wrap-line";
        span.textContent = line.text;
        span.style.position = "absolute";
        span.style.left = `${line.x}px`;
        span.style.top = `${line.y}px`;
        span.style.whiteSpace = "nowrap";
        paragraph.appendChild(span);
      }
    }
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let cancelled = false;

    async function init() {
      const pretext = await import("@chenglou/pretext");
      if (cancelled) return;
      pretextRef.current = pretext;

      await document.fonts.ready;
      if (cancelled) return;

      // Scan for float images
      const images = container!.querySelectorAll("img");
      const floats: FloatImage[] = [];

      for (const img of images) {
        const directive = parseFloatDirective(img);
        if (!directive) continue;

        // Clean up the alt text
        img.alt = directive.caption;

        // Find the next sibling paragraph to wrap
        const nextP = img.nextElementSibling;
        if (!(nextP instanceof HTMLParagraphElement)) continue;

        // Store original text
        const originalText = nextP.textContent || "";
        if (!originalText.trim()) continue;

        // Move image inside the paragraph
        nextP.insertBefore(img, nextP.firstChild);

        floats.push({
          img,
          side: directive.side,
          paragraph: nextP,
          originalText,
        });
      }

      floatsRef.current = floats;

      if (floats.length > 0) {
        // Wait for images to load, then layout
        await Promise.all(
          floats.map(
            (f) =>
              new Promise<void>((resolve) => {
                if (f.img.complete) {
                  resolve();
                } else {
                  f.img.onload = () => resolve();
                  f.img.onerror = () => resolve();
                }
              }),
          ),
        );

        if (!cancelled) doLayout();
      }
    }

    init();

    // Re-layout on resize
    const observer = new ResizeObserver(() => {
      if (floatsRef.current.length > 0) doLayout();
    });
    observer.observe(container);
    resizeObserverRef.current = observer;

    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [html, doLayout]);

  return (
    <div
      ref={containerRef}
      className="article-content prose"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
