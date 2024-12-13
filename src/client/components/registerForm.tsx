import logoImage from "../../../assets/logo.png?inline";

const RegisterForm = (props: {
  siteData: SiteData;
  email: string | null;
  enableEmail: boolean;
  inviteId: string;
}) => (
  <div className="flex flex-col items-center justify-center pt-20">
    <img src={logoImage} alt="logo" className="w-32 h-auto opacity-70" />
    <div className="p-10 bg-white rounded-lg ">
      <form
        className="flex flex-col gap-2"
        hx-target="#response"
        hx-post="/api/register"
        hx-vals={JSON.stringify({ inviteId: props.inviteId })}
        hx-ext="json-enc"
      >
        <span className="text-3xl font-bold">Register</span>
        <label for="email">
          Email
          <input
            type="text"
            name="email"
            value={props.email ?? ""}
            disabled={!props.enableEmail}
            required
          />
        </label>
        <label for="firstName">
          First Name
          <input type="text" name="firstName" required />
        </label>
        <label for="lastName">
          Last Name
          <input type="text" name="lastName" />
        </label>
        <label for="password">
          Password
          <input type="password" name="password" required />
        </label>
        <button type="submit">Register</button>
      </form>
      <div id="response"></div>
    </div>
  </div>
);

export { RegisterForm };
