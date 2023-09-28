<template>
  <div>
    <div class="q-gutter-y-sm">
      <q-table
          v-if="windowWidth > 600"
          row-key="id"
          row="row"
          :data="transfers"
          class="shadow-10"
          :columns="columns"
          :hide-pagination="true"
          :rows-per-page-options="[0]"
      >
        <template v-slot:top>
          <div v-if="windowWidth > 600" class="q-table__title">
            <span v-if="tab === 'send'">{{ $t('wms.transfer.send') }}</span>
            <span v-if="tab === 'received'">{{ $t('wms.transfer.pending') }}</span>
          </div>
          <q-space v-if="windowWidth > 600"/>
          <div v-if="windowWidth < 600" class="q-gutter-y-md  mb-1" style="max-width: 300px;">
            <q-tabs v-model="tab" inline-label outside-arrows mobile-arrows narrow-indicator active-color="primary" class="text-primary mr-2">
              <q-tab :tab="tab" name="send" :label="$t('wms.transfer.send')"></q-tab>
              <q-tab :tab="tab" name="received" :label="$t('wms.transfer.pending')"></q-tab>
            </q-tabs>
          </div>
          <q-tabs v-else v-model="tab" narrow-indicator active-color="primary" class="text-primary mr-2">
            <q-tab :tab="tab" name="send" :label="$t('wms.transfer.send')"></q-tab>
            <q-tab :tab="tab" name="received" :label="$t('wms.transfer.pending')"></q-tab>
          </q-tabs>
          <q-space v-if="windowWidth > 600"/>

          <q-space v-if="windowWidth < 600"/>
          <vs-button v-if="tab === 'send'" success animation-type="rotate" @click="createForm">
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
        <template v-slot:body-cell-actions="props">
          <q-td class="text-center">
            <vs-button v-if="props.row.status === 'READY'" style="display: inline-block" flat icon dark @click="viewForm(props.row.id)">
              <q-icon name="visibility"/>
            </vs-button>
            <vs-button v-if="props.row.status === 'SUSPENDED'" style="display: inline-block" flat icon primary @click="editForm(props.row.id)">
              <q-icon name="edit"/>
            </vs-button>
            <vs-button v-if="props.row.status === 'PENDING'" style="display: inline-block" flat icon primary @click="viewPendingForm(props.row.id)">
              <q-icon name="edit"/>
            </vs-button>
            <vs-button v-if="props.row.status === 'SUSPENDED'" style="display: inline-block" flat icon danger @click="deleteForm(props.row.id)">
              <q-icon name="delete"/>
            </vs-button>
          </q-td>
        </template>
      </q-table>
      <template v-if="windowWidth < 600">
        <q-toolbar>
          <vs-row>
            <vs-col class="mb-1 ml-1" w="12">
              <q-tabs style="max-width: 300px;" v-model="tab" inline-label outside-arrows mobile-arrows narrow-indicator active-color="primary" class="text-primary mr-2">
                <q-tab :tab="tab" name="send" :label="$t('wms.transfer.send')"></q-tab>
                <q-tab :tab="tab" name="received" :label="$t('wms.transfer.pending')"></q-tab>
              </q-tabs>
            </vs-col>
            <vs-button v-if="tab === 'send'" success animation-type="rotate" @click="createForm">
              <q-icon name="add"/>
              <template #animate>
                <q-icon name="add"/>
              </template>
            </vs-button>
          </vs-row>
        </q-toolbar>
        <div class="ml-2 q-pa-xs col-xs-12 col-sm-6" v-for="transfer in transfers"
             :key="transfer.id">
          <q-expansion-item
              :label="transfer.regNumber"
              style="border-radius: 15px;"
              expand-icon-class="text-white"
              header-class="text-white"
              :header-class="transfer.status === 'READY' ? 'bg-green-13' : 'bg-yellow-5'"
              class="shadow-24 overflow-hidden mr-2"
          >
            <q-card dense>
              <q-card-section>
                <q-list bordered separator dense>
                  <q-item v-ripple>
                    <q-item-section>
                      <q-item-label>{{ $t('doc.regNumber') }}</q-item-label>
                      <q-item-label><b>{{ transfer.regNumber }}</b></q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item v-ripple>
                    <q-item-section>
                      <q-item-label>{{ $t('doc.regDate') }}</q-item-label>
                      <q-item-label><b>{{ transfer.regDate }}</b></q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section>
                      <q-item-label>{{ $t('doc.department') }}</q-item-label>
                      <q-item-label><b>{{ transfer.toDepartmentName }}</b></q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section>
                      <q-item-label>{{ $t('doc.contragent') }}</q-item-label>
                      <q-item-label><b>{{ transfer.contragentName }}</b></q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section>
                      <vs-row>
                        <vs-col justify="center" align="center">
                          <vs-button v-if="transfer.status === 'READY'" style="display: inline-block" flat icon dark @click="viewForm(transfer.id)">
                            <q-icon name="visibility"/>
                          </vs-button>
                          <vs-button v-if="transfer.status === 'PENDING'" style="display: inline-block" flat icon primary @click="viewPendingForm(transfer.id)">
                            <q-icon name="edit"/>
                          </vs-button>
                          <vs-button v-if="transfer.status === 'SUSPENDED'" style="display: inline-block" flat icon primary @click="editForm(transfer.id)">
                            <q-icon name="edit"/>
                          </vs-button>
                          <vs-button v-if="transfer.status === 'SUSPENDED'" style="display: inline-block" flat icon danger @click="deleteForm(transfer.id)">
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
        <q-pagination v-model="payload.page" :max="maxTransfer" :max-pages="4" direction-links boundary-links push/>
      </div>
    </div>
    <!--           Create / Edit           -->
    <vs-dialog v-model="createEditModal" blur prevent-close width="100%">
      <template #header>
        <b v-if="create">{{ $t('wms.new_transfer') }}</b>
        <b v-else>{{ $t('wms.edit_transfer') }}</b>
      </template>
      <q-separator/>
      <validation-observer ref="transferForm" v-slot="{}">
        <vs-row>
          <vs-col :w="windowWidth > 600 ? '6' : '12'">
            <validation-provider v-slot="{valid}" rules="required" name="fromDepartmentId">
              <vs-select
                  block
                  class="mt-3"
                  :danger="!valid"
                  :class="!valid ? 'required' : ''"
                  :label="$t('doc.from_department')"
                  v-model="formTransfer.fromDepartmentId"
                  :key="`departmentList-${departmentList.length}`"
              >
                <vs-option-group>
                  <div>{{ $t('doc.from_department') }}</div>
                  <vs-option
                      v-for="(dep, i) in departmentList"
                      :key="`departmentList-${i}`"
                      :label="dep.name"
                      :value="dep.id">
                    {{ dep.name }}
                  </vs-option>
                </vs-option-group>
              </vs-select>
            </validation-provider>
          </vs-col>
          <vs-col :w="windowWidth > 600 ? '6' : '12'">
            <validation-provider v-slot="{valid}" rules="required" name="toDepartmentId">
              <vs-select
                  block
                  class="mt-3"
                  :danger="!valid"
                  :label="$t('doc.to_department')"
                  :class="!valid ? 'required' : ''"
                  v-model="depId"
                  @change="getItemById($event)"
                  :key="`toDepartmentList-${departmentList.length}`"
              >
                <vs-option-group>
                  <div>{{ $t('doc.to_department') }}</div>
                  <vs-option v-for="(lol, i) in departmentList" :key="`departmentList2-${i}`" :label="lol.name" :value="lol.id"
                             :disabled="formTransfer.fromDepartmentId == lol.id">
                    {{ lol.name }}
                  </vs-option>
                </vs-option-group>
              </vs-select>
            </validation-provider>
          </vs-col>
          <vs-col :w="windowWidth > 600 ? '6' : '12'">
            <validation-provider v-slot="{valid}" rules="required" name="regNumber">
              <vs-input
                  state="primary"
                  block
                  class="mt-3"
                  :danger="!valid"
                  :label="$t('doc.regNumber')"
                  v-model="formTransfer.regNumber"
                  :class="!valid ? 'required' : ''"
              />
            </validation-provider>
          </vs-col>
          <vs-col w="12">
            <validation-provider v-slot="{valid}" name="comment">
              <vs-input
                  state="primary"
                  block
                  primary
                  class="mt-3"
                  :danger="!valid"
                  :label="$t('doc.comment')"
                  v-model="formTransfer.comment"
              />
            </validation-provider>
          </vs-col>
          <vs-col :w="windowWidth > 600 ? '6' : '12'">
            <vs-select
                block
                class="mt-3"
                v-model="itemId"
                @change="itemSet(itemId)"
                :label="$t('references.product')"
                :key="`a-${whItemList.length}`"
            >
              <!--              <vs-option-group>-->
              <vs-option v-for="(it, ind) in whItemList" :key="`items-${ind}`"
                         :label="`${it.itemCku} /  ${it.sizeOlcham} - (${it.remaining})`" :value="it.id"
                         :label-placeholder="`${it.itemCku} /  ${it.sizeOlcham} - (${it.remaining})`" >
                {{ it.itemCku }}  / {{ it.sizeOlcham }} - <b>({{it.remaining}})</b>
              </vs-option>
              <!--              </vs-option-group>-->
            </vs-select>
          </vs-col>
          <vs-col :w="windowWidth > 600 ? '6' : '12'">
            <vs-input state="primary" block primary icon-after class="q-mr-lg mt-3" v-model="search1" :placeholder="$t('actions.search')">
              <template #icon>
                <q-icon name="search"/>
              </template>
            </vs-input>
          </vs-col>
          <vs-col v-if="itemId" :w="windowWidth > 600 ? '6' : '12'">
            <vs-input
                state="primary"
                block
                primary
                class="mt-3"
                type="number"
                :label="$t('items.count')"
                v-model="dynamicItem.count"
            />
          </vs-col>
          <vs-row v-if="itemId">
            <vs-col w="12" align="center" class="mt-1">
              <vs-button flat @click="addToWhList">{{ $t('actions.add') }}</vs-button>
            </vs-col>
          </vs-row>
          <vs-row class="mt-2">
            <vs-col w="12">
              <q-table class="shadow-10" dense row-key="id" row="row" :data="formTransfer.whItems" :columns="dynamicItemCols" :hide-pagination="true" :rows-per-page-options="[0]">
                <template v-slot:body-cell-id="props">
                  <q-td class="text-center">
                    {{ props.rowIndex+1 }}
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
    <!--       Delete       -->
    <confirm-modal :model="deleteModal" @submit="deleteTransferDoc" @close="deleteModal = false" :text="$t('confirm_delete')"/>
  </div>
