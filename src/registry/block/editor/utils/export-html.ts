/**
 * HTML Document Exporter Utility
 * Generates self-contained, beautifully styled standalone HTML documents
 * with Tailwind CSS CDN, typography, Google Fonts, and theme toggle.
 */

export interface ExportHtmlOptions {
  title?: string
  htmlContent: string
  updatedAt?: string
  authorName?: string
  initialTheme?: "dark" | "light"
}

/**
 * Escapes unsafe characters for HTML text insertion
 */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}

/**
 * Builds a complete standalone HTML document with Tailwind CDN,
 * Lexical theme compatibility styles, and interactive theme toggle.
 */
export function buildFullHtmlDocument({
  title = "Untitled Note",
  htmlContent,
  updatedAt,
  authorName,
  initialTheme = "dark",
}: ExportHtmlOptions): string {
  const safeTitle = escapeHtml(title)
  const displayDate = updatedAt
    ? escapeHtml(updatedAt)
    : new Intl.DateTimeFormat("vi-VN", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date())

  return `<!DOCTYPE html>
<html lang="vi" class="${initialTheme === "dark" ? "dark" : ""}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="generator" content="Note Flow" />
  <title>${safeTitle}</title>

  <!-- Google Fonts: Geist & Geist Mono -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700&family=Geist+Mono:wght@400;500;600&display=swap" rel="stylesheet" />

  <!-- Tailwind CSS CDN with Typography plugin -->
  <script src="https://cdn.tailwindcss.com?plugins=typography"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          fontFamily: {
            sans: ['Geist', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
            mono: ['Geist Mono', 'Courier New', 'monospace'],
          },
          colors: {
            brand: {
              50: '#f5f3ff',
              100: '#ede9fe',
              200: '#ddd6fe',
              300: '#c4b5fd',
              400: '#a78bfa',
              500: '#8b5cf6',
              600: '#7c3aed',
              700: '#6d28d9',
              800: '#5b21b6',
              900: '#4c1d95',
            },
          },
        },
      },
    }
  </script>

  <!-- Comprehensive Rich-Text & Lexical Theme Styles -->
  <style>
    :root {
      color-scheme: dark light;
    }
    body {
      font-family: 'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    /* Core Lexical Element Styles */
    .note-content h1 {
      font-size: 2.25rem;
      font-weight: 700;
      letter-spacing: -0.035em;
      line-height: 1.2;
      margin-top: 2rem;
      margin-bottom: 0.75rem;
    }
    .note-content h2 {
      font-size: 1.65rem;
      font-weight: 600;
      letter-spacing: -0.025em;
      line-height: 1.3;
      margin-top: 1.75rem;
      margin-bottom: 0.65rem;
    }
    .note-content h3 {
      font-size: 1.3rem;
      font-weight: 600;
      letter-spacing: -0.015em;
      line-height: 1.35;
      margin-top: 1.35rem;
      margin-bottom: 0.5rem;
    }
    .note-content p {
      line-height: 1.75;
      margin-top: 0.65rem;
      margin-bottom: 0.65rem;
    }
    .note-content hr {
      border: none;
      height: 1px;
      background: linear-gradient(to right, transparent, rgba(148, 163, 184, 0.4), transparent);
      margin: 2rem 0;
    }
    .note-content blockquote {
      border-left: 3px solid #8b5cf6;
      padding-left: 1.25rem;
      margin: 1.25rem 0;
      font-style: italic;
      color: inherit;
      opacity: 0.85;
    }
    .note-content ul {
      list-style-type: disc;
      padding-left: 1.6rem;
      margin: 0.75rem 0;
    }
    .note-content ol {
      list-style-type: decimal;
      padding-left: 1.6rem;
      margin: 0.75rem 0;
    }
    .note-content li {
      margin: 0.35rem 0;
      line-height: 1.65;
    }
    .note-content code:not(pre code) {
      background-color: rgba(139, 92, 246, 0.12);
      color: #a78bfa;
      padding: 0.2rem 0.45rem;
      border-radius: 0.375rem;
      font-family: 'Geist Mono', monospace;
      font-size: 0.875em;
      border: 1px solid rgba(139, 92, 246, 0.25);
    }
    html:not(.dark) .note-content code:not(pre code) {
      color: #6d28d9;
      background-color: rgba(109, 40, 217, 0.08);
      border-color: rgba(109, 40, 217, 0.2);
    }
    .note-content pre {
      background-color: #0c0a15 !important;
      color: #f1f5f9 !important;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 0.75rem;
      padding: 1.25rem;
      overflow-x: auto;
      margin: 1.5rem 0;
      font-family: 'Geist Mono', monospace;
      font-size: 0.875rem;
      line-height: 1.65;
    }
    html:not(.dark) .note-content pre {
      background-color: #1e1b2e !important;
      color: #f8fafc !important;
    }
    .note-content pre code {
      background: transparent !important;
      border: none !important;
      padding: 0 !important;
      color: inherit !important;
    }
    .note-content table {
      width: 100%;
      border-collapse: collapse;
      margin: 1.5rem 0;
      border-radius: 0.5rem;
      overflow: hidden;
      border: 1px solid rgba(148, 163, 184, 0.25);
    }
    .note-content th,
    .note-content td {
      border: 1px solid rgba(148, 163, 184, 0.25);
      padding: 0.65rem 1rem;
      text-align: left;
    }
    .note-content th {
      background-color: rgba(139, 92, 246, 0.12);
      font-weight: 600;
    }
    .note-content tr:nth-child(even) {
      background-color: rgba(148, 163, 184, 0.04);
    }
    .note-content img {
      max-width: 100%;
      height: auto;
      border-radius: 0.75rem;
      margin: 1.5rem auto;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);
    }
    .note-content details {
      border: 1px solid rgba(148, 163, 184, 0.25);
      border-radius: 0.65rem;
      padding: 0.75rem 1.25rem;
      margin: 1rem 0;
      background: rgba(148, 163, 184, 0.05);
    }
    .note-content details summary {
      font-weight: 600;
      cursor: pointer;
      user-select: none;
    }

    /* Excalidraw Whiteboard Export Styling */
    .note-content .excalidraw-drawing-wrapper,
    .note-content .excalidraw-export-container {
      max-width: 100%;
      overflow-x: auto;
      margin: 1.75rem auto;
      border-radius: 1rem;
      border: 1px solid rgba(148, 163, 184, 0.25);
      background-color: #ffffff;
      padding: 1rem;
      box-shadow: 0 4px 15px -2px rgba(0, 0, 0, 0.05);
      display: flex;
      justify-content: center;
      align-items: center;
    }
    html.dark .note-content .excalidraw-drawing-wrapper,
    html.dark .note-content .excalidraw-export-container {
      border-color: rgba(255, 255, 255, 0.1);
      background-color: #12111a;
      box-shadow: 0 4px 15px -2px rgba(0, 0, 0, 0.3);
    }
    .note-content .excalidraw-drawing-wrapper svg,
    .note-content .excalidraw-export-container svg {
      max-width: 100% !important;
      height: auto !important;
      display: block !important;
      margin: 0 auto !important;
      border-radius: 0.5rem;
    }

    /* Print Optimizations */
    @media print {
      body {
        background: #ffffff !important;
        color: #000000 !important;
        padding: 0 !important;
      }
      .no-print {
        display: none !important;
      }
      .note-card {
        box-shadow: none !important;
        border: none !important;
        padding: 0 !important;
        max-width: 100% !important;
      }
    }
  </style>
</head>
<body class="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#0a0910] dark:text-zinc-100 transition-colors duration-200 antialiased p-4 sm:p-8 md:p-12">
  <!-- Top Utility Bar (No Print) -->
  <header class="no-print max-w-4xl mx-auto mb-6 flex items-center justify-between gap-4 py-2 text-xs text-slate-500 dark:text-zinc-400">
    <div class="flex items-center gap-2 font-medium">
      <span class="inline-flex size-2 rounded-full bg-violet-500 animate-pulse"></span>
      <span class="font-semibold text-slate-700 dark:text-zinc-300">Note Flow Export</span>
      <span>•</span>
      <span>${displayDate}</span>
    </div>

    <div class="flex items-center gap-2">
      <!-- Theme Toggle Button -->
      <button
        type="button"
        id="theme-toggle"
        class="cursor-pointer inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-xs hover:bg-slate-100 dark:border-zinc-700/60 dark:bg-zinc-800/80 dark:text-zinc-200 dark:hover:bg-zinc-700 hover:text-slate-900 dark:hover:text-white transition-all"
        title="Chuyển đổi giao diện Sáng / Tối"
      >
        <span id="theme-toggle-icon">${initialTheme === "dark" ? "🌙" : "☀️"}</span>
        <span id="theme-toggle-text">${initialTheme === "dark" ? "Dark" : "Light"}</span>
      </button>

      <!-- Print Button -->
      <button
        type="button"
        onclick="window.print()"
        class="cursor-pointer inline-flex items-center gap-1.5 rounded-lg bg-violet-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-violet-500 transition-all shadow-sm"
        title="In hoặc lưu dạng PDF"
      >
        <span>🖨️ In / PDF</span>
      </button>
    </div>
  </header>

  <!-- Document Card Container -->
  <main class="note-card max-w-4xl mx-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-xl sm:p-10 md:p-14 dark:border-white/10 dark:bg-[#12111a]/95 dark:shadow-2xl">
    <!-- Document Title & Meta Header -->
    <header class="mb-8 border-b border-slate-200 pb-6 dark:border-white/10">
      <h1 class="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-3">
        ${safeTitle}
      </h1>
      <div class="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-zinc-400">
        <span class="rounded-full bg-violet-500/10 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400 px-3 py-0.5 font-medium border border-violet-500/20">
          ${displayDate}
        </span>
        ${authorName ? `<span>Tác giả: <strong class="text-slate-800 dark:text-zinc-300 font-semibold">${escapeHtml(authorName)}</strong></span>` : ""}
      </div>
    </header>

    <!-- Main Content Body -->
    <article class="note-content prose prose-slate dark:prose-invert max-w-none text-slate-800 dark:text-zinc-200 leading-relaxed">
      ${htmlContent || '<p class="text-slate-400 dark:text-zinc-500 italic">Tài liệu không có nội dung.</p>'}
    </article>

    <!-- Footer Timestamp -->
    <footer class="mt-12 pt-6 border-t border-slate-200 text-center text-xs text-slate-400 dark:border-white/5 dark:text-zinc-500">
      Xuất từ <strong>Note Flow</strong> • Định dạng HTML độc lập có nhúng sẵn Tailwind CSS
    </footer>
  </main>

  <!-- Client-side Script for Theme Toggle -->
  <script>
    (function () {
      const toggleBtn = document.getElementById('theme-toggle');
      const toggleIcon = document.getElementById('theme-toggle-icon');
      const toggleText = document.getElementById('theme-toggle-text');
      const htmlEl = document.documentElement;

      function syncToggleUI(isDark) {
        if (toggleIcon) toggleIcon.textContent = isDark ? '🌙' : '☀️';
        if (toggleText) toggleText.textContent = isDark ? 'Dark' : 'Light';
      }

      syncToggleUI(htmlEl.classList.contains('dark'));

      if (toggleBtn) {
        toggleBtn.addEventListener('click', function () {
          const isDark = htmlEl.classList.toggle('dark');
          syncToggleUI(isDark);
        });
      }
    })();
  </script>
</body>
</html>`
}

