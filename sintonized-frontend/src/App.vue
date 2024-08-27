<template>

    <HeaderComponent/>
    <main>
    <div class="content">
      <div class="chat-container" ref="chatContainer">
        <!-- Exibe as informações da música retornada -->
        <div v-if="message" class="message-card">
          <div v-if="message.albumArt">
            <img :src="message.albumArt" alt="Album Art" class="album-art"/>
          </div>
          <div>
            <strong>Música:</strong> {{ message.trackName }}<br>
            <strong>Banda:</strong> {{ message.artist }}<br>
            <strong>Álbum:</strong> {{ message.albumName }}
          </div>
        </div>
      </div>
    </div>
  </main>
    <InputComponent
      class="footer-input"
      @submitMessage="addMessage"
    />

</template>

<script>
import HeaderComponent from './components/HeaderComponent'
import InputComponent from './components/InputComponent'

export default {
  name: 'App',
  components: {
    HeaderComponent,
    InputComponent,
  },
  data() {
    return {
      message: null,
    };
  },
  methods: {
    addMessage(message) {
      if (message) {
        this.message = message;
        this.$nextTick(() => {
          const chatContainer = this.$refs.chatContainer;
          chatContainer.scrollTop = chatContainer.scrollHeight;
        });
      }
    },
  },
};
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700;800;900&display=swap');

#app {
  font-family: "Poppins", sans-serif;
  color: #2c3e50;
  height: 100vh;
  display: flex;
  flex-direction: column;
}

main {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center; /* Centraliza o conteúdo verticalmente */
  align-items: center; /* Centraliza o conteúdo horizontalmente */
}

.content {
  flex: 1;
  overflow-y: auto;
  width: 100%;
  display: flex;
  justify-content: center; /* Centraliza o chat-container horizontalmente */
}

.chat-container {
  max-height: 50vh; /* Limita a altura do container de chat */
  overflow-y: auto;
  display: flex;
  justify-content: center; /* Centraliza o conteúdo do chat-container horizontalmente */
  width: 100%;
}

.message-card {
  background-color: #d1410c;
  padding: 20px;
  border-radius: 15px;
  text-align: center;
  color: aliceblue;
  max-width: 30%;
  width: 40%;
  box-sizing: border-box;
}

.album-art {
  border-radius: 10px;
  width: 150px;
  height: 150px;
  margin-bottom: 10px;
}

.footer-input {
  margin-top: auto;
}
</style>