</template>
<script>
import ConfirmModal from "../../../components/confirmModal.vue"
import DepartmentService from "../../management/department/department.service";
import RequestService from "./request.service";
import WareHaseService from "../warehouse/warehouse.service";

export default {
  name: "index",
  components: {ConfirmModal},
  data() {
    return {
      windowWidth: window.innerWidth,
      transfers: [],
      totalTransfer: 0,
      payload: {
        page: 1,
        limit: 20
      },
      pagination: {
        page: 1,
        limit: 1000000
      },
      totalItem: 0,
      columns: [
        {name: 'id', align: 'center', label: this.$t('doc.index'), field: 'id'},
        {name: 'regNumber', align: 'center', label: this.$t('doc.regNumber'), field: 'regNumber'},
        {name: 'regDate', align: 'center', label: this.$t('doc.regDate'), field: 'regDate'},
        {name: 'fromDepartmentName', align: 'center', label: this.$t('doc.from_department'), field: 'fromDepartmentName'},
        {name: 'toDepartmentName', align: 'center', label: this.$t('doc.to_department'), field: 'toDepartmentName'},
        {name: 'comment', align: 'center',  style: 'width: 30px', label: this.$t('doc.comment'), field: 'comment'},
        {name: 'status', align: 'center', label: this.$t('doc.status'), field: 'status'},
        {name: 'actions', align: 'center', label: this.$t('doc.action'), field: 'actions'}
      ],
      dynamicItemCols: [
        {name: 'id', align: 'center', label: this.$t('items.index'), field: 'id'},
        {name: 'cku', align: 'center', label: this.$t('items.sku'), field: 'itemCku'},
        {name: 'brandName', align: 'center', label: this.$t('items.brand'), field: 'brandName'},
        {name: 'categoryName', align: 'center', label: this.$t('items.category'), field: 'categoryName'},
        {name: 'size', align: 'center', label: this.$t('items.size'), field: 'sizeOlcham'},
        {name: 'count', align: 'center', label: this.$t('items.count'), field: 'count'},
        {name: 'remaining', align: 'center', label: this.$t('items.remaining'), field: 'remaining'},
        // {name: 'incomePrice', align: 'center', label: this.$t('items.income_price'), field: 'incomePrice'},
        {name: 'price', align: 'center', label: this.$t('items.price'), field: 'price'},
        {name: 'actions', align: 'center', label: this.$t('items.action'), field: 'actions'}
      ],
      search: '',
      create: true,
      createEditModal: false,
      deleteModal: false,
      docId: null,
      formTransfer: {
        departmentId: null,
        toDepartmentId: "",
        fromDepartmentId: ""
      },
      departmentList: [],
      whItemList: [],
      itemId: '',
      dynamicItem: {},
      depId: '',
      tab: 'send',
      active: true,
      name: '',
      search1: '',
      brands: [],
      seasons: [],
      categories:[],
      categoryId : '',
      brandId : '',
      seasonsId : '',
      transferBySomeStuffModel: false,
    }
  },
  watch: {
    'search': {
      handler(e) {
        this.getTransferDocs();
      }
    },
    'payload.page': {
      handler(e) {
        this.getTransferDocs();
      }
    },
    'tab': {
      handler(t) {
        this.getTransferDocs(1);
      }
    },
    'search1': {
      handler(f) {
        this.getItems(this.depId, f)
      }
    }
  },
  computed: {
    maxTransfer() {
      let max = this.totalTransfer / this.payload.limit
      return Math.ceil(max)
    }
  },
  methods: {
    paginate(itemsPerPage, currentPage, index) {
      currentPage = currentPage - 1
      return itemsPerPage * currentPage + (index + 1)
    },
    getTransferDocs(n) {
      if (this.tab === 'send') {
        if (n === 1)
          this.payload.page = n
        RequestService.getSendDocs(this.payload).then(res => {
          this.transfers = res.data.list
          this.totalTransfer = res.data.total
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
      } else if (this.tab === 'received') {
        if (n === 1)
          this.payload.page = n
        RequestService.getReceivedDocs(this.payload).then(res => {
          this.transfers = res.data.list
          this.totalTransfer = res.data.total
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
      } else {
        if (n === 1)
          this.payload.page = n
        RequestService.getPendingDocs(this.payload).then(res => {
          this.transfers = res.data.list
          this.totalTransfer = res.data.total
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
    getItems(depId, search1) {
      WareHaseService.getItemByDepIdAndSearch(depId, search1, this.pagination).then(res => {
        this.whItemList = res.data.list
        this.totalItem = res.data.total
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
      this.getDepartments()
      RequestService.createTransferDoc().then(res => {
        this.formTransfer = {}
        this.formTransfer = res.data
        this.formTransfer.fromDepartmentId = ''
        this.formTransfer.toDepartmentId = ''
        this.formTransfer.whDocItems = []
        this.formTransfer.whItems = []
        this.itemId = ''
        this.dynamicItem = {}
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
      console.log('d',docId)
      this.$router.push(`/wms/request/request-view/${docId}`)
    },
    editForm(docId) {
      RequestService.getTransferDocById(docId).then(res => {
        this.itemId = ''
        this.dynamicItem = {}
        this.formTransfer = res.data
        this.formTransfer.whItems = res.data.whDocItems
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
    deleteTransferDoc() {
      RequestService.deleteTransferDoc(this.docId).then(res => {
        this.$vs.notification({
          type:'confirm',
          duration: 1000,
          title: this.$t('success_deleted'),
          progress: 'auto',
          color: 'success',
          position: 'top-right'
        })
        this.getTransferDocs();
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
      this.whItemList.forEach(item => {
        if (item.id === itemId) {
          this.dynamicItem = item
        }
      })
    },
    getItemById(depId){
      this.itemId = '';
      this.getItems(depId, '');
      this.formTransfer.whItems = []
    },
    addToWhList() {
      if (this.dynamicItem.count > 0) {
        if(this.formTransfer.fromDepartmentId !== this.formTransfer.toDepartmentId) {
          let has = false
          let ind = 0
          this.formTransfer.whItems.forEach((whItem, index) => {
            if (whItem.id === this.dynamicItem.id) {
              has = true
              ind = index
              if (has) {
                this.formTransfer.whItems.splice(ind, 1)
              }
            }
          })
          let item = Object.assign({}, this.dynamicItem)
          if(item.remaining >= this.dynamicItem.count) {
            let tmp = Object.assign({}, item)
            if (!tmp.itemId) {
              tmp.itemId = tmp.id
              tmp.id = null
            }
            this.formTransfer.whItems.unshift(tmp)
            this.getItems(this.depId,'');
            this.dynamicItem = {}
            this.itemId = ''
          }
          else {
            this.$vs.notification({
              type:'confirm',
              title: this.$t('big-count'),
              duration: 1000,
              progress: 'auto',
              color: 'danger',
              position: 'top-right'
            })
          }
        } else {
          this.$vs.notification({
            type:'confirm',
            title: this.$t('same_department'),
            progress: 'auto',
            duration: 1000,
            color: 'danger',
            position: 'top-right'
          })
        }
      } else {
        this.$vs.notification({
          type:'confirm',
          title: this.$t('no-count'),
          duration: 1000,
          progress: 'auto',
          color: 'danger',
          position: 'top-right'
        })
      }
    },
    editDynamicItem(index) {
      if(this.formTransfer.whItems.length > 0) {
        this.formTransfer.whItems.forEach(item => {
          this.itemId = item.id
        })
        this.formTransfer.whItems.splice(index, 1)
      }
    },
    deleteDynamicItem(index) {
      this.formTransfer.whItems.splice(index, 1)
    },
    save(status) {
      this.$refs.transferForm.validate().then(valid => {
        if (valid) {
          this.formTransfer.status = status
          this.formTransfer.whDocItems = null
          let tmp = true
          if (status === 'READY') {
            if (this.formTransfer.whItems.length > 0) {
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
            this.formTransfer.toDepartmentId = this.depId
            this.formTransfer.status = "PENDING"
            RequestService.saveTransferDoc(this.formTransfer).then(res => {
              this.createEditModal = false
              this.getTransferDocs();
              this.$vs.notification({
                type:'confirm',
                title: this.$t('success_updated'),
                progress: 'auto',
                duration: 1000,
                color: 'success',
                position: 'top-right'
              })
            }).catch(e => {
              type:'confirm',
                  this.$vs.notification({
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
    },
    viewPendingForm(id) {
      console.log('ddd', id)
      this.$router.push(`/wms/request/request-view/${id}`)
    },

  },
  async created() {
    this.getTransferDocs();

  }
}
</script>
<style scoped>
</style>
