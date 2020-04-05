//initialization
var Firecracker = require('./lib/firecracker');
var firecracker = new Firecracker({ socketPath: '/tmp/firecracker.socket' });

//kernel image
//https://s3.amazonaws.com/spec.ccfc.min/img/hello/kernel/hello-vmlinux.bin
firecracker.bootSource({
  'kernel_image_path': process.cwd() + '/test/images/hello-vmlinux.bin',
  'boot_args': 'console=ttyS0 reboot=k panic=1 pci=off'
}, function(err, data) {

})

//filesystem image
//https://s3.amazonaws.com/spec.ccfc.min/img/hello/fsfiles/hello-rootfs.ext4
var drive = firecracker.drive('rootfs');
drive.updatePreboot({
  'path_on_host': process.cwd() + '/test/images/hello-rootfs.ext4',
  'is_root_device': true,
  'is_read_only': false
}, function(err, data) {

})

//start
firecracker.actions.instanceStart(function(err, data) {
  if(err) {
    console.log(err);
  } else {
    console.log('MicroVM booted!');
  }
});