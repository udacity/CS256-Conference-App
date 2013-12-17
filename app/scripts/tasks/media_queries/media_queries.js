define(['app-controller', 'controllers/home-ui-controller', 'tasks/task', 'tasks/media_queries/home-ui'], function(AppController, HomeUIController, Task, nextTask) {

    // @media (min-width: $menuItemBreakPoint) {
    //  a {
    //      flex: 0 24%;
    //  }
    // }
	var task = new Task({
		instructions: {
			console: "Now let's apply what we know about media queries to our app. Take a look at the '.menu-items-grid a'. It currently has a flex attribute set to '0 46%', meaning each tag by default takes up 46% of the available space. This causes a wrapped, two column layout on phones, but doesn't look great on larger displays. The buttons are just too big.",
			screen: "Now let's apply what we know about media queries to our app. Take a look at the '.menu-items-grid a'. It currently has a flex attribute set to '0 46%', meaning each tag by default takes up 46% of the available space. This causes a wrapped, two column layout on phones, but doesn't look great on larger displays. The buttons are just too big.",
			audio: null//"/audio/tasks/flexbox/flexbox.mp3"
		},
		pointsNecessary: 1,
		tests: [{
			predicate: null,
			next: nextTask
		}]
	});

	return task;
});