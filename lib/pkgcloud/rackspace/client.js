/*
 * client.js: Base client from which all Rackspace clients inherit from
 *
 * (C) 2011 Charlie Robbins, Ken Perkins, Ross Kukulinski & the Contributors.
 *
 */

var util = require('util'),
    identity = require('./identity'),
    base = require('../openstack/client'),
    _ = require('lodash');

var Client = exports.Client = function (options) {
  options = options || {};
  options.authUrl = options.authUrl || 'https://identity.api.rackspacecloud.com';

  options.identity = identity.Identity;

  if (typeof options.useServiceCatalog === 'undefined') {
    options.useServiceCatalog = true;
  }

  base.Client.call(this, options);

  this.provider = 'rackspace';
};

util.inherits(Client, base.Client);

Client.prototype._getIdentityOptions = function() {
  return _.extend({
    apiKey: this.config.apiKey
  }, Client.super_.prototype._getIdentityOptions.call(this));
};

/*

https://developer.rackspace.com/docs/cloud-identity/v2/getting-started/authenticate/#send-an-authentication-request
returns a user token as well the the services that are avaliable to an account,
and which regions those services are avaliable in.

*/

Client.prototype.getToken = function (callback) {
    var options = {
      uri: this.config.authUrl+'/v2.0/tokens',
      method: 'POST',
      body: {
          auth : {
              "RAX-KSKEY:apiKeyCredentials": {
                  "username":this.config.username,
                  "apiKey":this.config.apiKey
              }
          }
      }
    };

    this._request(options, callback);
}
