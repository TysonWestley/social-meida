const NodeRSA = require('node-rsa');
const fs = require('fs');

// Generate a new RSA keypair
const key = new NodeRSA({ b: 512 }); 

// Export the keys to PEM files
const privateKeyPem = key.exportKey('pkcs1-private-pem');
const publicKeyPem = key.exportKey('pkcs8-public-pem');

// Write the keys to files
fs.writeFileSync('private.pem', privateKeyPem);
fs.writeFileSync('public.pem', publicKeyPem);

console.log("Keys successfully exported to 'private.pem' and 'public.pem'");