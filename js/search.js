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

Finder.prototype.translitHash = {
    // Russian
    'а': 'a',   'А': 'A',
    'б': 'b',   'Б': 'B',
    'в': 'v',   'В': 'V',
    'г': 'g',   'Г': 'G',
    'д': 'd',   'Д': 'D',
    'е': 'e',   'Е': 'E',
    'ё': 'jo',  'Ё': 'Jo',
    'ж': 'zh',  'Ж': 'Zh',
    'з': 'z',   'З': 'Z',
    'и': 'i',   'И': 'I',
    'й': 'j',   'Й': 'J',
    'к': 'k',   'К': 'K',
    'л': 'l',   'Л': 'L',
    'м': 'm',   'М': 'M',
    'н': 'n',   'Н': 'N',
    'о': 'o',   'О': 'O',
    'п': 'p',   'П': 'P',
    'р': 'r',   'Р': 'R',
    'с': 's',   'С': 'S',
    'т': 't',   'Т': 'T',
    'у': 'u',   'У': 'U',
    'ф': 'f',   'Ф': 'F',
    'х': 'h',   'Х': 'H',
    'ц': 'c',   'Ц': 'C',
    'ч': 'ch',  'Ч': 'Ch',
    'ш': 'sh',  'Ш': 'Sh',
    'щ': 'w',   'Щ': 'W',
    'ъ': '#',   'Ъ': '#',
    'ы': 'i',   'Ы': 'I',
    'ь': "'",   'Ь': "'",
    'э': 'e',   'Э': 'E',
    'ю': 'ju',  'Ю': 'Ju',
    'я': 'ja',  'Я': 'Ja',
    // English
    'a': 'а',   'A': 'А',
    'b': 'б',   'B': 'Б',
    'c': 'с',   'C': 'С',
    'd': 'д',   'D': 'Д',
    'e': 'е',   'E': 'Е',
    'f': 'ф',   'F': 'Ф',
    'g': 'г',   'G': 'Г',
    'h': 'х',   'H': 'Х',
    'i': 'и',   'I': 'И',
    'j': 'ж',   'J': 'Ж',
    'k': 'к',   'K': 'К',
    'l': 'л',   'L': 'Л',
    'm': 'м',   'M': 'М',
    'n': 'н',   'N': 'Н',
    'o': 'о',   'O': 'О',
    'p': 'п',   'P': 'П',
    'q': 'к',   'Q': 'К',
    'r': 'р',   'R': 'Р',
    's': 'с',   'S': 'С',
    't': 'т',   'T': 'Т',
    'u': 'у',   'U': 'У',
    'v': 'в',   'V': 'В',
    'w': 'в',   'W': 'В',
    'x': 'х',   'X': 'Х',
    'y': 'и',   'Y': 'И',
    'z': 'з',   'Z': 'З'
};

Finder.prototype.multiHash = {
    // Russian
    'а': 'f',   'А': 'F',
    'б': ',',   'Б': '\<',
    'в': 'd',   'В': 'D',
    'г': 'u',   'Г': 'U',
    'д': 'l',   'Д': 'L',
    'е': 't',   'Е': 'T',
    'ё': '\~',  'Ё': '\~',
    'ж': ';',   'Ж': '\:',
    'з': 'p',   'З': 'P',
    'и': 'b',   'И': 'B',
    'й': 'q',   'Й': 'Q',
    'к': 'r',   'К': 'R',
    'л': 'k',   'Л': 'K',
    'м': 'v',   'М': 'V',
    'н': 'y',   'Н': 'Y',
    'о': 'j',   'О': 'J',
    'п': 'g',   'П': 'G',
    'р': 'h',   'Р': 'H',
    'с': 'c',   'С': 'C',
    'т': 'n',   'Т': 'N',
    'у': 'e',   'У': 'E',
    'ф': 'a',   'Ф': 'A',
    'х': '\]',  'Х': '\{',
    'ц': 'w',   'Ц': 'W',
    'ч': 'x',   'Ч': 'X',
    'ш': 'i',   'Ш': 'I',
    'щ': 'o',   'Щ': 'O',
    'ъ': '\]',  'Ъ': '\}',
    'ы': 's',   'Ы': 'S',
    'ь': 'm',   'Ь': "M",
    'э': '\'',  'Э': '\"',
    'ю': '\.',  'Ю': '\>',
    'я': 'z',   'Я': 'Z',
    // English
    'a': 'ф',   'A': 'Ф',
    'b': 'и',   'B': 'И',
    'c': 'с',   'C': 'С',
    'd': 'в',   'D': 'В',
    'e': 'у',   'E': 'У',
    'f': 'а',   'F': 'А',
    'g': 'п',   'G': 'П',
    'h': 'р',   'H': 'Р',
    'i': 'ш',   'I': 'Ш',
    'j': 'о',   'J': 'О',
    'k': 'л',   'K': 'Л',
    'l': 'д',   'L': 'Д',
    'm': 'ь',   'M': 'Ь',
    'n': 'т',   'N': 'Т',
    'o': 'щ',   'O': 'Щ',
    'p': 'з',   'P': 'З',
    'q': 'й',   'Q': 'Й',
    'r': 'к',   'R': 'К',
    's': 'ы',   'S': 'Ы',
    't': 'е',   'T': 'Е',
    'u': 'г',   'U': 'Г',
    'v': 'м',   'V': 'М',
    'w': 'ц',   'W': 'Ц',
    'x': 'ч',   'X': 'Ч',
    'y': 'н',   'Y': 'Н',
    'z': 'я',   'Z': 'Я'
};
