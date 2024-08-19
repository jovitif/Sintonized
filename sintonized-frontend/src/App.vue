<template>
  <main>
    <HeaderComponent/>
    <div class="content">
      <div class="chat-container" ref="chatContainer">
        <div v-for="(message, index) in messages" :key="index" class="message">
          {{ message }}
        </div>
      </div>
    </div>
    <InputComponent
      class="footer-input"
      @submitMessage="addMessage"
    />
  </main>
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
      messages: [],
    };
  },
  methods: {
    addMessage(message) {
      if (message) {
        this.messages.push(message);
        this.$nextTick(() => {
          // Rolagem automática para o final do chat
          const chatContainer = this.$refs.chatContainer;
          chatContainer.scrollTop = chatContainer.scrollHeight;
        });
      }
    },
  },
};
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');

#app {
  font-family: "Poppins", sans-serif;
  text-align: center;
  color: #2c3e50;
  height: 100vh;
  display: flex;
  flex-direction: column;
}

main {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.chat-container {
  max-height: 70vh; /* Limita a altura do container de chat */
  overflow-y: auto;
}

.message {
  background-color: #e0e0e0;
  padding: 10px;
  border-radius: 15px;
  margin: 5px 0;
  text-align: left;
  max-width: 60%;
  word-wrap: break-word;
}

.footer-input {
  margin-top: auto;
}
</style>
