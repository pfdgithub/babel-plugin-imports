// https://github.com/babel/babel/tree/master/packages/babel-types
// https://github.com/estree/estree/blob/master/es2015.md

var types = require('babel-types');
var gPath = require('path');

var pluginsCfg = undefined; // babel plugin config
var ruleCfg = undefined; // the file entity of the transform rule

// filter import type
var filter = function (specifiers, type) {
  var filteredSpecifiers = [];
  for (var i = 0; i < specifiers.length; i++) {
    var specifier = specifiers[i];
    if (specifier.type === type) {
      filteredSpecifiers.push(specifier);
    }
  }
  return filteredSpecifiers;
};

// new import Declaration
var newDeclaration = function (localName, moduleName) {
  return types.importDeclaration(
    [types.importDefaultSpecifier(types.identifier(localName))],
    types.stringLiteral(moduleName)
  );
};

module.exports = function () {
  return {
    visitor: {
      ImportDeclaration: function (path, state) {
        var moduleName = path.node.source.value; // import module name

        // plugins config
        if (!pluginsCfg) {
          pluginsCfg = state.opts;
        }

        // rule file
        if (!ruleCfg && pluginsCfg && typeof (pluginsCfg.ruleFile) === 'string') {
          var ruleFile = gPath.join(process.cwd(), pluginsCfg.ruleFile); // the file path of the transform rule
          ruleCfg = require(ruleFile);
        }

        // filter module name 
        if (ruleCfg && typeof (ruleCfg.testModuleName) === 'function'
          && ruleCfg.testModuleName(moduleName)) {

          // filter import type
          var importSpecifiers = filter(path.node.specifiers, 'ImportSpecifier');
          var importDefaultSpecifiers = filter(path.node.specifiers, 'ImportDefaultSpecifier');
          var importNamespaceSpecifiers = filter(path.node.specifiers, 'ImportNamespaceSpecifier');

          // only handle ImportSpecifier
          if (importDefaultSpecifiers.length == 0 && importNamespaceSpecifiers.length == 0
            && importSpecifiers.length > 0 && typeof (ruleCfg.ruleImportSpecifier) === 'function') {

            // import Declaration array
            var importDeclarations = [];

            // traverse ImportSpecifier
            for (var i = 0; i < importSpecifiers.length; i++) {
              var specifier = importSpecifiers[i];
              var importedName = specifier.imported ? specifier.imported.name : ''; // import member name
              var localName = specifier.local ? specifier.local.name : ''; // import member alias name

              // call transform rule
              var newNames = ruleCfg.ruleImportSpecifier({
                moduleName: moduleName,
                importedName: importedName,
                localName: localName
              });

              // new import Declaration
              if (newNames) {
                if (Object.prototype.toString.call(newNames) === '[object Array]') {
                  for (var j = 0; j < newNames.length; j++) {
                    var newName = newNames[j];
                    importDeclarations.push(newDeclaration(newName.localName, newName.moduleName));
                  }
                }
                else {
                  var newName = newNames;
                  importDeclarations.push(newDeclaration(newName.localName, newName.moduleName));
                }
              }
            }

            // end
            if (importDeclarations.length > 0) {
              path.replaceWithMultiple(importDeclarations);
            }
          }
        }
      }
    }
  }
}