<template>
  <main>
    <HeaderComponent/>
    <div class="content">
      <!-- Outros conteúdos aqui -->
    </div>
    <InputComponent class="footer-input"/>
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
  }
}
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
  /* Outros estilos para o conteúdo da página */
}

.footer-input {
  margin-top: auto;
}
</style>
