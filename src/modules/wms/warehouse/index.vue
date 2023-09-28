<template>
  <div>
    <q-table
        :data="items"
        row-key="id"
        row="row"
        class="shadow-10"
        :columns="columns"
        :visible-columns="visible ? visibleColumns : visibleColumns1"
        :hide-pagination="true"
        :rows-per-page-options="[0]"
    >
      <template v-slot:top>
        <div v-if="windowWidth > 600" class="q-table__title">{{ $t('wms.warehouse.title') }}</div>
        <q-space v-if="windowWidth > 600"/>
        <vs-select :key="`departmentList-${departmentList.length}`" v-model="depIds" :placeholder="$t('doc.department')" multiple class="mr-1 mb-1">
            <vs-option v-for="(dep, i) in departmentList" :key="`departments-${i}`" :label="dep.name" :value="dep.id" >
               {{ dep.name }}
            </vs-option>
        </vs-select>
        <vs-input state="primary" v-model="search" primary icon-after class="mr-1" :placeholder="$t('actions.search')">
          <template #icon>
            <q-icon name="search"/>
          </template>
        </vs-input>
        <q-space v-if="windowWidth < 600"/>
        <vs-button dark icon animation-type="rotate" @click="filter">
          <q-icon name="search"/>
        </vs-button>
        <q-separator/>
      </template>
      <template v-if="windowWidth < 600" v-slot:item="props" class="row items-center">
        <div class="row items-center ml-4">
          <q-expansion-item
            v-for="item in items"
            :key="item.id"
            :label="`${item.brandName} / ${item.itemCku} / ${item.sizeOlcham}`"
            style="border-radius: 10px;"
            expand-icon-class="text-white"
            header-class="bg-primary text-white"
            class="shadow-24 overflow-hidden mt-1 mr-2"
          >
            <q-card dense>
              <q-card-section class="col">
                <div class="text-left ml-1"><b>{{ $t('items.brand') }}:</b> <span class="text-subtitle-2">{{ item.brandName}}</span></div>
                <hr/>
                <div class="text-left ml-1"><b>{{ $t('items.sku') }}:</b> <span class="text-subtitle-2">{{ item.itemCku}}</span></div>
              </q-card-section>
            </q-card>
          </q-expansion-item>
        </div>
      </template>
      <template v-slot:body-cell-id="props">
        <q-td class="text-center">{{ paginate(payload.limit, payload.page, props.rowIndex) }}</q-td>
      </template>
    </q-table>
    <div class="row justify-center q-mt-md">
      <q-pagination v-model="payload.page" :max="maxItem" :max-pages="4" direction-links boundary-links push/>
    </div>
  </div>
</template>

<script>
import DepartmentService from "../../management/department/department.service";
import WareHaseService from "./warehouse.service";
import UsersService from "../../management/users/users.service";
import {TokenService} from "../../../services/storage.service";

export default {
  name: "index",
  data() {
    return {
      items: [],
      sync: true,
      totalItems: 0,
      columns: [
        {name: 'id', align: 'center', label: this.$t('items.index'), field: 'index'},
        {name: 'brandName', align: 'center', label: this.$t('items.brand'), field: 'brandName'},
        {name: 'categoryName', align: 'center', label: this.$t('items.category'), field: 'categoryName'},
        {name: 'color', align: 'center', label: this.$t('items.colors'), field: 'colorName'},
        {name: 'cku', align: 'center', label: this.$t('items.sku'), field: 'itemCku'},
        {name: 'sizeId', align: 'center', label: this.$t('items.size'), field: 'sizeOlcham'},
        {name: 'departmentName', align: 'center', label: this.$t('items.departmentName'), field: 'departmentName'},
        {name: 'remaining', align: 'center', label: this.$t('items.remaining'), field: 'remaining'},
        {name: 'price', align: 'center', label: this.$t('items.price'), field: 'price'},
        {name: 'incomePrice', align: 'center', label: this.$t('items.income_price'), field: 'incomePrice'},
        // {name: 'name', align: 'center', label: this.$t('items.name'), field: 'itemName'},
      ],
      visibleColumns: ['id', 'brandName', 'categoryName', 'color', 'cku', 'sizeId', 'departmentName', 'remaining', 'price', 'incomePrice'],
      visibleColumns1: ['id', 'brandName', 'categoryName', 'color', 'cku', 'sizeId', 'departmentName', 'remaining', 'price'],
      search: '',
      windowWidth: window.innerWidth,
      payload: {
        page: 1,
        limit: 20
      },
      depIds: [],
      departmentList: [],
      userInfo: {},
      visible: false
    }
  },
  computed: {
    maxItem() {
      let max = this.totalItems / this.payload.limit
      return Math.ceil(max)
    }
  },
  watch: {
    'search': {
      handler(e) {
        this.filter();
      }
    },
    'payload.page': {
      handler(e) {
        this.filter();
      }
    }
  },
  methods: {
    getUserRole() {
      let user = TokenService.getUserInfo()
      UsersService.getUsersById(user.id).then(res => {
        this.userInfo = res.data
      })
    },
    paginate(itemsPerPage, currentPage, index) {
      currentPage = currentPage - 1
      return itemsPerPage * currentPage + (index + 1)
    },
    filter() {
      this.payload.depIds = this.depIds
      if(this.$can('View', 'IncomePrice')) {
        this.visible = true
        WareHaseService.getItemsDocs(this.search, this.payload).then(res => {
          this.items = res.data.list
          this.totalItems =res.data.total
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
      } else {
        this.visible = false
        WareHaseService.getItemsDocsForSaler(this.search, this.payload).then(res => {
          this.items = res.data.list
          this.totalItems =res.data.total
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
    },
  },
  async created() {
    await  DepartmentService.getDepartmentsList().then(res => {
      this.departmentList = []
      this.departmentList = res.data
      this.depIds = []
      this.departmentList.forEach(dep => {
        this.depIds.push(dep.id)
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
    this.getUserRole()
  }
}
</script>

<style scoped>
</style>
