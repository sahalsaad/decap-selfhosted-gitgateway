const GeneralMessage = (props: GeneralUiProps) => (
  <div className='text-center'>
    <div className='text-2xl font-bold'>{props.title}</div>
    <p>{props.message}</p>
  </div>
)

export { GeneralMessage }
