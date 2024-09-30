<template>
  <div id="app">
    <h1>Sistema de Efeitos de Som</h1>
    <!-- Componente de entrada -->
    <InputComponent @submitMessage="handleMessage" />

    <!-- Exibe os componentes dinamicamente com base nas palavras-chave -->
    <div class="components-container">
      <div v-for="(component, index) in activeComponents" :key="index" class="component-wrapper">
        <!-- Renderiza dinamicamente o componente correto -->
        <component :is="component.name" />
        <!-- Botão "X" para remover o componente -->
        <button @click="removeComponent(index)" class="remove-button">X</button>
      </div>
    </div>
    <TunerComponent/>
    <AmplifierComponent/>
    <OverdrivePedal/>
    <AudioPlayer/>
  </div>
</template>

<script>
import InputComponent from './components/InputComponent.vue';
import AmplifierComponent from './components/AmpSimulator.vue';
import TunerComponent from './components/GuitarTuner.vue';
import AudioPlayer from './components/AudioPlayer.vue';

export default {
  name: 'App',
  components: {
    InputComponent,
    AmplifierComponent,
    TunerComponent,
    AudioPlayer,
  },
  data() {
    return {
      // Lista de componentes ativos
      activeComponents: [],
    };
  },
  methods: {
    handleMessage(responseText) {
      const lowerCaseText = responseText.toLowerCase();

      // Adiciona componentes com base nas palavras-chave sem duplicar
      if (lowerCaseText.includes('amplificador') && !this.isComponentActive('AmplifierComponent')) {
        this.activeComponents.push({ name: 'AmplifierComponent' });
      }
      if (lowerCaseText.includes('afinador') && !this.isComponentActive('TunerComponent')) {
        this.activeComponents.push({ name: 'TunerComponent' });
      }
      if (lowerCaseText.includes('tremolo') && !this.isComponentActive('TremoloComponent')) {
        this.activeComponents.push({ name: 'TremoloComponent' });
      }
    },
    // Verifica se o componente já está ativo
    isComponentActive(componentName) {
      return this.activeComponents.some(component => component.name === componentName);
    },
    // Remove um componente da lista
    removeComponent(index) {
      this.activeComponents.splice(index, 1);
    },
  },
};
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  text-align: center;
  margin-top: 50px;
}

.components-container {
  margin-top: 20px;
}

.component-wrapper {
  position: relative;
  display: inline-block;
  margin: 10px;
}

.remove-button {
  position: absolute;
  top: 0;
  right: 0;
  background: red;
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  width: 20px;
  height: 20px;
}

.remove-button:hover {
  background: darkred;
}
</style>
