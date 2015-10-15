var fs = require('fs');

import __fetch from "isomorphic-fetch";
import React from "react";
import InlineCss from "react-inline-css";
import Transmit from "react-transmit";

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
				// console.log('LANCE transmitSsPoints', new Date() );

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
			const interval = 60000 ;
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
		const ssUrl     = (t, s) => { return t === 'sensor' ? sensorUrl(s) : switchUrl(s) ; };
/*
		const hasMp4     = (a) => { return "crap" ; };
		const isHo     = function(a) {
		// const hasMp4     = (a) => {
			if( !a ) {
				return '' ;
			}
			var path = '/home/lance/git/lpwrisk/static/e/' + a + '.mp4',
				stats;
			try {
				stats = fs.statSync(path);
				console.log("File exists", path, stats.isFile() );
				return "FUCKmp4";
			}
			catch (e) {
				console.log("File does not exist", path);
				return "FUCKnomp4";
			}
			var rv = stats && stats.isFile() ? 'mp4' : '';
			console.log("hasMp4 returning", rv);
			return rv ;
		}
*/

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
			// s.lastTimeStamp = 1442647938;
			// console.log( 'LANCE date ', s.lastTimeStamp );
			if( !s.lastTimeStamp ) {
				return '';
			}
			if( typeof s.lastTimeStamp === 'string' ) {
				return s.lastTimeStamp;
			}
			if( typeof s.lastTimeStamp !== 'number' ) {
				console.log( 'LANCE bad s.lastTimeStamp', s.lastTimeStamp );
				return '';
			}
			var d = new Date( s.lastTimeStamp * 1000 );
			var newTimeStr = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', timeZone: 'America/Denver', timeZoneName: "short"  });
			// just to make up for Safari not doing toLocalTimeString
			var newTimeSplit = newTimeStr.split(' ');
			// console.log( 'LANCE newTimeSplit', newTimeSplit );
			var justMinSecs = newTimeSplit.slice(0);
			// console.log( 'LANCE justMinSecs1', justMinSecs );
			justMinSecs = justMinSecs[0].split(':');
			// console.log( 'LANCE justMinSecs2', justMinSecs );
			justMinSecs = justMinSecs.slice(0, 2).join(':');
			// console.log( 'LANCE justMinSecs3', justMinSecs );
			newTimeStr = justMinSecs + ' ' + newTimeSplit.slice(1,3).join(' ');
			// console.log( 'LANCE newTimeSplit13', newTimeSplit.slice(1,3) );
			var newDateStr = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', timeZone: 'America/Denver' });
			// just to make up for Safari not doing toLocalDateString
			newDateStr = newDateStr.split(' ').filter( function( e ) { return e !== '2015'; }).join(' ');;
			newDateStr = newDateStr.split(' ').map( function( e ) { return e.slice(0,3); }).join(' ');;
			var newTimeDateStr = newTimeStr + ', ' + newDateStr ;
			newTimeDateStr = (s.type === 'sensor' ? 'Last active: ' : 'Last on: ') + newTimeDateStr ;
			newTimeDateStr = newTimeDateStr.replace( /,/g, '' );
			return newTimeDateStr;
		};
		const historyOf     = (s) => {
			// console.log( 'LANCE history ', s.time );
			if( !s.time ) {
				return '';
			}
			if( typeof s.time === 'string' ) {
				return s.time;
			}
			if( typeof s.time !== 'number' ) {
				console.log( 'LANCE bad s.time', s.time );
				return '';
			}
			var d = new Date( s.time * 1000 );
			var newTimeStr = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', timeZone: 'America/Denver', timeZoneName: "short"  });
			// just to make up for Safari not doing toLocalTimeString
			var newTimeSplit = newTimeStr.split(' ');
			// console.log( 'LANCE newTimeSplit', newTimeSplit );
			var justMinSecs = newTimeSplit.slice(0);
			// console.log( 'LANCE justMinSecs1', justMinSecs );
			justMinSecs = justMinSecs[0].split(':');
			// console.log( 'LANCE justMinSecs2', justMinSecs );
			justMinSecs = justMinSecs.slice(0, 2).join(':');
			// console.log( 'LANCE justMinSecs3', justMinSecs );
			newTimeStr = justMinSecs + ' ' + newTimeSplit.slice(1,3).join(' ');
			// console.log( 'LANCE newTimeSplit13', newTimeSplit.slice(1,3) );
			var newDateStr = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', timeZone: 'America/Denver' });
			// just to make up for Safari not doing toLocalDateString
			newDateStr = newDateStr.split(' ').filter( function( e ) { return e !== '2015'; }).join(' ');;
			newDateStr = newDateStr.split(' ').map( function( e ) { return e.slice(0,3); }).join(' ');;
			var newTimeDateStr = newTimeStr + ', ' + newDateStr ;
			// newTimeDateStr = (s.type === 'sensor' ? 'Last active: ' : 'Last on: ') + newTimeDateStr ;
			newTimeDateStr = newTimeDateStr.replace( /,/g, '' );
			return newTimeDateStr;
		};

		// dynamic data
		// phtoshop state
		// save all records: query current state, last on/active time, database
		// click sensor to open all times, need back button

		/**
		 * This is a Transmit fragment.
		 */
