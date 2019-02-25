class CardFullWidthPage extends React.Component {

  render () {

    return (
      <div className="container-fluid">
        {this.props.heading && (
          <div className="d-sm-flex align-items-center justify-content-between mb-4">
            {/* <!-- Page Heading  --> */}
            <h1 className="h3 mb-0 text-gray-800">
              {this.props.heading}
            </h1>
          </div>
        )}

        {/* <!-- Content Row  --> */}
        <div className="row">

          <div className="col-xl-12 col-md-12 mb-12">
            <div className="card border-left-primary shadow h-150 py-2">
              <div className="card-body">

                {this.props.children}

              </div>
            </div>
          </div>

        </div>
      </div>
    )
  }
}
