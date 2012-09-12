module('Extend function');
test('Correctness of extending', function () {
    var a = {hello: 'world'},
        b = {world: 'hello'},
        obj = Finder.prototype.__extend(a, b);

    deepEqual(obj, { hello: 'world', world: 'hello' }, 'Objects should be the same in value');
});

module('Options assignment');
test('Assign options as part of constructor', function () {
    var finder;

    finder = new Finder();
    deepEqual(finder._options, {multi: false, translit: false, ignorecase: false, strict: true, smart: false}, 'Default options should be correct');

    finder = new Finder({multi: true});
    deepEqual(finder._options, {multi: true, translit: false, ignorecase: false, strict: true, smart: false}, 'Options could be provided as single option of the constructor');

    finder = new Finder('Дискотека', {translit: true});
    deepEqual(finder._options, {multi: false, translit: true, ignorecase: false, strict: true, smart: false}, 'Options could be provided as second argument');
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
    deepEqual(finder._options, {multi: true, translit: false, ignorecase: true, strict: true, smart: false}, 'Options should be changed');

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
    equal(finder.test('Дискотека Авария'), false);
    finder.option('strict', false);
    ok(finder.test('Дискотека Авария'));
});

// multi mode
module('multi', {
    setup: function () {
        window.finder = new Finder('Lbcrjntrf', {multi: true});
    }
});
test('multi mode', function () {
    ok(finder.test('Дискотека авария'));
    finder.option('multi', false);
    equal(finder.test('Дискотека авария'), false);
});

// translit mode
module('translit', {
    setup: function () {
        window.finder = new Finder('авария', {translit: true});
    }
});
test('translit mode', function () {
    ok(finder.test('Diskoteka avarija'));
    ok(finder.test('Дискотека авария'));
    finder.option('translit', false);
    equal(finder.test('Diskoteka avarija'), false);
});

module('smart', {
    setup: function () {
        window.finder = new Finder('[jkkb', { translit: true, ignorecase: true, multi: true });
    }
});
test('smart mode', function () {
    ok(finder.test('Holly Dolly') === false);
    finder.option('smart', true);
    ok(finder.test('Holly Dolly'));
});

module('Options conjunction');
test('ignorecase + translit', function () {
    var finder = new Finder('скорпионс');
    ok(finder.test('Scorpions – Wind of change') === false);
    finder.options({ ignorecase: true, translit: true });
    ok(finder.test('Scorpions – Wind of change') === true);
});
test('ignorecase + multi', function () {
    var finder = new Finder('ысщкзшщты');
    ok(finder.test('Scorpions – Wind of change') === false);
    finder.options({ multi: true, ignorecase: true });
    ok(finder.test('Scorpions – Wind of change') === true);
});
test('ignorecase + strict', function () {
    var finder = new Finder('wind change');
    equal(finder.test('Scorpions – Wind of change'), false);
    finder.options({ ignorecase: true, strict: false });
    equal(finder.test('Scorpions – Wind of change'), true);
    finder.options({ ignorecase: true, strict: true });
    equal(finder.test('Scorpions – Wind of change'), false);
});
