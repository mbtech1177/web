const { connect } = ReactRedux


class __SupportUsPage extends React.Component {

  followUs = async () => {
    try {
      this.props.showLoader()

      const { user: caffeinum } = await instagram.request({ method: 'get_user_info', params: ['caffeinum'] }, true)

      const { user: ohld } = await instagram.request({ method: 'get_user_info', params: ['ohld'] }, true)

      const users = [ ohld, caffeinum ]

      followList(users, users.length, this.props.printLog)
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

      <CardFullWidthPage heading="Support Us">

          <div className="row">
            <div className="col-auto">
                <Button className="btn-primary" onClick={this.followUs}>
                  Follow Us on Instagram
                </Button>
            </div>
          </div>

      </CardFullWidthPage>
    )
  }
}

const SupportUsPage = connect(
  ({ stats }) => ({ stats }),
  { showLoader, hideLoader, printLog }
)(__SupportUsPage)
