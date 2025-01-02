export function ErrorMessage(props: { children: any }) {
  return (
    <span className="text-red-700">{props.children}</span>
  )
}
