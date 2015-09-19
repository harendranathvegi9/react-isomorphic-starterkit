import __fetch from "isomorphic-fetch";
import React from "react";
import InlineCss from "react-inline-css";
import Transmit from "react-transmit";

/*
		const xxxqueryResults = [{
			    location: "BealFarm",
			    type: "sensor",
			    name: "cattleSensor",
			    timeStamp: "Tue Sep 15 19:44:04 MDT 2015",
			    timeString: "Tue Sep 15 19:44:04 MDT 2015",
			    value: 0
			}, {
			    location: "BealFarm",
			    type: "sensor",
			    name: "shopSensor",
			    timeStamp: "Tue Sep 15 19:49:17 MDT 2015",
			    timeString: "Tue Sep 15 19:49:17 MDT 2015",
			    value: 0
			}, {
			    location: "BealFarm",
			    type: "switch",
			    name: "cordSwitch",
			    timeStamp: "Tue Sep 15 19:52:10 MDT 2015",
			    timeString: "Tue Sep 15 19:52:10 MDT 2015",
			    value: 0
			}, {
			    location: "BealFarm",
			    type: "switch",
			    name: "wallSwitch",
			    timeStamp: "Tue Sep 15 19:52:11 MDT 2015",
			    timeString: "Tue Sep 15 19:52:11 MDT 2015",
			    value: 0
			}
		];
*/

/**
 * main React application entry-point for both the server and client.
 */
class BealFarm extends React.Component {
	/**
	 * Runs on server and client.
	 */
	componentWillMount () {
		if (__SERVER__) {
			/**
			 * This is only run on the server, and will be removed from the client build.
			 */
			console.log("Hello server");
		}

		if (__CLIENT__) {
			/**
			 * This is only run on the client.
			 */
			console.log("Hello client");

			/**
			 * Recursive function to transmit the rest of the stargazers on the client.
			 */
			const transmitSsPoints = () => {
				console.log('LANCE transmitSsPoints', new Date() );

				// if (this.props.transmit.variables.pagesToFetch > 0) {
				// 	return;
				// }

				this.props.transmit.forceFetch({
					// prevSsPoints: this.props.response,
					nextPage:       this.props.transmit.variables.nextPage + 1,
					pagesToFetch:   this.props.transmit.variables.pagesToFetch - 1
				// }).then(transmitSsPoints);
				});
			};

			// transmitSsPoints();
			const interval = 10000 ;
			setTimeout( function() {
				setInterval( transmitSsPoints, interval );
			}, interval );
		}
	}

