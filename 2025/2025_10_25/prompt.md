I would like to develop a tool that helps me learn to play, visualise and understand Steve Reich's 'Clapping Music'
I want the tool to be based on the following technologies:
 - Vue.js using vite and typescript (with standard js code styling)
 - Use primevue ui with tailwindcss for any ui and styling
 - Styling and layout should use minimal tailwindcss classes so I can undestand what's going on
 - an overall very modern and minimal layout, look and feel
 - wavesurfer js or Tone js or a combination of both depending on what is easier and more simple

In the first stage the tool should have the following basic functionality:
 1. Initially appear with a record button.
 2. The user hits record and can record themselves clapping or singing the intial base 'clapping music' rhythm (in mono).
 3. The user then selects a region of their recorded audio which is looped... the user can play with and adjust the two endpoints of this loop to get it sounding right. 
 4. The user can then choose to 'play clapping music' with this adjusted loop... in which the following happens: the length of the loop is used as a guide to assume that the loop defines the 12 beats of one measure of clapping music... the original loop is played in the left speaker and the right speaker plays the loop first at the same offset but then after x repeats it plays offset by one 12th of the length - this process keeps happening until the offsets end up that the loops start at the same offset eventually and we are back in time for x measures.
 5. For the 'play clapping music' there are pause/resume, stop and play controls. The user can adjust the x measures that loops play a particular offset (maybe they set this before they hit 'play clapping music')... the initial/default setting is 2 measures.
 6. I think there will be more complex visualisations and controls but they can come later once the basics are in place.

I would love it if you could structure your response in the following manner: like a Test Driven Development inspired step by step tutorial that gives a really quick and satisfying pathway to the basic endgoal (being able to just hear that process of Clapping music played through with the recorded audio)... and then circling back to add any bells and whistles, e.g. playing with layout and aesthetics. 
So for example the first steps should be really quickly getting up basic audio recording and playback, so as I follow along the steps given I can see and try out the results as I'm going and feel satisfied if I only have a small amount of time to work on it on a given day, I can just advance one step and see that I'm getting somewhere along the path.
Like maybe the adjust the loop region is a really fiddly part that takes a while - well that can wait until later as well - I guess its more important to be as quickly as possible listening to how "clapping music" sounds and having that time for its meaning and structure to sink in.
Remember a real goal is to have a tool that helps one to actually play clapping music by oneself, without the help of a computer. I'm hoping that by having this experience and letting the user be able to play with the building blocks of the structure of the piece they will be able to find their own way to break it down and be able to understand it.
I also have a hunch that hearing a computer play the piece with their own recorded audio will be like an encouragement to them: here's how it could and will sound when you learn how to do it... this is what you are aiming for kind of thing.
Thank you!
