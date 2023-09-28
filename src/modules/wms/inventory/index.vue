<template>
  <div>
    <q-table
      class="shadow-10"
      row-key="id"
      row="row"
      :data="inventoryDocs"
      :columns="columns"
      :hide-pagination="true"
      :rows-per-page-options="[0]"
    >
      <template v-slot:top>
          <div v-if="windowWidth > 600" class="q-table__title">{{ $t('wms.inventory.title') }}</div>
          <q-space v-if="windowWidth > 600"/>
          <vs-input state="primary" icon-after class="q-mr-lg" v-model="search"    :placeholder="$t('actions.search')">
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
          <vs-button style="display: inline-block" flat icon dark @click="viewForm(props.row)">
            <q-icon name="eye"/>
          </vs-button>
          <vs-button style="display: inline-block" flat icon primary @click="editForm(props.row.id)">
            <q-icon name="edit"/>
          </vs-button>
          <vs-button style="display: inline-block" flat icon danger @click="deleteForm(props.row.id)">
            <q-icon name="delete"/>
          </vs-button>
        </q-td>
      </template>
    </q-table>
    <!--         Create / Edit  For Manager       -->
    <vs-dialog v-model="createEditModal" blur prevent-close width="100%">
      <template #header>
        <b v-if="create">{{ $t('wms.inventory.new_inventory') }}</b>
        <b v-else>{{ $t('wms.inventory.edit_inventory') }}</b>
      </template>
      <q-separator/>
      <validation-observer ref="inventoryFormForManager" v-slot="{}">
        <vs-row>
          <vs-col :w="windowWidth > 600 ? '6' : '12'">
            <validation-provider v-slot="{valid}" rules="required" name="departmentId">
              <vs-select
                block
                class="mt-3"
                :danger="!valid"
                :label="$t('doc.department')"
                :class="!valid ? 'required' : ''"
                v-model="depId"
                :key="`departmentList-${departmentList.length}`"
              >
                <vs-option-group>
                  <div>{{ $t('doc.department') }}</div>
                  <vs-option  v-for="(dep, i) in departmentList" :key="i" :label="dep.name" :value="dep.id">
                    {{ dep.name }}
                  </vs-option>
                </vs-option-group>
              </vs-select>
            </validation-provider>
          </vs-col>
          <vs-col :w="windowWidth > 600 ? '6' : '12'">
              <validation-provider v-slot="{valid}" rules="required" name="userId">
                <vs-select
                  block
                  class="mt-3"
                  :danger="!valid"
                  :label="$t('wms.inventory.responsible')"
                  :class="!valid ? 'required' : ''"
                  v-model="inventoryFormForManager.userId"
                  :key="`userList-${userList.length}`"
                >
                  <vs-option-group>
                    <div>{{ $t('wms.inventory.responsible') }}</div>
                    <vs-option v-for="(user, i) in userList" :key="i" :label="user.name" :value="user.id">
                      {{ user.name }}
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
                  :danger="!valid"
                  class="mt-3 ml-1"
                  :label="$t('doc.regNumber')"
                  v-model="inventoryFormForManager.regNumber"
                  :class="!valid ? 'required' : ''"
              />
            </validation-provider>
          </vs-col>
          <vs-col :w="windowWidth > 600 ? '6' : '12'">
            <validation-provider v-slot="{valid}" rules="required" name="regDate">
              <vs-inputstate="primary"
                  block
                  type="date"
                  :danger="!valid"
                  class="mt-3 ml-1"
                  :label="$t('doc.regDate')"
                  v-model="inventoryFormForManager.regDate"
                  :class="!valid ? 'required' : ''"
              />
            </validation-provider>
          </vs-col>
        </vs-row>
      </validation-observer>
       <template #footer>
        <vs-button class="mt-2" block primary gradient @click="saveDraft">{{ $t('actions.save') }}</vs-button>
      </template>
    </vs-dialog>
    <!--         Create / Edit  For Emplayee         -->
    <vs-dialog v-model="inventoryModal" blur prevent-close width="100%">
      <template #header>
        <b v-if="create">{{ $t('wms.inventory.new_inventory') }}</b>
        <b v-else>{{ $t('wms.inventory.edit_inventory') }}</b>
      </template>
      <q-separator/>
      <validation-observer ref="inventoryFormForUser" v-slot="{}">
        <vs-row>
          <vs-col>
            <validation-provider name="itemId">
              <vs-select
                  block
                  class="mt-3"
                  v-model="itemId"
                  @change="itemSet($event)"
                  :label="$t('references.product')"
                  :key="`productList-${productList.length}`"
              >
                <vs-option-group>
                  <div>{{ $t('references.product') }}</div>
                  <vs-option v-for="(pro, ind) in productList" :label="`${pro.cku} / ${pro.name}`" :value="pro.id">
                    {{ pro.cku }} / {{ pro.name }}
                  </vs-option>
                </vs-option-group>
              </vs-select>
            </validation-provider>
            <vs-row class="mt-1" v-if="itemId">
              <vs-col w="6" v-for="sizeCount in dynamicProduct.sizes">
               <validation-provider v-slot="{valid}">
                  <vs-input state="primary" :class="!valid ? 'required' : ''" type="number" block class="mt-3" :label="`${$t('items.count')} - ${sizeCount.olcham}`" v-model="sizeCount.count"/>
               </validation-provider>
              </vs-col>
              <vs-col :w="windowWidth > 600 ? '6' : '12'" align="center" class="mt-1">
                <vs-button flat @click="addToInvList">{{ $t('actions.add') }}</vs-button>
              </vs-col>
            </vs-row>
            <vs-row v-if="inventoryFormForUser.invItems.length > 0" class="mt-1">
              <vs-col>
                <q-table row-key="id" row="row" class="shadow-10" dense :data="inventoryFormForUser.invItems" :columns="dynamicProductCols" :hide-pagination="true" :rows-per-page-options="[0]">
                  <template v-slot:body-cell-id="props">
                    <q-td class="text-center">
                      {{ props.rowIndex+1 }}
                    </q-td>
                  </template>
                  <template v-slot:body-cell-actions="props">
                    <q-td class="text-center">
                      <vs-button style="display: inline-block" @click="viewForm(props.rowIndex)" flat icon primary>
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
          <vs-col w="6">
            <vs-button @click="saveInventory('SUSPENDED')" class="mt-2 mr-1" block warn gradient>{{ $t('actions.save') }}</vs-button>
          </vs-col>
          <vs-col w="6">
            <vs-button @click="saveInventory('READY')" class="mt-2 ml-1" block success gradient>{{ $t('actions.save_end_finish') }}</vs-button>
          </vs-col>
        </vs-row>
      </template>
    </vs-dialog>
    <!--       Delete       -->
    <confirm-modal :model="deleteModal" @submit="deleteIncomeDoc" @close="deleteModal = false" :text="$t('confirm_delete')"/>
  </div>
