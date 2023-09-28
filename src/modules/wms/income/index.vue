<template>
  <div>
    <q-table
      v-if="windowWidth > 600"
      row-key="id"
      row="row"
      :data="incomes"
      class="shadow-10"
      :columns="columns"
      :hide-pagination="true"
      :rows-per-page-options="[0]"
    >
      <template v-slot:top>
        <div v-if="windowWidth > 600" class="q-table__title">{{ $t('wms.income.title') }}</div>
        <q-space v-if="windowWidth > 600"/>
        <vs-input primary icon-after class="q-mr-lg" v-model="search" :placeholder="$t('actions.search')">
          <template #icon>
            <q-icon name="search"/>
          </template>
        </vs-input>
        <q-space v-if="windowWidth < 600"/>
        <vs-button success animation-type="rotate" @click="createForm">
          <q-icon name="add"/>
          <template #animate>
            <q-icon name="add"/>
          </template>
        </vs-button>
        <q-separator/>
      </template>
      <template v-slot:body-cell-id="props">
        <q-td class="text-center">{{ paginate(payload.limit, payload.page, props.rowIndex) }}</q-td>
      </template>
      <template v-if="windowWidth > 600" v-slot:body-cell-actions="props">
        <q-td class="text-center">
          <vs-button v-if="props.row.status === 'READY'" style="display: inline-block" flat icon dark @click="viewForm(props.row.id)">
            <q-icon name="visibility"/>
          </vs-button>
          <vs-button v-if="$can('Update', 'wareHouseDocument') && props.row.status === 'SUSPENDED'" style="display: inline-block" flat icon primary @click="editForm(props.row.id)">
            <q-icon name="edit"/>
          </vs-button>
          <vs-button v-if="$can('delete', 'WarehouseDoc') && props.row.status === 'SUSPENDED'" style="display: inline-block" flat icon danger @click="deleteForm(props.row.id)">
            <q-icon name="delete"/>
          </vs-button>
        </q-td>
      </template>
    </q-table>
    <template v-if="windowWidth < 600">
      <q-toolbar>
        <div v-if="windowWidth > 600" class="q-toolbar__title">{{ $t('wms.income.title') }}</div>
        <q-space v-if="windowWidth > 600"/>
        <vs-input primary icon-after  v-model="search" :placeholder="$t('actions.search')">
          <template #icon>
            <q-icon name="search"/>
          </template>
        </vs-input>
        <q-space v-if="windowWidth < 600"/>
        <vs-button success animation-type="rotate" @click="createForm">
          <q-icon name="add"/>
          <template #animate>
            <q-icon name="add"/>
          </template>
        </vs-button>
        <q-separator/>
      </q-toolbar>
      <div class="ml-2 q-pa-xs col-xs-12 col-sm-6" v-for="income in incomes"
           :key="income.id">
        <q-expansion-item
            :label="income.regNumber"
            style="border-radius: 15px;"
            expand-icon-class="text-white"
            header-class="text-white"
            :header-class="income.status === 'READY' ? 'bg-green-13' : 'bg-yellow-5'"
            class="shadow-24 overflow-hidden mr-2"
        >
          <q-card dense>
            <q-card-section>
              <q-list bordered separator dense>
                <q-item v-ripple>
                  <q-item-section>
                    <q-item-label>{{ $t('doc.regNumber') }}: <b class="ml-1" style="color: red">{{ income.regNumber }}</b></q-item-label>
                  </q-item-section>
                </q-item>
                <q-item v-ripple>
                  <q-item-section>
                    <q-item-label>{{ $t('doc.regDate') }}: <b class="ml-1" style="color: red">{{ income.regDate }}</b></q-item-label>
                  </q-item-section>
                 </q-item>
                <q-item>
                   <q-item-section>
                     <q-item-label>{{ $t('doc.department') }}: <b class="ml-1" style="color: red">{{ income.toDepartmentName }}</b></q-item-label>
                   </q-item-section>
                 </q-item>
                <q-item>
                   <q-item-section>
                     <q-item-label>{{ $t('doc.contragent') }}: <b class="ml-1" style="color: red">{{ income.contragentName }}</b></q-item-label>
                   </q-item-section>
                 </q-item>
                <q-item>
                   <q-item-section>
                     <vs-row>
                       <vs-col justify="center" align="center">
                         <vs-button v-if="income.status === 'READY'" style="display: inline-block" flat icon dark @click="viewForm(income.id)">
                           <q-icon name="visibility"/>
                         </vs-button>
                         <vs-button v-if="income.status === 'SUSPENDED'" style="display: inline-block" flat icon primary @click="editForm(income.id)">
                           <q-icon name="edit"/>
                         </vs-button>
                         <vs-button v-if="income.status === 'SUSPENDED'" style="display: inline-block" flat icon danger @click="deleteForm(income.id)">
                           <q-icon name="delete"/>
                         </vs-button>
                       </vs-col>
                     </vs-row>
                   </q-item-section>
                </q-item>

              </q-list>
            </q-card-section>
          </q-card>
        </q-expansion-item>
      </div>
    </template>
    <div class="row justify-center q-mt-md">
      <q-pagination v-model="payload.page" :max="maxIncome" :max-pages="4" direction-links boundary-links push/>
    </div>

    <!--           Create / Edit           -->
    <vs-dialog v-model="createEditModal" blur prevent-close width="100%">
      <template #header>
        <b v-if="create">{{ $t('wms.new_income') }}</b>
        <b v-else>{{ $t('wms.edit_income') }}</b>
      </template>
      <q-separator/>
      <validation-observer ref="incomeForm" v-slot="{}">
        <vs-row>
          <vs-col :w="windowWidth > 600 ? '6' : '12'">
            <validation-provider v-slot="{valid}" rules="required" name="departmentId">
              <vs-select
                  block
                  class="mt-3"
                  :danger="!valid"
                  :label="$t('doc.department')"
                  :class="!valid ? 'required' : ''"
                  v-model="formIncome.toDepartmentId"
                  :key="`departmentList-${departmentList.length}`"
              >
                <vs-option-group>
                  <div>{{ $t('doc.department') }}</div>
                  <vs-option v-for="(dep, i) in departmentList" :key="`departmentList-${i}`" :label="dep.name" :value="dep.id">
                    {{ dep.name }}
                  </vs-option>
                </vs-option-group>
              </vs-select>
            </validation-provider>
          </vs-col>
          <vs-col :w="windowWidth > 600 ? '6' : '12'">
            <validation-provider v-slot="{valid}" rules="required" name="regNumber">
              <vs-input
                  block
                  primary
                  class="mt-3"
                  :danger="!valid"
                  :label="$t('doc.regNumber')"
                  v-model="formIncome.regNumber"
                  :class="!valid ? 'required' : ''"
              />
            </validation-provider>
          </vs-col>
          <vs-col :w="windowWidth > 600 ? '6' : '12'">
            <validation-provider v-slot="{valid}" rules="required" name="contragentId">
              <vs-select
                  block
                  class="mt-3"
                  :danger="!valid"
                  :label="$t('doc.contragent')"
                  :class="!valid ? 'required' : ''"
                  v-model="formIncome.contragentId"
                  :key="`contragentList-${contragentList.length}`"
              >
                <vs-option-group>
                  <div>{{ $t('doc.contragent') }}</div>
                  <vs-option v-for="(con, ind) in contragentList" :key="`contragent-${ind}`" :label="con.name" :value="con.id">
                    {{ con.name }}
                  </vs-option>
                </vs-option-group>
              </vs-select>
            </validation-provider>
          </vs-col>
