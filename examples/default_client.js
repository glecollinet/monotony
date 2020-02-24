import React from 'react';
import Client from '../src/Client.js';

import config from './default_monotony.config.js';

new Client(config).start();
