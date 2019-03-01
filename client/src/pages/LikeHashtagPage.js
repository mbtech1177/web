const { connect } = ReactRedux
const { Redirect } = ReactRouterDOM

class __LikeHashtagPage extends React.Component {

  state = {
    hashtag: 'cats',
    nPhotos: 10,
    showAlertAfterFinish: false,
    shouldRedirectToLogs: false,
  }

  handleLikeHashtagButton = async () => {
    this.props.showLoader()

    const { hashtag, nPhotos, showAlertAfterFinish } = this.state

    showAlertAfterFinish && this.props.notifyWhenQueueFinished()

    try {
      if (!instagram.isStopped) {
        alert(`Please stop all other tasks before running!`)
        return
      }
      
      await likePhotosByHashtag(hashtag, nPhotos, this.props.printLog)

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
    const { nPhotos, hashtag, showAlertAfterFinish, shouldRedirectToLogs } = this.state

    if (shouldRedirectToLogs) {
      return <Redirect push to="/logs" />
    }

    return (
      <CardFullWidthPage>
              <div className="row no-gutters align-items-center">
                <div className="col mr-12">
                  <div className="text-xs font-weight-bold text-primary text-uppercase mb-12">
                    Like medias by hashtag
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-auto">

                    <label htmlFor="hashtag">Hashtag</label>

                    <div className="input-group mb-3">

                      <div className="input-group-prepend">
                        <span className="input-group-text" id="hash-symbol">#</span>
                      </div>
                      <input
                        type="text"
                        className="form-control form-control-lg"
                        id="hashtag"
                        name="hashtag"
                        aria-describedby="hash-symbol"
                        value={hashtag}
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

                    <label className="form-check-label" htmlFor="showAlertAfterFinish">Notify when queue finishes</label>

                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-auto">

                  <div className="btn-group">
                    {[10, 20, 50].map((num, index) => (
                      <Button
                        className="btn-secondary"
                        key={index}
                        data-value={num}
                        ym={`like-hashtag-select-${num}`}
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
                        ym="like-hashtag-submit"
                        onClick={this.handleLikeHashtagButton}>
                        Like {nPhotos} photos
                      </Button>
                  </div>
                </div>
              </div>
      </CardFullWidthPage>
    )
  }
}

const LikeHashtagPage = connect(
  null,
  { likePhotosByHashtag, notifyWhenQueueFinished, showLoader, hideLoader, printLog }
)(__LikeHashtagPage)
