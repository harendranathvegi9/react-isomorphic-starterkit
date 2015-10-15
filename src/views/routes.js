import BealFarm from "views/BealFarm";
import Event from "views/Event";

/**
 * The React Router 1.0 routes for both the server and the client.
 */
export default [
	{path: "/e/*", component: Event},
	// {path: "/oneevent", component: Event}
	{path: "/", component: BealFarm}
];
