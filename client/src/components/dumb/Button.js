const _onClick = (handler) => (event) => {
  event.preventDefault()

  return handler(event)
}

const Button = props => (
  <button
    type="button"
    className={`btn ${props.className}`}
    onClick={props.onClick && _onClick(props.onClick)}
  >
    {props.children}
  </button>
)
