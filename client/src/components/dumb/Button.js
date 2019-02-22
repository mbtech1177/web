const onClick = (handler) => (event) => {
  event.preventDefault()

  return handler()
}

const Button = props => (
  <a href="#" onClick={onClick(props.onClick)} className={`btn ${props.className}`}>
    {props.children}
  </a>
)
