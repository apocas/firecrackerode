# firecrackerode

Node.js client for Amazon's [Firecracker](http://firecracker-microvm.io) MicroVM platform.

## Installation

`npm install firecrackerode`

## Usage

 * Check [Fireracker API documentation](https://github.com/firecracker-microvm/firecracker/blob/master/src/api_server/swagger/firecracker.yaml) for more details.
 

### Getting started

To use `firecrackerode` first you need to instantiate it:

``` js
var Firecracker = require('dockerode');
var firecracker = new Firecracker({socketPath: '/tmp/firecracker.socket'});
```

### Creating a MicroVM

``` js
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
  return firecracker.action('InstanceStart');
}).then(function(data){
  console.log('MicroVM booted!');
}).catch(function(err) {
  console.log(err);
});
```

### Helper functions

``` js
//Downloading an image
firecracker.downloadImage('https://s3.amazonaws.com/spec.ccfc.min/img/hello/kernel/hello-vmlinux.bin', os.tmpdir() + '/hello-vmlinux.bin').then(function () {
  console.log('Kernel image downloaded!');
}).catch(function(err) {
  console.log(err);
});

//Spawn Firecracker process
firecracker.spawn().then(function () {
  console.log('Firecracker spawned!');
}).catch(function(err) {
  console.log(err);
});

//Kill Firecracker process
firecracker.kill()

```