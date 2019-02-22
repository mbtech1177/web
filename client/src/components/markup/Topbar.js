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

      {props.error && (
        <li className="nav-item dropdown no-arrow">
          <span className="nav-link">
            <span className="error-status mr-2 d-none d-lg-inline text-grey-600 small">
              {props.error}
            </span>
          </span>
        </li>
      )}

      {props.connection.status === CONNECTION.NOT_INSTALLED && (
        <li className="nav-item dropdown no-arrow">
          <span className="nav-link">
            <span className="install-extension mr-2 d-none d-lg-inline text-grey-600 small">
              <a href="https://chrome.google.com/webstore/detail/instagram-yourself/njonkbhnmmjgancfbncekpgkmidhbbpo" target="_blank">
                Install extension
              </a>
            </span>
          </span>
        </li>
      )}

      <li className="nav-item no-arrow">
        <a className="nav-link" href="#" onClick={() => alert(props.connection.description)}>
          <span title={props.connection.description} className="connection-status mr-2 d-none d-lg-inline text-gray-600 small">
            {props.connection.status}
          </span>
        </a>
      </li>

      <div className="topbar-divider d-none d-sm-block"></div>

      <li className="nav-item dropdown no-arrow">
        <span className="nav-link">
          <span className="instagram-status mr-2 d-none d-lg-inline text-gray-600 small">
            {props.instagram.isStopped && (
              <span>
                Instagram Service: No current task
              </span>
            )}

            {!props.instagram.isStopped && (
              <span>
                Instagram Service: Working
              </span>
            )}

            {!props.instagram.isStopped && (
              <Button
                className="btn-danger btn-sm shadow-sm"
                onClick={() => onKillAll(props.printLog)}>
                Stop
              </Button>
            )}

          </span>
        </span>
      </li>

      <div className="topbar-divider d-none d-sm-block"></div>

      {/* <!-- Nav Item - User Information  --> */}
      <li className="nav-item dropdown no-arrow">
        <a className="nav-link dropdown-toggle" href={props.user ? `https://www.instagram.com/${props.user.username}/` : `#`} target="_blank">
          <span className="mr-2 d-none d-lg-inline text-gray-600 small">
            {props.user.username}
          </span>
          <img className="img-profile rounded-circle" src={props.user.profile_pic_url} />
        </a>
      </li>

    </ul>

    {/* <!-- End of Topbar  --> */}
  </nav>
)

const Topbar = connect(
  ({ user, isLoading, error, connection, instagram }) => ({ user, isLoading, error, connection, instagram }),
  { printLog }
)(__Topbar)