	/**
	 * Runs on server and client.
	 */
	render () {
		// const repositoryUrl = "https://github.com/RickWong/react-isomorphic-starterkit";
		const pointSize    = 64;
		// const switchUrl     = (id) => `https://cdn4.iconfinder.com/data/icons/seo-2/71/SEO_power_on_start_switch-512.png?v=3&s=${avatarSize}`;
		// const switchUrl     = (id) => `https://cdn4.iconfinder.com/data/icons/seo-2/71/SEO_power_on_start_switch-512.png`;
		// const sensorUrl     = (id) => `https://pbs.twimg.com/profile_images/2347914910/is8zdvgqr2qbj3nwzevf.png`;
		const switchUrl     = (s) => { return s ? 'switch_on.png' : 'switch_off.png' ; };
		const sensorUrl     = (s) => { return s ? 'sensor_on.png' : 'sensor_off.png' ; };
		const stateStrings = {
			sensor: {
				0: 'inactive',
				1: 'active'
			},
			switch: {
				0: 'off',
				1: 'on'
			}
		};
		const nameOf     = (s) => {
			const name = s.name.replace( /sensor/i, '' ).replace( /switch/i, '' );
			const nameType = name.charAt(0).toUpperCase() + name.slice(1) + ' ' + s.type ;
			const nameTypeState = nameType + ' ' + stateStrings[s.type][s.value];
			return nameTypeState;
		};
		// const stateOf     = (s) => { return 'Currently: ' + stateStrings[s.type][s.value] };
		// const timeOf     = (s) => { return new Date(s).toLocaleString(); }; not w React SS rendering
		const timeOf     = (s) => {
			if( !s.lastTimeString ) {
				return '';
			}
			var spaceSplits = s.lastTimeString.split(' ') ;
			var timeSplits = spaceSplits[3].split(':') ;
			var hour = timeSplits[0] ;
			var pmam = hour > 12 ;
			hour = pmam ? hour - 12 : hour ;
			pmam = pmam ? 'PM' : 'AM' ;
			var newDateStr = hour + ':' + timeSplits[1] + ' ' + pmam + ',  ' + spaceSplits.slice(0,3).join(' ') ;
			return (s.type === 'sensor' ? 'Last active: ' : 'Last on: ') + newDateStr ;
		};

		// dynamic data
		// phtoshop state
		// save all records: query current state, last on/active time, database
		// click sensor to open all times, need back button

		/**
		 * This is a Transmit fragment.
		 */
console.log('LANCE render', this.props.response);
		const {response} = this.props;
		const curTime = new Date( response.time );
		const curTimeString = 'Beal Farm at ' + curTime.toLocaleTimeString('en-US', {timeZone: 'America/Denver', timeZoneName: "short"});
		const switches = response.ssPoints.filter( function( s ) {
			return s.type === 'switch' ;
		});
		const sensors = response.ssPoints.filter( function( s ) {
			return s.type === 'sensor' ;
		});
		// console.log( 'switches', switches );
		// console.log( 'sensors', sensors );
				// <h1>Beal Farm</h1>
				// <h3>Switches</h3>
				// </ul>
				// <ul>
									// <div>{stateOf(s)}</div>
		return (
			<InlineCss stylesheet={BealFarm.css(pointSize)} namespace="BealFarm">
				<h3>{curTimeString}</h3>
				<ul>
					{switches.map((s) =>
						<li key={s.name}>
							<a href={"https://bealfarm.com/"+s.name} title={s.name} target="_blank">
								<img className="point" src={switchUrl(s.value)} alt={s.name} />
								<span>
									<div>{nameOf(s)}</div>
									<div>{timeOf(s)}</div>
								</span>
							</a>
						</li>
					)}
					{sensors.map((s) =>
						<li key={s.name}>
							<a href={"https://bealfarm.com/"+s.name} title={s.name} target="_blank">
								<img className="point" src={sensorUrl(s.value)} alt={s.name} />
								<span>
									<div>{nameOf(s)}</div>
									<div>{timeOf(s)}</div>
								</span>
							</a>
						</li>
					)}
				</ul>
			</InlineCss>
		);
	}
	/**
	 * <InlineCss> component allows you to write a CSS stylesheet for your component. Target
	 * your component with `&` and its children with `& selectors`. Be specific.
	 */
	static css (pointSize) {
		return (`
			& ul {
				list-style-type: none;
				padding-left: 0;
			}
			& a {
				font-size: larger ;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;

			    display: flex;
					display: -webkit-box;      /* OLD - iOS 6-, Safari 3.1-6 */
					display: -moz-box;         /* OLD - Firefox 19- (buggy but mostly works) */
					display: -ms-flexbox;      /* TWEENER - IE 10 */
					display: -webkit-flex;     /* NEW - Chrome */
					display: flex;             /* NEW, Spec - Opera 12.1, Firefox 20+ */
			    align-items: center;
					-webkit-box-align: center;
					-webkit-flex-align: center;
					-ms-flex-align: center;
					-webkit-align-items: center;
					align-items: center;

				color: black;
				text-decoration: none;
				pointer-events: none;
				cursor: default;
			}
			& img {
				// flex: none;
				// border-radius: 50%;
				width: ${pointSize}px;
				height: ${pointSize}px;
				margin: 2px 8px 2px 2px;
			}
		`);
	}

}

/**
 * Use Transmit to query and return GitHub stargazers as a Promise.
 */
export default Transmit.createContainer(BealFarm, {
	initialVariables: {
		nextPage:       1,
		pagesToFetch:   1
		// prevSsPoints: []
	},
	fragments: {
		/**
		 * Return a Promise of the previous stargazers + the newly fetched stargazers.
		 */
		response ({nextPage, pagesToFetch}) {	// , prevSsPoints}) {
			/**
			 * On the server, connect to GitHub directly.
			 */
			let api = "http://bealfarm.com:8000";

			/**
			 * Load a few ss pionts using the Fetch API.
			 */
console.log('LANCE fetch', api);
			return fetch(
				api + "" + '?location=BealFarm' +
				`&per_page=100&page=${nextPage}`
			).then((response) => response.json()).then((body) => {
				/**
				 * Stop fetching if the response body is empty.
				 */
				if (!body) {	// no longer an array || !body.length) {
					console.log('LANCE Error no body should never happen');
					return null;	// prevSsPoints;
				}

				/**
				 * Pick id and username from fetched stargazers.
				 */
				const fechedPoints = body ;	// .map(({id, login}) => ({id, login}));

				// refresh, don't accumulate: var allPoints = prevSsPoints.concat(fechedPoints);
				var allPoints = fechedPoints ;
console.log('LANCE allPoints', allPoints);
				return allPoints;
			}).catch((error) => {
				console.error(error);
			});
		}
	}
});

