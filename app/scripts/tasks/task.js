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
 *         target: <DOM>,
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
 * is instantiated.
 *
 * 'pointsNecessary' is an integer indicating how many points are
 * necessary before moving onto the 'next' Task.
 *
 * 'tests' is an Array of Objects containing the 'target' DOM element to
 * observe, the 'predicate' with which to test a mutation of 'target'
 * against, the 'next' Task to run upon success of the 'predicate', an
 * integer 'points' indicating how many points triggering this test should
 * be worth, and a 'segue' message to display/play to the user
 * before running the 'next' Task.
 *
 */

/* TODO:
 *
 * - Refactor config to be a requirejs dependency
 * - Refactor screen display into something not sucky
 * - Refactor graph of tasks as requirejs dependencies
 * 
 */
define(['howler', 'polymer'], function(howler, polymer) {
	var currentPlaying = null;
	var taskList = document.querySelector('#tasks');
	var caption = document.querySelector('#caption');

	return function Task(taskConfig) {
		return function() {
			// Start loading instruction sound file in case it takes awhile.
			var instructions = new howler.Howl({
				urls: [taskConfig.instructions.audio],
				onloaderror: function(error) {
					console.log('Howler encountered error: ', error);
					instructions = null;
				}
			});

			var currentPoints = 0;
			var tasks = [];

			taskConfig.tests.forEach(function(test) {
				// We set observer out here so that we can access it later
				// to disconnect it.
				var observer = null;
				tasks.push(test.description);

				// Start loading segue sound file in case it takes awhile.
				var segue = new Howl({
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
						// Supposed to fire if the sound file fails to load for
						// whatever reason, but doesn't actually work. The idea
						// was to use this for detecting when we should check
						// whether we should move onto the next Task, after
						// the segue finishes playing, or inside the actual
						// MutationObserver.
						//
						// WTF Howler?!
						console.log('Howler encountered error: ', error);
						segue = null;
					}
				});

				// Create a new MutationObserver, and immediately start observing
				// the specified target for changes.
				if (taskConfig.initObserver) {
					(new MutationObserver(function(mutations) {
						// Set observer for later disconnection.
						observer = this;

						mutations.forEach(function(mutation) {
							// Check if the test has been passed by running the mutation
							// through test.predicate. If so, disconnect the observer,
							// increment currentPoints by how much this test is worth,
							// and run ALL THE SEGUES.
							// If we've racked up enough points, move onto the next Task.

							if(test.predicate(mutation)) {
								observer.disconnect();
								if (currentPlaying) {
									currentPlaying.stop();
								}

								currentPoints += test.points;

								console.log(test.segue.console);
								if (caption) {
									caption.innerHTML = test.segue.screen;
								}

								if (segue) {
									currentPlaying = segue;
									segue.play();
								} else if (currentPoints >= taskConfig.pointsNecessary) {
									(window[test.next])();
								}
							}
						});
					})).observe(test.target, taskConfig.initObserver);
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
			instructions.play();
		};
	};
});

