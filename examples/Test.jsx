import React, {Component} from 'react';
import {hot} from 'react-hot-loader/root';
import {Link} from 'react-router-dom';
import {renderRoutes} from "react-router-config";

import {someAsyncAction} from './default_actions.js';

import styles from './Test.css';

class Test extends Component {
	static dependencies = (match) => {
		return [
			someAsyncAction(1000, 'Text.jsx')
		]
	}
	render() {
		return (
			<>
				LOLOLOLOLOL
			</>
		);
	}
}

export default hot(Test);
