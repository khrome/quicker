(function (root, factory) {
    if (typeof define === 'function' && define.amd){
        define(['fs', 'node-dir', 'extended-emitter', 'async-arrays', 'exec', 'osx-quicklook'], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory(require('fs'), require('node-dir'), require('extended-emitter'), require('async-arrays'), require('child_process').exec, require('osx-quicklook'));
    } else {
        root.comicViewer = factory(root.fileSystem, root.nodeDir, root.Emitter, root.AsyncArrays, root.exec, root.OSXQuicklook);
    }
}(this, function (fs, dir, Emitter, arrays, exec, quicklook) {
    function Viewer(options){
        this.options = options || {};
        //todo: make this 'native' option
    }
    Viewer.prototype.display = function(dir, pages, cb){
        switch(process.platform){
            case 'darwin':
                quicklook(pages, {
                    directory:dir, 
                    fullscreen:this.options.fullscreen,
                    interval:this.options.interval
                }, function(){
                    if(cb) cb();
                });
                break;
            default : throw new Exception('Unsupported platform: '+process.platform+"\n Currently only supported on OS X.");
        }
    };
    Viewer.prototype.read = function(book, cb){
        var viewer = this;
         viewer.listPages(book, function(err, dir, pages){
             viewer.display(dir, pages, function(){
                 if(cb) cb();
             });
        });
    };
    Viewer.prototype.listPages = function(book, cb){
        var root = this.options.directory || process.cwd();
         dir.files(root?(root+'/'+book):book, function(err, files) {
             if (err) throw err;
             files = files.filter(function(file){
                 return file[0] !== '.';
             }).map(function(file){
                 return root?file.substring(root.length):file;
             });
             return cb(undefined, root, files);
        });
    };
    Viewer.prototype.listBooks = function(cb){
         fs.readdir(this.options.directory, function(err, files){
             if(err) return cb(err);
             files = files.filter(function(file){
                 return file[0] !== '.';
             });
             return cb(undefined, files);
         });
    };
    return Viewer;
}));