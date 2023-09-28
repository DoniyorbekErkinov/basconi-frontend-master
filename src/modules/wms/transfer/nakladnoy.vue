<template>
  <q-card class="shadow-24">
    <q-toolbar>
      <vs-button @click="goBack" icon flat primary><q-icon name="arrow_back"/></vs-button>
      <q-toolbar-title v-if="windowWidth > 600">
        {{ $t('doc.regNumber') }} - {{ income.regNumber }}
      </q-toolbar-title>
      <q-space v-if="windowWidth < 600"/>
      <vs-button v-if="income.status === 'PENDING'" @click="save('READY')" style="width: 150px" block success gradient flat>Save</vs-button>
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
    <q-table :data="income.whDocItems" :columns="columns" row="row" row-key="id" :visible-columns="income.status === 'PENDING' ? visibleColumns : visibleColumns2"  hide-pagination :rows-per-page-options="[0]" class="mt-2">
      <template v-slot:body-cell-id="props">
        <q-td class="text-center">{{ props.rowIndex + 1 }}</q-td>
      </template>
      <template v-if="income.status === 'PENDING'" v-slot:body-cell-actions="props">
        <q-td style="max-width: 70px;">
          <validation-observer ref="pendingToReadyForm" v-slot="{}">
            <validation-provider rules="required" v-slot="{valid}">
              <vs-row align="flex-end">
                <vs-col>
                  <vs-input
                    block
                    state="primary"
                    type="number"
                    :danger="valid"
                    :class="!valid ? 'required' : ''"
                    v-model="pendingForm.whItems[props.rowIndex]"
                  />
                </vs-col>
              </vs-row>
            </validation-provider>
          </validation-observer>
        </q-td>
      </template>
    </q-table>
  </q-card>
</template>

<script>
import TransferService from "./transfer.service";
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
        {name: 'cku', align: 'center', label: this.$t('items.sku'), field: 'cku'},
        {name: 'size', align: 'center', label: this.$t('items.size'), field: 'sizeOlcham'},
        {name: 'price', align: 'center', label: this.$t('items.price'), field: 'price'},
        {name: 'count', align: 'center', label: this.$t('items.count'), field: 'count'},
        {name: 'actions', align: 'center', style: 'max-width: 40px', label: this.$t('items.action'), field: 'actions'}
      ],
      visibleColumns: [ 'id', 'cku', 'size', 'count', 'actions'],
      visibleColumns2: [ 'id', 'cku', 'size', 'count'],
      dynamic: {
        count: []
      }
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
      this.$refs.pendingToReadyForm.validate().then(valid => {
        if(valid) {
          if(this.pendingForm.whItems !== []) {
            this.pendingForm = this.income
            this.pendingForm.status = status
            this.pendingForm.whItems = this.income.whDocItems
            this.pendingForm.whDocItems = this.income.whDocItems
            this.pendingForm.whDocItems = []
            TransferService.saveIncomeTransferDoc(this.pendingForm).then(res => {
              this.$router.go(-1)
            })
          }
        }
      })
    }
  },
  created() {
    TransferService.getTransferDocById(this.$route.params.id).then(res => {
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
  }
}
</script>

<style scoped>
</style>
