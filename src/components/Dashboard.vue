<template>
  <v-container class="fill-height">
    <v-app-bar :elevation="2">
      <template #prepend>
        <img
          alt="Logo"
          src="@/assets/logo.png"
          style="height: 150px; cursor: pointer;"
          @click.stop="drawer = !drawer"
        >
      </template>

      <v-app-bar-title>Gerenciamento de Loja</v-app-bar-title>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" :location="$vuetify.display.mobile ? 'bottom' : undefined" temporary>
      <v-list :items="items" />
    </v-navigation-drawer>

    <v-data-table :headers="tableHeaders" :items="sales" :sort-by="[{ key: 'day', order: 'asc' }]">
      <template #top>
        <v-toolbar flat>
          <v-toolbar-title>Controle de Vendas</v-toolbar-title>
          <v-divider class="mx-4" inset vertical />
          <v-dialog v-model="dialog" max-width="500px">
            <template #activator="{ props }">
              <v-btn class="mb-2" color="white" variant="tonal" v-bind="props">
                Adicionar Venda
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="text-h5">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" md="6">
                      <v-text-field v-model="editedItem.day" label="Dia" type="date" />
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field v-model="editedItem.value" label="Valor" />
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field v-model="editedItem.entries" label="Entradas" />
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field v-model="editedItem.exits" label="Saídas" />
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer />
                <v-btn color="white" variant="tonal" @click="close">
                  Cancelar
                </v-btn>
                <v-btn color="white" variant="tonal" @click="save">
                  Salvar
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
              <v-card-title class="text-h5" style="white-space: normal; text-align: center;">Você tem certeza que quer deletar esse item?</v-card-title>
              <v-card-actions>
                <v-spacer />
                <v-btn color="white" variant="tonal" @click="closeDelete">Cancelar</v-btn>
                <v-btn color="white" variant="tonal" @click="deleteItemConfirm">OK</v-btn>
                <v-spacer />
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template #item.actions="{ item }">
        <v-icon class="me-2" size="small" @click="editItem(item)">
          mdi-pencil
        </v-icon>
        <v-icon size="small" @click="deleteItem(item)">
          mdi-delete
        </v-icon>
      </template>
      <template #no-data>
        <v-btn color="primary" @click="initialize">
          Atualizar
        </v-btn>
      </template>
    </v-data-table>
  </v-container>
</template>

<script lang="ts">
  function getCurrentDate () {
    const date = new Date()
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()

    return `${day}/${month}/${year}`
  }
  export default {
    data: () => ({
      dialog: false,
      dialogDelete: false,
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
        {
          title: 'Receitas',
          value: 'recipes',
          props: {
            prependIcon: 'mdi-pot-mix',
          },
        },
        {
          title: 'Utensílios',
          value: 'utensils',
          props: {
            prependIcon: 'mdi-archive',
          },
        },
      ],
      tableHeaders: [
        { title: 'Dia', key: 'day' },
        { title: 'Valor', key: 'value' },
        { title: 'Entradas', key: 'entries' },
        { title: 'Saídas', key: 'exits' },
        { title: 'Ações', key: 'actions', sortable: false },
      ],
      sales: [],
      editedIndex: -1,
      editedItem: {
        name: '',
        day: getCurrentDate(),
        value: 0,
        entries: 0,
        exits: 0,
      },
      defaultItem: {
        name: '',
        day: getCurrentDate(),
        value: 0,
        entries: 0,
        exits: 0,
      },
    }),

    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'Novo Item' : 'Editar Item'
      },
    },

    watch: {
      dialog (val) {
        if (!val) this.close()
      },
      dialogDelete (val) {
        if (!val) this.closeDelete()
      },
    },

    created () {
      this.initialize()
    },

    methods: {
      editItem (item) {
        this.editedIndex = this.sales.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },

      deleteItem (item) {
        this.editedIndex = this.sales.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialogDelete = true
      },

      deleteItemConfirm () {
        this.sales.splice(this.editedIndex, 1)
        this.closeDelete()
      },

      close () {
        this.dialog = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },

      closeDelete () {
        this.dialogDelete = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },

      save () {
        if (this.editedIndex > -1) {
          Object.assign(this.sales[this.editedIndex], this.editedItem)
        } else {
          this.sales.push(this.editedItem)
        }
        this.close()
      },

      initialize () {
        this.sales = [
          {
            day: getCurrentDate(),
            value: 6.0,
            entries: 24,
            exits: 4.0,
          },
        ]
      },
    },
  }
</script>
