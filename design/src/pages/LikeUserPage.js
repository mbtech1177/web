const LikeHashtagPage = () => (
  <div className="container-fluid">
    <h1 className="h3 mb-4 text-gray-800">Like medias by hashtag</h1>

    <div className="row">
      <div className="col-lg-6">
        <label htmlFor="username">Put username: @</label>
        <input type="text" id="username" name="username" />
        <a className="btn btn-primary" id="likeUsernameButton">Like 10 photos</a>
      </div>
    </div>
  </div>
)
