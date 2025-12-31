I want to create a one page html application that does the following:
Synthesizes 20 minutes of audio that can be saved to an mp3 file when a button is pressed ("save as mp3").
The 20 minutes of synthesized audio adheres to a quite specific format the basic structure which might eventually be able to be specified or adjusted with a json file but for the moment is the following:
A macro structure of two parts: about 10 minutes of "guided breathing" and then 10 minutes of "free meditation"
The first guided breathing part has this structure:
20 second intro
Round 1: 1m30s of "breathing sounds" - there is a repetitive sound here that a listener can use to synchronise their breathing with the rhythm imposed by the audio. There are exactly 30 repetitions of this breath cycle sound that finish with a long and deep "exhale" sound (maybe that's twice as long as the normal exhale sound). The idea is that this sound could be as simple as a generated metronome "tick, tock" where the tick times the inhale and the tock signals the exhale but ideally I would like an option where if the user finds say a nice sound of ocean waves going in and out, they can drag and drop this sound clip to substitute that for the tick sound (and drag another ocean sound for the tock sound).
After this breathing part there is a 60 seconds of "breath holding" sound... this might be silence or it might be the ticking of a clock or maybe some bird chriping sounds... again there should be a basic synthesized option and a spot where the user can drop in a sound of there own that is repeated to fill up that time.
Then there is 15 seconds of "inhale deeply and hold" which starts with a long and deep breath in sound, continues for the 15 seconds and ends with the long breath out sound (the same that finished the "breathing sounds" rhythmic breathing part).
This is then followed by round 2...
Round 2: This is the same as round one (1m30s of breathing sounds that indicate the 30 breaths), then a breath hold part that is 1m30s (30 seconds longer than the Round 1 breath hold), then the 15 second inhale hold.
Round 3: This is exactly the same as Round 2 (1m30s for 30 rhythmic breaths, then 1m30s breath hold, then 15s deep inhale)
After the end of Round 3 this is the start of the roughly 10 minute "free meditation" part. The idea here is there is audio here or music that is kind of ambient but that also gives the idea of the passing time... like I wonder if some kind of slowly ascending scale or repeated pattern which slowly advances through the 12 keys of the circle of fifths to finally end up finishing at the end of the 20 minutes, so that the total audio time played is 20 minutes.
At the beginning of the free meditation part I would like the option that the user can drop in a vocal message that can be playing over the generated "passing of time" music. This message might last one or two minutes. 
It would be great if there were basic playback controls and a scrubable progress bar / transport so that users could preview the final audio and listen to parts of it before they push the "save as mp3" to render their result.
Again I'm hoping this can be quite a simple one page html app with nothing needed to be saved to a server or database or anything.
When the page first loads up, you can already hit play and hear the skeleton of the struture and scrub through it and then if the user wants they can drag and drop audio into the various slots to add their own touch and customise things.

