const { connect } = ReactRedux

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

class __MainPage extends React.Component {
  handleRefresh = () => {
    // redux/actions.js -> printLog action
    this.props.printLog('Refreshing... ')
    this.props.printLog('ok', false)
  }

  handleLoader = () => {
    this.props.isLoading
      ? this.props.hideLoader()
      : this.props.showLoader()
  }

  render () {
    return (
      <div className="container-fluid">
        <div className="d-sm-flex align-items-center justify-content-between mb-4">
          {/* <!-- Page Heading  --> */}
          <h1 className="h3 mb-0 text-gray-800">
            Dashboard
          </h1>

          <Button
            className="d-none d-sm-inline-block btn-sm btn-primary shadow-sm"
            onClick={this.handleLoader}>

            <i className="fas fa-sync fa-sm text-white-50"></i>
            Toggle Loader
          </Button>

          <Button
            className="d-none d-sm-inline-block btn-sm btn-primary shadow-sm"
            onClick={this.handleRefresh}>
            <i className="fas fa-sync fa-sm text-white-50"></i>
            Refresh Your Data
          </Button>

          {
            // <a href="#" className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm">
            //   <i className="fas fa-sync fa-sm text-white-50"></i>
            //   Refresh Your Data
            // </a>
          }
        </div>

        {/* <!-- Content Row  --> */}
        <div className="row">

          {/* <!-- Total Liked  --> */}
          <div className="col-xl-4 col-md-6 mb-4">
            <div className="card border-left-primary shadow h-100 py-2">
              <div className="card-body">
                <div className="row no-gutters align-items-center">
                  <div className="col mr-2">
                    <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">Total Liked</div>
                    <div className="h5 mb-0 font-weight-bold text-gray-800">123</div>
                  </div>
                  <div className="col-auto">
                    <i className="fas fa-heart fa-2x text-gray-300"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* <!-- Total Followed  --> */}
          <div className="col-xl-4 col-md-6 mb-4">
            <div className="card border-left-success shadow h-100 py-2">
              <div className="card-body">
                <div className="row no-gutters align-items-center">
                  <div className="col mr-2">
                    <div className="text-xs font-weight-bold text-success text-uppercase mb-1">Total Followed</div>
                    <div className="h5 mb-0 font-weight-bold text-gray-800">37</div>
                  </div>
                  <div className="col-auto">
                    <i className="fas fa-user-friends fa-2x text-gray-300"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* <!-- Total Commented  --> */}
          <div className="col-xl-4 col-md-6 mb-4">
            <div className="card border-left-warning shadow h-100 py-2">
              <div className="card-body">
                <div className="row no-gutters align-items-center">
                  <div className="col mr-2">
                    <div className="text-xs font-weight-bold text-warning text-uppercase mb-1">Total Commented</div>
                    <div className="h5 mb-0 font-weight-bold text-gray-800">0</div>
                  </div>
                  <div className="col-auto">
                    <i className="fas fa-comment fa-2x text-gray-300"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* <!-- Content Row  --> */}

        <div className="row">
          {/* <!-- Area Chart  --> */}
          <div className="col-xl-12 col-lg-7">
            <div className="card shadow mb-4">
              {/* <!-- Card Header - Dropdown  --> */}
              <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                <h6 className="m-0 font-weight-bold text-primary">Followers over time</h6>
              </div>
              {/* <!-- Card Body  --> */}
              <div className="card-body">
                <div className="chart-area">
                    Comming soon
                  <canvas id="myAreaChart">
                  </canvas>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          {/* <!-- Area Chart  --> */}
          <div className="col-xl-12 col-lg-7">
            <div className="card shadow mb-4">
              {/* <!-- Card Header - Dropdown  --> */}
              <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                <h6 className="m-0 font-weight-bold text-primary">Logs</h6>
              </div>
              {/* <!-- Card Body  --> */}
              <div className="card-body">
                {this.props.log.map((piece, index) => (
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
          </div>
        </div>
      </div>
  )
  }
}

const MainPage = connect(
  ({ isLoading, log, connectionStatus }) => ({ isLoading, log, connectionStatus }),
  { showLoader, hideLoader, printLog }
)(__MainPage)
