//TODO: Change 'next' to something semantically meaningful
define(['tasks/task', 'tasks/flexbox/info-pane-flex'], function(Task, nextTask) {

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
			console: "There's another problem with the links. If we resize the window to about 400px, they look fine, but as we make the window wider, we see that it looks kind of empty, the links get to be too far apart. Let's tell the buttons to fill that empty space. There are two ways we could do this. We could set '.menu-items-grid a' to 'flex-grow: 0' and 'flex-basis: 24%', or we could use the shorthand 'flex: 0 24%'. Try that now.",
			screen: "There's another problem with the links. If we resize the window to about 400px, they look fine, but as we make the window wider, we see that it looks kind of empty, the links get to be too far apart. Let's tell the buttons to fill that empty space. There are two ways we could do this. We could set '.menu-items-grid a' to 'flex-grow: 0' and 'flex-basis: 24%', or we could use the shorthand 'flex: 0 24%'. Try that now.",
			audio: null//"/audio/tasks/flexbox/menu-items-grid-a-flex.mp3"
		},
		pointsNecessary: 1,
		tests: [{
			target: document.querySelector('.menu-items-grid a'),
			description: "set '.menu-items-grid a' to 'flex: 0 24%'",
			predicate: function(mutation) {
				var style = window.getComputedStyle(mutation.target);
				var flex = style.getPropertyValue('flex');
				var flexGrow = style.getPropertyValue('flex-grow');
				var flexBasis = style.getPropertyValue('flex-basis');

				return (flex === '0 24%' || (flexGrow === '0' && flexBasis === '24%'));
			},
			next: nextTask,
			points: 1,
			segue: {
				console: "This looks a lot better to me. If you resize the window, you can see that the links expand to fill most of the space between them.",
				screen: "This looks a lot better to me. If you resize the window, you can see that the links expand to fill most of the space between them.",
				audio: null//"/media/audio/cs256/flexbox/menu-items-grid-a-flex-segue.mp3"
			}
		}]
	});

	return flexboxTask;
});