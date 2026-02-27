const path = require('path');

module.exports = function (options) {
  const originalExternals = options.externals ?? [];
  const externalsArray = Array.isArray(originalExternals)
    ? originalExternals
    : [originalExternals];

  return {
    ...options,
    entry: {
      main: options.entry,
      'data-source': path.resolve(__dirname, 'src/data-source.ts'),
    },
    output: {
      ...options.output,
      filename: '[name].js',
      libraryTarget: 'commonjs2',
    },
    externals: [
      function (ctx, callback) {
        const request = typeof ctx === 'string' ? ctx : ctx.request;

        // Inclui @poupa-juntos/* no bundle (não marca como externo)
        if (request && request.startsWith('@poupa-juntos/')) {
          return callback();
        }

        // Para todo o resto, delega ao nodeExternals padrão do NestJS
        for (const ext of externalsArray) {
          if (typeof ext === 'function') {
            return ext(ctx, callback);
          }
        }
        callback();
      },
    ],
  };
};
