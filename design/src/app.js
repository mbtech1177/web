const { BrowserRouter, HashRouter, Switch, Route } = ReactRouterDOM
const { Provider } = ReactRedux

class __App extends React.Component {
  componentWillMount() {
    this.props.showLoader()

    connectExtension()
      .then(status => this.props.updateConnectionStatus(status))
      .finally(() => this.props.hideLoader())
  }

  render() {
    return (
      <div>
        <Wrapper>
          <Switch>
            <Route exact path='/' component={MainPage}/>
            <Route path='/like/user-medias' component={BlankPage}/>
            <Route path='/like/hashtag' component={LikeHashtagPage}/>
            <Route path='/like' component={LikeHashtagPage}/>
            <Route path='/follow/followers' component={BlankPage}/>
            <Route path='/follow/followings' component={BlankPage}/>
            <Route path='/blank' component={BlankPage}/>
            <Route path='/empty' component={BlankPage}/>
            <Route path='/404' component={BlankPage}/>
          </Switch>
        </Wrapper>
        <ScrollToTop />
        <LogoutModal />
      </div>
    )
  }
}

const App = connect(null, { updateConnectionStatus, showLoader, hideLoader })(__App)

ReactDOM.render(
  <Provider store={store}>
    <HashRouter>
      <App />
    </HashRouter>
  </Provider>,
  document.getElementById('root')
);
