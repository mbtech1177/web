const { connect } = ReactRedux

class __LikeUserPage extends React.Component {

  state = {
    username: ''
  }

  handleLikeUserButton = async () => {
    this.props.showLoader()

    const { username } = this.state
    await likePhotosByUsername(username, 10, this.props.printLog)

    this.props.hideLoader()
  }

  handleChange = (event) => {
    // const name = event.target.name
    const username = event.target.value

    this.setState({ username })
  }

  render () {
    return (
      <div className="container-fluid">
        <h1 className="h3 mb-4 text-gray-800">Like user's medias</h1>

        <div className="row">
          <div className="col-lg-6">
            <label htmlFor="username">Put username: @</label>

            <input
              type="text"
              id="username"
              name="username"
              value={this.state.username}
              onChange={this.handleChange}
            />

            <Button
              className="btn-primary"
              onClick={this.handleLikeUserButton}>
              Like 10 photos
            </Button>
          </div>
        </div>
      </div>
    )
  }
}

const LikeUserPage = connect(
  null,
  { likePhotosByUsername, showLoader, hideLoader, printLog }
)(__LikeUserPage)
