import path from 'path';

import pkg from '../../package.json';

const packageRegExp = new RegExp(`^${pkg.name.replace(/^generator-/, '')}:`);

export default function getSubgenerators(appGenerator) {
  return Object.values(appGenerator.env.getGeneratorsMeta())
    // Get all web-starter generators.
    .filter(generator => packageRegExp.test(generator.namespace))
    // Filter out the 'app' generator.
    .filter(generator => generator.namespace !== appGenerator.options.namespace)
    // We don't care about the 'web-starter' part of each subgenerator's namespace, so reduce it to
    // just the generator's name.
    // Keep the resolved path for use later.
    .map(generator => ({
      machineName: generator.namespace.replace(packageRegExp, ''),
      /** @todo Do we actually need the resolved path in a mono-repo? **/
      resolved: generator.resolved,
    }))
    // Add available metadata for the generator.
    .map((generator) => {
      const metaFile = path.join(generator.resolved, '..', 'meta.js');

      // eslint-disable-next-line global-require, import/no-dynamic-require
      const meta = require(metaFile);

      return {
        ...generator,
        category: 'Other',
        ...meta,
      };
    })
    // Reduce to an object keyed by the `machineName` property on each object in the array.
    .reduce((accumulator, current) => ({
      [current.machineName]: current,
      ...accumulator,
    }), {});
}
