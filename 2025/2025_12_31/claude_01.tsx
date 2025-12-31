import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Download, Upload } from 'lucide-react';
import * as Tone from 'tone';

const BreathingMeditationSynth = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [customSounds, setCustomSounds] = useState({
    inhale: null,
    exhale: null,
    breathHold: null,
    deepInhale: null,
    deepExhale: null,
    vocalMessage: null
  });
  
  const playerRef = useRef(null);
  const animationFrameRef = useRef(null);
  const audioBufferRef = useRef(null);
  const totalDuration = 20 * 60; // 20 minutes in seconds

  // Structure definition
  const structure = {
    intro: { start: 0, duration: 20 },
    round1: {
      breathing: { start: 20, duration: 90, breaths: 30 },
      hold: { start: 110, duration: 60 },
      deepInhale: { start: 170, duration: 15 }
    },
    round2: {
      breathing: { start: 185, duration: 90, breaths: 30 },
      hold: { start: 275, duration: 90 },
      deepInhale: { start: 365, duration: 15 }
    },
    round3: {
      breathing: { start: 380, duration: 90, breaths: 30 },
      hold: { start: 470, duration: 90 },
      deepInhale: { start: 560, duration: 15 }
    },
    freeMeditation: { start: 575, duration: 625 }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getCurrentSection = (time) => {
    if (time < structure.intro.start + structure.intro.duration) return 'Intro';
    if (time < structure.round1.hold.start) return 'Round 1 - Breathing';
    if (time < structure.round1.deepInhale.start) return 'Round 1 - Hold';
    if (time < structure.round2.breathing.start) return 'Round 1 - Deep Inhale';
    if (time < structure.round2.hold.start) return 'Round 2 - Breathing';
    if (time < structure.round2.deepInhale.start) return 'Round 2 - Hold';
    if (time < structure.round3.breathing.start) return 'Round 2 - Deep Inhale';
    if (time < structure.round3.hold.start) return 'Round 3 - Breathing';
    if (time < structure.round3.deepInhale.start) return 'Round 3 - Hold';
    if (time < structure.freeMeditation.start) return 'Round 3 - Deep Inhale';
    return 'Free Meditation';
  };

  const generateAudio = async () => {
    await Tone.start();
    
    const offline = new Tone.Offline(async ({ transport }) => {
      const synth = new Tone.Synth({
        oscillator: { type: 'sine' },
        envelope: { attack: 0.1, decay: 0.2, sustain: 0.3, release: 0.8 }
      }).toDestination();

      const noiseSynth = new Tone.NoiseSynth({
        noise: { type: 'pink' },
        envelope: { attack: 0.5, decay: 0.3, sustain: 0.5, release: 1.5 }
      }).toDestination();

      // Intro bell
      transport.schedule((time) => {
        synth.triggerAttackRelease('C5', '2n', time);
      }, structure.intro.start);

      // Generate breathing sounds for each round
      const generateBreathing = (round) => {
        const breathDuration = round.breathing.duration / round.breathing.breaths;
        for (let i = 0; i < round.breathing.breaths; i++) {
          const breathStart = round.breathing.start + (i * breathDuration);
          
          // Inhale sound (rising pitch)
          transport.schedule((time) => {
            if (customSounds.inhale) {
              // Use custom sound
            } else {
              synth.triggerAttackRelease('A3', breathDuration / 2 - 0.1, time);
            }
          }, breathStart);

          // Exhale sound (falling pitch)
          const isLastBreath = i === round.breathing.breaths - 1;
          const exhaleDuration = isLastBreath ? breathDuration : breathDuration / 2;
          
          transport.schedule((time) => {
            if (customSounds.exhale) {
              // Use custom sound
            } else {
              synth.triggerAttackRelease('D3', exhaleDuration - 0.1, time);
            }
          }, breathStart + breathDuration / 2);
        }
      };

      // Breathing for all rounds
      generateBreathing(structure.round1);
      generateBreathing(structure.round2);
      generateBreathing(structure.round3);

      // Breath hold ticking for each round
      const generateHoldTicking = (holdSection) => {
        const tickInterval = 1; // 1 second ticks
        const numTicks = Math.floor(holdSection.duration / tickInterval);
        
        for (let i = 0; i < numTicks; i++) {
          transport.schedule((time) => {
            synth.triggerAttackRelease('C4', '16n', time);
          }, holdSection.start + (i * tickInterval));
        }
      };

      generateHoldTicking(structure.round1.hold);
      generateHoldTicking(structure.round2.hold);
      generateHoldTicking(structure.round3.hold);

      // Deep inhale sections
      [structure.round1.deepInhale, structure.round2.deepInhale, structure.round3.deepInhale].forEach((section) => {
        transport.schedule((time) => {
          noiseSynth.triggerAttackRelease('1n', time);
        }, section.start);
        
        transport.schedule((time) => {
          noiseSynth.triggerAttackRelease('2n', time);
        }, section.start + section.duration - 2);
      });

      // Free meditation - circle of fifths progression
      const freeMed = structure.freeMeditation;
      const keys = ['C4', 'G4', 'D4', 'A4', 'E4', 'B3', 'F#3', 'C#4', 'G#3', 'D#4', 'A#3', 'F4'];
      const chordDuration = freeMed.duration / keys.length;
      
      const padSynth = new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: 'sine' },
        envelope: { attack: 3, decay: 2, sustain: 0.7, release: 4 }
      }).toDestination();
      
      padSynth.volume.value = -12;

      keys.forEach((root, i) => {
        const chordStart = freeMed.start + (i * chordDuration);
        const baseNote = Tone.Frequency(root).toMidi();
        const chord = [
          Tone.Frequency(baseNote, 'midi').toNote(),
          Tone.Frequency(baseNote + 4, 'midi').toNote(),
          Tone.Frequency(baseNote + 7, 'midi').toNote()
        ];
        
        transport.schedule((time) => {
          padSynth.triggerAttackRelease(chord, chordDuration + 2, time);
        }, chordStart);
      });

      transport.start(0);
    }, totalDuration);

    return await offline.render();
  };

  const handlePlayPause = async () => {
    if (!playerRef.current) {
      if (!audioBufferRef.current) {
        audioBufferRef.current = await generateAudio();
      }
      
      playerRef.current = new Tone.Player(audioBufferRef.current).toDestination();
      await playerRef.current.load(audioBufferRef.current);
    }

    if (isPlaying) {
      playerRef.current.stop();
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      setIsPlaying(false);
    } else {
      await Tone.start();
      playerRef.current.start(0, currentTime);
      setIsPlaying(true);
      
      const startTime = Tone.now();
      const startPosition = currentTime;
      
      const updateTime = () => {
        const elapsed = Tone.now() - startTime;
        const newTime = startPosition + elapsed;
        
        if (newTime >= totalDuration) {
          setCurrentTime(totalDuration);
          setIsPlaying(false);
          playerRef.current.stop();
        } else {
          setCurrentTime(newTime);
          animationFrameRef.current = requestAnimationFrame(updateTime);
        }
      };
      
      updateTime();
    }
  };

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const newTime = percentage * totalDuration;
    
    setCurrentTime(newTime);
    
    if (playerRef.current) {
      const wasPlaying = isPlaying;
      playerRef.current.stop();
      
      if (wasPlaying) {
        playerRef.current.start(0, newTime);
      }
    }
  };

  const handleFileUpload = (type, e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const arrayBuffer = event.target.result;
        const audioContext = new AudioContext();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        
        setCustomSounds(prev => ({
          ...prev,
          [type]: audioBuffer
        }));
        
        // Reset audio buffer to regenerate with new sounds
        audioBufferRef.current = null;
        if (playerRef.current) {
          playerRef.current.dispose();
          playerRef.current = null;
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const handleSaveMP3 = async () => {
    setIsGenerating(true);
    
    try {
      if (!audioBufferRef.current) {
        audioBufferRef.current = await generateAudio();
      }

      // Convert Tone.js buffer to WAV (MP3 encoding requires additional libraries)
      const buffer = audioBufferRef.current;
      const wav = audioBufferToWav(buffer);
      const blob = new Blob([wav], { type: 'audio/wav' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = 'breathing-meditation.wav';
      a.click();
      
      URL.revokeObjectURL(url);
    } finally {
      setIsGenerating(false);
    }
  };

  const audioBufferToWav = (buffer) => {
    const length = buffer.length * buffer.numberOfChannels * 2;
    const arrayBuffer = new ArrayBuffer(44 + length);
    const view = new DataView(arrayBuffer);
    const channels = [];
    let offset = 0;
    let pos = 0;

    // Write WAV header
    const setUint16 = (data) => {
      view.setUint16(pos, data, true);
      pos += 2;
    };
    const setUint32 = (data) => {
      view.setUint32(pos, data, true);
      pos += 4;
    };

    setUint32(0x46464952); // "RIFF"
    setUint32(36 + length); // file length
    setUint32(0x45564157); // "WAVE"
    setUint32(0x20746d66); // "fmt "
    setUint32(16); // chunk size
    setUint16(1); // PCM
    setUint16(buffer.numberOfChannels);
    setUint32(buffer.sampleRate);
    setUint32(buffer.sampleRate * 2 * buffer.numberOfChannels);
    setUint16(buffer.numberOfChannels * 2);
    setUint16(16); // bits per sample
    setUint32(0x61746164); // "data"
    setUint32(length);

    // Write audio data
    for (let i = 0; i < buffer.numberOfChannels; i++) {
      channels.push(buffer.toArray(i));
    }

    while (pos < arrayBuffer.byteLength) {
      for (let i = 0; i < buffer.numberOfChannels; i++) {
        const sample = Math.max(-1, Math.min(1, channels[i][offset]));
        view.setInt16(pos, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
        pos += 2;
      }
      offset++;
    }

    return arrayBuffer;
  };

  useEffect(() => {
    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Breathing Meditation Synthesizer</h1>
        <p className="text-gray-600 mb-8">Create your custom 20-minute guided breathing and meditation audio</p>

        {/* Playback Controls */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm font-medium text-gray-700">
              {getCurrentSection(currentTime)}
            </div>
            <div className="text-2xl font-mono text-gray-800">
              {formatTime(currentTime)} / {formatTime(totalDuration)}
            </div>
          </div>

          {/* Progress Bar */}
          <div 
            className="w-full h-3 bg-gray-200 rounded-full cursor-pointer mb-6 relative overflow-hidden"
            onClick={handleSeek}
          >
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all"
              style={{ width: `${(currentTime / totalDuration) * 100}%` }}
            />
          </div>

          {/* Play/Pause Button */}
          <div className="flex justify-center gap-4">
            <button
              onClick={handlePlayPause}
              className="flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium text-lg"
            >
              {isPlaying ? <Pause size={24} /> : <Play size={24} />}
              {isPlaying ? 'Pause' : 'Play'}
            </button>
            
            <button
              onClick={handleSaveMP3}
              disabled={isGenerating}
              className="flex items-center gap-2 px-8 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-lg disabled:bg-gray-400"
            >
              <Download size={24} />
              {isGenerating ? 'Generating...' : 'Save as WAV'}
            </button>
          </div>
        </div>

        {/* Custom Sound Uploads */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-indigo-400 transition-colors">
            <label className="flex flex-col items-center cursor-pointer">
              <Upload className="text-gray-400 mb-2" size={32} />
              <span className="text-sm font-medium text-gray-700 mb-1">Inhale Sound</span>
              <span className="text-xs text-gray-500 text-center">Drop audio file or click to upload</span>
              <input 
                type="file" 
                accept="audio/*" 
                className="hidden"
                onChange={(e) => handleFileUpload('inhale', e)}
              />
              {customSounds.inhale && <span className="text-xs text-green-600 mt-2">✓ Custom sound loaded</span>}
            </label>
          </div>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-indigo-400 transition-colors">
            <label className="flex flex-col items-center cursor-pointer">
              <Upload className="text-gray-400 mb-2" size={32} />
              <span className="text-sm font-medium text-gray-700 mb-1">Exhale Sound</span>
              <span className="text-xs text-gray-500 text-center">Drop audio file or click to upload</span>
              <input 
                type="file" 
                accept="audio/*" 
                className="hidden"
                onChange={(e) => handleFileUpload('exhale', e)}
              />
              {customSounds.exhale && <span className="text-xs text-green-600 mt-2">✓ Custom sound loaded</span>}
            </label>
          </div>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-indigo-400 transition-colors">
            <label className="flex flex-col items-center cursor-pointer">
              <Upload className="text-gray-400 mb-2" size={32} />
              <span className="text-sm font-medium text-gray-700 mb-1">Breath Hold Sound</span>
              <span className="text-xs text-gray-500 text-center">Drop audio file or click to upload</span>
              <input 
                type="file" 
                accept="audio/*" 
                className="hidden"
                onChange={(e) => handleFileUpload('breathHold', e)}
              />
              {customSounds.breathHold && <span className="text-xs text-green-600 mt-2">✓ Custom sound loaded</span>}
            </label>
          </div>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-indigo-400 transition-colors">
            <label className="flex flex-col items-center cursor-pointer">
              <Upload className="text-gray-400 mb-2" size={32} />
              <span className="text-sm font-medium text-gray-700 mb-1">Vocal Message</span>
              <span className="text-xs text-gray-500 text-center">For free meditation section</span>
              <input 
                type="file" 
                accept="audio/*" 
                className="hidden"
                onChange={(e) => handleFileUpload('vocalMessage', e)}
              />
              {customSounds.vocalMessage && <span className="text-xs text-green-600 mt-2">✓ Custom sound loaded</span>}
            </label>
          </div>
        </div>

        {/* Structure Overview */}
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Session Structure</h2>
          <div className="space-y-2 text-sm text-gray-700">
            <div>• Intro (20s)</div>
            <div>• Round 1: 30 breaths (1m30s) → Hold (1m) → Deep inhale (15s)</div>
            <div>• Round 2: 30 breaths (1m30s) → Hold (1m30s) → Deep inhale (15s)</div>
            <div>• Round 3: 30 breaths (1m30s) → Hold (1m30s) → Deep inhale (15s)</div>
            <div>• Free Meditation (~10m25s)</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BreathingMeditationSynth;