const Register = (props: { siteData: SiteData; name: string }) => (
  <form hx-post="/api/register" hx-vals={{ foo: "bar" }}>
    <label for="author">
      Author
      <input type="text" name="author" />
    </label>
    <button type="submit">Submit</button>
  </form>
);

export { Register };
