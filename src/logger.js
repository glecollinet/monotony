// common js since webpack files read this too
const pino = require('pino');

module.exports = pino({
	name: '[MONOTONY]',
	prettyPrint: true
});
