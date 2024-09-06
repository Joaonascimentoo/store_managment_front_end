<template>
  <v-container class="fill-height">
    <v-data-table
      :headers="tableHeaders"
      :items="sales"
      :sort-by="[{ key: 'day', order: 'asc' }]"
    >
      <template #top>
        <v-toolbar flat>
          <v-toolbar-title>Controle de Vendas</v-toolbar-title>
          <v-divider class="mx-4" inset vertical />
          <v-dialog v-model="dialog" max-width="500px">
            <template #activator="{ props }">
              <v-btn
                class="mb-2"
                color="white"
                variant="tonal"
                v-bind="props"
              >
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
                      <v-text-field
                        v-model="saleItem.day"
                        v-maska="'##/##/####'"
                        label="Dia"
                        placeholder="DD/MM/AAAA"
                      />
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="saleItem.value"
                        label="Valor"
                        type="text"
                        @input="maskMoney($event)"
                      />
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="saleItem.entries"
                        label="Entradas"
                        type="text"
                        @input="maskMoney($event)"
                      />
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="saleItem.exits"
                        label="Saídas"
                        type="text"
                        @input="maskMoney($event)"
                      />
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
              <v-card-title
                class="text-h5"
                style="white-space: normal; text-align: center"
              >Você tem certeza que quer deletar esse item?</v-card-title>
              <v-card-actions>
                <v-spacer />
                <v-btn
                  color="white"
                  variant="tonal"
                  @click="closeDelete"
                >Cancelar
                </v-btn>
                <v-btn
                  color="white"
                  variant="tonal"
                  @click="deleteItemConfirm"
                >OK</v-btn>
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
        <v-icon size="small" @click="deleteItem(item)"> mdi-delete </v-icon>
      </template>
      <template #no-data>
        <v-btn color="primary" @click="initialize"> Atualizar </v-btn>
      </template>
    </v-data-table>
  </v-container>
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue'
  import { vMaska } from 'maska/vue'

  function getCurrentDate () {
    const date = new Date()
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()

    return `${day}/${month}/${year}`
  }

  const dialog = ref(false)
  const dialogDelete = ref(false)

  interface Sale {
    day: string
    value: string,
    entries: string,
    exits: string,
  }

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

  const tableHeaders = [
    { title: 'Dia', key: 'day' },
    { title: 'Valor', key: 'value' },
    { title: 'Entradas', key: 'entries' },
    { title: 'Saídas', key: 'exits' },
    { title: 'Ações', key: 'actions', sortable: false },
  ]

  const sales = ref<Sale[]>([])
  const saleItemIndex = ref<number>(-1)

  const defaultSaleItem:Sale = {
    day: getCurrentDate(),
    value: '',
    entries: '',
    exits: '',
  }

  const saleItem = ref<Sale>({ ...defaultSaleItem })

  const formTitle = computed(() => (saleItemIndex.value === -1 ? 'Nova Venda' : 'Editar Venda'))

  watch(dialog, val => {
    if (!val) close()
  })

  watch(dialogDelete, val => {
    if (!val) closeDelete()
  })

  onMounted(() => {
    initialize()
  })

  function editItem (item: Sale) {
    saleItemIndex.value = sales.value.indexOf(item)
    saleItem.value = { ...item }
    dialog.value = true
  }

  function deleteItem (item: Sale) {
    saleItemIndex.value = sales.value.indexOf(item)
    saleItem.value = { ...item }
    dialogDelete.value = true
  }

  function deleteItemConfirm () {
    sales.value.splice(saleItemIndex.value, 1)
    closeDelete()
  }

  function close () {
    dialog.value = false
    nextTick(() => {
      saleItem.value = { ...defaultSaleItem }
      saleItemIndex.value = -1
    })
  }

  function closeDelete () {
    dialogDelete.value = false
    nextTick(() => {
      saleItem.value = { ...defaultSaleItem }
      saleItemIndex.value = -1
    })
  }

  function save () {
    if (saleItemIndex.value > -1) {
      Object.assign(sales.value[saleItemIndex.value], saleItem.value)
    } else {
      sales.value.push(saleItem.value)
    }
    close()
  }

  function initialize () {
    sales.value = [
      {
        day: getCurrentDate(),
        value: '122,00',
        entries: '142,00',
        exits: '12,00',
      },
    ]
  }

</script>
