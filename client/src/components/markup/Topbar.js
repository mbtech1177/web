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

      <div className="topbar-divider d-none d-sm-block"></div>


      {props.connection.status === CONNECTION.NOT_INSTALLED && (
        <li className="nav-item dropdown no-arrow">
          <span className="nav-link">
            <span className="connection-status mr-2 d-none d-lg-inline text-danger">
              <i className="fas fa-exclamation-triangle"></i>
              Website works only with our extension installed.
              Please make sure that you have an extension installed,
              you are using the latest Chrome, you are not on mobile.
            </span>
          </span>
        </li>
      )}

      {props.connection.status === CONNECTION.NOT_INSTALLED && (
        <div className="topbar-divider d-none d-sm-block"></div>
      )}

      {props.connection.status === CONNECTION.NOT_INSTALLED && (
        <li className="nav-item dropdown no-arrow">
          <span className="nav-link">
            <span className="install-extension mr-2 d-none d-lg-inline text-grey-600">
              <a href="https://chrome.google.com/webstore/detail/instagram-yourself/njonkbhnmmjgancfbncekpgkmidhbbpo" target="_blank">
                Install extension
              </a>
            </span>
          </span>
        </li>
      )}

      {( props.connection.status === CONNECTION.NOT_LOGGED_IN
      || props.connection.status === CONNECTION.UNKNOWN)
      && (
        <li className="nav-item dropdown no-arrow">
          <span className="nav-link">
            <span className="connection-status mr-2 d-none d-lg-inline text-danger">
              <i className="fas fa-exclamation-triangle"></i>
              {' '}
              {props.connection.description}
            </span>
          </span>
        </li>
      )}


      {props.connection.status === CONNECTION.LOGGED_IN && (
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
                  className="btn-danger d-sm-block btn-sm shadow-sm"
                  onClick={() => onKillAll(props.printLog)}>
                  Stop
                </Button>
              )}

            </span>
          </span>
        </li>
      )}


      {props.connection.status === CONNECTION.LOGGED_IN && (
        <div className="topbar-divider d-none d-sm-block"></div>
      )}

      {/* <!-- Nav Item - User Information  --> */}

      {props.connection.status === CONNECTION.LOGGED_IN && (
        <li className="nav-item dropdown no-arrow">
            <a className="nav-link dropdown-toggle" href="#" id="userDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              <span className="mr-2 d-none d-lg-inline text-gray-600 small">
                {props.user.username}
              </span>
              <img className="img-profile rounded-circle" src={props.user.profile_pic_url} />
            </a>
            {/* <!-- Dropdown - User Information --> */}
            <div className="dropdown-menu dropdown-menu-right shadow animated--grow-in" aria-labelledby="userDropdown">
              <a className="dropdown-item" href={props.user ? `https://www.instagram.com/${props.user.username}/` : `#`} target="_blank">
                <i className="fab fa-instagram fa-md fa-fw mr-2 text-gray-400"></i>
                You Instagram
              </a>
              {/* <a className="dropdown-item" href="#">
                <i className="fas fa-cogs fa-sm fa-fw mr-2 text-gray-400"></i>
                Settings
              </a>
              <a className="dropdown-item" href="#">
                <i className="fas fa-list fa-sm fa-fw mr-2 text-gray-400"></i>
                Activity Log
              </a>
              <div className="dropdown-divider"></div>
              <a className="dropdown-item" href="#" data-toggle="modal" data-target="#logoutModal">
                <i className="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
                Logout
              </a> */}
            </div>
        </li>
      )}

    </ul>

    {/* <!-- End of Topbar  --> */}
  </nav>
)

const Topbar = connect(
  ({ user, isLoading, error, connection, instagram }) => ({ user, isLoading, error, connection, instagram }),
  { printLog }
)(__Topbar)
