const { withRouter, BrowserRouter, HashRouter, Switch, Route } = ReactRouterDOM
const { Provider } = ReactRedux

class __App extends React.Component {
  componentWillMount() {
    this.props.showLoader()

    connectExtension()
      .then(({ user, status, error }) => {
        this.props.updateConnectionStatus(status)

        if (user) {
          this.props.setUser(user)
        } else if (error) {
          this.props.showErrorMessage(error)
        }
      })
      .finally(() => this.props.hideLoader())
  }

  render() {
    return (
      <div>
        <Wrapper>
          <Switch>
            <Route exact path='/' component={MainPage}/>
            <Route path='/like/user-medias' component={LikeUserPage}/>
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

const App = withRouter(connect(
  null,
  { updateConnectionStatus, showLoader, hideLoader, setUser, showErrorMessage }
)(__App))

ReactDOM.render(
  <Provider store={store}>
    <HashRouter>
      <App />
    </HashRouter>
  </Provider>,
  document.getElementById('root')
);
