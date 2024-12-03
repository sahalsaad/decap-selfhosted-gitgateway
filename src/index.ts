import { Hono } from 'hono'
import {auth} from "./routes/auth/auth";
import { cors } from 'hono/cors'
import {settings} from "./routes/settings/settings";
import {github} from "./routes/gitgateway/github";

const app = new Hono<{ Bindings: CloudflareBindings }>()

app.get('/', (c) => {
  return c.text('Hello!')
})

app.use('*', cors())

app.route('/auth', auth);
app.route('/settings', settings);
app.route('/github', github);

export default app