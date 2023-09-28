<template>
  <div>
    <q-table
      row-key="id"
      row="row"
      :data="saleList"
      :columns="columns"
      :hide-pagination="true"
    >
      <template v-slot:top>
        <vs-button @click="goBack" icon flat primary><q-icon name="arrow_back"/></vs-button>
      </template>
      <template v-slot:body-cell-id="props">
        <q-td class="text-center">{{ props.rowIndex + 1 }}</q-td>
      </template>
      <template v-slot:body-cell-actions="props">
        <q-td class="text-center">
          <vs-button style="display: inline-block" flat icon dark @click="viewForm(props.row.id)">
            <q-icon name="visibility"/>
          </vs-button>
        </q-td>
      </template>
    </q-table>
  </div>
</template>
<script>
import SaleService from "../post/sale.service";
import ZReportService from "../post/z-report.service";
export default {
  name: "nakladnoy",
  data() {
    return {
      windowWidth: window.innerWidth,
      saleList: [],
      columns: [
        {name: 'id', align: 'center', label: this.$t('items.index'), field: 'id'},
        {name: 'fromDepartmentName', align: 'center', label: this.$t('doc.department'), field: 'fromDepartmentName'},
        {name: 'regDate', align: 'center', label: this.$t('doc.regDate'), field: 'regDate'},
        {name: 'regNumber', align: 'center', label: this.$t('doc.regNumber'), field: 'regNumber'},
        {name: 'status', align: 'center', label: this.$t('doc.status'), field: 'status'},
        {name: 'actions', align: 'center', label: this.$t('doc.action'), field: 'actions'}
      ],
      docId: null
    }
  },
  watch: {

  },
  methods: {
    print() {
      window.print();
    },
    goBack() {
      this.$router.go(-1)
    },
    viewForm(docId) {
      this.$router.push(`/post/sales/z-report-view/sale-view/${docId}`)
    },
  },
  created() {
    ZReportService.get_Zet_List_With_Sale_List(this.$route.params.id).then(res => {
      this.saleList = res.data
    }).catch(e => {
      this.$vs.notification({
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
