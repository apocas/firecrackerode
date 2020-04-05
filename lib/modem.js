var http = require('http'),
  debug = require('debug')('modem'),
  util = require('util');


var Modem = function (options) {
  this.socketPath = options.socketPath;
  this.timeout = options.timeout;
  this.connectionTimeout = options.connectionTimeout;
  this.headers = options.headers || {};
};

Modem.prototype.dial = function (options, callback) {
  var data;
  var self = this;

  var optionsf = {
    path: options.path,
    method: options.method,
    headers: options.headers || Object.assign({}, self.headers),
  };

  optionsf.headers['Content-Type'] = 'application/json';

  if (options.data) {
    data = JSON.stringify(options.data);
    optionsf.headers['Content-Length'] = Buffer.byteLength(data);
  }

  optionsf.socketPath = this.socketPath;

  this.buildRequest(optionsf, options, data, callback);
};

Modem.prototype.buildRequest = function (options, context, data, callback) {
  var self = this;
  var connectionTimeoutTimer;

  var req = http.request(options, function () { });

  debug('Sending: %s', util.inspect(options, {
    showHidden: true,
    depth: null
  }));

  if (self.connectionTimeout) {
    connectionTimeoutTimer = setTimeout(function () {
      debug('Connection Timeout of %s ms exceeded', self.connectionTimeout);
      req.abort();
    }, self.connectionTimeout);
  }

  if (self.timeout) {
    req.on('socket', function (socket) {
      socket.setTimeout(self.timeout);
      socket.on('timeout', function () {
        debug('Timeout of %s ms exceeded', self.timeout);
        req.abort();
      });
    });
  }

  req.on('connect', function () {
    clearTimeout(connectionTimeoutTimer);
  });

  req.on('disconnect', function () {
    clearTimeout(connectionTimeoutTimer);
  });

  req.on('response', function (res) {
    clearTimeout(connectionTimeoutTimer);
 
    var chunks = [];
    res.on('data', function (chunk) {
      chunks.push(chunk);
    });

    res.on('end', function () {
      var buffer = Buffer.concat(chunks);
      var result = buffer.toString();

      debug('Received: %s', result);

      var json;
      try {
        json = JSON.parse(result);
      } catch (e) {
        json = null;
      }
      self.buildPayload(null, context.statusCodes, res, json, callback);
    });
  });

  req.on('error', function (error) {
    clearTimeout(connectionTimeoutTimer);
    self.buildPayload(error, context.statusCodes, {}, null, callback);
  });

  req.write(data);
  req.end();
};

Modem.prototype.buildPayload = function (err, statusCodes, res, json, cb) {
  if (err) return cb(err, null);

  if (statusCodes[res.statusCode] !== true) {
    var msg = new Error(
      '(HTTP code ' + res.statusCode + ') ' +
      (statusCodes[res.statusCode] || 'unexpected') + ' - ' +
      (json.fault_message || json) + ' '
    );
    msg.reason = statusCodes[res.statusCode];
    msg.statusCode = res.statusCode;
    msg.json = json;
    cb(msg, null);
  } else {
    cb(null, json);
  }
};


module.exports = Modem;
