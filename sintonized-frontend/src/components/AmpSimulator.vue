<template>
  <div class="audio-controller">
    <h1 class="title">Amplifier Control</h1>

    <div class="amp-panel">
      <button @click="startAudio" class="amp-button">Power On</button>
      <button @click="stopAudio" class="amp-button">Power Off</button>

      <div v-if="isAudioActive" class="controls">
        <div class="control">
          <label for="gain">Volume</label>
          <input
            id="gain"
            class="dial"
            type="range"
            min="0"
            max="20"
            step="0.05"
            v-model="volume"
            @input="updateGain"
          />
        </div>

        <div class="control">
          <label for="bass">Bass</label>
          <input
            id="bass"
            class="dial"
            type="range"
            min="-10"
            max="10"
            step="0.1"
            v-model="bass"
            @input="updateBass"
          />
        </div>

        <div class="control">
          <label for="mid">Mid</label>
          <input
            id="mid"
            class="dial"
            type="range"
            min="-10"
            max="10"
            step="0.1"
            v-model="mid"
            @input="updateMid"
          />
        </div>

        <div class="control">
          <label for="treble">Treble</label>
          <input
            id="treble"
            class="dial"
            type="range"
            min="-10"
            max="10"
            step="0.1"
            v-model="treble"
            @input="updateTreble"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      context: null,        // AudioContext instance
      stream: null,         // Audio stream from getUserMedia
      lineInSource: null,   // MediaStreamAudioSourceNode
      gainNode: null,       // GainNode for volume control
      bassFilter: null,     // BiquadFilterNode for bass control
      midFilter: null,      // BiquadFilterNode for mid control
      trebleFilter: null,   // BiquadFilterNode for treble control
      volume: 0.5,          // Initial volume level
      bass: 0,              // Initial bass level
      mid: 0,               // Initial mid level
      treble: 0,            // Initial treble level
      isAudioActive: false, // Flag to track audio status
    };
  },
  methods: {
    async startAudio() {
      if (this.isAudioActive) {
        return; // Evita inicializar o áudio novamente se já estiver ativo
      }

      // Cria o contexto de áudio se ele ainda não foi criado
      if (!this.context) {
        this.context = new AudioContext();
      }

      // Verifica o estado do contexto e resume se estiver suspenso
      if (this.context.state === 'suspended') {
        await this.context.resume();
      }

      try {
        // Solicita permissão de acesso ao microfone do usuário
        this.stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: false,
            autoGainControl: false,
            noiseSuppression: false,
            latency: 0,
          },
        });

        // Cria os nós de áudio e filtros
        this.lineInSource = this.context.createMediaStreamSource(this.stream);
        this.gainNode = new GainNode(this.context, { gain: this.volume });

        this.bassFilter = this.context.createBiquadFilter();
        this.bassFilter.type = 'lowshelf';
        this.bassFilter.frequency.value = 200;
        this.bassFilter.gain.value = this.bass;

        this.midFilter = this.context.createBiquadFilter();
        this.midFilter.type = 'peaking';
        this.midFilter.frequency.value = 1000;
        this.midFilter.gain.value = this.mid;

        this.trebleFilter = this.context.createBiquadFilter();
        this.trebleFilter.type = 'highshelf';
        this.trebleFilter.frequency.value = 3000;
        this.trebleFilter.gain.value = this.treble;

        // Conecta os nós: source -> gain -> bass -> mid -> treble -> destination
        this.lineInSource
          .connect(this.gainNode)
          .connect(this.bassFilter)
          .connect(this.midFilter)
          .connect(this.trebleFilter)
          .connect(this.context.destination);

        // Marca o áudio como ativo
        this.isAudioActive = true;
      } catch (error) {
        console.error('Erro ao acessar o microfone:', error);
      }
    },
    stopAudio() {
      // Para o áudio se ele estiver ativo
      if (this.isAudioActive && this.lineInSource) {
        this.lineInSource.disconnect();
        this.lineInSource = null; // Reseta o source
      }
      if (this.stream) {
        const tracks = this.stream.getTracks();
        tracks.forEach((track) => track.stop()); // Para o stream de áudio
        this.stream = null; // Reseta o stream
      }

      // Define o estado do áudio como inativo
      this.isAudioActive = false;
    },
    updateGain() {
      if (this.gainNode) {
        this.gainNode.gain.setTargetAtTime(
          parseFloat(this.volume),
          this.context.currentTime,
          0.01
        );
      }
    },
    updateBass() {
      if (this.bassFilter) {
        this.bassFilter.gain.setTargetAtTime(
          parseFloat(this.bass),
          this.context.currentTime,
          0.01
        );
      }
    },
    updateMid() {
      if (this.midFilter) {
        this.midFilter.gain.setTargetAtTime(
          parseFloat(this.mid),
          this.context.currentTime,
          0.01
        );
      }
    },
    updateTreble() {
      if (this.trebleFilter) {
        this.trebleFilter.gain.setTargetAtTime(
          parseFloat(this.treble),
          this.context.currentTime,
          0.01
        );
      }
    },
  },
};
</script>

<style scoped>
.audio-controller {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #333;
  color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.5);
  width: 500px;
  margin-top: 20px;
}

.title {
  font-family: 'Courier New', Courier, monospace;
  font-size: 24px;
  margin-bottom: 20px;
  text-align: center;
  color: #FFD700;
}

.amp-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #222;
  padding: 15px;
  border-radius: 5px;
  border: 2px solid #666;
}

.amp-button {
  background-color: #444;
  color: #FFD700;
  padding: 10px 20px;
  margin: 10px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.amp-button:hover {
  background-color: #666;
}

.controls {
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
  width: 100%;
}

.control {
  display: flex;
  flex-direction: column;
  align-items: center;
}

label {
  margin-bottom: 5px;
  font-size: 14px;
}

.dial {
  appearance: none;
  width: 80px;
  height: 80px;
  margin: 10px;
  background: radial-gradient(circle, #555, #333);
  border-radius: 50%;
  border: 2px solid #777;
  cursor: pointer;
}

.dial:active {
  background: radial-gradient(circle, #777, #555);
}

input[type="range"] {
  transform: rotate(270deg);
}
</style>
