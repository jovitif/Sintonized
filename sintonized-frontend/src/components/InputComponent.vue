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
          placeholder="Digite um efeito de alguma música ou carregue um .mp3"
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
    name: 'inputComponent',
    data() {
      return {
        inputText: "",
        file: null,
      };
    },
    methods: {
      submitForm() {
        // Lógica para enviar o texto ou o arquivo carregado
        if (this.file) {
          console.log("Arquivo enviado:", this.file.name);
        } else if (this.inputText) {
          console.log("Texto enviado:", this.inputText);
        }
      },
      handleFileUpload(event) {
        this.file = event.target.files[0];
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
