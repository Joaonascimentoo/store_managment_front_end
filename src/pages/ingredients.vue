<template>
  <Header />
  <div class="background">
    <Ingredient />
  </div>
</template>

<style lang='scss'>
.background {
  background-image: url('@/assets/background.jpg');
  background-size: cover;
  background-position: center;
  height: 100vh; /* Define a altura para cobrir toda a tela */
  width: 100%; /* Define a largura para cobrir toda a tela */
  background-repeat: no-repeat; /* Evita a repetição da imagem */
}
</style>
