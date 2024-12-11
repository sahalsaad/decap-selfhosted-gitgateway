import { jsxRenderer } from "hono/jsx-renderer";

export const renderer = jsxRenderer(({ children, title }) => {
  return (
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        {import.meta.env.PROD ? (
          <>
            <link href="/static/style.css" rel="stylesheet" />
            <script defer type="module" src="/static/bundle.js"></script>
          </>
        ) : (
          <>
            <link href="/src/client/style.css" rel="stylesheet" />
            <script defer type="module" src="/src/client/bundle.ts"></script>
          </>
        )}
        <link
          rel="stylesheet"
          href="https://unpkg.com/bamboo.css/dist/light.min.css"
        />
        <title>{title}</title>
      </head>
      <body className="md:container md:mx-auto">{children}</body>
    </html>
  );
});
