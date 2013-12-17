define(['tasks/task'], function(Task) {

	var task = new Task({
		instructions: {
			console: "This is actually all we need to make our homepage look good across multiple layouts. The combination of flexbox and minimal media queries is a powerful one that allows us to do a lot with minimal code.",
			screen: "This is actually all we need to make our homepage look good across multiple layouts. The combination of flexbox and minimal media queries is a powerful one that allows us to do a lot with minimal code.",
			audio: null//"/audio/tasks/flexbox/finale.mp3"
		},
		pointsNecessary: 1,
		tests: []
	});

	return task;
});