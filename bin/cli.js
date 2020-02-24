#!/usr/bin/env node

'use strict';

process.on('unhandledRejection', err => {
  throw err;
});

const [,, ...args] = process.argv;

const { spawnSync } = require('child_process');

const scriptIndex = args.findIndex(
  x => x === 'build' || x === 'start'
);

const script = args[scriptIndex] || args[0];
const nodeArgs = scriptIndex > 0 ? args.slice(0, scriptIndex) : [];

if (['build', 'start'].includes(script)) {
	console.log(nodeArgs
			.concat(require.resolve('../scripts/' + script))
			.concat(args.slice(scriptIndex + 1)));
	const result = spawnSync(
		'node',
		nodeArgs
			.concat(require.resolve('../scripts/' + script))
			.concat(args.slice(scriptIndex + 1)),
		{stdio: 'inherit'}
	);

	if (result.signal) {
		switch(result.signal) {
			case 'SIGKILL':
			case 'SIGTERM':
				console.log('[MONOTONY] The build failed to build as the process exited too early.')
		}
		process.exit(1);
	}

	process.exit(result.status);
} else {
	console.log('[MONOTONY] No matching script for ' + script);
}
