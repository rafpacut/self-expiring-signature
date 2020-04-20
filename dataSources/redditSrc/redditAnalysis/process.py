from utils import hashData, addQuotes

def process(posts, subTrackedPosts):
    #merge on equal hash values
    return [(post_id,placement) for post_id, tracked_post_hash in subTrackedPosts
                                for placement, post in enumerate(posts)
                                if hashData(post) == tracked_post_hash]


