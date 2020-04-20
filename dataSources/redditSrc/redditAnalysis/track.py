#!/usr/bin/env python3
from scrape import scrape
from dbManager import insertData, getTrackedPosts
from utils import subNameToId, subNameToIdx

from itertools import product, groupby

subredditNames = ["askreddit", "dataisbeautiful", "privacy", "netsec"]
timeFilters = ["day", "week", "month", "year"]

trackedPosts = getTrackedPosts()

groupBySubredditId = lambda k : k[2]
sortedTrackedPosts = [[(post_id, post_hash) for (post_id,post_hash,_) in it] 
                                            for _,it in groupby(trackedPosts, key=groupBySubredditId)]

for subredditName, timeFilter in product(subredditNames, timeFilters):
    posts = scrape(subredditName, timeFilter, 50)

    subredditTrackedIdx = subNameToIdx[subredditName]
    subTrackedPosts = sortedTrackedPosts[subredditTrackedIdx]

    processedData = process(posts, subTrackedPosts)

    subredditId = subNameToId[subredditName]
    insertData(processedData, timeFilter, subredditId)
