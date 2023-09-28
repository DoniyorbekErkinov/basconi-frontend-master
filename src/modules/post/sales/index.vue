<template>
  <div>
    <div class="q-gutter-y-sm">
      <q-table
        row-key="id+'a'"
        row="row"
        :data="saleList"
        class="shadow-10"
        :columns="getDynamicCol"
        :hide-pagination="true"
        :rows-per-page-options="[0]"
      >
        <template v-slot:top >
          <vs-row class="mt-2">
            <div v-if="windowWidth < 600">
              <p style="font-size: 32px; font-weight: bold; margin-top: -3px; letter-spacing: 4px" v-if="message === 'report'">
                {{$t('post.z-report-title')}}
              </p>
              <p style="font-size: 32px; font-weight: bold; margin-top: -3px; letter-spacing: 4px" v-else-if="message === 'sale'">
                {{$t('post.item')}}
              </p>
              <p style="font-size: 32px; font-weight: bold; margin-top: -3px; letter-spacing: 4px" v-else-if="message === 'saleDoc'">
                {{$t('post.sales')}}
              </p>
            </div>
            <date-picker
              state="primary"
              format="DD-MM-YYYY"
              valuetype="format"
              v-model="start"

            ></date-picker>
            <date-picker
              state="primary"
              format="DD-MM-YYYY"
              valuetype="format"
              :class="windowWidth < 600 ? 'mt-1' : 'ml-1'"
              v-model="end"
            ></date-picker>
            <vs-select
              :class="windowWidth < 600 ? 'mt-2' : 'ml-1'"
              :key="`dep-${depList.length}`"
              @change="getCashBoxById($event)"
              v-model="getZetForm.departmentId"
              :label="$t('doc.department')"
            >
              <vs-option v-for="(dep, i) in depList" :key="`depList-${i}`" :value="dep.id" :label="dep.name">
                {{dep.name}}
              </vs-option>
            </vs-select>
            <vs-select
              :key="`cash-${cashBox.length}`"
              :class="windowWidth < 600 ? 'mt-2' : 'ml-1'"
              v-model="getZetForm.cashboxId"
              :label="$t('management.cash_box')"
            >
              <vs-option v-for="(cash, index) in cashBox" :key="`cashBox-${index}`" :value="cash.id" :label="cash.name">
                {{cash.name}}
              </vs-option>
            </vs-select>
            <vs-button :class="windowWidth < 600 ? 'mt-2' : 'ml-1'" danger icon animation-type="rotate" @click="clear">
              <q-icon name="close"/>
            </vs-button>
            <q-space/>
            <div v-if="windowWidth > 600">
              <p style="font-size: 32px; font-weight: bold; margin-top: -3px; letter-spacing: 4px" v-if="message === 'report'">
                {{$t('post.z-report-title')}}
              </p>
              <p style="font-size: 32px; font-weight: bold; margin-top: -3px; letter-spacing: 4px" v-else-if="message === 'sale'">
                {{$t('post.item')}}
              </p>
              <p style="font-size: 32px; font-weight: bold; margin-top: -3px; letter-spacing: 4px" v-else-if="message === 'saleDoc'">
                {{$t('post.sales')}}
              </p>
            </div>
            <q-space v-if="windowWidth > 600"/>
            <q-btn-group :class="windowWidth < 600 ? 'mt-1  ' : ''" push class="text-white">
              <q-btn style="letter-spacing: 2px;" :size="windowWidth < 600 ? 'xs' : 'md'" push class="bg-primary" @click="getList('report')" :label="$t('post.z-report-title')" />
              <q-btn style="letter-spacing: 2px;" :size="windowWidth < 600 ? 'xs' : 'md'" push class="bg-deep-orange-6" @click="getList('sale')" :label="$t('post.item')" />
              <q-btn style="letter-spacing: 2px;" :size="windowWidth < 600 ? 'xs' : 'md'" push class="bg-positive" @click="getList('saleDoc')" :label="$t('post.sales')" />
            </q-btn-group>
          </vs-row>
        </template>
        <template v-slot:body-cell-id="props">
          <q-td v-if="message === 'report'" class="text-center">{{ paginate(payload1.limit, payload1.page, props.rowIndex) }}</q-td>
          <q-td v-else-if="message === 'sale'" class="text-center">{{ paginate(payload2.limit, payload2.page, props.rowIndex) }}</q-td>
          <q-td v-else-if="message === 'saleDoc'" class="text-center">{{ paginate(payload3.limit, payload3.page, props.rowIndex) }}</q-td>
        </template>
        <template v-slot:body-cell-id="props">
          <q-td class="text-center">{{ props.rowIndex + 1 }}</q-td>
        </template>
        <template v-slot:body-cell-open="props">
          <q-td :props="props">
            <q-badge :class="props.row.open == true ? 'bg-primary' : 'bg-orange' ">
              <div v-if="props.row.open === true">{{$t('post.on_going')}}</div>
              <div v-if="props.row.open === false">{{$t('post.closed')}}</div>
            </q-badge>
          </q-td>
        </template>
        <template v-slot:body-cell-actions="props">
          <q-td class="text-center">
            <vs-button style="display: inline-block" flat icon dark @click="viewForm(props.row.id)">
              <q-icon name="visibility"/>
            </vs-button>
          </q-td>
        </template>
      </q-table>
      <div class="row justify-center q-mt-md">
        <q-pagination v-if="message === 'report'" v-model="payload1.page" :max="maxZetReport1" :max-pages="6" direction-links boundary-links push/>
        <q-pagination v-else-if="message === 'sale'" v-model="payload2.page" :max="maxZetReport2" :max-pages="6" direction-links boundary-links push/>
        <q-pagination v-else-if="message === 'saleDoc'" v-model="payload3.page" :max="maxZetReport3" :max-pages="6" direction-links boundary-links push/>
      </div>
    </div>
    <vs-dialog v-model="zModal"  prevent-close width="100%">
      <q-list v-if="message === 'report'" bordered padding>
        <q-item>
          <q-item-section>
            <q-item-label class="mb-2" style="display: flex; justify-content: space-between; font-size: 20px; letter-spacing: 2px">
              <div style="display: flex; justify-content: space-between">
                <div class="mr-1">{{$t('post.seller')}}:</div> <b>{{ zetInfo.user ? zetInfo.user.name:'' }}</b>
              </div>
              <div style="display: flex; justify-content: space-between">
                <div class="mr-1">{{$t('doc.from_department')}}:</div> <b>{{ zetInfo.user ?zetInfo.user.departmentName:'' }}</b>
              </div>
            </q-item-label>
            <q-item-label class="mt-2 mb-2" style="font-size: 16px; letter-spacing: 2px;">
              <q-separator/>
              <div class="mt-1 mb-1" style="display: flex; text-align: left;">
                <i style="font-size: 26px;" class="mdi mdi-cash mr-1"/>
                <div class="mr-1">{{$t('post.totalCashSum')}}:</div><b>{{ zetInfo.totalCashSum }}</b>
              </div>
              <q-separator/>
              <div class="mt-1 mb-1" style="display: flex; justify-content: flex-start;">
                <i style="font-size: 24px;" class="mdi mdi-credit-card-outline mr-1"/>
                <div class="mr-1">{{$t('post.totalHumo')}}:</div><b>{{ zetInfo.totalHumoSum }}</b>
              </div>
              <q-separator/>
              <div class="mt-1 mb-1" style="display: flex; justify-content: flex-start;">
                <i style="font-size: 24px;" class="mdi mdi-credit-card-outline mr-1"/>
                <div class="mr-1">{{$t('post.totalUzCard')}}:</div><b>{{ zetInfo.totalUzCardSum }}</b>
              </div>
              <q-separator/>
            </q-item-label>
            <q-item-label class="mt-1 mb-2">
              <div style="display: flex; justify-content: flex-start; font-size: 20px">
                <i style="font-size: 24px;" class="mdi mdi-cash-multiple mr-1"/>
                <div class="mr-1">{{$t('post.totalSum')}}:</div><b>{{ zetInfo.totalSum }}</b>
              </div>
            </q-item-label>
            <q-separator/>
            <q-item-label class="mt-2 mb-1">
              <div style="display: flex; justify-content: flex-start; font-size: 20px">
                <i style="font-size: 24px;" class="mdi mdi-database-arrow-right mr-1"/>
                <div class="mr-1">{{$t('post.totalCount')}}:</div><b>{{ zetInfo.documentCount }}</b>
              </div>
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
      <q-list v-else>
        <q-toolbar>
          <q-toolbar-title>
            {{$t('post.sold_items')}}
          </q-toolbar-title>
        </q-toolbar>
        <div class="row mr-1" style="display: flex; justify-content: center">
          <q-card :class="windowWidth > 600 ? 'col-5' : 'col-12' " class="ml-1 mt-1" v-for="(item, i) in docInfo" :key="`item-${i}`">
            <q-card-section class="pl-1">
              <div style="display: flex; justify-content: space-between">
                <div style="text-align: left"><b>{{ $t('post.sold_price') }}:</b> <span
                    class="text-pink-6">{{ item.salePrice }}</span></div>
                <div style="text-align: left"><b>{{ $t('items.sku') }}:</b> <span
                    class="text-pink-6">{{ item.cku }}</span></div>
              </div>
              <q-separator/>
              <div style="display: flex; justify-content: space-between">
                <div style="text-align: left"><b>{{ $t('items.count') }}:</b> <span
                    class="text-pink-6">{{ item.count }}</span></div>
                <div style="text-align: left"><b>{{ $t('items.size') }}:</b> <span
                    class="text-pink-6">{{ item.sizeOlcham }}</span></div>
              </div>
              <q-separator/>
              <div style="display: flex; justify-content: space-between">
                <div style="display: flex; justify-content: space-between">
                  <div style="text-align: left"><b>{{ $t('items.brand') }}:</b> <span
                      class="text-pink-6">{{ item.brandName }}</span></div>
                </div>
                <div style="text-align: left"><b>{{ $t('items.colors') }}:</b> <span
                    class="text-pink-6">{{ item.colorName }}</span></div>
              </div>
            </q-card-section>
          </q-card>
        </div>

      </q-list>
    </vs-dialog>
  </div>
