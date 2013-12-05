//TODO: Change 'next' to something semantically meaningful
define(['tasks/task', 'tasks/flexbox/menu-items-grid-display'], function(Task, nextTask) {

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
		initObserver: {
			attributes: true,
			attributeFilter: ['style']
		},
		instructions: {
			console: "Now, if you mouse over the child sections of '.home-ui' in the developer tools, you can see that they're laid out in a row. We really want these in a column layout; First the header, then the info-pane, then the menu, and finally the wifi details. Let's set the direction to column to achieve this.",
			screen: "Now, if you mouse over the child sections of '.home-ui' in the developer tools, you can see that they're laid out in a row. We really want these in a column layout; First the header, then the info-pane, then the menu, and finally the wifi details. Let's set the direction to column to achieve this.",
			audio: null//"/audio/tasks/flexbox/home-ui-direction.mp3"
		},
		pointsNecessary: 1,
		tests: [{
			target: document.querySelector('.home-ui'),
			description: "set the section '.home-ui' to 'flex-direction: column'",
			predicate: function(mutation) {
				return window.getComputedStyle(mutation.target).getPropertyValue('flex-direction') === 'column';
			},
			next: nextTask,
			points: 1,
			segue: {
				console: "This already looks way better! Our content sections are no longer overlapping.",
				screen: "This already looks way better! Our content sections are no longer overlapping.",
				audio: null//"/media/audio/cs256/flexbox/home-ui-direction-segue.mp3"
			}
		}]
	});

	return flexboxTask;
});