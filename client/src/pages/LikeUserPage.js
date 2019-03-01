const { connect } = ReactRedux
const { Redirect } = ReactRouterDOM

class __LikeUserPage extends React.Component {

  state = {
    username: 'robertdowneyjr',
    nPhotos: 10,
    showAlertAfterFinish: false,
    shouldRedirectToLogs: false,
  }

  handleLikeUserButton = async () => {
    this.props.showLoader()

    const { username, nPhotos, showAlertAfterFinish } = this.state

    showAlertAfterFinish && this.props.notifyWhenQueueFinished()

    try {
      if (!instagram.isStopped) {
        alert(`Please stop all other tasks before running!`)
        return
      }

      await likePhotosByUsername(username, nPhotos, this.props.printLog)

      this.handleRedirectToLogs()
    } catch (err) {
      console.error(err)
      this.props.printLog(`Error: ${err.message}`, false)
      alert(err.message)
    } finally {
      this.props.hideLoader()
    }
  }

  handleChange = (event) => {
    const name = event.target.name
    const value = event.target.value

    this.setState({ [name]: value })
  }

  handlePhotosNumberChange = (num = 10) => (event) => {
    this.setState({
      nPhotos: num,
    })
  }

  handleRedirectToLogs = () => {
    this.setState({
      shouldRedirectToLogs: true,
    })
  }

  render () {
    const { nPhotos, username, showAlertAfterFinish, shouldRedirectToLogs } = this.state

    if (shouldRedirectToLogs) {
      return <Redirect push to="/logs" />
    }

    return (
      <CardFullWidthPage>
                <div className="row no-gutters align-items-center">
                  <div className="col mr-12">
                    <div className="text-xs font-weight-bold text-primary text-uppercase mb-12">
                      Like Users media
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-auto">
                      <label htmlFor="username">Username</label>
                      <div className="input-group mb-3">
                        <div className="input-group-prepend">
                          <span className="input-group-text" id="hash-symbol">@</span>
                        </div>
                        <input
                          type="text"
                          className="form-control form-control-lg"
                          id="username"
                          name="username"
                          aria-describedby="hash-symbol"
                          value={username}
                          onChange={this.handleChange}
                        />
                      </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-auto">
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="showAlertAfterFinish"
                        name="showAlertAfterFinish"
                        value={showAlertAfterFinish}
                        onChange={this.handleChange}
                      />
                      <label
                        className="form-check-label"
                        htmlFor="showAlertAfterFinish">Notify when queue finishes
                      </label>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-auto">
                    <div className="btn-group">
                      {[1, 2, 3, 5, 10].map((num, index) => (
                        <Button
                          className="btn-secondary"
                          key={index}
                          data-value={num}
                          ym={`like-user-select-${num}`}
                          onClick={this.handlePhotosNumberChange(num)}
                        >
                          {num}
                        </Button>
                      ))}

                    </div>
                  </div>
                </div>

                <br />

                <div className="row">
                  <div className="col-auto">
                    <div>
                        <Button
                          className="btn-success"
                          ym={`like-user-submit`}
                          onClick={this.handleLikeUserButton}>
                          Like {nPhotos} photos
                        </Button>
                    </div>
                  </div>
                </div>

      </CardFullWidthPage>
    )
  }
}

const LikeUserPage = connect(
  null,
  { likePhotosByUsername, notifyWhenQueueFinished, showLoader, hideLoader, printLog }
)(__LikeUserPage)
