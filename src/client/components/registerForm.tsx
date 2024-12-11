const RegisterForm = (props: {
  siteData: SiteData;
  email: string | null;
  enableEmail: boolean;
  inviteId: string;
}) => (
  <div className="flex flex-col items-center justify-center pt-20">
    <img src="/slogo.png" className="w-32 h-auto opacity-70" />
    <div className="p-10 bg-white rounded-lg ">
      <form
        className="flex flex-col gap-2"
        hx-post="/api/register"
        hx-vals={{ inviteId: props.inviteId }}
      >
        <span className="text-3xl font-bold">Register</span>
        <label for="email">
          Email
          <input
            type="text"
            name="email"
            value={props.email ?? ""}
            disabled={!props.enableEmail}
          />
        </label>
        <label for="password">
          Password
          <input type="password" name="password" />
        </label>
        <label for="re-password">
          Email
          <input type="password" name="re-password" />
        </label>
        <button type="submit">Register</button>
      </form>
    </div>
  </div>
);

export { RegisterForm };
