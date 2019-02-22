const { connect } = ReactRedux

class __LikeHashtagPage extends React.Component {

  state = {
    hashtag: '',
    nPhotos: 10,
    showAlertAfterFinish: false,
  }

  handleLikeHashtagButton = async () => {
    this.props.showLoader()

    const { hashtag, nPhotos, showAlertAfterFinish } = this.state

    showAlertAfterFinish && this.props.notifyWhenQueueFinished()

    try {
      await likePhotosByHashtag(hashtag, nPhotos, this.props.printLog)
    } catch (err) {
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

  render () {
    const { nPhotos, hashtag, showAlertAfterFinish } = this.state
    return (
      <div className="container-fluid">

      {/* <!-- Content Row  --> */}
      <div className="row">

        {/* <!-- Total Liked  --> */}
        <div className="col-xl-12 col-md-12 mb-12">
          <div className="card border-left-primary shadow h-150 py-2">
            <div className="card-body">
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
                        onClick={this.handlePhotosNumberChange(num)}
                      >
                        {num}
                      </Button>
                    ))}

                  </div>

                  </div>
                  </div>



                  <div className="row">
                  <div className="col-auto">

                  <div>
                      <Button
                        className="btn-primary"
                        onClick={this.handleLikeHashtagButton}>
                        Like {nPhotos} photos
                      </Button>

                  </div>


                </div>

              </div>
            </div>
          </div>
        </div>

        </div>
        </div>
    )
  }
}

const LikeHashtagPage = connect(
  null,
  { likePhotosByHashtag, notifyWhenQueueFinished, showLoader, hideLoader, printLog }
)(__LikeHashtagPage)
