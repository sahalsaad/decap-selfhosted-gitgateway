import { jsxRenderer } from 'hono/jsx-renderer'

const renderer = jsxRenderer(({ children, title }) => {
  return (
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/@picocss/pico@2/css/pico.min.css"
        />
        {import.meta.env.PROD
          ? (
              <>
                <link href="/static/style.css" rel="stylesheet" />
                <script defer type="module" src="/static/bundle.js"></script>
              </>
            )
          : (
              <>
                <link href="/src/client/style.css" rel="stylesheet" />
                <script defer type="module" src="/src/client/bundle.ts"></script>
              </>
            )}
        <script src="https://unpkg.com/htmx.org@2.0.3"></script>
        <script src="https://unpkg.com/htmx.org/dist/ext/json-enc.js"></script>
        <title>{title}</title>
      </head>
      <body className="md:container md:mx-auto">
        <main className="flex flex-col items-center justify-center pt-20">
          <img src="/logo.png" alt="logo" className="w-32 h-auto opacity-70" />
          {children}
        </main>
      </body>
    </html>
  )
})

export { renderer }
