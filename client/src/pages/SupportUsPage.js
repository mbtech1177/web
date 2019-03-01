const { connect } = ReactRedux


class __SupportUsPage extends React.Component {

  followUs = async () => {
    try {
      this.props.showLoader()

      const users = [
        {
          pk: 352300017,
          username: 'ohld',
        },
        {
          pk: 45786877,
          username: 'caffeinum',
        },
        {
          pk: 376163936,
          username: 'ermolaeva.liuba',
        },
        {
          pk: 4814855936,
          username: 'phystechtv',
        },
      ]

      followList(users, users.length, this.props.printLog)
    } catch (err) {
      console.error(err)
      this.props.printLog(`Error: ${err.message}`)
      alert(err.message)
    } finally {
      this.props.hideLoader()
    }
  }

  likeUs = async () => {
    try { 
      this.props.showLoader()

      likePhotosByUsername('ohld', 10, this.props.printLog)
      // TODO: like all of us please!
    } catch (err) {
      console.error(err)
      this.props.printLog(`Error: ${err.message}`)
      alert(err.message)
    } finally {
      this.props.hideLoader()
    }
  }

  render () {
    return (

      <div className="container-fluid">
        {this.props.heading && (
          <div className="d-sm-flex align-items-center justify-content-between mb-4">
            {/* <!-- Page Heading  --> */}
            <h1 className="h3 mb-0 text-gray-800">
              Support Us
            </h1>
          </div>
        )}

        {/* <!-- Content Row  --> */}
        <div className="row">

          <div className="col-lg-6">
            <div className="card shadow mb-4">
              <div className="card-header py-3">
                <h6 className="m-0 font-weight-bold text-primary">Use this website to</h6>
              </div>
              <div className="card-body">
                <p>We would be very happy if you follow us on Instagram! Moreover, this is a good place to test our website.</p>

                <Button 
                  className="btn-success btn-icon-split" 
                  onClick={this.followUs}
                  ym={`supportUs-follow`}
                >
                  <span className="icon text-white-50">
                      <i className="fas fa-user-friends"></i>
                  </span>
                  <span className="text">Follow Us on Instagram</span>
                </Button>

                <div className="my-2"></div>

                <Button 
                  className="btn-success btn-icon-split" 
                  onClick={this.likeUs}
                  ym={`supportUs-like`}
                >
                  <span className="icon text-white-50">
                      <i className="fas fa-heart"></i>
                  </span>
                  <span className="text">Like Us on Instagram</span>
                </Button> 

              </div>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="card shadow mb-4">
              <div className="card-header py-3">
                <h6 className="m-0 font-weight-bold text-primary">Other links</h6>
              </div>
              <div className="card-body">
                <p>Just other links that you'd like to like, follow, donate, inspect, love, hate, ... you name it. Enjoy!</p>
                <a href="https://twitter.com/caffeinum" className="btn btn-primary btn-icon-split" target="_blank">
                  <span className="icon text-white-50">
                    <i className="fab fa-twitter"></i>
                  </span>
                  <span className="text">Follow us on Twitter</span>
                </a>

                <div className="my-2"></div>

                <a href="https://buymeacoff.ee/okhlopkov" className="btn btn-warning btn-icon-split" target="_blank">
                  <span className="icon text-white-50">
                    <i className="fas fa-coffee"></i>
                  </span>
                  <span className="text">Buy us a coffee</span>
                </a>
              </div>
            </div>
          </div>
          

        </div>
      </div>
    )
  }
}

const SupportUsPage = connect(
  ({ stats }) => ({ stats }),
  { showLoader, hideLoader, printLog }
)(__SupportUsPage)
