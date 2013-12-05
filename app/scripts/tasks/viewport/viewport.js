
define(['tasks/task', 'tasks/viewport/finale'], function(Task, finale) {
	var viewportTest = function(mutation) {
		var node = null;
		var name = null;
		var content = null;

		if (mutation.addedNodes[0].nodeName === "META") {
			node = mutation.addedNodes[0];
		} else if (mutation.target.nodeName === "META") {
			node = mutation.target;
		}

		if (node) {
			name = node.getAttribute('name');
			content = node.getAttribute('content');
		}

		return (name === 'viewport' && content === 'width=device-width');
	};

	var viewport = new Task({
		initObserver: {
			attributes: true,
			attributeFilter: ['name', 'content'],
			childList: true,
			subtree: true
		},
		instructions: {
			console: "Setting the viewport is relatively simple. Open up the Elements tab in your developer tools, and add a <meta> tag with the name attribute set to 'viewport' and the content attribute set to 'width=device-width'.",
			screen: "Setting the viewport is relatively simple. Open up the Elements tab in your developer tools, and add a <meta> tag with the name attribute set to 'viewport' and the content attribute set to 'width=device-width'.",
			audio: "/audio/tasks/viewport/viewportIntroduction.mp3"
		},
		pointsNecessary: 1,
		tests: [{
			target: document.querySelector('head'),
			description: "create a <meta name='viewport' content='width=device-width'> tag in the document head.",
			predicate: viewportTest,
			next: finale,
			points: 1,
			segue: {
				console: "Good job! I know this seemed pretty simple, but it's a necessary first step to making sure a web app can adapt well to arbitrary devices.",
				screen: "Good job! I know this seemed pretty simple, but it's a necessary first step to making sure a web app can adapt well to arbitrary devices.",
				audio: "/audio/tasks/viewport/viewportSegue.mp3"
			}
		}]
	});

	return viewport;
});