<!--          <vs-col :w="windowWidth > 600 ? '6' : '12'">-->
<!--            <validation-provider v-slot="{valid}" rules="required" name="regDate">-->
<!--              <vs-input-->
<!--                  block-->
<!--                  primary-->
<!--                  type="date"-->
<!--                  class="mt-3"-->
<!--                  :danger="!valid"-->
<!--                  :label="$t('doc.regDate')"-->
<!--                  v-model="formIncome.regDate"-->
<!--                  :class="!valid ? 'required' : ''"-->
<!--              />-->
<!--            </validation-provider>-->
<!--          </vs-col>-->
          <vs-col w="12">
            <vs-row>
              <vs-col :w="windowWidth > 600 ? '6' : '12'">
                <validation-provider v-slot="{valid}" name="itemId">
                  <vs-select
                      block
                      class="mt-3"
                      v-model="itemId"
                      @change="itemSet($event)"
                      :label="$t('references.product')"
                      :key="`itemList-${itemList.length}`"
                  >
                    <vs-option-group>
                      <div>{{ $t('references.product') }}</div>
                      <vs-option v-for="(it, ind) in itemList" :key="`items-${ind}`" :label="`${it.cku} / ${it.colorName}`" :value="it.id">
                        {{ it.cku }} / {{it.colorName}}
                      </vs-option>
                    </vs-option-group>
                  </vs-select>
                </validation-provider>
              </vs-col>
              <vs-col :w="windowWidth > 600 ? '6' : '12'">
                <validation-provider v-slot="{valid}">
                  <vs-input block primary icon-after class="q-mr-lg mt-3" v-model="search1" :placeholder="$t('actions.search')">
                    <template #icon>
                      <q-icon name="search"/>
                    </template>
                  </vs-input>
                </validation-provider>
              </vs-col>
            </vs-row>
            <vs-row v-if="itemId">
              <vs-col w="3" v-for="sizeCount in dynamicItem.sizes">
                <vs-input state="primary" type="number" block class="mt-3" :label="`${$t('items.count')} - ${sizeCount.olcham}`" v-model="sizeCount.count"/>
              </vs-col>
            </vs-row>
            <vs-row v-if="itemId">
              <vs-col w="6">
                <vs-input state="primary" type="number" block class="mt-3" :label="$t('items.income_price')" v-model="dynamicItem.incomePrice"/>
              </vs-col>
              <vs-col w="6">
                <vs-input state="primary" type="number" block class="mt-3" :label="$t('items.price')" v-model="dynamicItem.price"/>
              </vs-col>
              <vs-col w="12" align="center" class="mt-1">
                <vs-button flat @click="addToWhList">{{ $t('actions.add') }}</vs-button>
              </vs-col>
            </vs-row>
            <vs-row v-if="dynamicItem.editable">
              <vs-row>
                <vs-col w="12">
                  <b>{{ dynamicItem.cku }} / {{ dynamicItem.brandName }}</b>
                </vs-col>
              </vs-row>
              <vs-col w="3" v-for="sizeCount in dynamicItem.sizes">
                <vs-input state="primary" type="number" block class="mt-3" :label="`${$t('items.count')} - ${sizeCount.olcham}`" v-model="sizeCount.count"/>
              </vs-col>
            </vs-row>
            <vs-row v-if="dynamicItem.editable">
              <vs-col w="6">
                <vs-input state="primary" type="number" block class="mt-3" :label="$t('items.income_price')" v-model="dynamicItem.incomePrice"/>
              </vs-col>
              <vs-col w="6">
                <vs-input state="primary" type="number" block class="mt-3" :label="$t('items.price')" v-model="dynamicItem.price"/>
              </vs-col>
              <vs-col w="12" align="center" class="mt-1">
                <vs-button flat @click="addToWhList">{{ $t('actions.add') }}</vs-button>
              </vs-col>
            </vs-row>
            <vs-row v-if="formIncome.whItems.length > 0" class="mt-2">
              <vs-col w="12">
                <q-table class="shadow-10" dense row="row" row-key="id" :data="formIncome.whItems" :columns="dynamicItemCols" :hide-pagination="true" :rows-per-page-options="[0]">
                  <template v-slot:body-cell-id="props">
                    <q-td class="text-center">
                      {{ props.rowIndex+1 }}
                    </q-td>
                  </template>
                  <template v-slot:body-cell-name="props">
                    <q-td class="text-center">
                      {{ props.row.name ? props.row.name : props.row.brandName }}
                    </q-td>
                  </template>
                  <template v-slot:body-cell-actions="props">
                    <q-td class="text-center">
                      <vs-button @click="editDynamicItem(props.rowIndex, props.row)" style="display: inline-block" flat icon primary>
                        <q-icon name="edit"/>
                      </vs-button>
                      <vs-button @click="deleteDynamicItem(props.rowIndex)" style="display: inline-block" flat icon danger>
                        <q-icon name="delete"/>
                      </vs-button>
                    </q-td>
                  </template>
                </q-table>
              </vs-col>
            </vs-row>
          </vs-col>
        </vs-row>
      </validation-observer>
      <template #footer>
        <vs-row>
          <vs-col :w="windowWidth > 600 ? '6' : '12'">
            <vs-button @click="save('SUSPENDED')" :class="windowWidth > 600 ? 'mt-2 mr-1' : 'mt-1'" block warn gradient>{{ $t('actions.save') }}</vs-button>
          </vs-col>
          <vs-col :w="windowWidth > 600 ? '6' : '12'">
            <vs-button @click="save('READY')" :class="windowWidth > 600 ? 'mt-2 mr-1' : 'mt-1'" block success gradient>{{ $t('actions.save_end_finish') }}</vs-button>
          </vs-col>
        </vs-row>
      </template>
    </vs-dialog>

    <!--       Delete       -->
    <confirm-modal :model="deleteModal" @submit="deleteIncomeDoc" @close="deleteModal = false" :text="$t('confirm_delete')"/>
  </div>
