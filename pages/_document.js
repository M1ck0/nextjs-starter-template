import Document, { Html, Head, Main, NextScript } from "next/document";

import { readFileSync } from "fs";
import { join } from "path";

class InlineStylesHead extends Head {
  getCssLinks(files) {
    const { assetPrefix, devOnlyCacheBusterQueryString, dynamicImports } = this.context;
    const cssFiles = files.allFiles.filter((f) => f.endsWith(".css"));
    const sharedFiles = new Set(files.sharedFiles);

    // Unmanaged files are CSS files that will be handled directly by the
    // webpack runtime (`mini-css-extract-plugin`).
    let dynamicCssFiles = dedupe(
      dynamicImports.filter((f) => f.file.endsWith(".css"))
    ).map((f) => f.file);
    if (dynamicCssFiles.length) {
      const existing = new Set(cssFiles);
      dynamicCssFiles = dynamicCssFiles.filter(
        (f) => !(existing.has(f) || sharedFiles.has(f))
      );
      cssFiles.push(...dynamicCssFiles);
    }

    let cssLinkElements = [];
    cssFiles.forEach((file) => {
      if (!process.env.__NEXT_OPTIMIZE_CSS) {
        cssLinkElements.push(
          <style
            key={file}
            data-href={`${assetPrefix}/_next/${encodeURI(
              file
            )}${devOnlyCacheBusterQueryString}`}
            dangerouslySetInnerHTML={{
              __html: readFileSync(join(process.cwd(), ".next", file), "utf-8"),
            }}
          />
        );
      }

      cssLinkElements.push(
        <style
          key={file}
          data-href={`${assetPrefix}/_next/${encodeURI(
            file
          )}${devOnlyCacheBusterQueryString}`}
          dangerouslySetInnerHTML={{
            __html: readFileSync(join(process.cwd(), ".next", file), "utf-8"),
          }}
        />
      );
    });

    if (process.env.NODE_ENV !== "development" && process.env.__NEXT_OPTIMIZE_FONTS) {
      cssLinkElements = this.makeStylesheetInert(cssLinkElements);
    }

    return cssLinkElements.length === 0 ? null : cssLinkElements;
  }
}

function dedupe(bundles) {
  const files = new Set();
  const kept = [];

  for (const bundle of bundles) {
    if (files.has(bundle.file)) continue;
    files.add(bundle.file);
    kept.push(bundle);
  }
  return kept;
}

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <InlineStylesHead />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
