const Wrapper = (props) => (

  <div id="wrapper">
    <Sidebar></Sidebar>

    {/* <!-- Content Wrapper  --> */}

    <div id="content-wrapper" className="d-flex flex-column">
      {/* <!-- Main Content  --> */}
      <div id="content">
        <Topbar />
        {/* <!-- Begin Page Content  --> */}

        {props.children}

        {/* <!-- /.container-fluid  --> */}

      </div>
      {/* <!-- End of Main Content  --> */}

      <Footer />

    </div>
    {/* <!-- End of Content Wrapper  --> */}

  {/* <!-- End of Page Wrapper  --> */}
  </div>

)
