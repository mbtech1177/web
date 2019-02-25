const _onClick = (handler, props) => (event) => {
  event.preventDefault()

  if (props.ym) {
    console.log('ym', 52144714, 'reachGoal', `button-click-${props.ym}`)

    ym(52144714, 'reachGoal', `button-click-${props.ym}`)
  } else {
    const buttonText = event.target.textContent

    const name = String(buttonText).replace(/\s/g, '-').toLowerCase()

    console.log('ym', 52144714, 'reachGoal', `button-click-${name ? name : 'unknown'}`)
    ym(52144714, 'reachGoal', `button-click-${name ? name : 'unknown'}`)
  }

  return handler(event)
}

const InlineButton = props => (
  <a
    href="#"
    className={props.className}
    onClick={props.onClick && _onClick(props.onClick, props)}
  >
    {props.children}
  </a>
)

const Button = props => (
  <button
    type="button"
    className={`btn ${props.className}`}
    onClick={props.onClick && _onClick(props.onClick, props)}
  >
    {props.children}
  </button>
)
