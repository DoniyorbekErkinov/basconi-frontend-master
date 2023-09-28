<template>
  <q-card class="shadow-24">
    <q-toolbar>
      <vs-button @click="goBack" icon flat primary><q-icon name="arrow_back"/></vs-button>
      <q-toolbar-title v-if="windowWidth > 600">
        {{ $t('doc.regNumber') }} - {{ income.regNumber }}
      </q-toolbar-title>
      <q-space v-if="windowWidth < 600"/>
      <vs-button v-if="income.status === 'PENDING' && income.fromDepartmentId !== userDepId" @click="save('READY')" style="width: 150px" block success gradient flat>Save</vs-button>
<!--      <vs-button v-if="income.status !== 'PENDING'" @click="print" icon flat dark><q-icon name="print"/></vs-button>-->
    </q-toolbar>
    <vs-row>
      <vs-col v-if="windowWidth < 600" class="mt-2" w="12" align="left">
        <b class="ml-2">{{ $t('doc.regNumber') }}:</b> {{ income.regNumber }}
      </vs-col>
      <vs-col class="mt-1" w="12" align="left">
        <b class="ml-2">{{ $t('doc.regDate') }}:</b> {{ income.regDate }}
      </vs-col>
      <vs-col class="mt-1" w="12" align="left">
        <b class="ml-2">{{ $t('doc.from_department') }}:</b> {{ income.fromDepartmentName }}
      </vs-col>
      <vs-col class="mt-1" w="12" align="left">
        <b class="ml-2">{{ $t('doc.to_department') }}:</b> {{ income.toDepartmentName }}
      </vs-col>
    </vs-row>
    <q-table :data="income.whItems" :columns="columns" row="row" row-key="id+a"  hide-pagination :rows-per-page-options="[0]" class="mt-2">
      <template v-slot:body-cell-id="props">
        <q-td class="text-center">{{ props.rowIndex + 1 }}</q-td>
      </template>
    </q-table>
  </q-card>
</template>

<script>
import RequestService from "./request.service";
export default {
  name: "nakladnoy",
  data() {
    return {
      windowWidth: window.innerWidth,
      income: {},
      pendingForm: {
        whItems: {
          count: null
        }
      },
      columns: [
        {name: 'id', align: 'center', label: this.$t('items.index'), field: 'id'},
        // {name: 'itemName', align: 'center', label: this.$t('items.name'), field: 'itemName'},
        {name: 'cku', align: 'center', label: this.$t('items.sku'), field: 'itemCku'},
        {name: 'size', align: 'center', label: this.$t('items.size'), field: 'sizeOlcham'},
        {name: 'count', align: 'center', label: this.$t('items.count'), field: 'count'},
        {name: 'price', align: 'center', label: this.$t('items.price'), field: 'price'},
      ],
      dynamic: {
        count: []
      },
      userDepId: ""
    }
  },
  watch: {},
  methods: {
    print() {
      window.print();
    },
    goBack() {
      this.$router.go(-1)
    },
    save(status) {
      this.pendingForm = this.income
      this.pendingForm.status = status
      this.pendingForm.whItems = this.income.whItems
      RequestService.saveIncomeTransferDoc(this.pendingForm).then(res => {
        this.$router.go(-1)
      })
    },
    getUserInfo() {
      let userInfo = JSON.parse(localStorage.getItem('user_info'))
      return this.userDepId = userInfo.department
    }
  },
  async created() {
    let id = this.$route.params.id
    RequestService.getTransferDocById(id).then(res => {
      this.income = res.data
    }).catch(e => {
      this.$vs.notification({
        type:'confirm',
        title: e.message,
        progress: 'auto',
        color: 'danger',
        position: 'top-right'
      })
    })
    await this.getUserInfo()
  }
}
</script>

<style scoped>
</style>
