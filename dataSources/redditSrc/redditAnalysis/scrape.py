import praw
from utils import readRedditConfig

def scrape(subredditName, timeFilter, postsNum):
    conf = readRedditConfig()
    reddit = praw.Reddit(**conf)
    subreddit = reddit.subreddit(subredditName).top(timeFilter, limit=postsNum)

    posts = [sub.title for sub in subreddit if not sub.stickied]
    return posts

