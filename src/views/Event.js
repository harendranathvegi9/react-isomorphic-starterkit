import __fetch from "isomorphic-fetch";
import React from "react";
import InlineCss from "react-inline-css";
import Transmit from "react-transmit";

/**
 * main React application entry-point for both the server and client.
 */
class Event extends React.Component {
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
		}
	}

	/**
	 * Runs on server and client.
	 */
	render () {
		var _this = this;
		console.log('LANCE Event video render', this.props);	// , this.props.response);

				// <h3>Hello Movie</h3>
		return (
			<InlineCss stylesheet={Event.css(12)} namespace="Event">
				<video widtg="960" height="540" controls>
					<source src={'/e/' + _this.props.params.splat + '.mp4'} type="video/mp4"></source>
					Your browser does not support the <code>video</code> element.
				</video>
			</InlineCss>
		);
	}
	/**
	 * <InlineCss> component allows you to write a CSS stylesheet for your component. Target
	 * your component with `&` and its children with `& selectors`. Be specific.
	 */
	static css (pointSize) {
		return (`
		`);
	}

}

/**
 * Use Transmit to query and return GitHub stargazers as a Promise.
 */
export default Transmit.createContainer(Event, {
	// initialVariables: {
	// },
	// fragments: {
		// response ({nextPage, pagesToFetch}) {
		// }
	// }
});

