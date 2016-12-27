# babel-plugin-imports

[![npm version](https://badge.fury.io/js/babel-plugin-imports.svg)](http://badge.fury.io/js/babel-plugin-imports) [![license](https://img.shields.io/github/license/mashape/apistatus.svg?maxAge=2592000)]()

import { importedName as localName } from 'moduleName'; => import { importedName as localName } from 'moduleName/lib/importedName';  

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
      "imports",
      {
        "ruleExtend": "ruleExtend.js",
        "rules": [
          {
            // "ignoreCheckNewModuleName": false, // ！！警告：规则配置不当可能会造成死循环！！ 忽略检查新模块名称
            "moduleName": "^react-router$", // 模块名称
            "importType": { // 导入类型
              "importSpecifier": {
                "transforms": [
                  {
                    "newImportType": "ImportDefaultSpecifier", // 新导入类型 <ImportSpecifier|ImportDefaultSpecifier|ImportNamespaceSpecifier>
                    "newModuleName": "[moduleName]/lib/[importedName]", // 新模块名称
                    "newImportedName": "[importedName]", // 新导入名称
                    "newLocalName": "[localName]" // 新本地名称
                  }
                ]
              },
              // "importDefaultSpecifier": {
              //   "transforms": [
              //     {
              //       "newImportType": "[importType]",
              //       "newModuleName": "[moduleName]",
              //       "newImportedName": "[importedName]",
              //       "newLocalName": "[localName]"
              //     }
              //   ]
              // },
              "importNamespaceSpecifier": {
                "transforms": [
                  {
                    // "newImportType": "[importType]",
                    // "newModuleName": "[moduleName]",
                    "newImportedName": "[importedName]",
                    "newLocalName": "[localName]"
                  }
                ]
              }
            }
          }
        ]
      }
    ]
  ]
}
```

ruleExtend.js  

```javascript
let ruleExtend = {
  // ignoreCheckNewModuleName: (moduleName) => { // ！！警告：规则配置不当可能会造成死循环！！ 忽略检查新模块名称
  //   return false;
  // },
  moduleName: (moduleName) => {
    return (new RegExp('^react-router$')).test(moduleName);
  },
  importType: {
    importSpecifier: {
      transforms: (importType, moduleName, importedName, localName) => {
        return [
          {
            newImportType: 'ImportDefaultSpecifier', // 新导入类型 <ImportSpecifier|ImportDefaultSpecifier|ImportNamespaceSpecifier>
            newModuleName: `${moduleName}/lib/${importedName}`, // 新模块名称
            newImportedName: importedName, // 新导入名称
            newLocalName: localName // 新本地名称
          }
        ];
      }
    },
    // importDefaultSpecifier: {
    //   transforms: (importType, moduleName, importedName, localName) => {
    //     return [
    //       {
    //         newImportType: importType,
    //         newModuleName: moduleName,
    //         newImportedName: importedName,
    //         newLocalName: localName 
    //       }
    //     ];
    //   }
    // },
    importNamespaceSpecifier: {
      transforms: (importType, moduleName, importedName, localName) => {
        return [
          {
            // newImportType: importType,
            // newModuleName: moduleName,
            newImportedName: importedName,
            newLocalName: localName
          }
        ];
      }
    }
  }
}

module.exports = ruleExtend;
```

## License

This project is licensed under MIT.