const { connect } = ReactRedux

class __LikeHashtagPage extends React.Component {

  state = {
    hashtag: ''
  }

  handleLikeHashtagButton = async () => {
    this.props.showLoader()

    const { hashtag } = this.state
    await likePhotosByHashtag(hashtag, 10, this.props.printLog)

    this.props.hideLoader()
  }

  handleChange = (event) => {
    // const name = event.target.name
    const hashtag = event.target.value

    this.setState({ hashtag })
  }

  render () {
    return (
      <div className="container-fluid">
        <h1 className="h3 mb-4 text-gray-800">Like medias by hashtag</h1>

        <div className="row">
          <div className="col-lg-6">
            <label htmlFor="hashtag">Put hashtag: #</label>

            <input
              type="text"
              id="hashtag"
              name="hashtag"
              value={this.state.hashtag}
              onChange={this.handleChange}
            />

            <Button
              className="btn-primary"
              onClick={this.handleLikeHashtagButton}>
              Like 10 photos
            </Button>
          </div>
        </div>
      </div>
    )
  }
}

const LikeHashtagPage = connect(
  null,
  { likePhotosByHashtag, showLoader, hideLoader, printLog }
)(__LikeHashtagPage)
