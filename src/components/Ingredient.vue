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
                      <v-text-field v-model="ingredientItem.name" label="Nome" />
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field v-model="ingredientItem.value" label="Valor" @input="maskMoney($event)" />
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field v-model="ingredientItem.measure" label="G/Ml" prefix="G/Ml" />
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
  interface Ingredient {
    name: string,
    value: Number,
    measure: Number,
  }
  const dialog = ref(false)
  const dialogDelete = ref(false)
  const tableHeaders = [
    { title: 'Nome', key: 'name' },
    { title: 'Valor', key: 'value' },
    { title: 'Medida G/ML', key: 'measure' },
    { title: 'Ações', key: 'actions', sortable: false },
  ]
  const ingredients = ref<Ingredient[]>([])
  const ingredientItemIndex = ref<number>(-1)

  const defaultIngredientItem:Ingredient = {
    name: '',
    value: 0,
    measure: 0,
  }
  const ingredientItem = ref<Ingredient>({ ...defaultIngredientItem })

  const formTitle = computed(() => (ingredientItemIndex.value === -1 ? 'Novo Ingrediente' : 'Editar Ingrediente'))

  watch(dialog, val => {
    if (!val) close()
  })

  watch(dialogDelete, val => {
    if (!val) closeDelete()
  })

  onMounted(() => {
    initialize()
  })

  const maskMoney = (event:any) => {
    const onlyDigits = event.target.value
      .split('')
      .filter((s: string) => /\d/.test(s))
      .join('')
      .padStart(3, '0')
    const digitsFloat = onlyDigits.slice(0, -2) + '.' + onlyDigits.slice(-2)
    event.target.value = maskCurrency(digitsFloat)
  }

  const maskCurrency = (valor:any, locale = 'pt-BR', currency = 'BRL') => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
    }).format(valor)
  }

  function editItem (item:Ingredient) {
    ingredientItemIndex.value = ingredients.value.indexOf(item)
    ingredientItem.value = Object.assign({}, item)
    dialog.value = true
  }

  function deleteItem (item:Ingredient) {
    ingredientItemIndex.value = ingredients.value.indexOf(item)
    ingredientItem.value = Object.assign({}, item)
    dialogDelete.value = true
  }

  function deleteItemConfirm () {
    ingredients.value.splice(ingredientItemIndex.value, 1)
    closeDelete()
  }

  function close () {
    dialog.value = false
    nextTick(() => {
      ingredientItem.value = Object.assign({}, defaultIngredientItem)
      ingredientItemIndex.value = -1
    })
  }

  function closeDelete () {
    dialogDelete.value = false
    nextTick(() => {
      ingredientItem.value = Object.assign({}, defaultIngredientItem)
      ingredientItemIndex.value = -1
    })
  }

  function save () {
    if (ingredientItemIndex.value > -1) {
      Object.assign(ingredients.value[ingredientItemIndex.value], ingredientItem.value)
    } else {
      ingredients.value.push(ingredientItem.value)
    }
    close()
  }

  function initialize () {
    ingredients.value = [
      {
        name: 'Leite Condensado',
        value: 10.00,
        measure: 395,
      },
    ]
  }
</script>
