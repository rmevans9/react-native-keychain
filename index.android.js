/**
 * @providesModule Keychain
 */
'use strict';

var { NativeModules } = require('react-native');
var RNKeychainManager = NativeModules.RNKeychainManager;

var Keychain = {
  /**
   * Saves the `username` and `password` combination for `server`
   * and calls `callback` with an `Error` if there is any.
   * Returns a `Promise` object.
   */
  setInternetCredentials: function(
    server: string,
    username: string,
    password: string,
    callback?: ?(error: ?Error) => void
  ): Promise {
    return new Promise((resolve, reject) => {
      RNKeychainManager.setInternetCredentialsForServer(server, username, password, function(err) {
        callback && callback((err && convertError(err)) || null);
        if (err) {
          reject(convertError(err));
        } else {
          resolve();
        }
      });
    });
  },

  /**
   * Fetches login combination for `server` as an object with the format `{ username, password }`
   * and passes the result to `callback`, along with an `Error` if there is any.
   * Returns a `Promise` object.
   */
  getInternetCredentials: function(
    server: string,
    callback?: ?(error: ?Error, result: ?string) => void
  ): Promise {
    return new Promise((resolve, reject) => {
      RNKeychainManager.getInternetCredentialsForServer(server, function(err, username, password) {
        err = convertError(err);
        if(!err && arguments.length === 1) {
          err = new Error('No keychain entry found for server "' + server + '"');
        }
        callback && callback((err && convertError(err)) || null, username, password);
        if (err) {
          reject(convertError(err));
        } else {
          resolve({ username, password });
        }
      });
    });
  },

  /**
   * Deletes all internet password keychain entries for `server` and calls `callback` with an
   * `Error` if there is any.
   * Returns a `Promise` object.
   */
  resetInternetCredentials: function(
    server: string,
    callback?: ?(error: ?Error) => void
  ): Promise {
    return new Promise((resolve, reject) => {
      RNKeychainManager.resetInternetCredentialsForServer(server, function(err) {
        callback && callback((err && convertError(err)) || null);
        if (err) {
          reject(convertError(err));
        } else {
          resolve();
        }
      });
    });
  },

  /**
   * Saves the `username` and `password` combination for `service` (defaults to `bundleId`)
   * and calls `callback` with an `Error` if there is any.
   * Returns a `Promise` object.
   */
  setGenericPassword: function(
    username: string,
    password: string,
    service?: string,
    callback?: ?(error: ?Error) => void
  ): Promise {
    return new Promise((resolve, reject) => {
      RNKeychainManager.protect('generic-' + (service ? service : 'default'), JSON.stringify({username: username, password: password}));
      resolve();
    });
  },

  /**
   * Fetches login combination for `service` (defaults to `bundleId`) as an object with the format
   * `{ username, password }` and passes the result to `callback`, along with an `Error` if
   * there is any.
   * Returns a `Promise` object.
   */
  getGenericPassword: function(
    service?: string,
    callback?: ?(error: ?Error, result: ?string) => void
  ): Promise {
    return new Promise((resolve, reject) => {
      RNKeychainManager.unprotect('generic-' + (service ? service : 'default'), function(data) {
        var realData =  JSON.parse(data);

        if (realData !== null) {
          var username = realData.username;
          var password = realData.password;

          resolve({ username, password });
        }
        else {
          reject('No data found');
        }
      });
    });
  },

  /**
   * Deletes all generic password keychain entries for `service` (defaults to `bundleId`) and calls
   * `callback` with an `Error` if there is any.
   * Returns a `Promise` object.
   */
  resetGenericPassword: function(
    service?: string,
    callback?: ?(error: ?Error) => void
  ): Promise {
    return new Promise((resolve, reject) => {
      RNKeychainManager.remove('generic-' + (service ? service : 'default'));
      resolve();
    });
  },

};

function convertError(err) {
  if (!err) {
    return null;
  }
  var out = new Error(err.message);
  out.key = err.key;
  return out;
}

module.exports = Keychain;
