## Self-expiring signature

This is a (slightly) modified Shnorr Signature Scheme. The message is hashed with publicly accessible ephemeral data.
Supported data sources:

* DNS negative cache
* Reddit


Implemented with ECC provided by [mcl](https://github.com/herumi/mcl-wasm).

## usage
#### install dependencies:

`npm install`


#### sign:
`node sign.js <mode> <message>`

mode can be either: 'dns' or 'reddit'
In case of 'dns' the sign process will continue indefinately in order to refresh the data inserted into DNS.

#### verify:
`node verify.js <pathToSignatureFile>`

