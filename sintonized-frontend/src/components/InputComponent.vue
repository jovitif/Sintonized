<template>
  <form class="submit-form" @submit.prevent="submitForm">
    <div class="input-container">
      <input
      type="file"
      name="file"
      id="file"
      accept=".mp3"
      @change="handleFileUpload"
      hidden
    />
    <label for="file" class="file-upload-label">
      <span>🎵</span>
    </label>
      <input
        type="text"
        placeholder="Digite o nome da música e do artista (ex: Artista - Música)"
        v-model="inputText"
        @keydown.enter="submitForm"
      />
      <button type="submit">
        <span>➤</span>
      </button>
    </div>
  </form>
</template>

<script>
export default {
  name: 'InputComponent',
  data() {
    return {
      inputText: "",
    };
  },
  methods: {
    async submitForm() {
      if (this.inputText.trim()) {
        const response = await this.fetchTrackData(this.inputText);
        if (response) {
          this.$emit('submitMessage', response);
        }
        this.inputText = ""; // Limpa o campo de input após o envio
      }
    },
    async fetchTrackData(query) {
      const apiKey = process.env.VUE_APP_LASTFM_API_KEY;

      const [artist, track] = query.split(" - "); // Espera o formato "artista - música"
      const url = `http://ws.audioscrobbler.com/2.0/?method=track.getInfo&artist=${encodeURIComponent(artist)}&track=${encodeURIComponent(track)}&api_key=${apiKey}&format=json`;

      try {
        const res = await fetch(url);
        const data = await res.json();
        if (data.track) {
          return {
            artist: data.track.artist.name,
            trackName: data.track.name,
            albumName: data.track.album ? data.track.album.title : 'Álbum não disponível',
            albumArt: data.track.album && data.track.album.image[3] && data.track.album.image[3]['#text'] ? data.track.album.image[3]['#text'] : '', // Imagem maior
          };
        }
      } catch (error) {
        console.error("Erro ao buscar dados da música:", error);
      }
      return null;
    },
  },
};
</script>




  <style>
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

  .file-upload-label {
    cursor: pointer;
    font-size: 20px;
    color: #555;
    padding-right: 15px;
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
  </style>