console.log('LANCE render');	// , this.props.response);
		const {response} = this.props;
		var curTime = new Date( response.time * 1000 );
		curTime = curTime.toLocaleTimeString('en-US', {timeZone: 'America/Denver', timeZoneName: "short", hour: 'numeric', minute: 'numeric'});
			// just to make up for Safari not doing toLocalTimeString
			var newTimeSplit = curTime.split(' ');
			// console.log( 'LANCE newTimeSplit', newTimeSplit );
			var justMinSecs = newTimeSplit.slice(0);
			justMinSecs = justMinSecs[0].split(':');
			justMinSecs = justMinSecs.slice(0, 2).join(':');
			curTime = justMinSecs + ' ' + newTimeSplit.slice(1,3).join(' ');
		const curTimeString = 'Beal Farm at ' + curTime;
		const switches = response.ssPoints.filter( function( s ) {
			return s.type === 'switch' ;
		}).sort( function( a, b ) {
			if( !a.lastTimeStamp || (typeof a.lastTimeStamp !== 'number' )) {
				a.lastTimeStamp = 0 ;
			}
			if( !b.lastTimeStamp || (typeof b.lastTimeStamp !== 'number' )) {
				b.lastTimeStamp = 0 ;
			}
			return b.lastTimeStamp - a.lastTimeStamp ;
		});
		const sensors = response.ssPoints.filter( function( s ) {
			return s.type === 'sensor' ;
                }).sort( function( a, b ) {
                        if( !a.lastTimeStamp || (typeof a.lastTimeStamp !== 'number' )) {
                                a.lastTimeStamp = 0 ;
                        }
                        if( !b.lastTimeStamp || (typeof b.lastTimeStamp !== 'number' )) {
                                b.lastTimeStamp = 0 ;
                        }
                        return b.lastTimeStamp - a.lastTimeStamp ;
                });
		const ssPoints = response.ssPoints.filter( function( s ) {
			return s.type === 'switch' || s.type === 'sensor' ;
		}).sort( function( a, b ) {
			if( !a.lastTimeStamp || (typeof a.lastTimeStamp !== 'number' )) {
				a.lastTimeStamp = 0 ;
			}
			if( !b.lastTimeStamp || (typeof b.lastTimeStamp !== 'number' )) {
				b.lastTimeStamp = 0 ;
			}
			return b.lastTimeStamp - a.lastTimeStamp ;
		});
		const history = response.ssHistory;
		// console.log( 'history', history );

				// <h1>Beal Farm</h1>
				// <h3>Switches</h3>
				// </ul>
				// <ul>

    		var files = fs.readdirSync('/home/lance/git/lpwrisk/static/e/');
		function hasMp4(a) {
			var index = files.indexOf( a + '.mp4' );
			var rv = index === -1 ? '' : 'mp4' ;
			console.log( 'LANCE hasMp42', index, rv );
			return rv ;
		}
									// <div>{stateOf(s)}</div>
		return (
			<InlineCss stylesheet={BealFarm.css(pointSize)} namespace="BealFarm">
				<h3>{curTimeString}</h3>
				<ul className='current'>
					{ssPoints.map((s) =>
						<li className={s.type} key={s.name + '_current'}>
							<a className={hasMp4(s.asset)} href={"/e/"+s.asset} title={s.name} target="_blank">
								<img className="point" src={ssUrl(s.type, s.value)} alt={s.name} />
								<span>
									<div>{nameOf(s)}</div>
									<div>{timeOf(s)}</div>
								</span>
								<img className="asset" src="vidcam.png" alt="asset" />
							</a>
						</li>
					)}
				</ul>
				<h3>History</h3>
				<ul className='history'>
					{history.map((s) =>
						<li className={s.type}>
							<a className={hasMp4(s.asset)} href={"/e/"+s.asset} title={s.name} target="_blank">
								<img className="point" src={ssUrl(s.type, s.value)} alt={s.name} />
								<span>
									<div>{nameOf(s)}</div>
									<div>{historyOf(s)}</div>
								</span>
								<img className="asset" src="vidcam.png" alt="asset" />
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
			& h3 {
				text-align: center;
			}
			& ul {
				list-style-type: none;
				padding-left: 0;
			}
				.asset {
					position: absolute;
					right: 2px;
				}
				& a.mp4 {
				}
				& a:not(.mp4) {
					pointer-events: none;
					cursor: default;
					.asset {
						display: none;
					}
				}
				& a:not(.mp4) .asset {
					display: none;
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
// console.log('LANCE fetch', api);
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
// console.log('LANCE allPoints', allPoints);
				return allPoints;
			}).catch((error) => {
				console.error(error);
			});
		}
	}
});

