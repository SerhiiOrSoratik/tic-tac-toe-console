const net = require('net');

const client = new net.Socket();

// node server.js -i
const interactive = process.argv[2] === '-i' 

client.connect(1337, '10.0.0.227', () => {
    console.log('> Connected with port ', client.localPort);
    client.write('Hello, server! Love, Client.\n');
    if (interactive) {
        process.stdin.pipe(client);
    } else {
        client.end(); // lets server to know, that's all
    }
});

client.on('data', data => {
    console.log(data.toString());
});

client.on('close', () => {
    console.log('> Connection closed');
});