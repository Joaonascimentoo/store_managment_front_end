<template>
  <v-container class="fill-height">
    <v-data-table :headers="tableHeaders" :items="ingredients" :sort-by="[{ key: 'name', order: 'asc' }]">
      <template #top>
        <v-toolbar flat>
          <v-toolbar-title>Controle de Ingredientes</v-toolbar-title>
          <v-divider class="mx-4" inset vertical />
          <v-dialog v-model="dialog" max-width="500px">
            <template #activator="{ props }">
              <v-btn class="mb-2" color="white" variant="tonal" v-bind="props">
                Adicionar Ingrediente
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
                      <v-text-field v-model="editedItem.name" label="Nome" />
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field v-model="editedItem.value" label="Valor" />
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field v-model="editedItem.measure" label="G/Ml" />
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

<script lang="ts" setup>
  function getCurrentDate () {
    const date = new Date()
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()

    return `${day}/${month}/${year}`
  }
  const dialog = ref(false)
  const dialogDelete = ref(false)
  const tableHeaders = [
    { title: 'Nome', key: 'name' },
    { title: 'Valor', key: 'value' },
    { title: 'Medida G/ML', key: 'measure' },
  ]
  const ingredients = ref<any[]>([])
  const editedIndex = ref<number>(-1)

  const defaultItem = {
    name: '',
    day: getCurrentDate(),
    value: 0,
    entries: 0,
    exits: 0,
  }
  const editedItem = ref<any>({ ...defaultItem })

  const formTitle = computed(() => (editedIndex.value === -1 ? 'Novo Item' : 'Editar Item'))

  watch(dialog, val => {
    if (!val) close()
  })

  watch(dialogDelete, val => {
    if (!val) closeDelete()
  })

  onMounted(() => {
    initialize()
  })

  function editItem (item:any) {
    editedIndex.value = ingredients.value.indexOf(item)
    editedItem.value = Object.assign({}, item)
    dialog.value = true
  }

  function deleteItem (item:any) {
    editedIndex.value = ingredients.value.indexOf(item)
    editedItem.value = Object.assign({}, item)
    dialogDelete.value = true
  }

  function deleteItemConfirm () {
    ingredients.value.splice(editedIndex.value, 1)
    closeDelete()
  }

  function close () {
    dialog.value = false
    nextTick(() => {
      editedItem.value = Object.assign({}, defaultItem)
      editedIndex.value = -1
    })
  }

  function closeDelete () {
    dialogDelete.value = false
    nextTick(() => {
      editedItem.value = Object.assign({}, defaultItem)
      editedIndex.value = -1
    })
  }

  function save () {
    if (editedIndex.value > -1) {
      Object.assign(ingredients.value[editedIndex.value], editedItem.value)
    } else {
      ingredients.value.push(editedItem.value)
    }
    close()
  }

  function initialize () {
    ingredients.value = [
      {
        name: 'Leite Condensado',
        value: 10.0,
        measure: 395,
      },
    ]
  }
</script>
