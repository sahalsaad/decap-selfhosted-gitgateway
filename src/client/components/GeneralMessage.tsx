const GeneralMessage = (props: {
  siteData: SiteData;
  title: string;
  message: string;
}) => (
  <div className="text-center">
    <div className="text-2xl font-bold">{props.title}</div>
    <p>{props.message}</p>
  </div>
);

export { GeneralMessage };
