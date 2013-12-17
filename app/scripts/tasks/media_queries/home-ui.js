define(['app-controller', 'controllers/home-ui-controller', 'tasks/task', 'tasks/media_queries/finale'], function(AppController, HomeUIController, Task, nextTask) {

	var task = new Task({
		instructions: {
			console: "Let's adjust it back to '0 24%' if the 'min-width' is greater than a certain breakpoint, say '500px'. That is, let's write a media query for this, so that we still have a pleasant two column layout for smaller devices.",
			screen: "Let's adjust it back to '0 24%' if the 'min-width' is greater than a certain breakpoint, say '500px'. That is, let's write a media query for this, so that we still have a pleasant two column layout for smaller devices.",
			audio: null//"/audio/tasks/flexbox/home-ui-direction.mp3"
		},
		pointsNecessary: 1,
		tests: [{
			targets: ".menu-items-grid a",
			description: "set '.menu-items-grid a' to 'flex: 0 24%'",
			predicate: function(targets) {
				return targets.every(function(target) {
					return window.getComputedStyle(target).getPropertyValue('flex') === '0 24%';
				});
			},
			next: nextTask,
			points: 1,
			segue: {
				console: "Fantastic, now we have a site that switches between our target layouts, and that scales smoothly for smaller changes using flexbox.",
				screen: "Fantastic, now we have a site that switches between our target layouts, and that scales smoothly for smaller changes using flexbox.",
				audio: null//"/media/audio/cs256/flexbox/home-ui-direction-segue.mp3"
			}
		}]
	});

	return task;
});