var React     = require('react/addons'),
    TestUtils = React.addons.TestUtils,
    fs        = require('fs'),
    vm        = require('vm'),
    path      = require('path'),
    svgrt     = require('..');


// file: test/setup.js
var jsdom = require('jsdom');

// A super simple DOM ready for React to render into
// Store this DOM and the window in global scope ready for React to access
global.document = jsdom.jsdom('<!doctype html><html><body></body></html>');
global.window = document.defaultView;
global.navigator = window.navigator;

var load = function (file, test, settings) {

    settings = settings || {};

    return function (done) {

        file = path.join(__dirname, 'svg', file);

        var ts     = settings ? svgrt(settings)(file) : svgrt(file),
            result = '';

        var svg  = fs.readFileSync(file, {
            encoding: 'utf8'
        });

        ts.on('data', function (data) {

            result += data;
        });

        ts.on('end', function () {

            var m = new module.constructor();
            m.paths = module.paths;
            m._compile(result, file + '.js');

            test(m.exports);
            done();
        });

        ts.write(svg);
        ts.end();
    };
};

describe('The app', function () {

    it('should work for svg template', load('some.svg', function (svg) {

        var component = React.createElement(svg),
            rendered  = TestUtils.renderIntoDocument(component),
            path      = TestUtils.findRenderedDOMComponentWithTag(rendered, 'path');

        (rendered.getDOMNode().tagName.toLowerCase()).should.equal('svg');
        (rendered.getDOMNode().querySelector('path').getAttribute('d')).should.equal('M0 0h100v100H0z');
    }));

    it('should work for svg template and pass parent props', load('some.svg', function (svg) {

        var component = React.createElement(svg, {
                className: 'foo'
            }),
            rendered  = TestUtils.renderIntoDocument(component),
            path      = TestUtils.findRenderedDOMComponentWithTag(rendered, 'path');

        (rendered.getDOMNode().tagName.toLowerCase()).should.equal('svg');
        (rendered.getDOMNode().querySelector('path').getAttribute('d')).should.equal('M0 0h100v100H0z');
        (rendered.getDOMNode().className).should.equal('foo');
    }));

    it('should work for icon template and pass parent props', load('some.svg', function (svg) {

        var component = React.createElement(svg, {
                className: 'foo'
            }),
            rendered  = TestUtils.renderIntoDocument(component),
            path      = TestUtils.findRenderedDOMComponentWithTag(rendered, 'path');

        (rendered.getDOMNode().tagName.toLowerCase()).should.equal('span');
        (rendered.getDOMNode().querySelector('path').getAttribute('d')).should.equal('M0 0h100v100H0z');
        (rendered.getDOMNode().className).should.equal('icon icon-some foo');

    }, {
        template: 'icon'
    }));

    it('should work for all template and pass parent props', load('some.svg', function (svg) {

        var component = React.createElement(svg, {
                className: 'foo',
                type     : 'icon'
            }),
            rendered  = TestUtils.renderIntoDocument(component),
            path      = TestUtils.findRenderedDOMComponentWithTag(rendered, 'path');

        (rendered.getDOMNode().tagName.toLowerCase()).should.equal('span');
        (rendered.getDOMNode().querySelector('path').getAttribute('d')).should.equal('M0 0h100v100H0z');
        (rendered.getDOMNode().className).should.equal('icon icon-some foo');

    }, {
        template: 'all'
    }));

    it('should work for icon template', load('some.svg', function (svg) {

        var component = React.createElement(svg),
            rendered  = TestUtils.renderIntoDocument(component),
            path      = TestUtils.findRenderedDOMComponentWithTag(rendered, 'path');

        (rendered.getDOMNode().tagName.toLowerCase()).should.equal('span');
        (rendered.getDOMNode().querySelector('path').getAttribute('d')).should.equal('M0 0h100v100H0z');
        (rendered.getDOMNode().className).should.equal('icon icon-some');

    }, {
        template: 'icon'
    }));

    it('should work for all template', load('some.svg', function (svg) {

        var component = React.createElement(svg),
            rendered  = TestUtils.renderIntoDocument(component),
            path      = TestUtils.findRenderedDOMComponentWithTag(rendered, 'path');

        (rendered.getDOMNode().tagName.toLowerCase()).should.equal('svg');
        (rendered.getDOMNode().querySelector('path').getAttribute('d')).should.equal('M0 0h100v100H0z');

    }, {
        template: 'all'
    }));

    it('should work for all template and icon as default type', load('some.svg', function (svg) {

        var component = React.createElement(svg),
            rendered  = TestUtils.renderIntoDocument(component),
            path      = TestUtils.findRenderedDOMComponentWithTag(rendered, 'path');

        (rendered.getDOMNode().tagName.toLowerCase()).should.equal('span');
        (rendered.getDOMNode().querySelector('path').getAttribute('d')).should.equal('M0 0h100v100H0z');
        (rendered.getDOMNode().className).should.equal('icon icon-some');

    }, {
        template: 'all',
        type    : 'icon'
    }));

    it('should work for all template and icon as default type but passing svg on props', load('some.svg', function (svg) {

        var component = React.createElement(svg, {
                type: 'svg'
            }),
            rendered  = TestUtils.renderIntoDocument(component),
            path      = TestUtils.findRenderedDOMComponentWithTag(rendered, 'path');

        (rendered.getDOMNode().tagName.toLowerCase()).should.equal('svg');
        (rendered.getDOMNode().querySelector('path').getAttribute('d')).should.equal('M0 0h100v100H0z');

    }, {
        template: 'all',
        type    : 'icon'
    }));
});