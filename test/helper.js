var Firecracker = require('../lib/firecracker');

var firecracker = new Firecracker({ socketPath: '/tmp/firecracker.socket' });
firecracker.spawn();

module.exports = {
  'firecracker': firecracker
};