const os = require('os');
const expect = require('chai').expect;
var firecracker = require('./helper').firecracker;

before(async () => {
  try {
    let process = await firecracker.spawn();
  } catch (err) {
    expect(err).to.be.null;
  }
});

after(function () {
  var killed = firecracker.kill();
  expect(killed).to.be.true;
});

describe('#firecracker', function () {

  describe('#images', function () {
    it('should download kernel & filesystem images', async function () {
      var kernelImg = 'https://s3.amazonaws.com/spec.ccfc.min/img/hello/kernel/hello-vmlinux.bin';
      var rootImg = 'https://s3.amazonaws.com/spec.ccfc.min/img/hello/fsfiles/hello-rootfs.ext4';

      try {
        await firecracker.downloadImage(kernelImg, os.tmpdir() + '/hello-vmlinux.bin');
        await firecracker.downloadImage(rootImg, os.tmpdir() + '/hello-rootfs.ext4');
      }
      catch (err) {
        expect(err).satisfy(function (value) {
          if (value === null || value == 'File already exists') {
            return true;
          } else {
            return false;
          }
        });
      }
    });

    it('should use load the kernel image', async function () {
      try {
        await firecracker.bootSource({
          'kernel_image_path': os.tmpdir() + '/hello-vmlinux.bin',
          'boot_args': 'console=ttyS0 reboot=k panic=1 pci=off'
        });
      }
      catch (err) {
        expect(err).to.be.null;
      }
    });

    it('should use load the filesystem image', async function () {
      var drive = firecracker.drive('rootfs');
      try {
        await drive.updatePreboot({
          'path_on_host': os.tmpdir() + '/hello-rootfs.ext4',
          'is_root_device': true,
          'is_read_only': false
        });
      }
      catch (err) {
        expect(err).to.be.null;
      }
    });
  });

  describe('#firecracker', function () {
    it('should get info', async function () {
      try {
        const data = await firecracker.info();
        expect(data).to.be.ok;
        expect(data.state).to.equal('Uninitialized');
      }
      catch (err) {
        expect(err).to.be.null;
      }
    });

    it('should start microvm', async function () {
      try {
        await firecracker.action('InstanceStart');
        const data = await firecracker.info();
        expect(data).to.be.ok;
        expect(data.state).to.equal('Running');
      }
      catch (err) {
        expect(err).to.be.null;
      }
    });
  });

  describe('#machine-config', function () {
    it('should get machine-config', async function () {
      try {
        var machineConfig = firecracker.machineConfig();
        const data = await machineConfig.get();
        expect(data).to.be.ok;
        expect(data.vcpu_count).to.equal(1);
        expect(data.mem_size_mib).to.equal(128);
      }
      catch (err) {
        expect(err).to.be.null;
      }
    });

    it('should partially update machine-config', async function () {
      try {
        firecracker.kill();
        await firecracker.spawn();
        var machineConfig = firecracker.machineConfig();
        await machineConfig.partialUpdate({ 'mem_size_mib': 256 });
        var machineConfig = firecracker.machineConfig();
        let data = await machineConfig.get();
        expect(data).to.be.ok;
        expect(data.vcpu_count).to.equal(1);
        expect(data.mem_size_mib).to.equal(256);
      }
      catch (err) {
        expect(err).to.be.null;
      }
    });
  });
});