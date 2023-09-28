<template>
  <div>
    <q-table
      v-if="windowWidth > 600"
      class="shadow-10"
      row="row"
      row-key="id"
      :columns="columns"
      :data="removedList"
      :hide-pagination="true"
      :rows-per-page-options="[0]"
    >
      <template v-slot:top>
        <div v-if="windowWidth > 600" class="q-table__title">{{ $t('wms.write_off.title') }}</div>
        <q-space v-if="windowWidth > 600"/>
        <vs-input state="primary" primary icon-after class="q-mr-lg" v-model="search" :placeholder="$t('actions.search')">
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
        <q-td class="text-center">{{ props.rowIndex + 1 }}</q-td>
      </template>
      <template v-slot:body-cell-actions="props">
        <q-td class="text-center">
          <vs-button v-if="props.row.status === 'READY'" style="display: inline-block" flat icon dark @click="viewForm(props.row.id)">
            <q-icon name="visibility"/>
          </vs-button>
          <vs-button v-if="props.row.status === 'SUSPENDED'" style="display: inline-block" flat icon primary @click="editForm(props.row.id)">
            <q-icon name="edit"/>
          </vs-button>
          <vs-button v-if="props.row.status === 'SUSPENDED'" style="display: inline-block" flat icon danger @click="deleteForm(props.row.id)">
            <q-icon name="delete"/>
          </vs-button>
        </q-td>
      </template>
    </q-table>
    <template v-else>
      <q-toolbar>
        <vs-row>
          <vs-input state="primary" primary icon-after  v-model="search" :placeholder="$t('actions.search')">
            <template #icon>
              <q-icon name="search"/>
            </template>
          </vs-input>
          <vs-button success animation-type="rotate" @click="createForm">
            <q-icon name="add"/>
            <template #animate>
              <q-icon name="add"/>
            </template>
          </vs-button>
        </vs-row>
      </q-toolbar>
      <div class="ml-2 q-pa-xs col-xs-12 col-sm-6" v-for="(removedItem, i) in removedList"
           :key="`l-${i}`">
        <q-expansion-item
            :label="removedItem.regNumber"
            style="border-radius: 15px;"
            expand-icon-class="text-white"
            header-class="text-white"
            :header-class="removedItem.status === 'READY' ? 'bg-green-13' : 'bg-yellow-5'"
            class="shadow-8 overflow-hidden mr-2"
        >
          <q-card dense>
            <q-card-section>
              <q-list bordered separator dense>
                <q-item v-ripple>
                  <q-item-section>
                    <q-item-label>{{ $t('doc.regNumber') }}</q-item-label>
                    <q-item-label><b>{{ removedItem.regNumber }}</b></q-item-label>
                  </q-item-section>
                </q-item>
                <q-item v-ripple>
                  <q-item-section>
                    <q-item-label>{{ $t('doc.regDate') }}</q-item-label>
                    <q-item-label><b>{{ removedItem.regDate }}</b></q-item-label>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section>
                    <q-item-label>{{ $t('doc.department') }}</q-item-label>
                    <q-item-label><b>{{ removedItem.fromDepartmentName }}</b></q-item-label>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section>
                    <vs-row>
                      <vs-col justify="center" align="center">
                        <vs-button v-if="removedItem.status === 'READY'" style="display: inline-block" flat icon dark @click="viewForm(removedItem.id)">
                          <q-icon name="visibility"/>
                        </vs-button>
                        <vs-button v-if="removedItem.status === 'SUSPENDED'" style="display: inline-block" flat icon primary @click="editForm(removedItem.id)">
                          <q-icon name="edit"/>
                        </vs-button>
                        <vs-button v-if="removedItem.status === 'SUSPENDED'" style="display: inline-block" flat icon danger @click="deleteForm(removedItem.id)">
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
      <q-pagination v-model="payload.page" :max="maxItems" :max-pages="4" direction-links boundary-links push/>
    </div>
    <!--        Create / Edit        -->
    <vs-dialog v-model="createEditModal" blur prevent-close @close="getRemovedList" width="100%">
      <template #header>
        <b v-if="create">{{ $t('wms.write_off.title') }}</b>
        <b v-else>{{ $t('wms.write_off.write_off_edit') }}</b>
      </template>
      <q-separator/>
      <validation-observer ref="formWriteOf" v-slot="{}">
        <vs-row>
          <vs-col :w="windowWidth > 600 ? '6' : '12'">
            <validation-provider v-slot="{valid}" rules="required" name="fromDepartmentId">
              <vs-select
                block
                class="mt-3"
                :danger="!valid"
                :label="$t('doc.department')"
                :class="!valid ? 'required' : ''"
                v-model="depId"
                @change="getItemByDepId(depId)"
                :key="`l-${departmentList.length}`"
              >
                <vs-option v-for="(dep, i) in departmentList" :key="`m-${i}`" :label="dep.name" :value="dep.id">
                  {{ dep.name }}
                </vs-option>
              </vs-select>
            </validation-provider>
          </vs-col>
          <vs-col :w="windowWidth > 600 ? '6' : '12'">
            <validation-provider v-slot="{valid}" rules="required">
              <vs-input
                  state="primary"
                  block
                  primary
                  type="date"
                  class="mt-3"
                  :danger="!valid"
                  :label="$t('doc.regDate')"
                  v-model="writeOfForm.regDate"
                  :class="!valid ? 'required' : '' || windowWidth > 600 ? 'ml-1' : ''"
              />
            </validation-provider>
          </vs-col>
          <vs-col :w="windowWidth > 600 ? '6' : '12'">
            <validation-provider v-slot="{valid}" rules="required">
              <vs-input
                  state="primary"
                  block
                  primary
                  class="mt-3"
                  :danger="!valid"
                  :label="$t('doc.regNumber')"
                  v-model="writeOfForm.regNumber"
                  :class="!valid ? 'required' : ''"
              />
            </validation-provider>
          </vs-col>
          <vs-col :w="windowWidth > 600 ? '6' : '12'">
            <validation-provider v-slot="{valid}">
              <vs-input
                  state="primary"
                  block
                  primary
                  class="mt-3"
                  :placeholder="$t('doc.commentary')"
                  :label="$t('doc.commentary')"
                  v-model="writeOfForm.comment"
                  :class="windowWidth > 600 ? 'ml-1' : ''"
              />
            </validation-provider>
          </vs-col>
          <q-separator/>
          <vs-col :w="windowWidth > 600 ? '6' : '12'">
            <validation-provider  v-slot="{valid}">
              <vs-select
                block
                class="mt-3"
                :danger="!valid"
                :label="$t('references.product')"
                :class="!valid ? 'required' : ''"
                v-model="itemId"
                @change="itemSet($event)"
                :key="`l-${itemList.length}`"
              >
                <vs-option v-for="(pro, i) in itemList" :key="`itemList-${i}`" :value="pro.id" :label="`${pro.brandName} / ${pro.parentRegNumber} / ${pro.itemCku} / ${pro.sizeOlcham} / ${pro.remaining}`" :label-placeholder="`${pro.brandName} / ${pro.itemCku} / ${pro.sizeOlcham} / ${pro.remaining}`">
                  {{ pro.brandName }} / {{pro.parentRegNumber}} / {{ pro.itemCku }} / {{ pro.sizeOlcham }} / {{ pro.remaining }}
                  </vs-option>
              </vs-select>
            </validation-provider>
          </vs-col>
          <vs-col v-if="itemId" :w="windowWidth > 600 ? '6' : '12'">
            <validation-provider v-slot="{valid}">
              <vs-input
                  state="primary"
                block
                primary
                class="mt-3"
                type="number"
                :label="$t('items.count')"
                v-model="dynamicItem.count"
                :class="!valid ? 'required' : '' || windowWidth > 600 ? 'ml-1' : ''"
                :danger="!valid"
              />
            </validation-provider>
          </vs-col>
          <vs-row v-if="itemId">
            <vs-col w="6" align="center" class="mt-1">
              <vs-button flat @click="addWROList">{{ $t('actions.add') }}</vs-button>
            </vs-col>
          </vs-row>
          <vs-row v-if="writeOfForm.whItems.length > 0">
            <vs-col class="mt-1" w="12">
              <q-table
                  row="row"
                  row-key="id"
                  class="shadow-10"
                  :columns="dynamicItemCols"
                  :data="writeOfForm.whItems"
                  :hide-pagination="true" :rows-per-page-options="[0]"
              >
                <template v-slot:body-cell-id="props">
                  <q-td class="text-center">
                    {{ props.rowIndex+1 }}
                  </q-td>
                </template>
                <template v-slot:body-cell-brandName="props">
                  <q-td class="text-center">
                    {{ props.row.brandName ? props.row.brandName : props.row.brandName }}
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
    <confirm-modal :model="deleteModal" @submit="deleteWriteOFDoc" @close="deleteModal = false" :text="$t('confirm_delete')"/>
  </div>
