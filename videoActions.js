// Global variable popUpProblemTimer is defined in the HTML.
var videoActions = videoActions || {};
$(document).ready(function() {

	// Declaring semi-global variables for later use.
	var video = $('.video');
	var state;
	var time;
	var problemCounter;
	var skipEmAll;
	var protectedTime = false;
	var problemsBeingShown = 0;

	function addVideoPlayPauseListeners() {
		// Log play/pause events from the player.
		// Also set the play/pause external control properly.
		video.on('pause', function() {
			Logger.log("harvardx.video_embedded_problems", {
				"video_event" : "pause"
			});
			console.log('pause');
			$('#playpauseicon').html('&#8227;');
			$('#playpauseword').html('Play');
		});

		video.on('play', function() {
			Logger.log("harvardx.video_embedded_problems", {
				"video_event" : "play"
			});
			console.log('play');
			// Also set the play/pause external control properly.
			$('#playpauseicon').html('||');
			// Need a better-looking pause icon.
			$('#playpauseword').html('Pause');
		});

	}


	console.log('ready');
	var waitForVid = setInterval(function() {

		state = video.data('video-player-state');
		//console.log('state',state);
		// Sometimes this fails and that's ok.
		if (!state) {
			console.log('loading video..')
		}

		if (state /*&& state.videoPlayer.isCued()*/) {
			console.log('video data loaded');
			clearInterval(waitForVid);
			var pause = setTimeout(function() {
				console.log('done waiting');
				//setUpData();
				//setUpControls();
				mainLoop();
			}, 0);
		}
	}, 100);
	var currentEvent = 0;
	// Every 500 ms, check to see whether we're going to add a new problem.
	function mainLoop() {

		var timeChecker = setInterval(function() {

			state.videoPlayer.update();
			// Forced update of time. Required for Safari.
			time = state.videoPlayer.currentTime;

			console.log('time:', time);
			_.each(popUpProblemTimer, function(obj) {
				if (time >= obj.start && time < obj.end) {
					console.log(obj);
					videoActions.actionFunction(time, obj);
				}
				else{
					videoActions.actionFunction(time, null);
				}
			})

		}, 500);

	}

	function changeSlides(time, obj) {
		$(videoActions.slidePlaceholder).attr("src", obj.url);
	}

	function popUpQuestion() {

	}


	videoActions.changeSlides = changeSlides;
	videoActions.popUpQuestion = popUpQuestion;

	videoActions.addVideoPlayPauseListeners = addVideoPlayPauseListeners;

	//api calls should be else where
	videoActions.actionFunction = changeSlides;
	videoActions.slidePlaceholder = '#slideImage';
	videoActions.addVideoPlayPauseListeners();

});

