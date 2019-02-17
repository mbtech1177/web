// def get_hashtag_feed(self, hashtag, max_id=''):
//     url = 'feed/tag/{hashtag}/?max_id={max_id}&rank_token={rank_token}&ranked_content=true&'
//     url = url.format(
//         hashtag=hashtag,
//         max_id=max_id,
//         rank_token=self.rank_token
//     )
//     return self.send_request(url)
//

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

// def like(self, media_id):
//     data = self.json_data({'media_id': media_id})
//     url = 'media/{media_id}/like/'.format(media_id=media_id)
//     return self.send_request(url, data)
//
// def unlike(self, media_id):
//     data = self.json_data({'media_id': media_id})
//     url = 'media/{media_id}/unlike/'.format(media_id=media_id)
//     return self.send_request(url, data)

export const like = (self, media_id) => {
  const data = { media_id }

  return self.send_request(`media/${media_id}/like/`, data)
}

export const unlike = (self, media_id) => {
  const data = { media_id }

  return self.send_request(`media/${media_id}/unlike/`, data)
}



// vvvvvvvvvvvvvvvvv

// def get_location_feed(self, location_id, max_id=''):
//     url = 'feed/location/{location_id}/?max_id={max_id}&rank_token={rank_token}&ranked_content=true&'
//     url = url.format(
//         location_id=location_id,
//         max_id=max_id,
//         rank_token=self.rank_token
//     )
//     return self.send_request(url)
//
// def get_popular_feed(self):
//     url = 'feed/popular/?people_teaser_supported=1&rank_token={rank_token}&ranked_content=true&'
//     return self.send_request(url.format(rank_token=self.rank_token))

// export default {
//   get_hashtag_feed,
//
// }
