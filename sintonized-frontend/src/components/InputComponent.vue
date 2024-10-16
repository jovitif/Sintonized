<template>
  <div class="audio-container">
    <!-- Formulário de entrada de texto -->
    <form class="submit-form" @submit.prevent="submitForm">
      <div class="input-container">
        <!-- Botão para carregar música -->
        <label class="upload-btn">
          <input type="file" @change="onFileChange" accept="audio/*" />
          🎵 <!-- Ícone ou símbolo de música -->
        </label>

        <input
          type="text"
          placeholder="Digite sua mensagem"
          v-model="inputText"
          @keydown.enter="submitForm"
        />

        <button type="submit">
          <span>➤</span>
        </button>
      </div>
    </form>

    <!-- Player de áudio -->
    <div class="audio-player" v-if="audioSource">
      <audio ref="audio" @timeupdate="updateProgress" @loadedmetadata="setTotalTime">
        <source :src="audioSource" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>

      <!-- Controles -->
      <div class="controls">
        <button @click="togglePlay">{{ isPlaying ? 'Pause' : 'Play' }}</button>
        <input type="range" v-model="volume" @input="updateVolume" min="0" max="1" step="0.01" />
      </div>

      <!-- Barra de progresso -->
      <div class="progress" @click="seekAudio">
        <div class="progress-bar" :style="{ width: progress + '%' }"></div>
      </div>

      <!-- Exibição de tempo -->
      <div class="time-display">
        <span>{{ formatTime(currentTime) }}</span> / <span>{{ formatTime(duration) }}</span>
      </div>

      <!-- Botão de excluir áudio -->
      <button class="delete-btn" @click="removeAudio">Excluir áudio</button>
    </div>
    <VirtualPiano :sound-status="soundStatus" />
  </div>
</template>

<script>

import VirtualPiano from './VirtualPiano.vue';
export default {
  name: 'InputComponent',
  VirtualPiano,

  data() {
    return {
      soundStatus: '', // Estado para armazenar o valor de 'data.response'

      inputText: "",
      audioFile: null, // Adiciona uma variável para armazenar o arquivo de áudio
      audioSource: null, // Caminho do arquivo de áudio
      isPlaying: false,
      volume: 1,
      currentTime: 0,
      duration: 0,
      progress: 0,
    };
  },
  methods: {
    removeAudio() {
    this.audioSource = null; // Remove o caminho do áudio
    this.isPlaying = false;
    this.currentTime = 0;
    this.progress = 0;
    this.volume = 1; // Reseta o volume
  },
    // Método para lidar com o upload do arquivo de áudio
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
    async submitForm() {
  if (this.inputText.trim()) {
    try {
      const response = await fetch('http://localhost:3000/echo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: this.inputText.trim() }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('valor ' + data.response)
      // Verifica se o comando é para ligar ou desligar o instrumento
      if (data.response === 'Instrumento ligado') {
        console.log('ligar 2')
        this.$refs.audio.play(); // Ligar o instrumento
        this.isPlaying = true;
      } else if (data.response === 'Instrumento desligado') {
        console.log('desligar')
        this.$refs.audio.pause(); // Desligar o instrumento
        this.isPlaying = false;
      }

      // Emite o evento para o componente pai com a resposta processada
      this.$emit('submitMessage', data.response);
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }

    this.inputText = ""; // Limpa o campo de input após o envio
  }
}
,
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
.submit-form {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20px;
}

.input-container {
  display: flex;
  align-items: center;
  background-color: #f5f5f5;
  border-radius: 25px;
  padding: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 600px;
}

input[type="text"] {
  border: none;
  background-color: transparent;
  flex: 1;
  font-size: 16px;
  padding: 10px;
  outline: none;
}

input[type="text"]::placeholder {
  color: #999;
}

button {
  background-color: #007bff;
  border: none;
  color: white;
  padding: 10px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

button:hover {
  background-color: #0056b3;
}

/* Estilo do botão de upload */
.upload-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
  cursor: pointer;
  font-size: 20px;
}

.upload-btn input {
  display: none; /* Esconde o campo de input do arquivo */
}

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



.submit-form {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20px;
}

.input-container {
  display: flex;
  align-items: center;
  background-color: #f5f5f5;
  border-radius: 25px;
  padding: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 600px;
}

input[type="text"] {
  border: none;
  background-color: transparent;
  flex: 1;
  font-size: 16px;
  padding: 10px;
  outline: none;
}

input[type="text"]::placeholder {
  color: #999;
}

button {
  background-color: #007bff;
  border: none;
  color: white;
  padding: 10px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

button:hover {
  background-color: #0056b3;
}

/* Player de áudio centralizado e com estilo moderno */
.audio-player {
  width: 100%;
  max-width: 500px;
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
  margin-top: 20px;
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
  border-radius: 5px;
  margin-top: 10px;
  cursor: pointer;
}

.progress-bar {
  height: 100%;
  background-color: #4caf50;
  border-radius: 5px;
}

.time-display {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}

.delete-btn {
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
}

.delete-btn:hover {
  background-color: #c0392b;
}

</style>
