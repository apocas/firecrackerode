var Modem = require('./modem'),
  Drive = require('./drive'),
  Interface = require('./interface'),
  MMDS = require('./mmds');

var Firecracker = function (opts) {
  this.modem = new Modem(opts);
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

Firecracker.prototype.machineConfig = {
  'get': function (callback) {
    var self = this;
    if (!callback && typeof opts === 'function') {
      callback = opts;
      opts = undefined;
    }

    var optsf = {
      path: '/machine-config',
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
  },
  'update': function (data, callback) {
    var self = this;
    if (!callback && typeof opts === 'function') {
      callback = opts;
      opts = undefined;
    }

    var optsf = {
      path: '/machine-config',
      method: 'PUT',
      data: data,
      statusCodes: {
        204: true,
        400: 'Machine Configuration cannot be updated due to bad input'
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
  }
}

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

module.exports = Firecracker;