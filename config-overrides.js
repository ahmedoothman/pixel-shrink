/* config-overrides.js */
module.exports = function override(config, env) {
  // Add the ignoreWarnings configuration to silence the Ant Design source map warnings
  if (!config.ignoreWarnings) {
    config.ignoreWarnings = [];
  }

  config.ignoreWarnings.push({
    module: /node_modules\/antd/,
    message: /Failed to parse source map/,
  });

  // Disable source maps for node_modules in production
  if (env === 'production') {
    if (config.module && config.module.rules) {
      config.module.rules.forEach((rule) => {
        if (rule.oneOf) {
          rule.oneOf.forEach((oneOfRule) => {
            if (
              oneOfRule.test &&
              oneOfRule.test.toString().includes('css') &&
              oneOfRule.use
            ) {
              // Modify CSS loaders to skip source maps for node_modules
              const cssRuleIndex = oneOfRule.use.findIndex(
                (loader) =>
                  loader.loader && loader.loader.includes('css-loader')
              );

              if (cssRuleIndex !== -1 && oneOfRule.use[cssRuleIndex].options) {
                const originalTest = oneOfRule.test;
                // Create a copy of this rule specifically for node_modules
                const nodeModulesRule = { ...oneOfRule };

                // Modify the original rule to exclude node_modules
                oneOfRule.include = [/src/]; // Only include files from src directory

                // Create a new rule for node_modules that doesn't use source maps
                nodeModulesRule.include = [/node_modules\/antd/];
                if (nodeModulesRule.use[cssRuleIndex].options) {
                  nodeModulesRule.use[cssRuleIndex].options.sourceMap = false;
                }

                // Add the new rule
                rule.oneOf.push(nodeModulesRule);
              }
            }
          });
        }
      });
    }
  }

  return config;
};
