<template>
  <v-app-bar :elevation="2">
    <template #prepend>
      <img
        alt="Logo"
        src="@/assets/logo.png"
        style="height: 150px; cursor: pointer"
        @click.stop="drawer = !drawer"
      >
    </template>

    <v-app-bar-title>Gerenciamento de Loja</v-app-bar-title>
  </v-app-bar>

  <v-navigation-drawer
    v-model="drawer"
    :location="$vuetify.display.mobile ? 'bottom' : undefined"
    temporary
  >
    <v-list>
      <v-list-item
        v-for="item in items"
        :key="item.value"
        link
        :to="{ name: item.value }"
      >
        <v-list-item-icon>
          <v-icon>{{ item.props.prependIcon }}</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="js">
  export default {
    data: () => ({
      drawer: false,
      items: [
        {
          title: 'Dashboard',
          value: 'dashboard',
          props: {
            prependIcon: 'mdi-home',
          },
        },
        {
          title: 'Ingredientes',
          value: 'ingredients',
          props: {
            prependIcon: 'mdi-carrot',
          },
        },
        // {
        //   title: 'Receitas',
        //   value: 'recipes',
        //   props: {
        //     prependIcon: 'mdi-pot-mix',
        //   },
        // },
        {
          title: 'Utensílios',
          value: 'utensils',
          props: {
            prependIcon: 'mdi-archive',
          },
        },
      ],
    }),
  }
</script>