</template>
<script>
import ConfirmModal from "../../../components/confirmModal.vue"
import DepartmentService from "../../management/department/department.service";
import ContragentService from "../../references/contragent/contragent.servie";
import IncomeService from "./income.service";
import ProductService from "../../references/product/product.service";

export default {
  name: "index",
  components: {ConfirmModal},
  data() {
    return {
      windowWidth: window.innerWidth,
      incomes: [],
      totalIncome: 0,
      payload: {
        page: 1,
        limit: 20
      },
      columns: [
        {name: 'id', align: 'center', label: this.$t('doc.index'), field: 'id'},
        {name: 'regNumber', align: 'left', label: this.$t('doc.regNumber'), field: 'regNumber'},
        {name: 'regDate', align: 'center', label: this.$t('doc.regDate'), field: 'regDate'},
        {name: 'toDepartmentName', align: 'center', label: this.$t('doc.department'), field: 'toDepartmentName'},
        {name: 'contragentName', align: 'center', label: this.$t('doc.contragent'), field: 'contragentName'},
        {name: 'status', align: 'center', label: this.$t('doc.status'), field: 'status'},
        {name: 'actions', align: 'center', label: this.$t('doc.action'), field: 'actions'}
      ],
      visibleColumns: ['regNumber', 'regDate', 'toDepartmentName', 'contragentName','status'],
      visibleColumn: ['id','regNumber', 'regDate', 'toDepartmentName', 'contragentName','status','actions'],
      dynamicItemCols: [
        {name: 'id', align: 'center', label: this.$t('items.index'), field: 'id'},
        {name: 'cku', align: 'center', label: this.$t('items.sku'), field: 'cku'},
        // {name: 'name', align: 'center', label: this.$t('items.name'), field: 'name'},
        {name: 'size', align: 'center', label: this.$t('items.size'), field: 'sizeOlcham'},
        {name: 'count', align: 'center', label: this.$t('items.count'), field: 'count'},
        {name: 'incomePrice', align: 'center', label: this.$t('items.income_price'), field: 'incomePrice'},
        {name: 'price', align: 'center', label: this.$t('items.price'), field: 'price'},
        {name: 'actions', align: 'center', label: this.$t('items.action'), field: 'actions'}
      ],
      search: '',
      search1: '',
      create: true,
      createEditModal: false,
      deleteModal: false,
      docId: null,
      formIncome: {},
      departmentList: [],
      contragentList: [],
      itemList: [],
      itemId: '',
      dynamicItem: {}
    }
  },
  watch: {
    'search': {
      handler(e) {
        this.getIncomeDocs();
      }
    },
    'payload.page': {
      handler(e) {
        this.getIncomeDocs();
      }
    },
    'search1': {
      handler(e) {
        this.getItems(e)
      }
    }
  },
  computed: {
    maxIncome() {
      let max = this.totalIncome / this.payload.limit
      return Math.ceil(max)
    }
  },
  methods: {
    paginate(itemsPerPage, currentPage, index) {
      currentPage = currentPage - 1
      return itemsPerPage * currentPage + (index + 1)
    },
    getIncomeDocs() {
      IncomeService.getIncomeDocs(this.search, this.payload).then(res => {
        this.incomes = res.data.list
        this.totalIncome = res.data.total
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
    },
    getDepartments() {
      DepartmentService.getDepartmentsList().then(res => {
        this.departmentList = res.data
      }).catch(e => {
        this.$vs.notification({
          type:'confirm',
          title: e.message,
          duration: 1000,
          progress: 'auto',
          color: 'danger',
          position: 'top-right'
        })
      })
    },
    getContragents() {
      ContragentService.getContragents().then(res => {
        this.contragentList = res.data
      }).catch(e => {
        this.$vs.notification({
          type:'confirm',
          title: e.message,
          duration: 1000,
          progress: 'auto',
          color: 'danger',
          position: 'top-right'
        })
      })
    },
    getItems(search) {
      let payload = {
        page: 1,
        limit: 1000000
      }
      ProductService.getItemsList(payload, search).then(res => {
        this.itemList = res.data.list
      }).catch(e => {
        this.$vs.notification({
          type:'confirm',
          title: e.message,
          duration: 1000,
          progress: 'auto',
          color: 'danger',
          position: 'top-right'
        })
      })
    },
    createForm() {
      IncomeService.createIncomeDoc().then(res => {
        this.formIncome = {}
        this.formIncome = res.data
        this.formIncome.regDate = res.data.regDate
        this.formIncome.toDepartmentId = ''
        this.formIncome.contragentId = ''
        this.formIncome.whDocItems = []
        this.formIncome.whItems = []
        this.itemId = ''
        this.dynamicItem = {}
        this.getItems('');
        this.getDepartments();
        this.getContragents();
        this.createEditModal = true
      }).catch(e => {
        this.$vs.notification({
          type:'confirm',
          title: e.message,
          duration: 1000,
          progress: 'auto',
          color: 'danger',
          position: 'top-right'
        })
      })
    },
    viewForm(docId) {
      this.$router.push(`/wms/income-view/${docId}`)
    },
    editForm(docId) {
      IncomeService.getIncomeDocById(docId).then(res => {
        this.itemId = ''
        this.dynamicItem = {}
        this.formIncome = {
          ...res.data,
          whItems: res.data.whDocItems,
          whDocItems:null,
        }
        this.createEditModal = true
      }).catch(e => {
        this.$vs.notification({
          type:'confirm',
          title: e.message,
          duration: 1000,
          progress: 'auto',
          color: 'danger',
          position: 'top-right'
        })
      })
    },
    deleteForm(id) {
      this.docId = null
      this.docId = id
      this.deleteModal = true
    },
    deleteIncomeDoc() {
      IncomeService.deleteIncomeDoc(this.docId).then(res => {
        this.$vs.notification({
          type:'confirm',
          duration: 1000,
          title: this.$t('success_deleted'),
          progress: 'auto',
          color: 'success',
          position: 'top-right'
        })
        this.getIncomeDocs();
        this.deleteModal = false
      }).catch(e => {
        this.$vs.notification({
          type:'confirm',
          title: e.message,
          duration: 1000,
          progress: 'auto',
          color: 'danger',
          position: 'top-right'
        })
      })
    },
    itemSet(itemId) {
      this.itemList.forEach(item => {
        if (item.id === itemId) {
          this.dynamicItem = item
          Object.assign(this.dynamicItem, {itemId: item.id})
        }
      })
    },
    addToWhList() {
      if (this.dynamicItem.price && this.dynamicItem.incomePrice) {
        let has = false,
            ind = 0
        this.formIncome.whItems.forEach((whItem, index) => {
          if (whItem.id === this.dynamicItem.id) {
            has = true
            ind = index
          }
        })
        if (has) {
          this.formIncome.whItems.splice(ind, 1)
        }
        let item = Object.assign({}, this.dynamicItem)
        this.dynamicItem.sizes.forEach((s, i) => {
          let tmp = Object.assign({}, item)
          if (s.count) {
            if (!tmp.itemId) {
              tmp.itemId = tmp.id
              tmp.id = null
            }
            tmp.sizeId = s.id
            tmp.sizeOlcham = s.olcham
            tmp.count = s.count
            this.formIncome.whItems.unshift(tmp)
          }
        })
        this.getItems('');
        this.dynamicItem = {}
        this.itemId = ''
        this.dynamicItem.editable = false
      } else {
        this.$vs.notification({
          type:'confirm',
          title: '',
          duration: 1000,
          progress: 'auto',
          color: 'danger',
          position: 'top-right'
        })
      }
    },
    editDynamicItem(index, item) {
      this.formIncome.whItems.splice(index, 1)
      let tmp = {
        itemId: item.itemId,
        // itemName: item.name ? item.name : item.itemName,
        cku: item.cku,
        sizes: [
          {id: item.sizeId, olcham: item.sizeOlcham, count: item.count}
        ],
        price: item.price,
        incomePrice: item.incomePrice
      }
      this.dynamicItem = tmp
      this.dynamicItem.editable = true
    },
    deleteDynamicItem(index) {
      this.formIncome.whItems.splice(index, 1)
    },
    save(status) {
      this.$refs.incomeForm.validate().then(valid => {
        if (valid) {
          this.formIncome.status = status
          this.formIncome.whDocItems = null
          let tmp = true
          if (status === 'READY') {
            if (this.formIncome.whItems.length > 0) {
              tmp = true
            } else {
              tmp = false
              this.$vs.notification({
                type:'confirm',
                title: this.$t('item_required_error'),
                progress: 'auto',
                duration: 1000,
                color: 'danger',
                position: 'top-right'
              })
            }
          }
          if (tmp) {
            IncomeService.saveIncomeDoc(this.formIncome).then(res => {
              this.createEditModal = false
              this.getIncomeDocs();
              this.$vs.notification({
                type:'confirm',
                title: this.$t('success_updated'),
                progress: 'auto',
                duration: 1000,
                color: 'success',
                position: 'top-right'
              })
            }).catch(e => {
              this.$vs.notification({
                type:'confirm',
                title: e.message,
                duration: 1000,
                progress: 'auto',
                color: 'danger',
                position: 'top-right'
              })
            })
          }
        } else {
          this.$vs.notification({
            type:'confirm',
            duration: 1000,
            title: this.$t('required_error'),
            progress: 'auto',
            color: 'danger',
            position: 'top-right'
          })
        }
      })
    }
  },
  created() {
    this.getIncomeDocs();
  }
}
</script>

<style scoped>

</style>
