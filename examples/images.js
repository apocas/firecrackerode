const os = require('os');

var Firecracker = require('../lib/firecracker');
var firecracker = new Firecracker({ socketPath: '/tmp/firecracker.socket' });

var kernelImg = 'https://s3.amazonaws.com/spec.ccfc.min/img/hello/kernel/hello-vmlinux.bin';
var rootImg = 'https://s3.amazonaws.com/spec.ccfc.min/img/hello/fsfiles/hello-rootfs.ext4';

firecracker.downloadImage(kernelImg, os.tmpdir() + '/hello-vmlinux.bin').then(function () {
  console.log('Kernel image downloaded!');
  return firecracker.downloadImage(rootImg, os.tmpdir() + '/hello-rootfs.ext4');
}).then(function () {
  console.log('Filesystem image downloaded!');
}).catch(function (err) {
  console.log(err);
});