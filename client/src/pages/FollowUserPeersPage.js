const { connect } = ReactRedux
const { Redirect } = ReactRouterDOM

class __FollowUserPeersPage extends React.Component {

  state = {
    username: '',
    nUsers: 10,
    users: [],
    showAlertAfterFinish: false,
    shouldRedirectToLogs: false,
  }

  handleFollowUserPeersButton = async () => {
    this.props.showLoader()

    const { username, nUsers, showAlertAfterFinish } = this.state

    showAlertAfterFinish && this.props.notifyWhenQueueFinished()

    const { printLog } = this.props

    try {
      if (!instagram.isStopped) {
        alert(`Please stop all other tasks before running!`)
        return
      }

      if (!username) {
        throw new Error(`Empty field!`)
      }

      instagram.start()

      printLog(`Fetching by username @${username}: ... `)

      const { user } = await instagram.request({
        method: 'get_user_info',
        params: [ username ]
      })

      const user_list_method =
        this.getUserListType() === 'followings'
          ? 'get_user_followings'
          : 'get_user_followers'

      const { users } = await instagram.request({
        method: user_list_method,
        params: [ user.pk ]
      })

      this.setState({
        users,
      })

      printLog(`OK, ${users.length} results`, false)

      followList(users, nUsers, printLog)

      this.handleRedirectToLogs()
    } catch (err) {
      console.error(err)
      this.props.printLog(`Error: ${err.message}`)
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
      nUsers: num,
    })
  }

  handleRedirectToLogs = () => {
    this.setState({
      shouldRedirectToLogs: true,
    })
  }

  getUserListType = () => this.props.match.path === '/follow/followings'
    ? 'followings'
    : 'followers'

  render () {
    const { nUsers, username, showAlertAfterFinish, shouldRedirectToLogs } = this.state

    if (shouldRedirectToLogs) {
      return <Redirect push to="/logs" />
    }

    return (
      <CardFullWidthPage>
                <div className="row no-gutters align-items-center">
                  <div className="col mr-12">
                    <div className="text-xs font-weight-bold text-primary text-uppercase mb-12">
                      {this.getUserListType() === 'followings'
                        ? 'Follow User Followees'
                        : 'Follow User Followers'}
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
                      {[1, 2, 5, 10, 20, 30, 50].map((num, index) => (
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
                          className="btn-primary"
                          ym={`like-user-submit`}
                          onClick={this.handleFollowUserPeersButton}>
                          Follow {nUsers} Users
                        </Button>
                    </div>
                  </div>
                </div>

      </CardFullWidthPage>
    )
  }
}

const FollowUserPeersPage = connect(
  null,
  { likePhotosByUsername, notifyWhenQueueFinished, showLoader, hideLoader, printLog }
)(__FollowUserPeersPage)
