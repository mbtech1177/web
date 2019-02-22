const { connect } = ReactRedux


class __LogsPage extends React.Component {
  render () {
    return (
      <div className="container-fluid">
        <div className="row">
          {/* <!-- Area Chart  --> */}
          <div className="col-xl-12 col-lg-7">
            <LogCard log={this.props.log}/>
          </div>
        </div>
      </div>
    )
  }
}

const LogsPage = connect(
  ({ log }) => ({ log }),
  {}
)(__LogsPage)
