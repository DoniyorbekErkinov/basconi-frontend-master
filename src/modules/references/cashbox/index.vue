<template>
  <div>
    <q-table
      :title="$t('management.cash_box')"
      row="row"
      :columns="columns"
      :data="cashBoxList"
      row-key="id"
      :hide-pagination="true"
      :rows-per-page-options="[0]"
    >
      <template v-slot:top-right>
        <vs-button success animation-type="rotate" @click="createForm">
          <q-icon name="add"/>
          <template #animate>
            <q-icon name="add"/>
          </template>
        </vs-button>
      </template>
      <template v-slot:body-cell-id="props">
        <q-td class="text-center">{{ props.rowIndex + 1 }}</q-td>
      </template>
      <template v-slot:body-cell-action="props">
        <q-td class="text-center">
          <vs-button style="display: inline-block" flat icon primary @click="editForm(props.row)">
            <q-icon name="edit"/>
          </vs-button>
          <vs-button  style="display: inline-block" flat icon danger @click="deleteModalTrue(props.row.id)">
            <q-icon name="delete"/>
          </vs-button>
        </q-td>
      </template>
    </q-table>
    <!--    Create / Edit    -->
    <vs-dialog blur prevent-close v-model="createModal">
      <template #header>
        <b v-if="create">{{ $t('management.cash_box_create') }}</b>
        <b v-else>{{ $t('management.cash_box_edit') }}</b>
      </template>
      <q-separator/>
      <vs-input
          state="primary"
      block class="mt-3"
      label="Nomi"
      v-model="name"/>
      <vs-select
        block
        class="mt-3"
        v-model="departmentId"
        :key="`departmentList-${departmentList.length}`"
        :label="$t('management.department')"
      >
          <vs-option v-for="(dep, i) in departmentList" :key="`dep-${i}`" :label="dep.name" :value="dep.id">
            {{ dep.name }}
          </vs-option>
      </vs-select>
      <template #footer>
        <vs-button class="mt-2" block primary gradient @click="save('ACTIVE')">{{ $t('actions.save') }}</vs-button>
      </template>
    </vs-dialog>
    <!--           Delete          -->
    <confirm-modal :model="deleteModal" @submit="deleteCashBox" @close="deleteModal = false" :text="$t('confirm_delete')"/>
  </div>
</template>

<script>
import DepartmentService from "../../management/department/department.service";
import CashBoxService from "./cashbox.service";
import ConfirmModal from "../../../components/confirmModal";
export default {
  name: "cashbox",
  components: {ConfirmModal},
  data() {
    return {
      windowWidth: window.innerWidth,
      create: true,
      createModal: false,
      departmentList: [],
      cashBoxList: [],
      columns: [
        {name: 'id', align: 'center', label: '№', field: 'id'},
        {name: 'name', align: 'center', label: this.$t('management.cash_box'), field: 'name'},
        {name: 'departmentName', align: 'center', label: this.$t('doc.department'), field: 'departmentName'},
        // {name: 'ipAddress', align: 'center', label: this.$t('doc.ip_address'), field: 'ipAddress'},
        {name: 'status', align: 'center', label: this.$t('doc.status'), field: 'status'},
        {name: 'action', align: 'center', label: this.$t('doc.action'), field: 'action'},
      ],
      form: {

        // ipAddress: ''
      },
      name: '',
      departmentId: '',
      deleteModal: false,
      cashBoxId: null
    }
  },
  computed: {
  },
  methods: {
    getCashBoxlist() {
      CashBoxService.getList().then(res => {
        this.cashBoxList = res.data
      })
    },
    getDepList(){
      DepartmentService.getDepartmentsList().then(res => {
        this.departmentList = []
        this.departmentList = res.data
      })
    },
    createForm() {
      this.create = true
      this.getDepList()
      this.createModal = true
    },
    editForm(item) {
      this.create = false
      this.form = item
      this.getDepList()
      this.createModal = true
    },
    save(status) {
      this.form.status = status
      this.form.name = this.name
      this.form.departmentId = this.departmentId
      if(this.create) {
        CashBoxService.createCashbox(this.form).then(res => {
          this.getCashBoxlist()
          this.departmentList=[]
          this.departmentId = ''
          this.name = ''
          this.getDepList()
          this.createModal = false
          this.form = {}
        })
      } else {
        CashBoxService.updateCashbox(this.form).then(res => {
          this.getCashBoxlist()
          this.departmentList=[]
          this.getDepList()
          this.form = {}
          this.form.departmentId = ''
          this.name = ''
          this.createModal = false
        })
      }
    },
    deleteModalTrue(id) {
      this.cashBoxId = id
      this.deleteModal = true
    },
    deleteCashBox() {
      CashBoxService.deleteCashbox(this.cashBoxId).then(res => {
        this.deleteModal = false
        this.getCashBoxlist();
      })
    }
  },
  watch: {


  },
  created() {
    this.getCashBoxlist()
  }
}
</script>

<style scoped>

</style>
