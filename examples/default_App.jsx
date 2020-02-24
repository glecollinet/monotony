import React, {Component} from 'react';
import {hot} from 'react-hot-loader/root';
import {Link} from 'react-router-dom';
import {renderRoutes} from "react-router-config";

import styles from './default_styles.css'

import {someAsyncAction} from './default_actions.js';

class App extends Component {
	static dependencies = (match) => {
		return [
			someAsyncAction(500, 'App.jsx')
		]
	}
	render() {
		const {
			route: {
				routes = []
			}
		} = this.props;
		return (
			<>
				<Link
					className={styles.home}
					to="/">
					Home
				</Link>

				{routes &&
				<ul>
					{routes
						.filter(({path}) => path && path !== '/')
						.map(({path}) => (
						<li
							key={path}>
							<Link
								to={path}>
								{path}
							</Link>
						</li>
					))}
				</ul>
				}

				{routes && renderRoutes(routes)}
			</>
		);
	}
}

export default hot(App);
