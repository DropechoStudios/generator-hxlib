'use strict';
var yeoman = require('yeoman-generator');
var path = require('path');

module.exports = yeoman.generators.Base.extend({
    init: function init() {
        this.on('end', function() {
            this.installDependencies({
                bower: false
            });
        });
    },

    askFor: function askFor() {
        var _self = this,
            done = _self.async();

        var prompts = [{
            type: 'input',
            name: 'username',
            message: 'What is your haxelib/npm/github username?'
        }, {
            type: 'input',
            name: 'name',
            message: 'What is the name of your library?'
        }];

        _self.prompt(prompts, function(props) {
            _self._.each(prompts, function(prompt) {
                _self[prompt.name] = props[prompt.name];
            });

            done();
        });
    },

    config: function config() {
        this.libClass = this._.classify(this.name);
    },

    src: function src() {
        var name = this.name;

        this._templateDirectory('base', '.');
        this.mkdir('src');
        this.mkdir('src/' + this.libClass);
        this.template('src/_lib.hx', 'src/' + this.libClass + '/' + this.libClass + '.hx');
    },

    _templateDirectory: function _templateDirectory(source, destination) {
        destination = destination || source;
        var root = this.isPathAbsolute(source) ? source : path.join(this.sourceRoot(), source);
        var files = this.expandFiles('**', {
            dot: true,
            cwd: root
        });

        for (var i = 0; i < files.length; i++) {
            var f = files[i];
            var src = path.join(root, f);
            if (path.basename(f).indexOf('_') == 0) {
                var dest = path.join(destination, path.dirname(f), path.basename(f).replace(/^_/, ''));
                this.template(src, dest);
            } else {
                var dest = path.join(destination, f);
                this.copy(src, dest);
            }
        }
    }
});
