const convertRawURL = (text) => {
  const [ _, head, url, link_text, tail ] = text.match(/^(.*)<a href="(.*)" target="_blank">(.*)<\/a>(.*)$/)

  return (
    <span>
      {head}
      <a href={url} target="_blank">
        {link_text}
      </a>
      {tail}
    </span>
  )
}

const LogCard = props => (
  <div className="card shadow mb-4">
    {/* <!-- Card Header - Dropdown  --> */}
    <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
      <h6 className="m-0 font-weight-bold text-primary">Logs</h6>
    </div>
    {/* <!-- Card Body  --> */}
    <div className="card-body">
      {props.log.map((piece, index) => (
        piece == `<br>`
          ? <br key={index} />
          : (
            <span key={index}>
              {piece.includes('<a href') ? convertRawURL(piece) : piece}
            </span>
          )
      ))}
    </div>
  </div>
)