</template>

<script>
import confirmModal from '../../../components/confirmModal.vue'
import ProductService from "../../references/product/product.service"
import InventoryService from "./inventory.service"
export default {
  name: "index",
  components: {confirmModal},
  data() {
    return {
      windowWidth: window.innerWidth,
      payload: {
        page: 0,
        limit: 50
      },
      inventoryDocs: [],
      departmentList: [],
      userList: [],
      productList: [],
      itemId: '',
      depId: '',
      selected: '',
      selectedDep: {},
      dynamicProduct: {},
      columns: [
        {name: 'id', align: 'center', label: this.$t('doc.index'), field: 'id'},
        {name: 'regNumber', align: 'left', label: this.$t('doc.regNumber'), field: 'regNumber'},
        {name: 'regDate', align: 'center', label: this.$t('doc.regDate'), field: 'regDate'},
        {name: 'departmentName', align: 'center', label: this.$t('doc.department'), field: 'departmentName'},
        {name: 'userName', align: 'center', label: this.$t('wms.inventory.responsible'), field: 'userName'},
        {name: 'status', align: 'center', label: this.$t('doc.status'), field: 'status'},
        {name: 'actions', align: 'center', label: this.$t('doc.action'), field: 'actions'}
      ],
      dynamicProductCols: [
        {name: 'id', align: 'center', label: this.$t('items.index'), field: 'id'},
        {name: 'cku', align: 'center', label: this.$t('items.sku'), field: 'cku'},
        // {name: 'name', align: 'center', label: this.$t('items.name'), field: 'name'},
        {name: 'size', align: 'center', label: this.$t('items.size'), field: 'size'},
        {name: 'count', align: 'center', label: this.$t('items.count'), field: 'count'},
        {name: 'actions', align: 'center', label: this.$t('items.action'), field: 'actions'}
      ],
      inventoryFormForManager: {},
      inventoryFormForUser: {},
      search: '',
      createEditModal: false,
      inventoryModal: false,
      create: true,
      deleteModal: false,
    }
  },
  methods: {
    getInventoryDocs() {

    },
    getDepartments() {
      InventoryService.getDepartments().then(res => {
        this.depId= `${res.data[0].id}`
        this.departmentList = []
        this.departmentList = res.data
        this.selected = res.data[0].name
      }).catch(e => {
        this.$vs.notification({
          type:'confirm',
          title: e.message,
          progress: 'auto',
          color: 'danger',
          position: 'top-right'
        })
      })
    },
    getUsersList() {
      InventoryService.getUsersByDepId(this.depId).then(res => {
        this.depId = `${res.data[0].departmentId}`
        this.userList = []
        this.userList = res.data
      }).catch(e => {
        this.$vs.notification({
          type:'confirm',
          title: e.message,
          progress: 'auto',
          color: 'danger',
          position: 'top-right'
        })
      })
    },
    getProducts() {
      let payload = {
        page: 0,
        limit: 100
      }
      ProductService.getItemsList(payload, '').then(res => {
        this.productList = res.data.list
      }).catch(e => {
        this.$vs.notification({
          type:'confirm',
          title: e.message,
          progress: 'auto',
          color: 'danger',
          position: 'top-right'
        })
      })
    },
    createForm() {
      // InventoryService.createInventorDoc().then(res => {
        this.inventoryFormForManager = []
        // this.inventoryFormForManager = res.data
        this.inventoryFormForManager.departmentId = this.depId
        this.inventoryFormForManager.userId = ''
        this.inventoryFormForManager.regNumber = ''
        this.inventoryFormForManager.regDate = ''
        this.createEditModal = true
      // }).catch(e => {
      //   this.$vs.notification({
      // type:'confirm',
      //     title: e.message,
      //     progress: 'auto',
      //     color: 'danger',
      //     position: 'top-right'
      //   })
      // })
    },
    saveDraft() {
      this.$refs.inventoryFormForManager.validate().then(valid => {
        if(valid) {
          this.inventoryDocs.unshift(this.inventoryFormForManager)
          this.createEditModal = false
        } else {
          this.$vs.notification({
            type:'confirm',
            title: this.$t('required_error'),
            progress: 'auto',
            color: 'danger',
            position: 'top-right'
          })
        }
      })
    },
    viewForm(){
      this.inventoryFormForUser = {}
      this.inventoryFormForUser.invItems = []
      this.dynamicProduct = {}
      this.inventoryModal = true
    },
    saveInventory(status) {
      if(!this.itemId && this.inventoryFormForUser.invItems.length > 0) {
        this.inventoryFormForUser.status = status
        let tmp = true
        if(status === 'READY') {
          if (this.inventoryFormForUser.invItems.length > 0) {
            tmp = true
          } else {
            tmp = false
            this.$vs.notification({
              type:'confirm',
              title: this.$t('item_required_error'),
              progress: 'auto',
              color: 'danger',
              position: 'top-right'
            })
          }
        }
        if (tmp) {
          // InventoryService.createInventorDoc(this.inventoryFormForUser).then(res => {
            this.inventoryModal = false
            this.$vs.notification({
              type:'confirm',
              title: this.$t('success_updated'),
              progress: 'auto',
              color: 'success',
              position: 'top-right'
            })
          // }).catch(e => {
          //   this.$vs.notification({
          //     title: e.message,
          //     progress: 'auto',
          //     color: 'danger',
          //     position: 'top-right'
          //   })
          // })
        }
      } else {
        this.$vs.notification({
          title: 'Mahsulotlar Qo`shilmagan',
          progress: 'auto',
          color: 'danger',
          position: 'top-right'
        })
      }
    },
    editForm(){

    },
    deleteForm() {
      this.deleteModal = false
    },
    deleteDynamicItem() {

    },
    deleteIncomeDoc() {

    },
    itemSet(itemId) {
      this.productList.forEach(product => {
        if (product.id === itemId) {
          this.dynamicProduct = product
        }
      })
    },
    addToInvList() {
      if(this.itemId) {
        let has = false
        let ind = 0
        this.inventoryFormForUser.invItems.forEach((invProduct, index) => {
          if(invProduct.id === this.dynamicProduct.id) {
            has = true
            ind = index
          }
        })
        if(has) {
          this.inventoryFormForUser.invItems.splice(ind, 1)
        }
        let product = Object.assign({}, this.dynamicProduct)
        this.dynamicProduct.sizes.forEach((s, i) => {
          let tmp = Object.assign({}, product)
          if(s.count) {
            tmp.sizeId = s.id
            tmp.size = s.olcham
            tmp.count = s.count
            this.inventoryFormForUser.invItems.unshift(tmp)
          }
        })
        this.dynamicProduct = {}
        this.itemId = ''
      } else {
        this.$vs.notification({
          title: this.$t('required_error'),
          progress: 'auto',
          color: 'danger',
          position: 'top-right'
        })
      }
    },
  },
  created() {
    this.getDepartments();
    this.getProducts();
  },
  watch: {
    'selected': {
      handler(e) {
        this.departmentList.forEach(t => {
          if(t.name == e) {
            this.depId = `${t.id}`
            this.selectedDep = t
            this.userList.forEach(u => {
              u.departmentId = t.id
            })
          }
        })
        this.getUsersList()
      }
    },
    'depId': {
      handler(e) {
        this.getUsersList()
      }
    }
  }
}
</script>

<style scoped>

</style>
