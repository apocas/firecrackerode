const os = require('os');
const expect = require('chai').expect;
var firecracker = require('./helper').firecracker;

describe('#firecracker', function () {

  describe('#images', function () {
    it('should download kernel & filesystem images', function () {
      var kernelImg = 'https://s3.amazonaws.com/spec.ccfc.min/img/hello/kernel/hello-vmlinux.bin';
      var rootImg = 'https://s3.amazonaws.com/spec.ccfc.min/img/hello/fsfiles/hello-rootfs.ext4';

      return firecracker.downloadImage(kernelImg, os.tmpdir() + '/hello-vmlinux.bin').then(function () {
        return firecracker.downloadImage(rootImg, os.tmpdir() + '/hello-rootfs.ext4');
      }).then(function () {
      }).catch(function (err) {
        expect(err).to.be.null;
      });
    });

    it('should use load the kernel image', function () {
      return firecracker.bootSource({
        'kernel_image_path': os.tmpdir() + '/hello-vmlinux.bin',
        'boot_args': 'console=ttyS0 reboot=k panic=1 pci=off'
      }).then(function () {
      }).catch(function (err) {
        expect(err).to.be.null;
      });
    });

    it('should use load the filesystem image', function () {
      var drive = firecracker.drive('rootfs');
      return drive.updatePreboot({
        'path_on_host': os.tmpdir() + '/hello-rootfs.ext4',
        'is_root_device': true,
        'is_read_only': false
      }).then(function () {
      }).catch(function (err) {
        expect(err).to.be.null;
      });
    });
  });

  describe('#firestarter', function () {
    it('should get info', function () {
      return firecracker.info().then(function (data) {
        expect(data).to.be.ok;
      }).catch(function (err) {
        expect(err).to.be.null;
      });
    });

    it('should start microvm', function () {
      return firecracker.action('InstanceStart').then(function () {
      }).catch(function (err) {
        expect(err).to.be.null;
      });
    });
  });

});