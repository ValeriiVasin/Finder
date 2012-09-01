/**
 * Extend a from b
 * @param  {Object} a Extensible object
 * @param  {Object} b Some object
 * @return {Object}   Object a with updated properties from b
 */
var __extend = function (a, b) {
    var slice = Array.prototype.slice,
        key;
    for (key in b) {
        if (b.hasOwnProperty(key)) {
            a[key] = b[key];
        }
    }

    return a;
};

var Finder = function (source, options) {
    "use strict";

    // compilation state: true, if regexp has been compiled before
    this._compiled = false;
    // cache that will contain all previously tested results
    this._cache = {};
    // compiled regular expressions for current source
    this._regexps = [];
    // options hash with default value
    this._options = {
        // usual search, no github-like
        strict: false,
        // case insensetive
        ignorecase: false,
        // support transliteration en <=> ru
        translit: false,
        // no matter what keyboard is active
        multi: false
    };

    // check initial arguments
    if (source && typeof source === 'object') {
        options = source;
        source = '';
    }

    this._source = source ? source : '';

    if (options) {
        __extend(this._options, options);
    }

};

/**
 * Get current search source
 * @return {String} Search string
 */
Finder.prototype.source = function () {
    return this._source;
};

/**
 * Set option value
 * @param  {String} option Option name
 * @param  {String} value  Option value
 * @return {Object}        Current object
 */
Finder.prototype.option = function (option, value) {
    if (value === undefined) {
        throw new Error('Option value should be provided');
    }
    this._options[option] = value;
    this.compile();
    return this;
};

/**
 * Set options
 * @param  {Object} options Hash with options
 * @return {Object}         Current object
 */
Finder.prototype.options = function (options) {
    if (typeof options !== 'object') {
        throw new Error('Options should be an object');
    }
    __extend(this._options, options);
    this.compile();
    return this;
};

Finder.prototype.compile = function (source, options) {
    var parsedSource = null,
        joinSymbol = '';

    // check initial arguments
    if (typeof source === 'object') {
        options = source;
        source = null;
    }

    if (source) {
        this._source = source;
    }

    if (options) {
        __extend(this._options, options);
    }

    // compilation
    parsedSource = this._source.split('');

    if (this._options.strict) {
        joinSymbol = '.*';
    }

    this._regexp = new RegExp(parsedSource.join(joinSymbol), this._options.ignorecase ? 'i' : '');
    this._compiled = true;
    return this;
};

Finder.prototype.test = function (value) {
    // compile regexp if it's not compiled
    if (!this._compiled) {
        this.compile();
    }
    return value === '' ? false : this._regexp.test(value);
};
