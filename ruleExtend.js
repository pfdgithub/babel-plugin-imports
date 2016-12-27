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