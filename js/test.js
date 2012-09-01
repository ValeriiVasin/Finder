module('Extend function');
test('Correctness of extending', function () {
    var a = {hello: 'world'},
        b = {world: 'hello'},
        obj = __extend(a, b);

    deepEqual(obj, { hello: 'world', world: 'hello' }, 'Objects should be the same in value');
});

module('Options assignment');
test('Assign options as part of constructor', function () {
    var finder;

    finder = new Finder();
    deepEqual(finder._options, {multi: false, translit: false, ignorecase: false, strict: false}, 'Default options should be correct');

    finder = new Finder({multi: true});
    deepEqual(finder._options, {multi: true, translit: false, ignorecase: false, strict: false}, 'Options could be provided as single option of the constructor');

    finder = new Finder('Дискотека', {translit: true});
    deepEqual(finder._options, {multi: false, translit: true, ignorecase: false, strict: false}, 'Options could be provided as second argument');
});
test('option() method', function () {
    var finder;

    finder = new Finder();
    finder.option('ignorecase', true);
    ok(finder._options.ignorecase, true, 'Option should be changed');

    throws(function () { finder.option('ignorecase'); }, 'Option value should be provided');
});
test('options() method', function () {
    var finder;

    finder = new Finder();
    finder.options({ignorecase: true, multi: true});
    deepEqual(finder._options, {multi: true, translit: false, ignorecase: true, strict: false}, 'Options should be changed');

    throws(function () { finder.options(true); }, 'Options should be an object');
});

module('Source assignment');
test('Default source should be empty string', function () {
    var finder = new Finder();
    equal(finder._source, '');
});

// compilation
module('Compile', {
    setup: function () {
        window.finder = new Finder('авария');
    }
});
test('Implicit compilation while first testing', function () {
    ok(finder.test('Дискотека авария'));
});
test('After each options changes regexp should be recompiled automatically', function () {
    equal(finder.test('Дискотека Авария'), false);
    finder.option('ignorecase', true);
    ok(finder.test('Дискотека Авария'));
});

module('ingorecase', {
    setup: function () {
        window.finder = new Finder('авария', {ignorecase: true});
    }
});
test('ignore case', function () {
    ok( window.finder.test('Дискотека Авария - Заколебал ты'));
    ok( window.finder.test('АвАрИя'));
    equal(window.finder.test('Руки Вверх - Маленькие девочки'), false);

    window.finder.option('ignorecase', false);
    ok( window.finder.test('Дискотека авария - Заколебал ты') );
    equal( window.finder.test('Дискотека Авария'), false);
});

// strict mode
module('strict', {
    setup: function () {
        window.finder = new Finder('скова', {strict: true});
    }
});

test('strict mode', function () {
    ok(finder.test('Дискотека Авария'));
    finder.option('strict', false);
    equal(finder.test('Дискотека Авария'), false);
});
