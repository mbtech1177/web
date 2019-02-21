const { connect } = ReactRedux


const __Topbar = (props) => (
  <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
    {/* <!-- Topbar  --> */}

    {/* <!-- Sidebar Toggle (Topbar)  --> */}
    <button id="sidebarToggleTop" className="btn btn-link d-md-none rounded-circle mr-3">
      <i className="fa fa-bars"></i>
    </button>

    {/* <!-- Topbar Navbar  --> */}
    <ul className="navbar-nav ml-auto">

      {props.isLoading && (
        <li className="nav-item dropdown no-arrow">
          <span className="nav-link">
            <span className="loading-status mr-2 d-none d-lg-inline text-gray-600 small">
              Loading...
            </span>
          </span>
        </li>
      )}

      <li className="nav-item dropdown no-arrow">
        <span className="nav-link">
          <span className="connection-status mr-2 d-none d-lg-inline text-gray-600 small">
            {props.connectionStatus}
          </span>
        </span>
      </li>

      <div className="topbar-divider d-none d-sm-block"></div>

      {/* <!-- Nav Item - User Information  --> */}
      <li className="nav-item dropdown no-arrow">
        <a className="nav-link dropdown-toggle" href="#" id="userDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          <span className="mr-2 d-none d-lg-inline text-gray-600 small">
            {props.user.username}
          </span>
          <img className="img-profile rounded-circle" src="https://source.unsplash.com/QAB-WJcbgJk/60x60" />
        </a>
      </li>

    </ul>

    {/* <!-- End of Topbar  --> */}
  </nav>
)

const Topbar = connect(
  ({ user, isLoading, connectionStatus }) => ({ user, isLoading, connectionStatus }),
  {}
)(__Topbar)
