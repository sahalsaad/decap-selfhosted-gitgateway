import { Hono } from 'hono'
import {auth} from "./auth/auth";
import { cors } from 'hono/cors'
import {settings} from "./settings/settings";
import {github} from "./gitgateway/github";

const app = new Hono<{ Bindings: CloudflareBindings }>()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.use('*', cors())

app.route('/auth', auth);
app.route('/settings', settings);
app.route('github', github);

export default app