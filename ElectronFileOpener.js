const electron = require('electron');

/**
 * ElectronFileOpener
 * 
 * @abstract
 */
module.exports = (function() {

    /**
     * __callback
     * 
     * @access  private
     * @var     Function (default: null)
     */
    var __callback = null;

    /**
     * __callbackDelay
     * 
     * This is important because files don't trigger the open-file event at the
     * exact same moment. So need to delay the callback so there's time to
     * collect all the files that may have been "opened".
     * 
     * @see     https://i.imgur.com/sPYVLab.png
     * @access  private
     * @var     Number (default: 250)
     */
    var __callbackDelay = 250;

    /**
     * __callbackTimeout
     * 
     * @access  private
     * @var     Number (default: null)
     */
    var __callbackTimeout = null;

    /**
     * __filePaths
     * 
     * @access  private
     * @var     Array (default: [])
     */
    var __filePaths = [];

    /**
     * __maxFiles
     * 
     * @access  private
     * @var     Number (default: 10)
     */
    var __maxFiles = 10;

    /**
     * __clone
     * 
     * @access  private
     * @param   Array arr
     * @return  Array
     */
    var __clone = function(arr) {
        return arr.slice(0);
    };

    /**
     * __listenForLaunchingEvent
     * 
     * @access  private
     * @return  Promise
     */
    var __listenForLaunchingEvent = function() {
        return new Promise(function(resolve, reject) {
            electron.app.on(
                'will-finish-launching',
                function() {
                    resolve();
                }
            );
        });
    };

    /**
     * __listenForOpenFileEvents
     * 
     * @access  private
     * @return  void
     */
    var __listenForOpenFileEvents = function() {
        electron.app.on(
            'open-file',
            function(event, filePath) {
                event.preventDefault();
                clearTimeout(__callbackTimeout);
                if (electron.app.isReady() === false) {
                    electron.app.on(
                        'ready',
                        function() {
                            __trackFilePath(filePath);
                        }
                    );
                } else {
                    __trackFilePath(filePath);
                }
            }
        );
    };

    /**
     * __setOptions
     * 
     * @access  private
     * @param   undefined|Object options
     * @return  void
     */
    var __setOptions = function(options) {
        if (options !== undefined) {
            if (options.maxFiles !== undefined) {
                __maxFiles = options.maxFiles;
            }
        }
    };

    /**
     * __trackFilePath
     * 
     * @access  private
     * @param   String filePath
     * @return  void
     */
    var __trackFilePath = function(filePath) {
        __filePaths.push(filePath);
        __callbackTimeout = setTimeout(
            function() {
                var filePaths = __clone(__filePaths);
                filePaths = filePaths.slice(0, __maxFiles);
                __callback(filePaths);
                __filePaths = [];
            },
            __callbackDelay
        );
    };

    // Public
    return {

        /**
         * init
         * 
         * @access  public
         * @param   Function callback
         * @return  void
         */
        init: function(callback, options) {
            __callback = callback;
            __setOptions(options);
            __listenForLaunchingEvent().then(function() {
                __listenForOpenFileEvents();
            });
        }
    };
})();
