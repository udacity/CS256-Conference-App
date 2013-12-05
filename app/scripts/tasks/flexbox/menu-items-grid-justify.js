//TODO: Change 'next' to something semantically meaningful
define(['tasks/task', 'tasks/flexbox/menu-items-grid-wrap'], function(Task, nextTask) {

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
			console: "Now what we'd like to do is space our links across the page. To do this, let's set 'justify-content' on '.menu-items-grid' to 'space-around'.",
			screen: "Now what we'd like to do is space our links across the page. To do this, let's set 'justify-content' on '.menu-items-grid' to 'space-around'.",
			audio: null//"/audio/tasks/flexbox/menu-items-grid-justify.mp3"
		},
		pointsNecessary: 1,
		tests: [{
			target: document.querySelector('.menu-items-grid'),
			description: "set the section '.menu-items-grid' to 'justify-content: space-around'",
			predicate: function(mutation) {
				return window.getComputedStyle(mutation.target).getPropertyValue('justify-content') === 'space-around';
			},
			next: nextTask,
			points: 1,
			segue: {
				console: "Great, now if you were to resize the window manually, you'd see the links dynamically adjusting their position relative to each other. However, there are still some problems with this.",
				screen: "Great, now if you were to resize the window manually, you'd see the links dynamically adjusting their position relative to each other. However, there are still some problems with this.",
				audio: null//"/media/audio/cs256/flexbox/menu-items-grid-justify-segue.mp3"
			}
		}]
	});

	return flexboxTask;
});