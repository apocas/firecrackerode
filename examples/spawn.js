var Firecracker = require('../lib/firecracker');

var firecracker = new Firecracker({ socketPath: '/tmp/firecracker.socket' });
var streams = firecracker.spawn('/root/firecracker');

process.on('SIGINT', function () {
  console.log('Killing Firecracker...');
  firecracker.kill();
});

streams.stdout.on('data', (data) => {
  console.log(data.toString('utf8'));
});

streams.stderr.on('data', (data) => {
  console.log(data.toString('utf8'));
});

console.log('Firecracker started!');