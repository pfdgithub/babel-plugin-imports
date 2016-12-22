var ruleExtend = {
  moduleName: function (moduleName) {
    return (new RegExp('^react-router$')).test(moduleName);
  },
  importType: {
    importSpecifier: {
      transforms: function (importType, moduleName, importedName, localName) {
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
    //   transforms: function (importType, moduleName, importedName, localName) {
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
      transforms: function (importType, moduleName, importedName, localName) {
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