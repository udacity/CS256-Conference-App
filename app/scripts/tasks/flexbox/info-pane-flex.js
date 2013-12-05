//TODO: Change 'next' to something semantically meaningful
define(['tasks/task', 'tasks/flexbox/finale'], function(Task, nextTask) {

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
			console: "We're almost done! The last thing we want to do is push those links down to the bottom. Notice the section with class 'info-pane'? This is currently empty, but we might want to put conference updates or other information here that we want all attendees to see. We can use 'flex-grow' or 'flex' on '.info-pane' to specify that we want it to take up as much space as we give it. Do that by setting 'flex-grow' to any number greater than 0.",
			screen: "We're almost done! The last thing we want to do is push those links down to the bottom. Notice the section with class 'info-pane'? This is currently empty, but we might want to put conference updates or other information here that we want all attendees to see. We can use 'flex-grow' or 'flex' on '.info-pane' to specify that we want it to take up as much space as we give it. Do that by setting 'flex-grow' to any number greater than 0.",
			audio: null//"/audio/tasks/flexbox/info-pane-flex.mp3"
		},
		pointsNecessary: 1,
		tests: [{
			target: document.querySelector('.info-pane'),
			description: "set the section '.info-pane' to 'flex: 4'",
			predicate: function(mutation) {
				var style = window.getComputedStyle(mutation.target);
				var flex = style.getPropertyValue('flex');
				var flexGrow = style.getPropertyValue('flex-grow');

				return (flex === '4' || flexGrow === '4');
			},
			next: nextTask,
			points: 1,
			segue: {
				console: "Fantastic, we've gotten exactly the effect we wanted. We have our info pane front and center, and the rest of our content is pushed down to the bottom. If we resize the window, we see that the info pane dynamically adjusts its size so we don't push our links below the fold.",
				screen: "Fantastic, we've gotten exactly the effect we wanted. We have our info pane front and center, and the rest of our content is pushed down to the bottom. If we resize the window, we see that the info pane dynamically adjusts its size so we don't push our links below the fold.",
				audio: null//"/media/audio/cs256/flexbox/info-pane-flex-segue.mp3"
			}
		}]
	});

	return flexboxTask;
});