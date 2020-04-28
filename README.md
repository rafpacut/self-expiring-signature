## Self-expiring signature

This is a (slightly) modified Shnorr Signature Scheme. The message is hashed with publicly accessible ephemeral data.
Supported data sources:

* DNS negative cache
* Reddit


Implemented with ECC provided by [mcl](https://github.com/herumi/mcl-wasm).

#### install dependencies:
`apt install nodejs npm`
`npm install`

#### data sources configuration:
To use reddit's API read [this](https://www.reddit.com/wiki/api). Save your OAuth credentials in redditAuthCredentials.json

DNS mode requires a list of server IPs. Place those in dataSources/dnsCacheSrc/serverList.json.
The file should contain a list of IPs.

## usage
#### sign:
`node sign.js <mode> <message>`

mode can be either: 'dns' or 'reddit'.


In case of 'dns', after saving the signature to a file, the sign process will continue indefinately in order to refresh the data inserted into DNS cache.

#### verify:
`node verify.js <pathToSignatureFile>`

