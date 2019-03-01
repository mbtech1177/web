const { connect } = ReactRedux
const { Redirect } = ReactRouterDOM

class __ScriptPage extends React.Component {

  constructor(props) {
    super(props)

    console.log('props', props.match.params.name)

    const script = scripts[props.match.params.name]

    if (!script) {
      this.state = {
        showAlertAfterFinish: false,
        shouldRedirectToLogs: false,
      }
      return
    }

    const params = script.params
      .reduce(
        (obj, item) => ({
          ...obj,
          [item.name]: item.defaultValue || ''
        }),
      {})

    this.script = script
    this.state = {
      showAlertAfterFinish: false,
      shouldRedirectToLogs: false,
      params: script.params,
      files: {},
      ...params,
    }
  }

  handleSubmit = async () => {
    this.props.showLoader()

    const { showAlertAfterFinish } = this.state
    showAlertAfterFinish && this.props.notifyWhenQueueFinished()

    if (!instagram.isStopped) {
      alert(`Finish other tasks first!`)
      return
    }

    instagram.start()

    this.script.run(this.state, this.props.printLog)
      .catch(err => {
          console.error(err)
          this.props.printLog(`Error: ${err.message}`, false)
          alert(err.message)
      })
      .finally(() => instagram.kill())
      .finally(() => this.props.hideLoader())

    this.handleRedirectToLogs()
  }

  handleChange = (event) => {
    const name = event.target.name
    const value = event.target.value

    this.setState({ [name]: value })

    if (event.target.files) {
      this.handleFileChange(files)
    }
  }

  handleFileChange = files => {
    const reader = new FileReader()

    reader.onload = event => {
      console.log('file', event.target.result)

      this.setState({
        files: {
          [name]: event.target.result,
        },
      })
    }

    reader.readAsDataURL(event.target.files[0])
  }

  handleNumberChange = (name, value) => (event) => {
    this.setState({
      [name]: value,
    })
  }

  handleRedirectToLogs = () => {
    this.setState({
      shouldRedirectToLogs: true,
    })
  }

  render () {
    const { params, showAlertAfterFinish, shouldRedirectToLogs } = this.state

    const scriptName = this.props.match.params.name

    if (shouldRedirectToLogs) {
      return <Redirect push to="/logs" />
    }

    if (!this.script) {
      return (
        <CardFullWidthPage>
          <h2>Script with name '{scriptName}' is not found</h2>
        </CardFullWidthPage>
      )
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

                {params.map(({ labelText, name, type, prefix, values }, index) => (
                  <div className="row" key={index}>
                    <div className="col-auto">
                        <label htmlFor={name}>{labelText || name}</label>

                        {type === 'text' && (
                          <div className="input-group mb-3">
                            {prefix && (
                              <div className="input-group-prepend">
                                <span className="input-group-text" id={`prefix-symbol-${prefix}`}>
                                  {prefix}
                                </span>
                              </div>
                            )}

                            <input
                              type="text"
                              className="form-control form-control-lg"
                              id={name}
                              name={name}
                              aria-describedby={`prefix-symbol-${prefix}`}
                              value={this.state[name]}
                              onChange={this.handleChange}
                            />
                          </div>
                        )}

                        {type === 'number' && (
                          <div className="btn-group d-block">
                            {(values || [1, 2, 3, 5, 10]).map((num, index) => (
                              <Button
                                id={name}
                                className="btn-secondary"
                                key={index}
                                data-value={num}
                                ym={`${scriptName}-select-${num}`}
                                onClick={this.handleNumberChange(name, num)}
                              >
                                {num}
                              </Button>
                            ))}

                          </div>
                        )}

                        {type === 'file' && (
                          <div className="input-group mb-3">
                            <input
                              type="file"
                              className="form-control form-control-lg"
                              id={name}
                              name={name}
                              value={this.state[name]}
                              onChange={this.handleChange}
                            />
                          </div>
                        )}

                    </div>
                  </div>
                ))}


                <br />

                <div className="row">
                  <div className="col-auto">

                  </div>
                </div>


                <div className="row">
                  <div className="col-auto">
                    <div className="btn-group d-inline-block">
                      <Button
                        className="btn-primary"
                        ym={`${scriptName}-submit`}
                        onClick={this.handleSubmit}>
                        Run!
                      </Button>
                    </div>
                    <div className="d-inline-block">
                      &nbsp;
                    </div>
                    <div className="d-inline-block">
                      &nbsp;
                    </div>

                    <div className="form-check d-inline-block">
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

      </CardFullWidthPage>
    )
  }
}

const ScriptPage = connect(
  null,
  { likePhotosByUsername, notifyWhenQueueFinished, showLoader, hideLoader, printLog }
)(__ScriptPage)
