<template>
  <div>
    <p class="retorno" v-if="response">
     {{ response }}
    </p>
    <p v-if="soundControlResponse">
      <strong>Sound Control:</strong> {{ soundControlResponse }}
    </p>
    <!-- Waveform selector -->

    <!-- Keyboard placeholder -->
    <div id="keyboard">
      <div
        v-for="(note, keyCode) in notesByKeyCode"
        :key="keyCode"
        :class="['key', { playing: playingKeys[keyCode] }]"
        @touchstart.prevent="playNote(keyCode)"
        @touchend.prevent="endNote(keyCode)"
        @mousedown.prevent="playNote(keyCode)"
        @mouseup.prevent="endNote(keyCode)"
      >
        {{ note.noteName }}<br /><span>{{ note.keyName }}</span>
      </div>
    </div>
      <select name="soundType" id="soundType" v-model="waveform" @change="setWaveform" class="waveform-selector">
        <option value="triangle">Triangle</option>
        <option value="sine">Sine</option>
        <option value="square">Square</option>
        <option value="sawtooth">Sawtooth</option>
        <option value="custom">Custom</option>
      </select>
    <div class="enviar">

        <input
          type="text"
          id="soundType"
          v-model="waveformInput"
          placeholder="Entre com alguma recomendação"
          class="waveform-input"
        />

        <button @click="sendPromptToBackend" type="button" class="sound-button">Enviar</button>


    </div>

  </div>
</template>

  <script>
//import SimpleReverb from './SimpleReverb';

  export default {
    props: ['soundStatus'],

    data() {
      return {
        waveformInput: '', // Entrada de texto do usuário
      response: '', // Resposta do backend
      soundControlResponse: '', // Resposta do controle de som (ligar/desligar)

        audioCtx: null,
        waveform: 'triangle',
        soundButtonLabel: this.soundStatus || 'Enable sound', // Inicializa com o valor do prop
        playingKeys: {},
        notesByKeyCode: {
          65: { noteName: 'c4', frequency: 261.6, keyName: 'a', sound: null },
          83: { noteName: 'd4', frequency: 293.7, keyName: 's', sound: null },
          68: { noteName: 'e4', frequency: 329.6, keyName: 'd', sound: null },
          70: { noteName: 'f4', frequency: 349.2, keyName: 'f', sound: null },
          71: { noteName: 'g4', frequency: 392, keyName: 'g', sound: null },
          72: { noteName: 'a4', frequency: 440, keyName: 'h', sound: null },
          74: { noteName: 'b4', frequency: 493.9, keyName: 'j', sound: null },
          75: { noteName: 'c5', frequency: 523.3, keyName: 'k', sound: null },
          76: { noteName: 'd5', frequency: 587.3, keyName: 'l', sound: null },
          186: { noteName: 'e5', frequency: 659.3, keyName: ';', sound: null },
        },
      };
    },
    watch: {
    soundStatus(newValue) {
      this.soundButtonLabel = newValue; // Atualiza quando o prop mudar
      console.log(this.soundButtonLabel);
    },
  },
    mounted() {
      // Initialize AudioContext
      this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();

      // Create sounds for each key
      for (const keyCode in this.notesByKeyCode) {
        const note = this.notesByKeyCode[keyCode];
        note.sound = this.createSound(note.frequency, this.waveform);
      }

      window.addEventListener('keydown', this.handleKeydown);
      window.addEventListener('keyup', this.handleKeyup);
    },
    methods: {
      async sendPromptToBackend() {
      try {
        const response = await fetch('http://localhost:3000/echo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: this.waveformInput }), // Envia o texto inserido pelo usuário
        });
        const data = await response.json();
        if (data.response.includes('ligar') || data.response.includes('desligar')) {
          this.soundControlResponse = data.response; // Controle de som
        } else {
          this.response = data.response; // Resposta do backend
        }
      } catch (error) {
        console.error('Erro ao se comunicar com o backend:', error);
      }
    },
      enableSound() {
        if(this.soundButtonLabel !== 'Sound enabled'){
          this.audioCtx.resume().then(() => {
          this.soundButtonLabel = 'Sound enabled';
        });
        }else{
          this.audioCtx.suspend().then(() => {
      this.soundButtonLabel = 'Enable sound';
    });
        }
      },
      createSound(frequency, type) {
        const osc = this.audioCtx.createOscillator();
        osc.frequency.value = frequency;
        osc.type = type;
        osc.start(0);
        return { osc, pressed: false };
      },
      playNote(keyCode) {
  const note = this.notesByKeyCode[keyCode];
  if (note && !note.sound.pressed) {
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }

    // Cria um novo oscilador para cada tecla pressionada
    const osc = this.audioCtx.createOscillator();
    osc.frequency.value = note.frequency;

    if (this.waveform === 'custom') {
      // Criar e usar uma forma de onda personalizada
      const real = new Float32Array([0, 1, 0.1, 0.05, 0.02]);
      const imag = new Float32Array([0, 0.1, 0.05, 0.02, 0.01]);
      const periodicWave = this.audioCtx.createPeriodicWave(real, imag);
      osc.setPeriodicWave(periodicWave); // Define a forma de onda personalizada
    } else {
      // Usar as formas de onda padrão (sine, square, etc.)
      osc.type = this.waveform;
    }

    osc.connect(this.audioCtx.destination);
    osc.start(0);

    note.sound.osc = osc; // Armazena o oscilador para parar depois
    note.sound.pressed = true;
    this.playingKeys[keyCode] = true;
  }
}
,

