'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Created by ravi.hamsa on 6/28/16.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _fetch = require('./fetch');

var _fetch2 = _interopRequireDefault(_fetch);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DataLoader = function () {
    function DataLoader() {
        _classCallCheck(this, DataLoader);

        this._resourceConfigIndex = {};

        this._commonHeaders = { 'X-Requested-With': 'XMLHttpRequest' };
        this._sessionHeaders = {};
        this._requestQue = {};
        this._dataCache = {};
        this._middlewares = {};

        this._responseParser = function (resp) {
            return {
                data: resp,
                errors: null,
                warnings: null
            };
        };
    }

    _createClass(DataLoader, [{
        key: 'getRequestConfig',
        value: function getRequestConfig(requestId, propKey, propDependency) {
            return {
                requestId: requestId,
                propKey: propKey,
                propDependency: propDependency
            };
        }
    }, {
        key: 'setResponseParser',
        value: function setResponseParser(fun) {
            this._responseParser = fun;
        }
    }, {
        key: 'generateGetUrl',
        value: function generateGetUrl(url, data) {
            if (!data) {
                return url;
            }
            _lodash2.default.each(data, function (value, index) {
                url = url.replace(':' + index, value);
            });

            return url;
        }
    }, {
        key: 'addResource',
        value: function addResource(requestId, config) {
            config = _lodash2.default.defaults(config, { cache: 'session', queue: 'queue', method: 'get' });
            this._resourceConfigIndex[requestId] = config;
        }
    }, {
        key: 'setCommonHeaders',
        value: function setCommonHeaders(headers) {
            this._commonHeaders = _lodash2.default.extend({}, this._commonHeaders, headers);
        }
    }, {
        key: 'clearSessionHeaders',
        value: function clearSessionHeaders() {
            this._sessionHeaders = {};
        }
    }, {
        key: 'setSessionHeaders',
        value: function setSessionHeaders(headers) {
            this._sessionHeaders = _lodash2.default.extend({}, this._sessionHeaders, headers);
        }
    }, {
        key: '_getStaticPromise',
        value: function _getStaticPromise(config) {
            return new _bluebird2.default(function (resolve, reject) {
                setTimeout(function () {
                    if (config.errors) {
                        reject(config.errors, config.warnings, { errors: config.errors });
                    } else {
                        resolve(config.data, config.warnings, { data: config.data });
                    }
                }, config.responseDelay || 100);
            });
        }
    }, {
        key: 'getStaticPromise',
        value: function getStaticPromise(config) {
            return this._getStaticPromise(config);
        }
    }, {
        key: '_getCachedDataPromise',
        value: function _getCachedDataPromise(requestHash) {
            var cachedData = this._dataCache[requestHash];
            if (cachedData) {
                return new _bluebird2.default(function (resolve, reject) {
                    resolve(cachedData.data, cachedData.warnings);
                });
            }
        }
    }, {
        key: '_getQueuedPromise',
        value: function _getQueuedPromise(requestHash) {
            var promise = this._requestQue[requestHash];
            if (promise) {
                return promise;
            }
        }
    }, {
        key: '_executeBeforeMiddleWares',
        value: function _executeBeforeMiddleWares(requestId, payload) {
            var self = this;
            for (var i in self._middlewares) {
                var middleware = self._middlewares[i];
                if (middleware.before) {
                    payload = middleware.before.call(null, requestId, payload);
                }
            }
            return payload;
        }
    }, {
        key: '_executeAfterMiddleWares',
        value: function _executeAfterMiddleWares(requestId, response) {
            var self = this;
            for (var i in self._middlewares) {
                var middleware = self._middlewares[i];
                if (middleware.after) {
                    response = middleware.after.call(null, requestId, response);
                }
            }
            return response;
        }
    }, {
        key: '_getFetchPromise',
        value: function _getFetchPromise(config, payload, requestId, requestHash) {
            var self = this;
            var url = config.url,
                method = config.method,
                queue = config.queue,
                cache = config.cache,
                paramParser = config.paramParser;

            method = method.toLowerCase();

            payload = this._executeBeforeMiddleWares(requestId, payload);

            var payLoadToServer = payload;
            if (paramParser) {
                payLoadToServer = paramParser(payload);
            }

            if (typeof url === 'function') {
                url = url(payload, payLoadToServer);
            }
            var requestConfig = {
                method: method,
                headers: Object.assign({}, self._commonHeaders, self._sessionHeaders),
                credentials: 'include'
            };

            requestConfig.method = requestConfig.method.toUpperCase();

            url = self.generateGetUrl(url, payLoadToServer);
            if (method === 'post' || method === 'put' || method === 'patch') {
                requestConfig.body = JSON.stringify(payLoadToServer);
            } else if (method === 'form_post') {
                var data = new FormData();
                console.log(payLoadToServer);
                for (var i in payLoadToServer) {
                    data.append(i, payLoadToServer[i]);
                }
                requestConfig.body = data;
                requestConfig.method = 'POST';
                delete requestConfig.headers['Content-Type'];
            }

            return new _bluebird2.default(function (resolve, reject) {
                var fetchPromise = (0, _fetch2.default)(url, requestConfig);
                fetchPromise.then(function (response) {
                    if (!response.ok) {
                        try {
                            return response.json();
                        } catch (e) {
                            throw new Error(response.statusText);
                        }
                    }
                    return response;
                }).then(function (response) {
                    return response.json();
                }).then(function (body) {
                    var parsedResponse = self._responseParser(body);
                    parsedResponse = self._executeAfterMiddleWares(requestId, parsedResponse);
                    if (parsedResponse.data) {
                        if (config.parser) {
                            parsedResponse.data = config.parser(parsedResponse.data);
                        }
                        if (cache !== 'none') {
                            self._dataCache[requestHash] = _extends({}, parsedResponse, { body: body });
                        }
                        resolve(parsedResponse.data, parsedResponse.warnings, body);
                    } else {
                        reject(parsedResponse.errors, parsedResponse.warnings, body);
                    }
                }).catch(function (ex) {
                    reject([{ type: 'error', message: ex.message }], null, ex);
                });
            });
        }
    }, {
        key: 'getRequestDef',
        value: function getRequestDef(requestId, payload) {
            var config = this._resourceConfigIndex[requestId];
            var self = this;

            switch (config.type) {
                case 'static':
                    return self._getStaticPromise(config);
                    break;

                case 'url':
                    var url = config.url,
                        method = config.method,
                        queue = config.queue,
                        cache = config.cache,
                        paramParser = config.paramParser;

                    method = method.toLowerCase();
                    var payLoadToServer = payload;
                    if (paramParser) {
                        payLoadToServer = paramParser(payload);
                    }
                    var requestHash = requestId + JSON.stringify(payLoadToServer);
                    var cachedDataPromise = this._getCachedDataPromise(requestHash);
                    if (cachedDataPromise) {
                        return cachedDataPromise;
                    }
                    var queuePromise = this._getQueuedPromise(requestHash);
                    if (queuePromise) {
                        return queuePromise;
                    }

                    var fetchPromise = this._getFetchPromise(config, payload, requestId, requestHash);
                    if (queue !== 'none') {
                        self._requestQue[requestHash] = fetchPromise;
                        fetchPromise.finally(function () {
                            delete self._requestQue[requestHash];
                        });
                    }
                    return fetchPromise;
                    break;
            }
        }
    }, {
        key: 'addMiddleWare',
        value: function addMiddleWare(id, paramParser, responseParser) {
            if (this._middlewares[id] !== undefined) {
                throw new Error('Middleware by ' + id + ' already exist');
            }
            this._middlewares[id] = {
                before: paramParser,
                after: responseParser
            };
        }
    }, {
        key: 'removeMiddleWare',
        value: function removeMiddleWare(id) {
            delete this._middlewares[id];
        }
    }]);

    return DataLoader;
}();

var instance = new DataLoader();

exports.default = instance;