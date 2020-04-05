const http = require('http'),
  https = require('https'),
  fs = require('fs'),
  path = require('path'),
  child_process = require('child_process');

const Modem = require('./modem'),
  Drive = require('./drive'),
  Interface = require('./interface'),
  MMDS = require('./mmds'),
  MachineConfig = require('./machineconfig');

var Firecracker = function (opts) {
  this.options = opts;
  this.modem = new Modem(opts);
};

Firecracker.prototype.info = function (callback) {
  var self = this;
  if (!callback && typeof opts === 'function') {
    callback = opts;
    opts = undefined;
  }

  var optsf = {
    path: '/',
    method: 'GET',
    statusCodes: {
      200: true
    }
  };

  if (callback === undefined) {
    return new Promise(function (resolve, reject) {
      self.modem.dial(optsf, function (err, data) {
        if (err) {
          return reject(err);
        }
        resolve(data);
      });
    });
  } else {
    this.modem.dial(optsf, function (err, data) {
      callback(err, data);
    });
  }
};

Firecracker.prototype.action = function (action, callback) {
  var self = this;
  if (!callback && typeof opts === 'function') {
    callback = opts;
    opts = undefined;
  }

  var optsf = {
    path: '/actions',
    method: 'PUT',
    data: { 'action_type': action },
    statusCodes: {
      204: true,
      400: 'The action cannot be executed due to bad input'
    }
  };

  if (callback === undefined) {
    return new Promise(function (resolve, reject) {
      self.modem.dial(optsf, function (err, data) {
        if (err) {
          return reject(err);
        }
        resolve(data);
      });
    });
  } else {
    this.modem.dial(optsf, function (err, data) {
      callback(err, data);
    });
  }
};

Firecracker.prototype.bootSource = function (data, callback) {
  var self = this;
  if (!callback && typeof opts === 'function') {
    callback = opts;
    opts = undefined;
  }

  var optsf = {
    path: '/boot-source',
    method: 'PUT',
    data: data,
    statusCodes: {
      204: true,
      400: 'Boot source cannot be created due to bad input'
    }
  };

  if (callback === undefined) {
    return new Promise(function (resolve, reject) {
      self.modem.dial(optsf, function (err, data) {
        if (err) {
          return reject(err);
        }
        resolve(data);
      });
    });
  } else {
    this.modem.dial(optsf, function (err, data) {
      callback(err, data);
    });
  }
};

Firecracker.prototype.mmds = function () {
  return new MMDS(this.modem);
};

Firecracker.prototype.drive = function (id) {
  return new Drive(this.modem, id);
};

Firecracker.prototype.interface = function (id) {
  return new Interface(this.modem, id);
};

Firecracker.prototype.machineConfig = function () {
  return new MachineConfig(this.modem);
};

Firecracker.prototype.logger = function (data, callback) {
  var self = this;
  if (!callback && typeof opts === 'function') {
    callback = opts;
    opts = undefined;
  }

  var optsf = {
    path: '/logger',
    method: 'PUT',
    data: data,
    statusCodes: {
      204: true,
      400: 'Logger cannot be initialized due to bad input.'
    }
  };

  if (callback === undefined) {
    return new Promise(function (resolve, reject) {
      self.modem.dial(optsf, function (err, data) {
        if (err) {
          return reject(err);
        }
        resolve(data);
      });
    });
  } else {
    this.modem.dial(optsf, function (err, data) {
      callback(err, data);
    });
  }
};

Firecracker.prototype.metrics = function (data, callback) {
  var self = this;
  if (!callback && typeof opts === 'function') {
    callback = opts;
    opts = undefined;
  }

  var optsf = {
    path: '/metrics',
    method: 'PUT',
    data: data,
    statusCodes: {
      204: true,
      400: 'Metrics system cannot be initialized due to bad input.'
    }
  };

  if (callback === undefined) {
    return new Promise(function (resolve, reject) {
      self.modem.dial(optsf, function (err, data) {
        if (err) {
          return reject(err);
        }
        resolve(data);
      });
    });
  } else {
    this.modem.dial(optsf, function (err, data) {
      callback(err, data);
    });
  }
};

Firecracker.prototype.vsock = function (data, callback) {
  var self = this;
  if (!callback && typeof opts === 'function') {
    callback = opts;
    opts = undefined;
  }

  var optsf = {
    path: '/vsock',
    method: 'PUT',
    data: data,
    statusCodes: {
      204: true,
      400: 'Vsock cannot be created due to bad input'
    }
  };

  if (callback === undefined) {
    return new Promise(function (resolve, reject) {
      self.modem.dial(optsf, function (err, data) {
        if (err) {
          return reject(err);
        }
        resolve(data);
      });
    });
  } else {
    this.modem.dial(optsf, function (err, data) {
      callback(err, data);
    });
  }
};

Firecracker.prototype.downloadImage = function (url, dest) {
  const uri = new URL(url);
  var proto = http;
  if (uri.protocol === 'https:') {
    proto = https;
  }

  //var filename = path.posix.basename(uri.pathname);
  //dest = dest + path.delimiter + filename;

  return new Promise((resolve, reject) => {
    if (fs.existsSync(dest)) {
      return reject('File already exists');
    }

    let file = fs.createWriteStream(dest, { flags: 'wx' });

    file.on('finish', () => {
      resolve();
    });

    file.on('error', err => {
      file.close();
      fs.unlink(dest, () => { });
      reject(err.message);
    });

    const request = proto.get(url, response => {
      if (response.statusCode === 200) {
        response.pipe(file);
      } else {
        file.close();
        fs.unlink(dest, () => { });
        reject(`Server responded with ${response.statusCode}: ${response.statusMessage}`);
      }
    });

    request.on('error', err => {
      file.close();
      fs.unlink(dest, () => { });
      reject(err.message);
    });
  });
};

Firecracker.prototype.spawn = function (binPath) {
  var self = this;
  binPath = binPath || '/usr/bin/firecracker';

  this.child = child_process.spawn(binPath, ['--api-sock', this.options.socketPath]);

  this.child.on('exit', function (code, signal) {
    fs.unlink(self.options.socketPath, () => { });
    self.child = undefined;
  });

  this.child.on('error', function (err) {
    fs.unlink(self.options.socketPath, () => { });
  });

  return {
    'stdout': self.child.stdout,
    'stderr': self.child.stderr
  };
};

Firecracker.prototype.kill = function () {
  if (this.child) {
    this.child.kill();
  }
};

module.exports = Firecracker;