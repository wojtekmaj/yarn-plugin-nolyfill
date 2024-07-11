import { structUtils, type Plugin, type Hooks } from '@yarnpkg/core';

const prototyp = '.prototype.';
const arrayPrototype = `array${prototyp}`;
const stringPrototype = `string${prototyp}`;

// Keep in sync with https://github.com/SukkaW/nolyfill/blob/master/packages/tools/cli/src/all-packages.ts
const allPackages = [
  'abab',
  'array-buffer-byte-length',
  'array-includes',
  'array.from',
  'array.of',
  `${arrayPrototype}at`,
  `${arrayPrototype}every`,
  `${arrayPrototype}find`,
  `${arrayPrototype}findlast`,
  `${arrayPrototype}findlastindex`,
  `${arrayPrototype}flat`,
  `${arrayPrototype}flatmap`,
  `${arrayPrototype}flatmap`,
  `${arrayPrototype}foreach`,
  `${arrayPrototype}reduce`,
  `${arrayPrototype}toreversed`,
  `${arrayPrototype}tosorted`,
  'arraybuffer.prototype.slice',
  'assert',
  'asynciterator.prototype',
  'available-typed-arrays',
  'deep-equal',
  'deep-equal-json',
  'define-properties',
  'es-aggregate-error',
  'es-iterator-helpers',
  'es-set-tostringtag',
  'es6-object-assign',
  'function-bind',
  'function.prototype.name',
  'get-symbol-description',
  'globalthis',
  'gopd',
  'harmony-reflect',
  'has',
  'has-property-descriptors',
  'has-proto',
  'has-symbols',
  'has-tostringtag',
  'hasown',
  'internal-slot',
  'is-arguments',
  'is-array-buffer',
  'is-core-module',
  'is-date-object',
  'is-generator-function',
  'is-nan',
  'is-regex',
  'is-shared-array-buffer',
  'is-string',
  'is-symbol',
  'is-typed-array',
  'is-weakref',
  'isarray',
  'iterator.prototype',
  'json-stable-stringify',
  'jsonify',
  'object-is',
  'object-keys',
  'object.assign',
  'object.entries',
  'object.fromentries',
  'object.getownpropertydescriptors',
  'object.groupby',
  'object.hasown',
  'object.values',
  'promise.allsettled',
  'promise.any',
  'reflect.getprototypeof',
  'reflect.ownkeys',
  'regexp.prototype.flags',
  'safe-array-concat',
  'safe-regex-test',
  'set-function-length',
  'side-channel',
  `${stringPrototype}at`,
  `${stringPrototype}codepointat`,
  `${stringPrototype}includes`,
  `${stringPrototype}matchall`,
  `${stringPrototype}padend`,
  `${stringPrototype}padstart`,
  `${stringPrototype}repeat`,
  `${stringPrototype}replaceall`,
  `${stringPrototype}split`,
  `${stringPrototype}startswith`,
  `${stringPrototype}trim`,
  `${stringPrototype}trimend`,
  `${stringPrototype}trimleft`,
  `${stringPrototype}trimright`,
  `${stringPrototype}trimstart`,
  'typed-array-buffer',
  'typed-array-byte-length',
  'typed-array-byte-offset',
  'typed-array-length',
  'typedarray',
  'typedarray.prototype.slice',
  'unbox-primitive',
  'util.promisify',
  'which-boxed-primitive',
  'which-typed-array',
];

const PATCHES = new Map(
  allPackages.map((name) => [
    structUtils.makeIdent(null, name).identHash,
    structUtils.makeIdent('nolyfill', name),
  ]),
);

const plugin: Plugin<Hooks> = {
  hooks: {
    reduceDependency: async (dependency) => {
      const patchIdent = PATCHES.get(dependency.identHash);

      if (patchIdent) {
        const patchDescriptor = structUtils.makeDescriptor(patchIdent, 'latest');

        const range = structUtils.makeRange({
          protocol: 'npm:',
          source: null,
          selector: structUtils.stringifyDescriptor(patchDescriptor),
          params: null,
        });

        const patchedDescriptor = structUtils.makeDescriptor(dependency, range);

        return patchedDescriptor;
      }

      return dependency;
    },
  },
};

export default plugin;
