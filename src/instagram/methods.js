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

export const comment = (self, media_id, comment_text) => {
  return self.send_request(`media/${media_id}/comment/`, { comment_text })
}

export const reply_to_comment = (self, media_id, comment_text, replied_to_comment_id) => {
  return self.send_request(`media/${media_id}/comment/`, { comment_text, replied_to_comment_id })
}

export const delete_comment = (self, media_id, comment_id) => {
  return self.send_request(`media/${media_id}/comment/${comment_id}/delete/`, {})
}

export const get_user_story_feed = (self, user_id) => {
  return self.send_request(`feed/user/${user_id}/story/`)
}

export const search_location = (self, query, lat = '', lng = '') => {
  const rank_token = self.rank_token()
  return self.send_request(`fbsearch/places/?rank_token=${rank_token}&query=${query}&lat=${lat}&lng=${lng}`)
}
