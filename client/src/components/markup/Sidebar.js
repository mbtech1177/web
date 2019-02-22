const { Link } = ReactRouterDOM

const Sidebar = () => (
  <ul className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion" id="accordionSidebar">
  {/* Sidebar */}

    {/* <!-- Sidebar - Brand  --> */}
    <Link className="sidebar-brand d-flex align-items-center justify-content-center" to="/">
      <div className="sidebar-brand-icon rotate-n-15">
        <i className="fas fa-laugh-wink"></i>
      </div>
      <div className="sidebar-brand-text mx-3">Instagram yourself</div>
    </Link>

    {/* <!-- Divider  --> */}
    <hr className="sidebar-divider my-0" />

    {/* <!-- Nav Item - Dashboard  --> */}
    <li className="nav-item active">
      <Link className="nav-link" to="/">
        <i className="fas fa-fw fa-tachometer-alt"></i>
        <span>Dashboard</span>
      </Link>
    </li>

    {/* <!-- Divider  --> */}
    <hr className="sidebar-divider" />

    {/* <!-- Heading  --> */}
    <div className="sidebar-heading">
      Actions
    </div>

    {/* <!-- Nav Item - Pages Collapse Menu  --> */}
    <li className="nav-item">
      <a className="nav-link collapsed" href="#" data-toggle="collapse" data-target="#collapseTwo" aria-expanded="true" aria-controls="collapseTwo">
        <i className="fas fa-fw fa-heart"></i>
        <span>Like</span>
      </a>
      <div id="collapseTwo" className="collapse" aria-labelledby="headingTwo" data-parent="#accordionSidebar">
        <div className="bg-white py-2 collapse-inner rounded">
          {/* <!-- <h6 className="collapse-header">Custom Components:</h6>  --> */}
          <Link className="collapse-item" to="/like/hashtag">Hashtag</Link>
          <Link className="collapse-item" to="/like/user-medias">User Medias</Link>

          {/* <a className="collapse-item" href="like/hashtag.html">Hashtag</a> */}
          {/* <a className="collapse-item" href="like/user-medias.html">User Medias</a> */}
        </div>
      </div>
    </li>

    {/* <!-- Nav Item - Utilities Collapse Menu  --> */}
    <li className="nav-item">
      <a className="nav-link collapsed" href="#" data-toggle="collapse" data-target="#collapseUtilities" aria-expanded="true" aria-controls="collapseUtilities">
        <i className="fas fa-fw fa-user-friends"></i>
        <span>Follow</span>
      </a>
      <div id="collapseUtilities" className="collapse" aria-labelledby="headingUtilities" data-parent="#accordionSidebar">
        <div className="bg-white py-2 collapse-inner rounded">
          {/* <!-- <h6 className="collapse-header">Custom Utilities:</h6>  --> */}
          <Link className="collapse-item" to="/follow/followers">Followers of</Link>
          <Link className="collapse-item" to="/follow/followings">Followees of</Link>
        </div>
      </div>
    </li>


    <li className="nav-item">
      <Link className="nav-link" to="/logs">
        <i className="fas fa-file-alt"></i>
        <span>Logs</span>
      </Link>
    </li>

    {/* <!-- Divider  --> */}
    <hr className="sidebar-divider" />

    {/* <!-- Heading  --> */}
    <div className="sidebar-heading">
      Useful links
    </div>

    {/* <!-- Nav Item -   --> */}
    <li className="nav-item">
      <a className="nav-link" href="https://t.me/instabotproject">
        <i className="fab fa-fw fa-telegram"></i>
        <span>Telegram</span></a>
    </li>

    {/* <!-- Nav Item -   --> */}
    <li className="nav-item">
      <a className="nav-link" href="https://github.com/caffeinum/instaweb">
        <i className="fab fa-fw fa-github"></i>
        <span>GitHub</span></a>
    </li>

    {/* <!-- Nav Item -   --> */}
    <li className="nav-item">
        <a className="nav-link" href="https://github.com/caffeinum/instaweb#installing-extension">
          <i className="fas fa-fw fa-question"></i>
          <span>FAQ</span></a>
      </li>

    {/* <!-- Divider  --> */}
    <hr className="sidebar-divider d-none d-md-block" />

    {/* <!-- Sidebar Toggler (Sidebar)  --> */}
    <div className="text-center d-none d-md-inline">
      <button className="rounded-circle border-0" id="sidebarToggle"></button>
    </div>

    {/* <!-- End of Sidebar  --> */}
  </ul>
)
