import { Hono } from "hono";
import { renderer } from "../middlewares/renderer";
import { Register } from "./components/register";

const register = new Hono<{ Bindings: CloudflareBindings }>();

register.use("*", renderer);
register.get("/", (c) => {
  const props = {
    name: "World",
    siteData: {
      title: "Register",
      description: "Register for a new account",
    },
  };
  return c.render(<Register {...props} />);
});

export { register };
