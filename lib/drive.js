var Drive = function(drive_id) {
  this.id = drive_id;
};


Drive.prototype.updatePreboot = function (data, callback) {
  var self = this;
  if (!callback && typeof opts === 'function') {
    callback = opts;
    opts = undefined;
  }

  var optsf = {
    path: '/drives/' + this.id,
    method: 'PUT',
    data: data,
    statusCodes: {
      204: true,
      400: 'Drive cannot be created/updated due to bad input'
    }
  };

  if (callback === undefined) {
    return new this.Promise(function (resolve, reject) {
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

Drive.prototype.createPreboot = function(data, callback) {
  return this.updatePreboot.apply(this, [data, callback]);
}

Drive.prototype.updatePostboot = function (data, callback) {
  var self = this;
  if (!callback && typeof opts === 'function') {
    callback = opts;
    opts = undefined;
  }

  var optsf = {
    path: '/drives/' + this.id,
    method: 'PATCH',
    data: data,
    statusCodes: {
      204: true,
      400: 'Drive cannot be updated due to bad input'
    }
  };

  if (callback === undefined) {
    return new this.Promise(function (resolve, reject) {
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

module.exports = Drive