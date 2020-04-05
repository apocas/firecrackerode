var Firecracker = require('../lib/firecracker');

var firecracker = new Firecracker({ socketPath: '/tmp/firecracker.socket' });

//https://s3.amazonaws.com/spec.ccfc.min/img/hello/kernel/hello-vmlinux.bin
firecracker.bootSource({
  'kernel_image_path': process.cwd() + '/images/hello-vmlinux.bin',
  'boot_args': 'console=ttyS0 reboot=k panic=1 pci=off'
}).then(function(data) {
  //https://s3.amazonaws.com/spec.ccfc.min/img/hello/fsfiles/hello-rootfs.ext4
  var drive = firecracker.drive('rootfs');
  return drive.updatePreboot({
    'path_on_host': process.cwd() + '/images/hello-rootfs.ext4',
    'is_root_device': true,
    'is_read_only': false
  });
}).then(function(data) {
  firecracker.actions.instanceStart();
}).then(function(data){
  console.log('MicroVM booted!');
}).catch(function(err) {
  console.log(err);
});

