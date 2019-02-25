const { connect } = ReactRedux


class __DashboardPage extends React.Component {

  render () {
    const { stats } = this.props

    return (
      <div className="container-fluid">
        <div className="d-sm-flex align-items-center justify-content-between mb-4">
          {/* <!-- Page Heading  --> */}
          <h1 className="h3 mb-0 text-gray-800">
            Dashboard
          </h1>

          <Button
            className="d-none d-sm-inline-block btn-sm btn-primary shadow-sm"
            onClick={() => alert(this.props.connection.description)}>
            <i className="fas fa-sync fa-sm text-white-50"></i>
            Check Extension Connection
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
          <div className="col-xl-3 col-md-3 mb-4">
            <div className="card border-left-primary shadow h-100 py-2">
              <div className="card-body">
                <div className="row no-gutters align-items-center">
                  <div className="col mr-2">
                    <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">Total Liked</div>
                    <div className="h5 mb-0 font-weight-bold text-gray-800">
                      {stats.likes
                        ? stats.likes
                        : 'Unknown'}
                    </div>
                  </div>
                  <div className="col-auto">
                    <i className="fas fa-heart fa-2x text-gray-300"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* <!-- Total Followed  --> */}
          <div className="col-xl-3 col-md-3 mb-4">
            <div className="card border-left-success shadow h-100 py-2">
              <div className="card-body">
                <div className="row no-gutters align-items-center">
                  <div className="col mr-2">
                    <div className="text-xs font-weight-bold text-success text-uppercase mb-1">Total Followed</div>
                    <div className="h5 mb-0 font-weight-bold text-gray-800">
                      {stats.follows !== null
                        ? stats.follows
                        : 'Unknown'}
                    </div>
                  </div>
                  <div className="col-auto">
                    <i className="fas fa-user-friends fa-2x text-gray-300"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* <!-- Total Followed  --> */}
          <div className="col-xl-3 col-md-3 mb-4">
            <div className="card border-left-info shadow h-100 py-2">
              <div className="card-body">
                <div className="row no-gutters align-items-center">
                  <div className="col mr-2">
                    <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                      Followers
                    </div>
                    <div className="h5 mb-0 font-weight-bold text-gray-800">
                      {stats.follower_count
                        ? stats.follower_count
                        : 'Unknown'}
                    </div>
                  </div>
                  <div className="col-auto">
                    <i className="fas fa-user-friends fa-2x text-gray-300"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* <!-- Total Followed  --> */}
          <div className="col-xl-3 col-md-3 mb-4">
            <div className="card border-left-warning shadow h-100 py-2">
              <div className="card-body">
                <div className="row no-gutters align-items-center">
                  <div className="col mr-2">
                    <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                      Following
                    </div>
                    <div className="h5 mb-0 font-weight-bold text-gray-800">
                      {stats.following_count
                        ? stats.following_count
                        : 'Unknown'}
                    </div>
                  </div>
                  <div className="col-auto">
                    <i className="fas fa-user-friends fa-2x text-gray-300"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* <!-- Content Row  --> */}

        <div className="row">
          {/* <!-- Area Chart  --> */}
          <div className="col-xl-12 col-lg-12">
            <div className="card shadow mb-4">
              {/* <!-- Card Header - Dropdown  --> */}
              <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                <h6 className="m-0 font-weight-bold text-primary">Followers over time</h6>
              </div>
              {/* <!-- Card Body  --> */}
              <div className="card-body">
                <div className="chart-area" style={{ overflowY: 'scroll' }}>
                    {stats.full.follower_count && stats.full.follower_count.map(item => (
                      <div key={item.savedAt}>
                        {`${new Date(item.savedAt)} - ${item.followers}`}
                      </div>
                    ))}
                  <canvas id="myAreaChart">
                  </canvas>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          {/* <!-- Area Chart  --> */}
          <div className="col-xl-12 col-lg-12">
            <LogCard log={this.props.log}/>
          </div>
        </div>
      </div>
  )
  }
}

const DashboardPage = connect(
  ({ isLoading, log, connection, stats }) => ({ isLoading, log, connection, stats }),
  { showLoader, hideLoader, printLog, updateStats }
)(__DashboardPage)
