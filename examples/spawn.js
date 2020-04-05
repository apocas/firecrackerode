var Firecracker = require('../lib/firecracker');

var firecracker = new Firecracker({ socketPath: '/tmp/firecracker.socket' });
var streams = firecracker.spawn('/root/firecracker');

process.on('SIGINT', function () {
  console.log('Killing Firecracker...');
  firecracker.kill();
});

streams.stdout.on('data', (data) => {
  console.log(`Firecracker stdout:\n${data}`);
});

streams.stderr.on('data', (data) => {
  console.log(`Firecracker stderr:\n${data}`);
});