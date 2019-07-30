import { join } from '@angular-devkit/core';
import { Tree } from '@angular-devkit/schematics';
import { offsetFromRoot } from './common';

export function generateProjectLint(
  projectRoot: string,
  tsConfigPath: string,
  linter: 'tslint' | 'eslint' | 'none'
) {
  if (linter === 'tslint') {
    return {
      builder: '@nrwl/linter:lint',
      options: {
        linter: 'tslint',
        tsConfig: [tsConfigPath],
        exclude: ['**/node_modules/**', '!' + projectRoot + '/**']
      }
    };
  } else if (linter === 'eslint') {
    return {
      builder: '@nrwl/linter:lint',
      options: {
        linter: 'eslint',
        tsConfig: [tsConfigPath],
        exclude: ['**/node_modules/**', '!' + projectRoot + '/**']
      }
    };
  } else {
    return undefined;
  }
}

export function addLintFiles(
  projectRoot: string,
  linter: 'tslint' | 'eslint' | 'none',
  onlyGlobal = false
) {
  return (host: Tree) => {
    if (linter === 'tslint') {
      if (!host.exists('/tslint.json')) {
        host.create('/tslint.json', globalTsLint);
      }
      if (!onlyGlobal) {
        host.create(
          join(projectRoot as any, `tslint.json`),
          JSON.stringify({
            extends: `${offsetFromRoot(projectRoot)}tslint.json`,
            rules: []
          })
        );
      }
    } else if (linter === 'eslint') {
      if (!host.exists('/.eslintrc')) {
        host.create('/.eslintrc', '{}');
      }
    } else {
    }
  };
}

const globalTsLint = `
{
  "rulesDirectory": ["node_modules/@nrwl/workspace/src/tslint"],
  "rules": {
    "arrow-return-shorthand": true,
    "callable-types": true,
    "class-name": true,
    "deprecation": {
      "severity": "warn"
    },
    "forin": true,
    "import-blacklist": [true, "rxjs/Rx"],
    "interface-over-type-literal": true,
    "member-access": false,
    "member-ordering": [
      true,
      {
        "order": [
          "static-field",
          "instance-field",
          "static-method",
          "instance-method"
        ]
      }
    ],
    "no-arg": true,
    "no-bitwise": true,
    "no-console": [true, "debug", "info", "time", "timeEnd", "trace"],
    "no-construct": true,
    "no-debugger": true,
    "no-duplicate-super": true,
    "no-empty": false,
    "no-empty-interface": true,
    "no-eval": true,
    "no-inferrable-types": [true, "ignore-params"],
    "no-misused-new": true,
    "no-non-null-assertion": true,
    "no-shadowed-variable": true,
    "no-string-literal": false,
    "no-string-throw": true,
    "no-switch-case-fall-through": true,
    "no-unnecessary-initializer": true,
    "no-unused-expression": true,
    "no-var-keyword": true,
    "object-literal-sort-keys": false,
    "prefer-const": true,
    "radix": true,
    "triple-equals": [true, "allow-null-check"],
    "unified-signatures": true,
    "variable-name": false,

    "nx-enforce-module-boundaries": [
      true,
      {
        "allow": [],
        "depConstraints": [
          { "sourceTag": "*", "onlyDependOnLibsWithTags": ["*"] }
        ]
      }
    ]
  }
}
`;

const globalEsLit = `
{
}
`;