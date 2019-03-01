const LegalPage = () => (
    <div className="container-fluid">
      <h1>Legal Stuff</h1>

      <div className="row">
        <div className="col-lg-6">
          <div className="card shadow mb-4">
            <div className="card-header py-3">
              <h6 className="m-0 font-weight-bold text-primary">Most important</h6>
            </div>
            <div className="card-body">
              <p>Don't use this tool to spam or to do any other illegal stuff. All at your own risk, guys.</p>
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card shadow mb-4">
            <div className="card-header py-3">
              <h6 className="m-0 font-weight-bold text-primary">Passwords</h6>
            </div>
            <div className="card-body">
              <p>We don't store your Instagram passwords (feel free to audit the browser extension code) since everything is happening in your browser on your side. Even if we would save your credentials, Instagram wouldn't allow us to login - you would receive the 'suspicious login from strange location' alert.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
  