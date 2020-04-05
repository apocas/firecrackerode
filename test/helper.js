var Firecracker = require('../lib/firecracker');
firecracker = new Firecracker({ socketPath: '/tmp/firecracker.socket' });

module.exports = {
  'firecracker': firecracker
};