</template>

<script>
import WriteOfService from "./write_off.service";
import confirmModal from '../../../components/confirmModal.vue';
import DepartmentService from '../../management/department/department.service';
import WareHaseService from '../warehouse/warehouse.service';
import TransferService from "../transfer/transfer.service";
import IncomeService from "../income/income.service";
export default {
name: "index",
components: {confirmModal},
data() {
  return {
    columns: [
      {name: 'id', align: 'center', label: this.$t('doc.index'), field: 'id'},
      {name: 'fromDepartmentId', align: 'center', label: this.$t('doc.department'), field: 'fromDepartmentName'},
      {name: 'regNumber', align: 'center', label: this.$t('doc.regNumber'), field: 'regNumber'},
      {name: 'regDate', align: 'center', label: this.$t('doc.regDate'), field: 'regDate'},
      {name: 'comment', align: 'center', label: this.$t('doc.comment'), field: 'comment'},
      {name: 'status', align: 'center', label: this.$t('doc.status'), field: 'status'},
      {name: 'actions', align: 'center', label: this.$t('doc.action'), field: 'actions'}
    ],
    dynamicItemCols: [
      {name: 'id', align: 'center', label: this.$t('items.index'), field: 'id'},
      {name: 'cku', align: 'center', label: this.$t('items.sku'), field: 'itemCku'},
      {name: 'brandName', align: 'center', label: this.$t('items.brand'), field: 'brandName'},
      {name: 'size', align: 'center', label: this.$t('items.size'), field: 'sizeOlcham'},
      {name: 'price', align: 'center', label: this.$t('items.price'), field: 'price'},
      {name: 'count', align: 'center', label: this.$t('items.count'), field: 'count'},
      {name: 'actions', align: 'center', label: this.$t('items.action'), field: 'actions'}
    ],
    windowWidth: window.innerWidth,
    payload: {
      page: 1,
      limit: 20
    },
    keyword: '',
    search: '',
    totalItems: 0,
    totalItem: 0,
    pagination: {
      page: 1,
      limit: 20
    },
    create: true,
    createEditModal: false,
    deleteModal: false,
    removedList: [],
    writeOfForm: {},
    departmentList: [],
    fromDepartmentId: '',
    itemId: '',
    itemList: [],
    whItems: [],
    dynamicItem: {},
    itemLength: '',
    depId: '',
    docId: null,
    nothing: null
  }
},
watch: {
},
computed: {
  maxItems() {
    let maxI = this.totalItem / this.pagination.limit
    return Math.ceil(maxI)
  }
},
methods: {
  async getDepList() {
    await  DepartmentService.getDepartmentsList().then(res => {
      this.departmentList = []
      this.departmentList = res.data
    }).catch(e => {
        this.$vs.notification({
          duration: 2000,
          title: e.message,
          progress: 'auto',
          color: 'danger',
          position: 'top-right'
        })
      })
  },
  getProductList() {
    WareHaseService.getItemByDepId(this.depId, this.pagination).then(res => {
      this.itemList = res.data.list
      this.totalItem =res.data.total
    }).catch(e => {
        this.$vs.notification({
          title: e.message,
          duration: 2000,
          progress: 'auto',
          color: 'danger',
          position: 'top-right'
        })
      })
  },
  getRemovedList() {
    WriteOfService.getWriteOfDocs(this.keyword, this.payload).then(res => {
      this.removedList = res.data.list
      this.totalIncome = res.data.total
    }).catch(e => {
      this.$vs.notification({
        title: e.message,
        duration: 2000,
        progress: 'auto',
        color: 'danger',
        position: 'top-right'
      })
    })
  },
  createForm() {
    WriteOfService.createWriteOfDoc().then(res => {
      this.writeOfForm = {}
      this.writeOfForm = res.data
      this.writeOfForm.fromDepartmentId = ''
      this.writeOfForm.comment = ''
      this.writeOfForm.whItems = []
      this.dynamicItem = {}
      this.itemId = ''
      this.createEditModal = true
    }).catch(e => {
      this.$vs.notification({
        duration: 2000,
        title: e.message,
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
      }
    })
  },
  getItemByDepId(depId){
    this.removedList = [];
    this.getProductList(depId);
    this.writeOfForm.whItems = [];
  },
  addWROList(){
    if(this.dynamicItem.count > 0) {
      if(this.itemId) {
        let has = false,
            ind = 0
        this.writeOfForm.whItems.forEach((whDocItem, index) => {
          if(whDocItem.id === this.dynamicItem.id) {
              if(whDocItem.remaining >= this.dynamicItem.count) {
                has = true,
                ind = index
              }
          }
        })
        if (has) {
          this.writeOfForm.whItems.splice(ind, 1)
        }
        let item = Object.assign({}, this.dynamicItem)
        if(item.remaining >= this.dynamicItem.count) {
          this.writeOfForm.whItems.unshift(item)
          this.dynamicItem = {}
          this.itemId = ''
        } else {
          this.$vs.notification({
            title: this.$t('big-count'),
            progress: 'auto',
            duration: 2000,
            color: 'danger',
            position: 'top-right'
          })
        }

      } else {
        this.$vs.notification({
          title: this.$t('required_error'),
          duration: 2000,
          progress: 'auto',
          color: 'danger',
          position: 'top-right'
        })
      }
    } else {
      this.$vs.notification({
        title: this.$t('no-count'),
        duration: 2000,
        progress: 'auto',
        color: 'danger',
        position: 'top-right'
      })
    }
  },
  save(status) {
    this.$refs.formWriteOf.validate().then(valid => {
      if(valid) {
        this.writeOfForm.status = status
        let tmp = true
        if(status === 'READY') {
          if(this.itemId === '' && this.writeOfForm.whItems.length > 0) {
            tmp = true
          } else {
            tmp = false
            this.$vs.notification({
              title: this.$t('required_error'),
              progress: 'auto',
              duration: 2000,
              color: 'danger',
              position: 'top-right'
            })
          }
        } if (tmp) {
          this.writeOfForm.fromDepartmentId = this.depId
          WriteOfService.saveWriteOfDoc(this.writeOfForm).then(res => {
            this.getRemovedList()
            this.createEditModal = false
            this.$vs.notification({
              title: this.$t('success_updated'),
              progress: 'auto',
              duration: 2000,
              color: 'success',
              position: 'top-right'
            })
          }).catch(e => {
            this.$vs.notification({
              title: e.message,
              progress: 'auto',
              duration: 2000,
              color: 'danger',
              position: 'top-right'
            })
          })
        }
      }else {
        this.$vs.notification({
          title: this.$t('required_error'),
          progress: 'auto',
          duration: 2000,
          color: 'danger',
          position: 'top-right'
        })
      }
    })
  },
  editDynamicItem(index, item) {
    this.writeOfForm.whItems.splice(index, 1)
    let tem = {
      itemId: item.itemId,
      brandName: item.brand ? item.brand : item.brandName,
      itemCku: item.cku ? item.cku : item.itemCku,
      sizeOlcham: item.size ? item.size : item.sizeOlcham
    }
    this.dynamicItem = tem
    this.itemId = this.dynamicItem.itemId
},
  deleteDynamicItem(index) {
    this.writeOfForm.whItems.splice(index, 1)
  },
  viewForm(docId) {
    this.$router.push(`/wms/writeOff/writeOff-view/${docId}`)
  },
  editForm(docId) {
    IncomeService.getIncomeDocById(docId).then(res => {
      this.itemId = ''
      this.dynamicItem = {}
      this.writeOfForm = {
        ...res.data,
        whItems: res.data.whDocItems,
        whDocItems:null,
      }
      this.createEditModal = true
    }).catch(e => {
      this.$vs.notification({
        title: e.message,
        duration: 2000,
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
  deleteWriteOFDoc() {
    WriteOfService.deleteWriteOfDoc(this.docId).then(res => {
      this.$vs.notification({
        title: this.$t('success_deleted'),
        progress: 'auto',
        duration: 2000,
        color: 'success',
        position: 'top-right'
      })
      this.getRemovedList();
      this.deleteModal = false
    })
  }
},
created() {
  this.getRemovedList();
  this.getDepList();
}
}
</script>

<style scoped>
</style>
