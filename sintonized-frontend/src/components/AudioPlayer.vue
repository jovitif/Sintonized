<template>
  <div class="audio-player">
    <!-- Campo para carregar o arquivo de áudio -->
    <input type="file" @change="onFileChange" accept="audio/*" />

    <!-- Player de áudio -->
    <audio ref="audio" @timeupdate="updateProgress" @loadedmetadata="setTotalTime" v-if="audioSource">
      <source :src="audioSource" type="audio/mpeg" />
      Your browser does not support the audio element.
    </audio>

    <!-- Controles -->
    <div class="controls" v-if="audioSource">
      <button @click="togglePlay">{{ isPlaying ? 'Pause' : 'Play' }}</button>
      <input type="range" v-model="volume" @input="updateVolume" min="0" max="1" step="0.01" />
    </div>

    <!-- Barra de progresso -->
    <div class="progress" v-if="audioSource" @click="seekAudio">
      <div class="progress-bar" :style="{ width: progress + '%' }"></div>
    </div>

    <!-- Exibição de tempo -->
    <div id="current-time" v-if="audioSource">{{ formatTime(currentTime) }}</div>
    <div id="total-time" v-if="audioSource">{{ formatTime(duration) }}</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      audioSource: null, // Caminho do arquivo de áudio
      isPlaying: false,
      volume: 1,
      currentTime: 0,
      duration: 0,
      progress: 0,
    };
  },
  methods: {
    // Método para lidar com a mudança de arquivo de áudio
    onFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        const url = URL.createObjectURL(file); // Cria uma URL para o arquivo
        this.audioSource = url; // Define a fonte de áudio
        this.isPlaying = false; // Reseta o estado de reprodução
        this.currentTime = 0; // Reseta o tempo atual
        this.progress = 0; // Reseta a barra de progresso
        this.volume = 1; // Reseta o volume para o máximo
      }
    },
    togglePlay() {
      const audio = this.$refs.audio;
      if (this.isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
      this.isPlaying = !this.isPlaying;
    },
    updateVolume() {
      const audio = this.$refs.audio;
      audio.volume = this.volume;
    },
    updateProgress() {
      const audio = this.$refs.audio;
      this.currentTime = audio.currentTime;
      this.duration = audio.duration;

      // Calcula o progresso em porcentagem
      this.progress = (this.currentTime / this.duration) * 100;
    },
    setTotalTime() {
      const audio = this.$refs.audio;
      this.duration = audio.duration;
    },
    formatTime(time) {
      const minutes = Math.floor(time / 60);
      const seconds = Math.floor(time % 60).toString().padStart(2, '0');
      return `${minutes}:${seconds}`;
    },
    // Método para avançar o áudio ao clicar na barra de progresso
    seekAudio(event) {
      const audio = this.$refs.audio;
      const progressBar = event.currentTarget;
      const clickX = event.clientX - progressBar.getBoundingClientRect().left; // Posição do clique
      const totalWidth = progressBar.offsetWidth; // Largura total da barra de progresso
      const progressPercent = (clickX / totalWidth); // Percentual de progresso
      const newTime = progressPercent * audio.duration; // Novo tempo do áudio
      audio.currentTime = newTime; // Atualiza o tempo atual do áudio
    },
  },
};
</script>

<style scoped>
.audio-player {
  width: 400px;
  margin: 20px;
}

.controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
}

.progress {
  height: 10px;
  background-color: #ccc;
  margin-top: 10px;
  cursor: pointer; /* Muda o cursor para indicar que a barra é clicável */
}

.progress-bar {
  width: 0;
  height: 100%;
  background-color: #4caf50;
}

#current-time,
#total-time {
  margin-top: 10px;
}
</style>
