/*global define */
define(['speakers-model'], function (speakersModel) {
    'use strict';

    var exports = {};

	var speakers = null;

	function sortSpeakers() {
		if (speakers && (speakers instanceof Array))
			speakers.sort(function(a, b){
				var nameA=a.last_name.toLowerCase(), 
				    nameB=b.last_name.toLowerCase();
				if (nameA < nameB) //sort string ascending
					return -1 
				if (nameA > nameB)
					return 1
				return 0 //default return value (no sorting)
			});
	}

/*
<section class="speaker">
    <img class="avatar" src="../images/speakers/cwilso.192.jpg">
    <section class="speaker-info">
        <h2 class="speaker-name">Chris Wilson</h2>
        <section class="talks">
            <section class="chrome track">
                <h2></h2>
                <section class="talk">
                    <h4 class="bold">Rocking Out with Web MIDI</h4>
                    <p>3:45PM Wednesday, Room 1</p>
                </section>
            </section>
            <section class="android track">
                <h2></h2>
                <section class="talk">
                    <h4 class="bold">Android's Audio Stack</h4>
                    <p>12:00PM Wednesday, Room 5</p>
                </section>
            </section>
        </section>
    </section>
</section>
*/


	function generateSpeakerHTML( speaker ) {
		var listItem = document.createElement("li");
		listItem.className = "speaker";
		listItem.id = speaker.speaker_id;

		var thumbnailContainer = document.createElement("div");
		thumbnailContainer.className = "speaker-thumbnail-container";

		var thumbnail = new Image();
		thumbnail.src = speaker.thumbnail_url ? speaker.thumbnail_url : "../images/speaker_placeholder.png";
		thumbnail.className = "speaker-thumbnail";

		thumbnailContainer.appendChild(thumbnail);

		var speakerInfo = document.createElement("section");
		speakerInfo.className = "speaker-info";

		var speakerName = document.createElement("h2");
		speakerName.className = "speaker-name";
		speakerName.innerText = speaker.display_name;

		var talksList = document.createElement("ol");
		talksList.className = "speaker-talks";

		var talkTitle = document.createElement("li");
		talkTitle.innerText = "Creating Great Lorem Ipsum Texts";
		talkTitle.className = "talk-title";
		talksList.appendChild(talkTitle);

		//var talkTime = document.createElement("div");
		//talkTime.innerText = "11:00AM Thursday";
		//talkTime.className = "talk-time";
		//talksList.appendChild(talkTime);

		speakerInfo.appendChild(speakerName);
		speakerInfo.appendChild(talksList);

		listItem.appendChild(thumbnailContainer);
		listItem.appendChild(speakerInfo);

		return listItem;
	}

	function regenerateSpeakers() {
		var speakerList = document.getElementById("speaker-list");
		while (speakerList.hasChildNodes()) {
			speakerList.removeChild(speakerList.childNodes[0]);
		}

		//var placeholder = document.createElement("section");
		for (var i=0; i < speakers.length; i++) {
			speakerList.appendChild(generateSpeakerHTML(speakers[i]));
		}

		//insert.appendChild(placeholder);
	}

	// TEMPORARY code - TODO: replace with JSON loading
// via var jsonResponse = JSON.parse(req.responseText);
	speakers = speakersModel.speakers;

	sortSpeakers();
	regenerateSpeakers();
});
