var Firecracker = require('../lib/firecracker');

var firecracker = new Firecracker({ socketPath: '/tmp/firecracker.socket' });
//var process = firecracker.spawn();
//console.log('Firefracker started! ' + process.pid);

module.exports = {
  'firecracker': firecracker
};