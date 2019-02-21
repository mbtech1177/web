const { BrowserRouter, HashRouter, Switch, Route } = ReactRouterDOM

class App extends React.Component {
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

ReactDOM.render(
  <HashRouter>
    <App />
  </HashRouter>,
  document.getElementById('root')
);
