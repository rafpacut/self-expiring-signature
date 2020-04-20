import psycopg2
import sys

from utils import addQuotes, readDBConfig

def insertData(data, tFilter, subreddit_id):
    query = createQuery(data, tFilter, subreddit_id)
    executeInsert(query)

def createQuery(data, tFilter, subreddit_id):
    tFilter=addQuotes(tFilter[0])

    queryHeader = "insert into post_placements  (post_id, placement, timefilter) values "

    valuesQueryStr = [f"({post_id}, {placement}, {tFilter})," 
                        for post_id, placement in data]

    #cut the last comma out
    valuesQueryStr[-1] = valuesQueryStr[-1][:-1]

    return queryHeader + ''.join(valuesQueryStr)+';'

def getTrackedPosts():
    query = "select * from post_ids;"
    connection, cursor = prepareConnection()
    cursor.execute(query)
    return cursor.fetchall()

def executeInsert(query):
    connection, cursor = prepareConnection()
    cursor.execute(query)
    connection.commit()
    cleanUp(connection, cursor)

def prepareConnection():
    dbConfig = readDBConfig()
    try:
        connection = psycopg2.connect(**dbConfig)
        cursor = connection.cursor()
    except (Exception, psycopg2.Error) as error :
        if(connection):
            cursor.close()
            connection.close()
        sys.exit("Error while connecting to PostgreSQL\n" + error)
    return connection, cursor

def cleanUp(connection, cursor):
    if(connection):
        cursor.close()
        connection.close()


#def getPostId(h, subreddit_id, addIfNotInDb):
#    try:
#        post_id = fetchId(h)
#    except (Exception, psycopg2.Error) as error :
#        sys.exit("When quering post_id: error while connecting to PostgreSQL\n"+ error)
#    if post_id is None:
#        if addIfNotInDb:
#            addNewPost(h, subreddit_id)
#            post_id = fetchId(h)
#            if post_id is None:
#                sys.exit("After inserting new post: post_id retrieved is None")
#        else:
#            sys.exit(f"Post id {post_id} not found and addIfNotInDb flag is false ")
#
#    return post_id[0]
#
#def fetchId(h):
#    query=f"select id from post_ids where hash={h}"
#    
#    return executeSelect(query)
#
#def addNewPost(h, subreddit_id):
#    query = f"insert into post_ids (hash, subreddit_id) values ({h}, {subreddit_id});"
#    executeInsert(query)
#
#def executeSelect(query):
#    connection, cursor = prepareConnection()
#    cursor.execute(query)
#    post_id = cursor.fetchone()
#    cleanUp(connection, cursor)
#    return post_id
#
