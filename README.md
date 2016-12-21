# babel-plugin-imports

[![npm version](https://badge.fury.io/js/babel-plugin-imports.svg)](http://badge.fury.io/js/babel-plugin-imports) [![license](https://img.shields.io/github/license/mashape/apistatus.svg?maxAge=2592000)]()

import { importedName as localName } from 'moduleName'; => import { importedName as localName2 } from 'moduleName2';  

## Installation

``` bash
npm install --save-dev babel-plugin-imports
```

## Usage

.babelrc  

```javascript
{
  "plugins": [
    [
      "import-module",
      {
        "ruleFile": "ruleFile.js" // path.join(process.cwd(), 'ruleFile.js')
      }
    ]
  ]
}
```

ruleFile.js  

```javascript
module.exports = {
  testModuleName: function(moduleName){
    return moduleName === 'react-router';
  },
  ruleImportSpecifier: function(param){
    var moduleName = param.moduleName;
    var importedName = param.importedName;
    var localName = param.localName;

    return {
      moduleName: `${moduleName}/lib/${importedName}`,
      importedName: importedName,
      localName: localName
    };
  }
};
```

## License

This project is licensed under MIT.