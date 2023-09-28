<template>
  <q-card class="shadow-24">
    <q-toolbar>
      <vs-button @click="goBack" icon flat primary><q-icon name="arrow_back"/></vs-button>
      <q-toolbar-title v-if="windowWidth > 600">
        {{ $t('doc.regNumber') }} - {{ income.regNumber }}
      </q-toolbar-title>
<!--      <vs-button @click="print" icon flat dark><q-icon name="print"/></vs-button>-->
    </q-toolbar>
    <vs-row>
      <vs-col class="mt-2" w="12" align="left">
        <b class="ml-2">{{ $t('doc.regNumber') }}:</b> {{ income.regNumber }}
      </vs-col>
      <vs-col class="mt-1" w="12" align="left">
        <b class="ml-2">{{ $t('doc.regDate') }}:</b> {{ income.regDate }}
      </vs-col>
      <vs-col class="mt-1" w="12" align="left">
        <b class="ml-2">{{ $t('doc.contragent') }}:</b> {{ income.contragentName }}
      </vs-col>
      <vs-col class="mt-1" w="12" align="left">
        <b class="ml-2">{{ $t('doc.department') }}:</b> {{ income.toDepartmentName }}
      </vs-col>
    </vs-row>
    <q-table row="row" row-key="id" :data="income.whDocItems" :columns="columns"  hide-pagination :rows-per-page-options="[0]" class="mt-2">
      <template v-slot:body-cell-id="props">
        <q-td class="text-center">{{ props.rowIndex + 1 }}</q-td>
      </template>
    </q-table>
  </q-card>
</template>

<script>
import IncomeService from "./income.service";

export default {
  name: "nakladnoy",
  data() {
    return {
      windowWidth: window.innerWidth,
      income: {},
      columns: [
        {name: 'id', align: 'center', label: this.$t('items.index'), field: 'id'},
        {name: 'cku', align: 'left', label: this.$t('items.sku'), field: 'cku'},
        // {name: 'itemName', align: 'center', label: this.$t('items.name'), field: 'itemName'},
        {name: 'size', align: 'center', label: this.$t('items.size'), field: 'sizeOlcham'},
        {name: 'count', align: 'center', label: this.$t('items.count'), field: 'count'},
        // {name: 'incomePrice', align: 'center', label: this.$t('items.income_price'), field: 'incomePrice'},
        {name: 'price', align: 'center', label: this.$t('items.price'), field: 'price'}
      ]
    }
  },
  methods: {
    print() {
      window.print();
    },
    goBack() {
      this.$router.go(-1)
    }
  },
  created() {
    IncomeService.getIncomeDocById(this.$route.params.id).then(res => {
      this.income = res.data
    }).catch(e => {
      this.$vs.notification({
        type:'confirm',
        duration: 1000,
        title: e.message,
        progress: 'auto',
        color: 'danger',
        position: 'top-right'
      })
    })
  }
}
</script>

<style scoped>

</style>
