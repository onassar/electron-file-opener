# ElectronFileOpener
Provides a helper class for dealing with the 'open-file' event within Electron apps

## Sample Usage:
``` javascript
var ElectronFileOpener = require('./vendors/ElectronFileOpener/ElectronFileOpener.js'),
    options = {
        maxFiles: 5
    };
ElectronFileOpener.init(function(filePaths) {
    console.log(filePaths);
}, options);
```
