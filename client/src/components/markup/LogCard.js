class LogCard extends React.Component {
  scrollToBottom = (force = false) => {
    if (!this.props.autoScroll && !force) return

    this.messagesEnd.scrollIntoView({ behavior: "smooth" })
  }

  convertRawURL = (text) => {
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

  componentDidMount() {
    this.scrollToBottom()
  }

  componentDidUpdate() {
    this.scrollToBottom()
  }

  render () {
    return (
      <div className="card shadow mb-4">
        {/* <!-- Card Header - Dropdown  --> */}
        <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
          <h6 className="m-0 font-weight-bold text-primary">Logs</h6>

          {this.props.clearLog && !!this.props.log.length && (
          <InlineButton
            className="m-0 text-danger"
            onClick={() => confirm(`Clear log?`) && this.props.clearLog()}
          >
            Clear Log
          </InlineButton>
          )}

          <InlineButton
            className="m-0"
            onClick={() => this.scrollToBottom(true)}
          >
            Scroll to End
          </InlineButton>
        </div>
        {/* <!-- Card Body  --> */}
        <div className="card-body" style={{ height: "70vh", overflowY: "scroll" }}>
          {this.props.log.map((piece, index) => (
             piece == `<br>`
               ? <br key={index} />
               : (
                 <span key={index}>
                   {piece.includes('<a href') ? this.convertRawURL(piece) : piece}
                 </span>
               )
          ))}

          <div style={{ float: "left", clear: "both" }}
              ref={(el) => { this.messagesEnd = el; }}>
          </div>
        </div>
      </div>
    )
  }
}
