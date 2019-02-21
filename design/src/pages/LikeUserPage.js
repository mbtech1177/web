const LikeHashtagPage = () => (
  <div className="container-fluid">
    <h1 className="h3 mb-4 text-gray-800">Like medias by hashtag</h1>

    <div className="row">
      <div className="col-lg-6">
        <label for="username">Put username: @</label>
        <input type="text" id="username" name="username" />
        <a class="waves-effect waves-light btn" id="likeUsernameButton">Like 10 photos</a>
      </div>
    </div>
  </div>
)
