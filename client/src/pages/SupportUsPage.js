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