/**
 * Post-processes HTML string to ensure all Excalidraw whiteboards are converted
 * to static, responsive vector SVGs for standalone viewing and printing.
 */
export async function renderExcalidrawDrawingsInHtml(
  htmlContent: string,
  isDark?: boolean
): Promise<string> {
  if (typeof document === "undefined") return htmlContent
  if (!htmlContent.includes("data-lexical-excalidraw")) return htmlContent

  const activeIsDark =
    isDark ??
    (document.documentElement.classList.contains("dark") ||
      document.documentElement.getAttribute("data-theme") === "dark")

  const container = document.createElement("div")
  container.innerHTML = htmlContent

  const excalidrawElements = container.querySelectorAll<HTMLElement>(
    "[data-lexical-excalidraw-json], [data-lexical-excalidraw]"
  )

  if (excalidrawElements.length === 0) return htmlContent

  let exportToSvgFn: ((options: any) => Promise<SVGElement>) | null = null
  try {
    const excalidrawModule = await import("@excalidraw/excalidraw")
    exportToSvgFn = excalidrawModule.exportToSvg
  } catch (err) {
    console.warn("[ExportHTML] Could not load @excalidraw/excalidraw:", err)
  }

  for (const el of Array.from(excalidrawElements)) {
    // 1. Check if the element already contains a genuine Excalidraw canvas SVG (never Lucide toolbar icons)
    const existingSvg = el.querySelector<SVGElement>(
      'svg.excalidraw-canvas-svg, [data-excalidraw-svg-container] svg, svg:not([class*="lucide"])'
    )

    const isLucideOrToolbarIcon =
      !existingSvg ||
      existingSvg.classList.contains("lucide") ||
      existingSvg.closest("button") !== null ||
      existingSvg
        .getAttribute("data-tsd-source")
        ?.includes("excalidraw-component") ||
      (existingSvg.getAttribute("width") === "24" &&
        existingSvg.getAttribute("height") === "24" &&
        existingSvg.getAttribute("viewBox") === "0 0 24 24")

    if (existingSvg && !isLucideOrToolbarIcon) {
      // Strip any dev/debug attributes
      existingSvg.removeAttribute("data-tsd-source")
      Array.from(existingSvg.querySelectorAll("[data-tsd-source]")).forEach(
        (child) => child.removeAttribute("data-tsd-source")
      )

      const wrapper = document.createElement("div")
      wrapper.className = "excalidraw-drawing-wrapper"
      wrapper.innerHTML = existingSvg.outerHTML
      el.replaceWith(wrapper)
      continue
    }

    // If an invalid or Lucide icon was trapped inside, clear it out
    if (existingSvg && isLucideOrToolbarIcon) {
      existingSvg.remove()
    }

    // 2. Fallback: Generate vector SVG directly from stored JSON scene data
    const rawData =
      el.getAttribute("data-lexical-excalidraw-json") ||
      el.getAttribute("data-lexical-excalidraw")
    if (!rawData) {
      el.remove()
      continue
    }

    try {
      const parsed = JSON.parse(rawData)
      let elements = []
      let appState: Record<string, any> = {}
      let files = {}

      if (Array.isArray(parsed)) {
        elements = parsed
      } else if (parsed && typeof parsed === "object") {
        elements = parsed.elements || []
        appState = parsed.appState || {}
        files = parsed.files || {}
      }

      const activeElements = Array.isArray(elements)
        ? elements.filter((item: any) => item && !item.isDeleted)
        : []

      if (activeElements.length > 0 && exportToSvgFn) {
        const isDefaultBg =
          !appState.viewBackgroundColor ||
          appState.viewBackgroundColor === "#ffffff" ||
          appState.viewBackgroundColor === "#fff" ||
          appState.viewBackgroundColor === "#121212" ||
          appState.viewBackgroundColor === "#18181b"

        const effectiveBgColor = isDefaultBg
          ? activeIsDark
            ? "#18181b"
            : "#ffffff"
          : appState.viewBackgroundColor

        const svg: SVGElement = await exportToSvgFn({
          appState: {
            ...appState,
            exportBackground: appState.exportBackground ?? true,
            viewBackgroundColor: effectiveBgColor,
            exportWithDarkMode: activeIsDark,
          },
          elements: activeElements,
          files,
        })

        // Clean up any dev attributes from generated SVG
        svg.removeAttribute("data-tsd-source")
        Array.from(svg.querySelectorAll("[data-tsd-source]")).forEach((child) =>
          child.removeAttribute("data-tsd-source")
        )
        svg.classList.add("excalidraw-canvas-svg")

        const viewBox = svg.getAttribute("viewBox")
        if (viewBox) {
          const parts = viewBox.split(" ")
          if (parts.length === 4) {
            svg.setAttribute("width", parts[2])
            svg.setAttribute("height", parts[3])
          }
        }
        svg.style.maxWidth = "100%"
        svg.style.height = "auto"
        svg.style.display = "block"
        svg.style.margin = "0 auto"

        const wrapper = document.createElement("div")
        wrapper.className = "excalidraw-drawing-wrapper"
        wrapper.innerHTML = svg.outerHTML
        el.replaceWith(wrapper)
      } else {
        el.remove()
      }
    } catch (err) {
      console.warn("[ExportHTML] Failed to export Excalidraw SVG:", err)
      el.remove()
    }
  }

  // Purge any lingering data-tsd-source attributes across the entire document
  Array.from(container.querySelectorAll("[data-tsd-source]")).forEach((node) =>
    node.removeAttribute("data-tsd-source")
  )

  return container.innerHTML
}

/**
 * Initiates browser file download for an exported HTML string.
 */
export async function downloadHtmlFile(
  htmlContent: string,
  filename: string = "document.html",
  title?: string
) {
  const isDark =
    typeof document !== "undefined" &&
    (document.documentElement.classList.contains("dark") ||
      document.documentElement.getAttribute("data-theme") === "dark")

  const processedHtml = await renderExcalidrawDrawingsInHtml(
    htmlContent,
    isDark
  )

  const fullDocumentHtml = buildFullHtmlDocument({
    title: title || filename.replace(/\.html$/i, ""),
    htmlContent: processedHtml,
    initialTheme: isDark ? "dark" : "light",
  })

  const blob = new Blob([fullDocumentHtml], {
    type: "text/html;charset=utf-8",
  })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename.endsWith(".html") ? filename : `${filename}.html`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
