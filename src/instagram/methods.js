// Inspired with Instabot API:
// https://github.com/instagrambot/instabot/blob/master/instabot/api/api.py


function is_user_id(user_id_or_username){
  return !isNaN(user_id_or_username)
}


export const get_user_info = (self, user_id_or_username) => {
  if (is_user_id(user_id_or_username)) {
    const user_id = user_id_or_username
    return self.send_request(`users/${user_id}/info/`)
  } else {
    const username = user_id_or_username
    return self.send_request(`users/${username}/usernameinfo/`)
  }
}

export const get_user_followers = (self, user_id, max_id='') => {
  const rank_token = self.rank_token()
  const url = `friendships/${user_id}/followers/?max_id=${max_id}&rank_token=${rank_token}&`
  return self.send_request(url)
}

export const get_user_followings = (self, user_id, max_id='') => {
  const rank_token = self.rank_token()
  const url = `friendships/${user_id}/following/?max_id=${max_id}&rank_token=${rank_token}&`
  return self.send_request(url)
}

export const get_user_feed = (self, user_id, max_id='') => {
  const rank_token = self.rank_token()
  const url = `feed/user/${user_id}/?max_id=${max_id}&rank_token=${rank_token}&ranked_content=true&`
  return self.send_request(url)
}

export const get_hashtag_feed = (self, hashtag, max_id='') => {
    const rank_token = self.rank_token()
    const url = `feed/tag/${hashtag}/?max_id=${max_id}&rank_token=${rank_token}&ranked_content=true&`
    return self.send_request(url)
}

export const get_location_feed = (self, location_id, max_id='') => {
    const rank_token = self.rank_token()
    const url = `feed/location/${location_id}/?max_id=${max_id}&rank_token=${rank_token}&ranked_content=true&`
    return self.send_request(url)
}

export const media_info = (self, media_id) => {
  return self.send_request(`media/${media_id}/info/`)
}

export const like = (self, media_id) => {
  return self.send_request(`media/${media_id}/like/`, {})
}

export const unlike = (self, media_id) => {
  return self.send_request(`media/${media_id}/unlike/`, {})
}

export const follow = (self, user_id) => {
  return self.send_request(`friendships/create/${user_id}/`, {})
}

export const unfollow = (self, user_id) => {
  return self.send_request(`friendships/destroy/${user_id}/`, {})
}


export const upload_photo = (self, photo, caption, upload_id, from_video = false) => {

  if (!upload_id) {
    upload_id = String(Date.now())
  }

  // if (!from_video) {
  //   photo = resize_image(photo)
  // }

  if (!photo) {
    return false
  }

  if (!photo instanceof Blob) {
    return false
  }


  const data = {
      upload_id,
      '_uuid': self.uuid,
      '_csrftoken': self.token,
      'image_compression': '{"lib_name":"jt","lib_version":"1.3.0","quality":"87"}',
      photo,
      // 'photo': ('pending_media_%s.jpg' % upload_id, open(photo, 'rb'), 'application/octet-stream', {'Content-Transfer-Encoding': 'binary'})
  }

  const extra_headers = {
    'X-IG-Capabilities': '3Q4=',
    'X-IG-Connection-Type': 'WIFI',
    'Cookie2': '$Version=1',
    'Accept-Language': 'en-US',
    'Accept-Encoding': 'gzip, deflate',
    'Content-type': 'multipart/form-data',
    // 'Content-type': 'application/octet-stream',
    'Connection': 'close',
    'User-Agent': self.user_agent
  }

    //
    // m = MultipartEncoder(data, boundary=self.uuid)
    // self.session.headers.update({'X-IG-Capabilities': '3Q4=',
    //                              'X-IG-Connection-Type': 'WIFI',
    //                              'Cookie2': '$Version=1',
    //                              'Accept-Language': 'en-US',
    //                              'Accept-Encoding': 'gzip, deflate',
    //                              'Content-type': m.content_type,
    //                              'Connection': 'close',
    //                              'User-Agent': self.user_agent})

    return self.send_request('upload/photo', data, extra_headers)
    //
    // response = self.session.post(
    //     config.API_URL + "upload/photo/", data=m.to_string())
    // if response.status_code == 200:
    //     if self.configure_photo(upload_id, photo, caption):
    //         self.expose()
    //         from os import rename
    //         rename(photo, "{}.REMOVE_ME".format(photo))
    //         return True
    // return False
}