endNote(keyCode) {
  const note = this.notesByKeyCode[keyCode];
  if (note && note.sound.pressed) {
    note.sound.osc.stop(); // Para o oscilador
    note.sound.osc.disconnect(); // Desconecta do destino de áudio
    note.sound.pressed = false;
    this.playingKeys[keyCode] = false;
  }
},

      handleKeydown(event) {
        this.playNote(event.keyCode);
      },
      handleKeyup(event) {
        this.endNote(event.keyCode);
      },
      setWaveform() {
  for (const keyCode in this.notesByKeyCode) {
    const oscillator = this.notesByKeyCode[keyCode].sound.osc;

    if (this.waveform === 'custom') {
      const real = new Float32Array([0, 1, 0.1, 0.05, 0.02]); // Harmônicos muito atenuados
      const imag = new Float32Array([0, 0.1, 0.05, 0.02, 0.01]);
      const periodicWave = this.audioCtx.createPeriodicWave(real, imag);
      oscillator.setPeriodicWave(periodicWave);
    } else if (this.waveform === 'reverb') {
      // Só iniciar o reverb quando a tecla for pressionada
  //    const reverb = new SimpleReverb(this.audioCtx);
      //reverb.setup(2); // Definir tempo do reverb

      // Conecte o oscilador ao reverb quando ele estiver tocando
     // oscillator.connect(reverb.input).connect(this.audioCtx.destination);

    } else {
      oscillator.type = this.waveform; // Definir o tipo de onda
    }
  }
  },
    },
  };


  </script>

  <style scoped>
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap');

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    font-family: 'Poppins', sans-serif;
  }

  html {
    font-size: 62.5%;
  }

  body {
    font-size: 3rem;
    background: #2ecc71;
    color: #fff;
    margin: 0;
    padding: 0;
  }

  .retorno{
    background: #2ecc71;
    color: #fff;
  }

  button, select {
    font-size: 1.6rem;
    padding: 10px 20px;
    margin: 10px;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
    background: #2ecc71;
    color: #fff;
    transition: background 0.3s ease;
  }


  #waveform-selector {
    padding: 10px;
    margin: 20px;
    border-radius: 0.5rem;
    background: #2ecc71;
    color: #fff;
    border: none;
  }

  .waveform-input{
    width: 80%;
    padding: 10px
  }

  #keyboard {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    margin-top: 20px;
  }

  .key {
    border: 1px solid #7f8c8d;
    background: #fff;
    color: #2c3e50;
    border-radius: 0.7rem;
    margin: 0 0.5%;
    width: 9%;
    padding: 3rem 0;
    text-align: center;
    font-size: 1.2rem;
    transition: transform 0.1s ease, box-shadow 0.2s ease;
  }

  .key span {
    display: inline-block;
    padding: 1rem;
    background: #bdc3c7;
    border-radius: 0.4rem;
    margin-top: 1rem;
  }

  .key:hover {
    transform: scale(1.05);
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  }

  .key.playing {
    background: #2ecc71;
    color: #fff;
  }

  .key.playing span {
    background: #27ae60;
  }


  .enviar{
    margin: 10px;
    display: flex;
    flex-direction: row;
    align-self: center;
  }


  </style>
