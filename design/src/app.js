const { BrowserRouter, HashRouter, Switch, Route } = ReactRouterDOM

class App extends React.Component {
  render() {
    return (
      <div>
        <Wrapper>
          <Switch>
            <Route exact path='/' component={MainPage}/>
            <Route path='/like/hashtag' component={LikeHashtagPage}/>
            <Route path='/like' component={LikeHashtagPage}/>
            <Route path='/blank' component={BlankPage}/>
            <Route path='/empty' component={BlankPage}/>
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
