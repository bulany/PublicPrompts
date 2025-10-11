Srgy Surkv's project webaudiofont (https://github.com/surikov/webaudiofont) is a fantastic implentation of a sample set player and also a good set of samples for different instruments.
I recently used parts of it in a vue.js typescript project where I was looking for this kind of solution.
I just wanted to be able to play a sequence of midi notes with a piano sound.
I looked at using various tone.js piano options but they either weren't maintained or the sample sets were too large and over the top for my needs.
I wanted to simply be able to write something like:
```
npm install tone
npm install midi_sample_player # installs the midi player code
npm install midi_sample_player_piano_sound # installs the sample set for just a small piano (e.g. the fluid synth piano)
```
The idea being that after this in say your vue project you can just write something like
```
sampleplayer.loadSound('piano')
sampleplayer.playNotes([{start_time: 1.2, end_time: 1.5, pitch: 69, velocity: 80}, {start_time: 2.2, end_time: 2.5, pitch: 81, velocity: 80}])
```
And in your app you'll hear those notes played nicely.
In my adaption I used tone.js to do the sequencing of calling the queueWaveTable() function.
Also, importantly, the soundbank of samples is installed in the node_modules folder so that this works completely offline (and so is also pretty quick to load for the first time etc)
My question is, what is the best practice way one would go about packaging and releasing this so other people could use it?
It uses significant parts of surikov's project, so would it be good to start it as a fork of his?
If it was started as a fork, I think the first step would be brutally deleting and reorganising things so that it wouldn't really resemble the original project structure.
What do people normally do in this kind of situation where I would like to make it clear that the core code is coming from surikov's project.
Also if you could talk me through this kind of thing step by step, up to and including going from a github repo to how to set it up as an npm release... also if you have reccommendations about what would be the best install workflow so people can get up and running with a simple piano as quickly and painlessly as possible... eg should it just be
```
npm install vite@latest # get your project started
npm install simple_piano # get the piano part installed
# start coding
```
If you have any suggestions on naming conventions also... I see a lot of things I don't understand with the naming of npm packages. Ideally this project would have options to install each individual instrument that surkov offers so I don't know how the npm command should look for that...