//TODO: Change 'next' to something semantically meaningful
define(['tasks/task', 'tasks/flexbox/home-ui-display'], function(Task, nextTask) {

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
			console: "Let's apply what we've learned about flexbox to the main page of our conference app. We've removed all the relevant flexbox styles from this page, so now let's walk through how to reimplement them.",
			screen: "Let's apply what we've learned about flexbox to the main page of our conference app. We've removed all the relevant flexbox styles from this page, so now let's walk through how to reimplement them.",
			audio: null//"/audio/tasks/flexbox/flexbox.mp3"
		},
		pointsNecessary: 1,
		tests: [{
			predicate: null,
			next: nextTask
		}]
	});

	return flexboxTask;
});