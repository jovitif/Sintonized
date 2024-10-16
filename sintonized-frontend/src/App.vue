<template>
  <div id="app">
      <VirtualPiano/>
  </div>
</template>

<script>
import VirtualPiano from './components/VirtualPiano.vue';

export default {
  name: 'App',
  components: {
    VirtualPiano,
  },
  data() {
    return {
      audioContext: null,
      gainNode: null,
      bassFilter: null,
      midFilter: null,
      trebleFilter: null,
      showPiano: false, // Variável que controla a exibição do piano
    };
  },
  mounted() {
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    this.gainNode = this.audioContext.createGain();
    this.bassFilter = this.audioContext.createBiquadFilter();
    this.midFilter = this.audioContext.createBiquadFilter();
    this.trebleFilter = this.audioContext.createBiquadFilter();

    // Configura os filtros do amplificador
    this.bassFilter.type = 'lowshelf';
    this.bassFilter.frequency.setValueAtTime(200, this.audioContext.currentTime);
    this.midFilter.type = 'peaking';
    this.midFilter.frequency.setValueAtTime(1000, this.audioContext.currentTime);
    this.trebleFilter.type = 'highshelf';
    this.trebleFilter.frequency.setValueAtTime(3000, this.audioContext.currentTime);

    // Conecta os nós de áudio: Piano -> Amplificador -> Destination
    this.gainNode.connect(this.bassFilter);
    this.bassFilter.connect(this.midFilter);
    this.midFilter.connect(this.trebleFilter);
    this.trebleFilter.connect(this.audioContext.destination);
  },
  methods: {
    togglePiano() {
      this.showPiano = !this.showPiano; // Alterna entre mostrar e ocultar o piano
    }
  }
};
</script>
<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-family: 'Poppins', sans-serif;
}
</style>
