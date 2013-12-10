/*
 *
 * Task takes an Object 'taskConfig' with the following structure:
 *
 * {
 *     instructions: {
 *         console: <String>,
 *         screen: <String>,
 *         audio: <URL>
 *     },
 *     pointsNecessary: <Integer>,
 *     tests: [{
 *         targets: <CSS QuerySelector String>,
 *         predicate: <Function>,
 *         points: <Integer>,
 *         next: <Task>,
 *         segue: {
 *             console: <String>,
 *             screen: <String>,
 *             audio: <URL>
 *         }
 *     },
 *     ...]
 * }
 *
 * and the following semantics:
 * 
 * 'instructions' is an Object containing the initial instructions given
 * to the student. These are displayed/played immediately when the task
 * is instantiated. Instructions can be played in the console. in audio
 * form, or in a DOM Element with id 'caption'.
 *
 * 'pointsNecessary' is an integer indicating how many points are
 * necessary before moving onto the 'next' Task.
 *
 * 'tests' is an Array of Objects containing
 * - the 'targets' DOM elements to observe in the form of a CSS QuerySelector
 *   String
 * - the 'predicate' with which to test the 'targets' against, returns Boolean
 * - the 'next' Task to run upon success of the 'predicate'
 * - an integer 'points' indicating how many points triggering this test should
 *   be worth
 * - a 'segue' object of the same structure as the 'instructions' object to
 *   display/play to the user upon 'predicate' returning true. The next Task
 *   runs after this.
 *
 */

/* TODO:
 * - Refactor screen display into something not sucky
 */
define(['howler'], function(howler) {
	var currentPlaying = null;
	var taskList = document.querySelector('#tasks');
	var caption = document.querySelector('#caption');

	return function Task(taskConfig) {
		return function() {
			var instructions = null;
			var segue = null;

			// Start loading instruction sound file in case it takes awhile.
			if (taskConfig.instructions.audio) {
				instructions = new howler.Howl({
					urls: [taskConfig.instructions.audio],
					onloaderror: function(error) {
						console.log('Howler encountered error: ', error);
						instructions = null;
					},
					onend: function(event) {
						// If we have no predicate to test against, just play the next
						// task, if available.
						if (taskConfig.tests[0] &&
							taskConfig.tests[0].predicate === null &&
							taskConfig.tests[0].next !== null) {
							taskConfig.tests[0].next();
						}
					}
				});
			}

			var currentPoints = 0;
			var tasks = [];

			taskConfig.tests.forEach(function(test) {
				if (test.predicate !== null) {
					if (test.description) {
						tasks.push(test.description);
					}

					// Start loading segue sound file in case it takes awhile.
					if (test.segue && test.segue.audio) {
						segue = new Howl({
							urls: [test.segue.audio],
							onend: function(event) {
								// When the sound file stops playing, check if we can
								// move onto the next Task.
								if (currentPoints >= taskConfig.pointsNecessary) {
									if (taskList) {
										taskList.innerHTML = '';
									}
									test.next();
								}
							},
							onloaderror: function(error) {
								console.log('Howler encountered error: ', error);
								segue = null;
							}
						});
					}

					// Rewritten from MutationObserver version to polling version
					// 
					// Reasons for this:
					// 
					// 1) MutationObserver ran into issues with DOM element not being
					// fully loaded before trying to run. This is... fixed, but brittle.
					// Polling is distasteful, but should be simple to silently fail if
					// the DOM element isn't loaded yet.
					// 
					// 2) MutationObserver does not fire on any computed changes to the
					// DOM element's style. Rather, it only fires when the underlying
					// element changes. This causes issues when students change, for
					// example, a style attached to a class rather than the single
					// element.
					var pollObserver = setInterval(function() {
						// Grab the DOM elements matching the target, then immediately convert from a
						// DOMList to an Array, because seriously why, Javascript? Why?!
						var targets = Array.prototype.slice.call(document.querySelectorAll(test.targets));

						if(targets.length > 0) {
							// Check if predicate passes, then immediately clear further polling
							if (test.predicate(targets)) {
								clearInterval(pollObserver);

								// Stop any currently playing audio before we start playing more
								if (currentPlaying) {
									currentPlaying.stop();
								}

								// Increment student's accumulated points for this task
								currentPoints += test.points;

								// Display segue info if it exists
								if (test.segue) {
									console.log(test.segue.console);
									console.log('\n\n\n');
									if (caption) {
										caption.innerHTML = test.segue.screen;
									}
								}

								// Play segue audio if it exists, otherwise immediately check
								// for accumulation of enough points to move on to the next
								// task.
								if (segue) {
									currentPlaying = segue;
									segue.play();
								} else if (currentPoints >= taskConfig.pointsNecessary) {
									if (taskList) {
										taskList.innerHTML = '';
									}
									test.next();
								}
							}
						}
					}, 300);
				}
			});

			// Once everything is setup, run ALL THE INSTRUCTIONS.
			console.log(taskConfig.instructions.console);

			if (caption) {
				caption.innerHTML = taskConfig.instructions.screen;
			}

			tasks.forEach(function(task) {
				if (taskList) {
					taskList.append('<li class="task">' + task + '</li>');
				}
				console.log(task);
			});

			if (currentPlaying) {
				currentPlaying.stop();
			}

			currentPlaying = instructions;

			if (instructions) {
				instructions.play();
			} else if (taskConfig.tests[0] &&
				taskConfig.tests[0].predicate === null &&
				taskConfig.tests[0].next !== null) {
				taskConfig.tests[0].next();
			}
		};
	};
});

