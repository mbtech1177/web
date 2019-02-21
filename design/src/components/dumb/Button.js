const onClick = (handler) => (event) => {
  event.preventDefault()

  return handler()
}

const Button = props => (
  <a href="#" onClick={onClick(props.onClick)} className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm">
    {props.children}
  </a>
)
