define(['app-controller', 'controllers/home-ui-controller', 'tasks/task', 'tasks/flexbox/menu-items-grid-a-flex'], function(AppController, HomeUIController, Task, nextTask) {

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
			console: "If you resize the window down small enough (feel free to try this now), you'll see the links start overlapping each other, and running off the right side of the page. This isn't really what we want. We'd like the links to wrap around if the window gets too small, so let's tell '.menu-items-grid' that we want its children to wrap.",
			screen: "If you resize the window down small enough (feel free to try this now), you'll see the links start overlapping each other, and running off the right side of the page. This isn't really what we want. We'd like the links to wrap around if the window gets too small, so let's tell '.menu-items-grid' that we want its children to wrap.",
			audio: null//"/audio/tasks/flexbox/menu-items-grid-wrap.mp3"
		},
		pointsNecessary: 1,
		tests: [{
			targets: ".menu-items-grid",
			description: "set the section '.menu-items-grid' to 'flex-wrap: wrap'",
			predicate: function(targets) {
				return targets.every(function(target) {
					return window.getComputedStyle(target).getPropertyValue('flex-wrap') === 'wrap';
				});
			},
			next: nextTask,
			points: 1,
			segue: {
				console: "Ok, if we resize the window now, we see the links wrapping around to the next line. It's still not perfect, and we'll see how to improve this behavior further in the next lesson, but it's good for now.",
				screen: "Ok, if we resize the window now, we see the links wrapping around to the next line. It's still not perfect, and we'll see how to improve this behavior further in the next lesson, but it's good for now.",
				audio: null//"/media/audio/cs256/flexbox/menu-items-grid-wrap-segue.mp3"
			}
		}]
	});

	return flexboxTask;
});