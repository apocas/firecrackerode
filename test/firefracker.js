const os = require('os');
const expect = require('chai').expect;
var firecracker = require('./helper').firecracker;

describe('#firecracker', function () {

  describe('#images', function () {
    it('should download kernel & filesystem images', function () {
      var kernelImg = 'https://s3.amazonaws.com/spec.ccfc.min/img/hello/kernel/hello-vmlinux.bin';
      var rootImg = 'https://s3.amazonaws.com/spec.ccfc.min/img/hello/fsfiles/hello-rootfs.ext4';

      return firecracker.downloadImage(kernelImg, os.tmpdir() + '/hello-vmlinux.bin').then(function () {
        console.log('Kernel image downloaded!');
        return firecracker.downloadImage(rootImg, os.tmpdir() + '/hello-rootfs.ext4');
      }).then(function () {
        console.log('Filesystem image downloaded!');
      }).catch(function (err) {
        console.log(err);
        expect(err).to.be.null;
      });
    });

    it('should get info', function() {
      return firecracker.info().then(function(data) {
        console.log(data);
        expect(data).to.be.ok;
      }, function(err) {
        console.log(err);
        expect(err).to.be.null;
      });
    });
    
  });

});