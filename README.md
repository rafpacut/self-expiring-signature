## Self-expiring signature

A (slightly) modified Shnorr Signature Scheme. The message is hashed with publicly accessible ephemeral data.
Supported data sources:

* DNS negative cache ([Neuralizer](https://www.sec.in.tum.de/i20/publications/neuralyzer-flexible-expiration-times-for-the-revocation-of-online-data/@@download/file/neuralyzer.pdf))
* External server with a database service
* News feed ([FADE](http://www.imperial.ac.uk/media/imperial-college/faculty-of-engineering/computing/public/1718-ug-projects/Sam-Wood-Self-Destructing-Data.pdf), news API provided by [NewsAPI.org](newsapi.org))


Implemented with pairing-based cryptography provided by [mcl](https://github.com/herumi/mcl-wasm).

#### install dependencies:
`apt install nodejs npm`

`npm install`

 `apt install dnsutils` (for dig package)

#### data sources configuration:
To use news API obtain key [here](https://newsapi.org/pricing).
Save your key in /path/to/project/conf/newsAPI.key

DNS mode requires a list of open resolver server IPs. Place those in /path/to/project/conf/serverList.json.
The file should contain a list of IPs.

To use ''service' mode hostname and port of the server in /path/to/project/cli.json 
## usage
#### sign:
`node sign.js <mode> <message>`

mode can be either: 'dns', 'service' or 'news'.


In case of 'dns', after saving the signature to a file, the sign process will continue indefinately in order to refresh the data inserted into DNS cache.

#### verify:
`node verify.js <pathToSignatureFile>`

###### Tested on node version 14.0.1

