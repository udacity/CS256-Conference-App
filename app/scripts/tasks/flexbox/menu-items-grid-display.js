define(['app-controller', 'controllers/home-ui-controller', 'tasks/task', 'tasks/flexbox/menu-items-grid-justify'], function(AppController, HomeUIController, Task, nextTask) {

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
			console: "Next let's take a look at the section containing our links, the one with class 'menu-items-grid'. If you look at its children, you can see that the buttons are really inline 'a' tags containing spans. We'd like to lay these out with flexbox as well. Go ahead and set this section to 'display: flex'.",
			screen: "Next let's take a look at the section containing our links, the one with class 'menu-items-grid'. If you look at its children, you can see that the buttons are really inline 'a' tags containing spans. We'd like to lay these out with flexbox as well. Go ahead and set this section to 'display: flex'.",
			audio: null//"/audio/tasks/flexbox/menu-items-grid-display.mp3"
		},
		pointsNecessary: 1,
		tests: [{
			targets: ".menu-items-grid",
			description: "set the section '.menu-items-grid' to 'display: flex'",
			predicate: function(targets) {
				return targets.every(function(target) {
					return window.getComputedStyle(target).getPropertyValue('display') === 'flex';
				});
			},
			next: nextTask,
			points: 1,
			segue: {
				console: "This doesn't change the look of the menu-items too much, so let's do that next.",
				screen: "This doesn't change the look of the menu-items too much, so let's do that next.",
				audio: null//"/media/audio/cs256/flexbox/menu-items-grid-display-segue.mp3"
			}
		}]
	});

	return flexboxTask;
});