import { jsxRenderer } from "hono/jsx-renderer";

export const renderer = jsxRenderer(({ children, title }) => {
  return (
    <html>
      <head>
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
          href="https://cdn.jsdelivr.net/npm/@picocss/pico@2/css/pico.min.css"
        />
        <title>{title}</title>
      </head>
      <body>
        <div
          id="container"
          className="flex flex-col items-center justify-center h-screen text-center"
        >
          {children}
        </div>
      </body>
    </html>
  );
});
