<template>
  <v-container class="fill-height">
    <v-data-table :headers="tableHeaders" :items="utensils" :sort-by="[{ key: 'name', order: 'asc' }]">
      <template #top>
        <v-toolbar flat>
          <v-toolbar-title>Controle de Utensílios</v-toolbar-title>
          <v-divider class="mx-4" inset vertical />
          <v-dialog v-model="dialog" max-width="500px">
            <template #activator="{ props }">
              <v-btn class="mb-2" color="white" variant="tonal" v-bind="props">
                Adicionar Utensílio
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
                      <v-text-field v-model="utensilItem.name" label="Nome" />
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field v-model="utensilItem.value" label="Valor" @input="maskMoney($event)" />
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field v-model="utensilItem.quantity" label="Quantidade" />
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
              <v-card-title class="text-h5" style="white-space: normal; text-align: center;">Você tem certeza que quer deletar esse utensílio?</v-card-title>
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
  interface Utensil {
    name: string,
    value: Number,
    quantity: Number,
  }
  const dialog = ref(false)
  const dialogDelete = ref(false)
  const tableHeaders = [
    { title: 'Nome', key: 'name' },
    { title: 'Valor', key: 'value' },
    { title: 'Quantidade', key: 'quantity' },
    { title: 'Ações', key: 'actions', sortable: false },
  ]
  const utensils = ref<Utensil[]>([])
  const utensilItemIndex = ref<number>(-1)

  const defaultUtensilItem = {
    name: '',
    value: 0,
    quantity: 0,
  }
  const utensilItem = ref<Utensil>({ ...defaultUtensilItem })

  const formTitle = computed(() => (utensilItemIndex.value === -1 ? 'Novo Utensílio' : 'Editar Utensílio'))

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

  function editItem (item:Utensil) {
    utensilItemIndex.value = utensils.value.indexOf(item)
    utensilItem.value = Object.assign({}, item)
    dialog.value = true
  }

  function deleteItem (item:Utensil) {
    utensilItemIndex.value = utensils.value.indexOf(item)
    utensilItem.value = Object.assign({}, item)
    dialogDelete.value = true
  }

  function deleteItemConfirm () {
    utensils.value.splice(utensilItemIndex.value, 1)
    closeDelete()
  }

  function close () {
    dialog.value = false
    nextTick(() => {
      utensilItem.value = Object.assign({}, defaultUtensilItem)
      utensilItemIndex.value = -1
    })
  }

  function closeDelete () {
    dialogDelete.value = false
    nextTick(() => {
      utensilItem.value = Object.assign({}, defaultUtensilItem)
      utensilItemIndex.value = -1
    })
  }

  function save () {
    if (utensilItemIndex.value > -1) {
      Object.assign(utensils.value[utensilItemIndex.value], utensilItem.value)
    } else {
      utensils.value.push(utensilItem.value)
    }
    close()
  }

  function initialize () {
    utensils.value = [
      {
        name: 'Embalagem',
        value: 10.00,
        quantity: 20,
      },
    ]
  }
</script>
