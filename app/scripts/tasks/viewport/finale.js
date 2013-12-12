
define(['tasks/task'], function(Task) {
	var viewportFinale = new Task({
		instructions: {
			console: "Congratulations, now that we've set the viewport, we can start building a responsive layout. Let's move onto the next lesson to learn how to do that.",
			screen: "Congratulations, now that we've set the viewport, we can start building a responsive layout. Let's move onto the next lesson to learn how to do that.",
			audio: null//"/audio/tasks/viewport/finale.mp3"
		},
		tests: []
	});

	return viewportFinale;
});