</template>
<script>
import ZReportService from "../post/z-report.service";
import SaleService from "@/modules/post/post/sale.service";
import DepartmentService from "../../management/department/department.service";
import CashBoxService from "../../references/cashbox/cashbox.service";
import moment from "moment";
import DatePicker from 'vue2-datepicker';
import 'vue2-datepicker/index.css';
export default {
  components: { DatePicker },
  name: "index",
  data() {
    return {
      windowWidth: window.innerWidth,
      saleList: [],
      search: '',
      payload1: {
        limit: 20,
        page: 1
      },
      payload2: {
        limit: 20,
        page: 1
      },
      payload3: {
        limit: 20,
        page: 1
      },
      itemsTotal: 0,
      totalTransfer: 0,
      columnsZetReport: [
        {name: 'id', align: 'center', label: this.$t('doc.index'), field: 'id'},
        {name: 'departmentName', align: 'center', label: this.$t('doc.department'), field: 'departmentName'},
        {name: 'cashboxName', align: 'center', label: this.$t('management.cash_box'), field: 'cashboxName'},
        {name: 'open', align: 'center', label: this.$t('doc.status'), field: 'open'},
        {name: 'start', align: 'center', label: this.$t('post.start_time'), field: 'start'},
        {name: 'end', align: 'center', label: this.$t('post.end_time'), field: 'end'},
        {name: 'actions', align: 'center', label: this.$t('doc.action'), field: 'actions'}
      ],
      saleColumns:[
        {name: 'id', align: 'center', label: this.$t('doc.index'), field: 'id'},
        {name: 'brandName', align: 'center', label: this.$t('items.brand'), field: 'brandName'},
        {name: 'categoryName', align: 'center', label: this.$t('items.category'), field: 'categoryName'},
        {name: 'color', align: 'center', label: this.$t('items.colors'), field: 'colorName'},
        {name: 'departmentName', align: 'center', label: this.$t('items.departmentName'), field: 'departmentName'},
        {name: 'cku', align: 'center', label: this.$t('items.sku'), field: 'cku'},
        {name: 'sizeId', align: 'center', label: this.$t('items.size'), field: 'sizeOlcham'},
        {name: 'count', align: 'center', label: this.$t('items.count'), field: 'count'},
        {name: 'salePrice', align: 'center', label: this.$t('post.sold_price'), field: 'salePrice'},
        {name: 'seasonsName', align: 'center', label: this.$t('items.seasons'), field: 'seasonsName'},
        // {name: 'name', align: 'center', label: this.$t('items.name'), field: 'itemName'},
      ],
      columnsDoc: [
        {name: 'id', align: 'center', label: this.$t('doc.index'), field: 'id'},
        {name: 'departmentName', align: 'center', label: this.$t('doc.department'), field: 'fromDepartmentName'},
        {name: 'cashboxName', align: 'center', label: this.$t('management.cash_box'), field: 'cashboxName'},
        {name: 'cashierName', align: 'center', label: this.$t('post.seller'), field: 'cashierName'},
        {name: 'regDate', align: 'center', label: this.$t('post.regDate'), field: 'regDate'},
        {name: 'regNumber', align: 'center', label: this.$t('post.regNumber'), field: 'regNumber'},
        {name: 'saleСount', align: 'center', label: this.$t('post.totalSum'), field: 'saleСount'},
        {name: 'totalCount', align: 'center', label: this.$t('post.totalCount'), field: 'totalCount'},
        {name: 'actions', align: 'center', label: this.$t('doc.action'), field: 'actions'}
      ],
      deleteModal: false,
      docId: null,
      endDate: null,
      startDate: null,
      message: 'report',
      getZetForm: {
        cashboxId: '',
        departmentId: '',
        end: null,
        open: true,
        start: null,
        limit: 20,
        page: 1
      },
      zetReportByDate: [],
      start: '',
      end: '',
      depList: [],
      cashBox: [],
      depId: '',
      zetInfo: {},
      zModal: false,
      docInfo: {},
    }
  },
  watch: {
    'payload1.page': {
      handler(e) {
        this.getList(this.message, e);
      }
    },
    'payload2.page': {
      handler(e) {
        this.getList(this.message, e);
      }
    },
    'payload3.page': {
      handler(e) {
        this.getList(this.message, e);
      }
    }
  },
  computed: {
    maxZetReport1() {
      let max = this.itemsTotal / this.payload1.limit
      return Math.ceil(max)
    },
    maxZetReport2() {
      let max = this.itemsTotal / this.payload2.limit
      return Math.ceil(max)
    },
    maxZetReport3() {
      let max = this.itemsTotal / this.payload3.limit
      return Math.ceil(max)
    },
    getDynamicCol() {
      if (this.message === 'report') {
        return this.columnsZetReport
      } else if (this.message === 'sale') {
        return this.saleColumns
      } else if (this.message === 'saleDoc') {
        return this.columnsDoc
      } else {
        return this.columnsZetReport
      }
    }
  },
  methods: {
    getList(message) {
      let start = this.start
      let end = this.end
      this.getZetForm.start = start ? moment(start).format("DD-MM-YYYY 00:01") : null;
      this.getZetForm.end  = end ? moment(end).format("DD-MM-YYYY 23:59") : null;
      this.getZetForm.departmentId = this.getZetForm.departmentId === '' ? null : this.getZetForm.departmentId
      this.getZetForm.cashboxId = this.getZetForm.cashboxId === '' ? null : this.getZetForm.cashboxId
      this.message = message
      if(this.message === 'report') {
        this.getZetForm.page = this.payload1.page
        this.getZetForm.limit = this.payload1.limit
        ZReportService.getDateWithDate(this.getZetForm).then(res => {
          this.saleList = []
          this.saleList = res.data.list
          this.itemsTotal = res.data.total
          this.getZetForm.departmentId = this.getZetForm.departmentId ? `${this.getZetForm.departmentId}` : ''
          this.getZetForm.cashboxId = this.getZetForm.cashboxId ? `${this.getZetForm.cashboxId}` : ''
          this.getZetForm.start = this.getZetForm.start ? moment(this.getZetForm.start).format("DD-MM-YYYY")  : this.getZetForm.start;
          this.getZetForm.end  = this.getZetForm.end ? moment(this.getZetForm.end).format("DD-MM-YYYY") : this.getZetForm.end;
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
      else if (this.message === 'sale') {
        this.getZetForm.page = this.payload2.page
        this.getZetForm.limit = this.payload2.limit
        SaleService.getSaleList(this.getZetForm).then(res => {
          this.saleList = []
          this.saleList = res.data.list
          this.itemsTotal = res.data.total
          this.getZetForm.departmentId = this.getZetForm.departmentId ? `${this.getZetForm.departmentId}` : ''
          this.getZetForm.cashboxId = this.getZetForm.cashboxId ? `${this.getZetForm.cashboxId}` : ''
          this.getZetForm.start = this.getZetForm.start ? moment(this.getZetForm.start).format("DD-MM-YYYY")  : this.getZetForm.start;
          this.getZetForm.end  = this.getZetForm.end ? moment(this.getZetForm.end).format("DD-MM-YYYY") : this.getZetForm.end;
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
      else if (this.message === 'saleDoc') {
        this.getZetForm.page = this.payload3.page
        this.getZetForm.limit = this.payload3.limit
        SaleService.getSaleDoc(this.getZetForm).then(res => {
          this.saleList = []
          this.saleList = res.data.list
          this.itemsTotal = res.data.total
          this.getZetForm.departmentId = this.getZetForm.departmentId ? `${this.getZetForm.departmentId}` : ''
          this.getZetForm.cashboxId = this.getZetForm.cashboxId ? `${this.getZetForm.cashboxId}` : ''
          this.getZetForm.start = this.getZetForm.start ? moment(this.getZetForm.start).format("DD-MM-YYYY")  : this.getZetForm.start;
          this.getZetForm.end  = this.getZetForm.end ? moment(this.getZetForm.end).format("DD-MM-YYYY") : this.getZetForm.end;
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
    getCashBoxById(depId){
      CashBoxService.getByDebId(depId).then(res => {
        this.cashBox = res.data
      })
    },
    GetDepartmentList() {
      DepartmentService.getDepByAccess().then(res => {
        this.depList = res.data
      })
    },
    paginate(itemsPerPage, currentPage, index) {
      currentPage = currentPage - 1
      return itemsPerPage * currentPage + (index + 1)
    },
    viewForm(id) {
      if(this.message === 'report') {
        ZReportService.getInfo(id).then(res => {
          this.zetInfo = res.data
          this.zModal = true
        })
      } else {
        SaleService.getDocById(id).then(res => {
          this.docInfo = res.data
          this.zModal = true
        })
      }

    },
    clear() {
      this.getZetForm.departmentId = ''
      this.getZetForm.cashboxId = ''
      this.start = ''
      this.end = ''
      this.saleList = []
    }
  },
  created() {
    this.GetDepartmentList()
  }
}
</script>

<style scoped>

</style>