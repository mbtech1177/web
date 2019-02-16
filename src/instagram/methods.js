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
    const rank_token = self.rank_token
    const url = `feed/tag/${hashtag}/?max_id=${max_id}&rank_token=${rank_token}&ranked_content=true&`
    return self.send_request(url)
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
