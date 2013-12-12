
define(['tasks/task', 'tasks/viewport/finale'], function(Task, finale) {
	var viewportTest = function(targets) {
		for (var i = 0; i < targets.length; i++) {
			if (targets[i].getAttribute('name') == 'viewport' && targets[i].getAttribute('content') === 'width=device-width') {
				return true;
			}
		}

		return false;
	};

	var viewport = new Task({
		instructions: {
			console: "Setting the viewport is relatively simple. Open up the Elements tab in your developer tools, and add a <meta> tag with the name attribute set to 'viewport' and the content attribute set to 'width=device-width'. Note that, if you're doing this in the Udacity classroom, make sure you set the viewport inside the iframe, rather than the outer one for the classroom page itself.",
			screen: "Setting the viewport is relatively simple. Open up the Elements tab in your developer tools, and add a <meta> tag with the name attribute set to 'viewport' and the content attribute set to 'width=device-width'. Note that, if you're doing this in the Udacity classroom, make sure you set the viewport inside the iframe, rather than the outer one for the classroom page itself.",
			audio: null//"/audio/tasks/viewport/viewportIntroduction.mp3"
		},
		pointsNecessary: 1,
		tests: [{
			targets: 'meta',
			description: "create a <meta name='viewport' content='width=device-width'> tag in the document head.",
			predicate: viewportTest,
			next: finale,
			points: 1,
			segue: {
				console: "Good job! I know this seemed pretty simple, but it's a necessary first step to making sure a web app can adapt well to arbitrary devices.",
				screen: "Good job! I know this seemed pretty simple, but it's a necessary first step to making sure a web app can adapt well to arbitrary devices.",
				audio: null//"/audio/tasks/viewport/viewportSegue.mp3"
			}
		}]
	});

	return viewport;
});