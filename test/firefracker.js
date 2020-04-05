const os = require('os');
const expect = require('chai').expect;
var firecracker = require('./helper').firecracker;

describe('#firecracker', function () {

  describe('#images', function () {
    it('should download kernel & filesystem images', function (done) {
      var kernelImg = 'https://s3.amazonaws.com/spec.ccfc.min/img/hello/kernel/hello-vmlinux.bin';
      var rootImg = 'https://s3.amazonaws.com/spec.ccfc.min/img/hello/fsfiles/hello-rootfs.ext4';

      firecracker.downloadImage(kernelImg, os.tmpdir() + '/hello-vmlinux.bin').then(function () {
        console.log('Kernel image downloaded!');
        return firecracker.downloadImage(rootImg, os.tmpdir() + '/hello-rootfs.ext4');
      }).then(function () {
        console.log('Filesystem image downloaded!');
        done();
      }).catch(function (err) {
        expect(err).to.be.null;
        done();
      });
    });

    it('should get info', function(done) {
      firecracker.info().then(function(data) {
        console.log(data);
        expect(data).to.be.ok;
        done();
      }).catch(function (err) {
        console.log(err);
        expect(err).to.be.null;
        done();
      });
    });
  });

});