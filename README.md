# ElectronFileOpener
Provides a helper class for dealing with the `open-file` event within Electron apps.

Was helpful to have this decoupled from general app logic because when a user drags more than 1 file, or right-clicks on more than 1 file, the event handler `open-file` gets fired multiple times in isolation.


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
