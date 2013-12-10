define(['tasks/task'], function(Task) {

/*
 * Step 1: .home-ui display: flex
 * Step 2: .home-ui flex-direction: column
 * Step 3: .menu-items-grid display: flex
 * Step 4: .menu-items-grid flex-direction: row
 * Step 5: .menu-items-grid justify-content: space around
 * Step 6: .menu-items-grid flex-wrap: wrap
 * Step 7: .menu-items-grid a flex: 0 24%
 * Step 8: .info-pane flex: 4
 */
	var flexboxTask = new Task({
		instructions: {
			console: "Ok, so we've just walked through a potential example of what you can do with flexbox to control application layout. This is really just the tip of the iceberg, though. I'd recommend prototyping up a few examples of your own to see how quickly and easily you can apply flexbox to create the layout you want.",
			screen: "Ok, so we've just walked through a potential example of what you can do with flexbox to control application layout. This is really just the tip of the iceberg, though. I'd recommend prototyping up a few examples of your own to see how quickly and easily you can apply flexbox to create the layout you want.",
			audio: null//"/audio/tasks/flexbox/finale.mp3"
		},
		pointsNecessary: 1,
		tests: []
	});

	return flexboxTask;
});