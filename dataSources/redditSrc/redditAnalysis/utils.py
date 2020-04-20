import hashlib
import sys
from configparser import ConfigParser

def readDBConfig():
    c = readConfig('DATABASE')
    for k in c:
        c[k] = c[k].replace('\"','')
    c['port'] = int(c['port'])
    c['connect_timeout'] = int(c['connect_timeout'])
    return c

def readRedditConfig():
    c =  readConfig('REDDIT')
    #delete \"
    for key in c:
        c[key] = c[key][1:-1]
    return c

def readConfig(section):
    config = ConfigParser()
    config.read('./conf.config')
    return {key: config[section][key] for key in config[section]}

def hashData(data):
    m = hashlib.sha256()
    for d in data:
        m.update(bytes(d, 'utf-8'))
    return m.hexdigest()

def addQuotes(string):
    return '\''+string+'\''

def subNameToId(subName):
    subNameToIdMap = {
            'askreddit' : 1,
            'AskHistorians' : 2,
            'dataisbeautiful' :3,
            'privacy' : 4,
            'netsec' : 5
    }
    return subNameToIdMap[subName]

#i dropped AskHistorians, so it's not linear
def subNameToIdx(subName):
    subId = subNameToId(subName)
    subIdToIdxMap = { 1 : 0, 3 : 1, 4 : 2, 5 : 3}
    return subNameToIdxMap[subId]


