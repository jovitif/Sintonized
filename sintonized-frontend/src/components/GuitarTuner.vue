<template>
  <div class="tuner" @click="startTuning">
    <h1>Guitar Tuner</h1>
    <div class="display">
      <div class="needle" :style="needleStyle"></div>
      <div class="note-display">
        <span>{{ note?.note || '--' }}</span>
      </div>
      <div class="detuning-display">
        <span v-if="detuning != 0">{{ detuning > 0 ? '+' : '' }}{{ detuning.toFixed(2) }} cents</span>
        <span v-else>Perfect</span>
      </div>
    </div>
  </div>
</template>

  <script>
  export default {
    data() {
      return {
        audioContext: null,
        analyser: null,
        bufferLength: 2048,
        frequency: null,
        note: null,
        detuning: 0,
        notes: [
          { note: 'E', frequency: 82.41 },  // 6th string (E2)
          { note: 'A', frequency: 110.00 }, // 5th string (A2)
          { note: 'D', frequency: 146.83 }, // 4th string (D3)
          { note: 'G', frequency: 196.9 }, // 3rd string (G3)
          { note: 'B', frequency: 246.94 }, // 2nd string (B3)
          { note: 'E', frequency: 329.63 }  // 1st string (E4)
        ]
      };
    },
    methods: {
      async startTuning() {
        try {
          this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          const source = this.audioContext.createMediaStreamSource(stream);

          this.analyser = this.audioContext.createAnalyser();
          this.analyser.fftSize = this.bufferLength;
          source.connect(this.analyser);

          this.detectPitch();
        } catch (error) {
          console.error('Error accessing microphone', error);
        }
      },
      detectPitch() {
        const buffer = new Float32Array(this.bufferLength);
        this.analyser.getFloatTimeDomainData(buffer);

        const frequency = this.autoCorrelate(buffer, this.audioContext.sampleRate);
        if (frequency !== -1) {
          this.frequency = frequency;
          this.note = this.getNoteFromFrequency(frequency);
          this.detuning = this.getDetuning(frequency, this.note.frequency);
        }

        requestAnimationFrame(this.detectPitch);
      },
      autoCorrelate(buffer, sampleRate) {
        // Auto-correlation algorithm for pitch detection
        const SIZE = buffer.length;
        let rms = 0;
        for (let i = 0; i < SIZE; i++) {
          rms += buffer[i] * buffer[i];
        }
        rms = Math.sqrt(rms / SIZE);
        if (rms < 0.01) return -1;

        let r1 = 0, r2 = SIZE - 1, thres = 0.2;
        for (let i = 0; i < SIZE / 2; i++) {
          if (Math.abs(buffer[i]) < thres) {
            r1 = i;
            break;
          }
        }
        for (let i = 1; i < SIZE / 2; i++) {
          if (Math.abs(buffer[SIZE - i]) < thres) {
            r2 = SIZE - i;
            break;
          }
        }
        buffer = buffer.slice(r1, r2);
        const newSize = buffer.length;
        const correlations = new Array(newSize).fill(0);

        for (let i = 0; i < newSize; i++) {
          for (let j = 0; j < newSize - i; j++) {
            correlations[i] = correlations[i] + buffer[j] * buffer[j + i];
          }
        }
        let d = 0;
        while (correlations[d] > correlations[d + 1]) d++;
        let maxVal = -1, maxPos = -1;
        for (let i = d; i < newSize; i++) {
          if (correlations[i] > maxVal) {
            maxVal = correlations[i];
            maxPos = i;
          }
        }
        let T0 = maxPos;

        return sampleRate / T0;
      },
      getNoteFromFrequency(frequency) {
        let minDiff = Infinity;
        let closestNote = null;

        this.notes.forEach((note) => {
          const diff = Math.abs(frequency - note.frequency);
          if (diff < minDiff) {
            minDiff = diff;
            closestNote = note;
          }
        });

        return closestNote;
      },
      getDetuning(frequency, targetFrequency) {
        return 1200 * Math.log2(frequency / targetFrequency);
      }
    }
  };
  </script>

<style scoped>
.tuner {
  text-align: center;
  margin: 40px auto;
  width: 300px;
  font-family: 'Roboto', sans-serif;
}

.display {
  position: relative;
  width: 100%;
  height: 150px;
  margin: 0 auto 20px;
  border-radius: 15px;
  background: linear-gradient(135deg, #e0e0e0, #ffffff);
  box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.1);
}

.needle {
  position: absolute;
  bottom: 20px;
  left: 50%;
  width: 3px;
  height: 100px;
  background-color: #00bcd4;
  transform-origin: bottom;
  transform: rotate(0deg);
  transition: transform 0.1s ease-out;
  box-shadow: 0px 0px 10px rgba(0, 188, 212, 0.8);
}

.note-display {
  position: absolute;
  top: 20px;
  left: 0;
  right: 0;
  text-align: center;
  font-size: 2.5em;
  font-weight: 600;
  color: #2c3e50;
}

.detuning-display {
  position: absolute;
  bottom: 20px;
  left: 0;
  right: 0;
  text-align: center;
  font-size: 1.2em;
  font-weight: 400;
  color: #7f8c8d;
}

.tuner h1 {
  font-size: 2em;
  color: #34495e;
  margin-bottom: 20px;
}

.note-sharp-flat {
  font-size: 1.5em;
  color: #e74c3c;
  margin-top: 5px;
  font-weight: 600;
}

.note-sharp-flat.flat {
  color: #3498db;
}

.note-sharp-flat.sharp {
  color: #e67e22;
}



</style>
