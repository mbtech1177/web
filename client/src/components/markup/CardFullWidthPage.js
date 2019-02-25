class CardFullWidthPage extends React.Component {

  render () {

    return (
      <div className="container-fluid">

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
