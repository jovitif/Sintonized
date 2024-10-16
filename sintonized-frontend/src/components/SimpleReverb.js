class SimpleReverb {
    constructor(context) {
      this.context = context;
      this.effect = this.context.createConvolver();
      this.input = this.context.createGain(); // Entrada do reverb
      this.output = this.context.createGain(); // Saída do reverb
      this.isActive = false; // Flag para controlar quando o reverb está ativo
    }

    setup(reverbTime = 1) {
      this.reverbTime = reverbTime;
      this.input.connect(this.effect);
      this.effect.connect(this.output);
      this.renderTail(); // Renderiza a resposta impulsiva
    }

    renderTail() {
      if (this.isActive) return; // Garante que o reverb só será renderizado uma vez

      const tailContext = new OfflineAudioContext(2, this.context.sampleRate * this.reverbTime, this.context.sampleRate);
      tailContext.oncomplete = (buffer) => {
        this.effect.buffer = buffer.renderedBuffer;
      };

      // Gera o ruído branco para o reverb (apenas quando ativado)
     // const noise = this.createNoise(tailContext);
     // noise.connect(tailContext.destination);
      tailContext.startRendering();

      this.isActive = true; // Marca o reverb como ativo
    }

    createNoise(audioContext) {
      const bufferSize = audioContext.sampleRate * this.reverbTime;
      const buffer = audioContext.createBuffer(2, bufferSize, audioContext.sampleRate);

      for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
        const data = buffer.getChannelData(channel);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1; // Gera ruído branco
        }
      }

      const noise = audioContext.createBufferSource();
      noise.buffer = buffer;
      return noise;
    }
  }

  export default SimpleReverb;
