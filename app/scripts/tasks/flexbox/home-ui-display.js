//TODO: Change 'next' to something semantically meaningful
define(['tasks/task', 'tasks/flexbox/home-ui-direction'], function(Task, nextTask) {

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
			console: "As you can see, our page doesn't look very good. If you inspect the page, you'll notice that the entire page is contained in a section with class 'home-ui'. Let's start with setting this element to 'display: flex' so we can organize our page layout with flexbox.",
			screen: "As you can see, our page doesn't look very good. If you inspect the page, you'll notice that the entire page is contained in a section with class 'home-ui'. Let's start with setting this element to 'display: flex' so we can organize our page layout with flexbox.",
			audio: null//"/audio/tasks/flexbox/home-ui-display.mp3"
		},
		pointsNecessary: 1,
		tests: [{
			target: document.querySelector('.home-ui'),
			description: "set the section '.home-ui' to 'display: flex'",
			predicate: function(mutation) {
				return window.getComputedStyle(mutation.target).getPropertyValue('display') === 'flex';
			},
			next: nextTask,
			points: 1,
			segue: {
				console: "Great! Well, sort of. This doesn't actually look like much of an improvement, does it? Let's try and fix that.",
				screen: "Great! Well, sort of. This doesn't actually look like much of an improvement, does it? Let's try and fix that.",
				audio: null//"/media/audio/cs256/flexbox/home-ui-display-segue.mp3"
			}
		}]
	});

	return flexboxTask;
});