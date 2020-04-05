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