<template>
  <div>
    <q-table
        v-if="windowWidth > 600"
        class="shadow-10"
        bordered
        row="row"
        :data="items"
        :columns="columns"
        :hide-pagination="true"
        :rows-per-page-options="[0]"
    >
      <template v-slot:top>
        <div v-if="windowWidth > 600" class="q-table__title">{{ $t('post.return') }}</div>
        <q-space/>
        <vs-input  icon-after class="q-mr-lg" state="primary" v-model="search" :placeholder="$t('actions.search')">
          <template #icon>
            <q-icon name="search"/>
          </template>
        </vs-input>
        <vs-button dark icon animation-type="rotate" @click="getItemByRegNumber">
        <q-icon name="search"/>
      </vs-button>
      </template>
      <template v-slot:body-cell-id="props">
        <q-td class="text-center">{{ props.rowIndex + 1 }}</q-td>
      </template>
      <template v-slot:body-cell-actions="props">
        <q-td class="text-center">
          <vs-button style="display: inline-block" flat icon dark @click="getDescription(props.row.id)">
            <q-icon name="visibility"/>
          </vs-button>
        </q-td>
      </template>
    </q-table>
    <div v-if="windowWidth < 600">
      <q-toolbar>
        <vs-input block state="primary" v-model="search"  icon-after class="mb-1" :placeholder="$t('actions.search')">
          <template #icon>
            <q-icon name="search"/>
          </template>
        </vs-input>
      </q-toolbar>
      <q-card dense v-if="found" v-for="(item, i) in items" :key="i" class="mb-1">
        <q-card-section dense class="bg-cyan-3 text-blue-grey-10" @click="getDescription(item.id)">
          <div style="display: flex; justify-content: space-between; text-align: left">
            <b style="letter-spacing: 2px">{{ $t('post.seller') }}:</b><p>{{item.cashierName}}</p>
          </div>
          <div style="display: flex; justify-content: space-between">
            <b style="letter-spacing: 2px">{{ $t('post.regNumber') }}:</b><p>{{item.regNumber}}</p>
          </div>
          <div style="display: flex; justify-content: space-between">
            <b style="letter-spacing: 2px">{{ $t('post.regDate') }}:</b><p>{{item.regDate}}</p>
          </div>
          <div style="display: flex; justify-content: space-between">
            <b style="letter-spacing: 2px">{{ $t('post.sold_price') }}:</b><p>{{item.saleСount}}: {{$t('uzb_currency')}}</p>
          </div>
        </q-card-section>
      </q-card>
      <q-card v-else>
        <q-card-section>
          <b>Hech Narsa topilmadi</b>
        </q-card-section>
      </q-card>
    </div>
    <vs-dialog v-model="fun" blur prevent-close>
      <q-toolbar style="display: flex; flex-direction: column">
        <q-toolbar-title>
          {{ $t('post.sold_items') }}
        </q-toolbar-title>
      </q-toolbar>
      <q-card class="no-padding ml-2 mr-2 mb-2" v-for="(item, i) in whItems" :key="`item-${i}`">
        <q-card-section dense class="bg-cyan-3 text-blue-grey-10">
          <div class="q-pa-none q-ma-none" style="display: flex; justify-content: space-between; text-align: left">
            <b style="letter-spacing: 2px">{{ $t('items.sku') }}:</b><p>{{item.cku}}</p>
          </div>
          <div class="q-pa-none q-ma-none" style="display: flex; justify-content: space-between">
            <b style="letter-spacing: 2px">{{ $t('items.size') }}:</b><p>{{item.sizeOlcham}}</p>
          </div>
          <div class="q-pa-none q-ma-none" style="display: flex; justify-content: space-between">
            <b style="letter-spacing: 2px">{{ $t('items.price') }}:</b><p>{{item.salePrice}}</p>
          </div>
        </q-card-section>
      </q-card>
      <vs-input
          state="primary"
          block
          class="mt-3"
          :label="$t('doc.comment')"
          v-model="comment"
      />
      <vs-button @click="returnGoods" class="mt-2" block success gradient>{{ $t('post.return') }}</vs-button>
    </vs-dialog>
    <vs-dialog v-model="resale"  blur prevent-close width="100%">
      <q-toolbar>
        <vs-row>
          <vs-col w="1">
            <vs-button style="top: -8px" flat icon danger @click="clear">
              <q-icon name="delete"/>
            </vs-button>
          </vs-col>
          <vs-col w="11">
            <q-toolbar-title>{{ $t('post.payment') }}</q-toolbar-title>
          </vs-col>
        </vs-row>
      </q-toolbar>
      <vs-row>
        <vs-col class="mb-1">
          <q-toolbar-title>
            {{ calculateTotal }}: {{ calculate }} So'm
          </q-toolbar-title>
        </vs-col>
      </vs-row>
      <div>
        <q-card  class="no-padding mb-1" v-for="(item, i) in saleform.whItems" :key="item.id">
          <q-btn
              :class="windowWidth < 600 ? 'small' : 'desktop'"
              round
              color="negative"
              size="sm"
              icon="close"
              @click="deleteDynamicItem(i)"
          ></q-btn>
          <q-card-section vertical class="pl-1">
            <div style="display: flex; justify-content: space-between">
              <div style="text-align: left"><b>{{ $t('items.brand') }}:</b> <span
                  class="text-pink-6">{{ item.brandName }}</span></div>
              <div style="text-align: left"><b>{{ $t('items.sku') }}:</b> <span
                  class="text-pink-6">{{ item.cku }}</span></div>
            </div>
            <q-separator/>
            <div style="display: flex; justify-content: space-between;" class="mt-1 mb-1">
              <div style="text-align: left"><b>{{ $t('items.size') }}:</b> <span
                  class="text-pink-6">{{ item.sizeOlcham }}</span></div>
            </div>
            <q-separator/>
            <div style="display: flex; justify-content: space-between;" class="mt-1 mb-1">
              <div style="text-align: left"><b>{{ $t('items.count') }}:</b> <span
                  class="text-pink-6">{{ item.count }}</span></div>
            </div>
            <q-separator/>
            <div style="display: flex; justify-content: space-between">
              <div style="text-align: left"><b>{{ $t('items.colors') }}:</b> <span
                  class="text-pink-6">{{ item.colorName }}</span></div>
              <!--<div style="text-align: left"><b>{{ $t('items.brand') }}:</b> <span
                  class="text-pink-6">{{ item.brandName }}</span></div>-->
            </div>
            <q-separator/>
            <div style="text-align: center">
              <b>{{ $t('post.sold_price') }}:</b>
              <span class="text-pink-6 mt-1" style="font-size: 16px;">{{item.salePrice }}</span>
            </div>
          </q-card-section>
        </q-card>
      </div>
      <template #footer>
        <div style="display: flex; justify-content: center; flex-direction: column">
          <div v-for="(payment, i) in paymentList" :key="i">
            <div style="display: flex; justify-content: center; flex-direction: row;" class="mt-1">
              <vs-button @click="calculatePrice(payment, i)">{{payment.name}}</vs-button>
              <input :id="`price-${i}`" state="primary" v-model="paymentList[i].amount" :key="i" class="vs-input a"/>
            </div>
          </div>
        </div>
        <vs-row>
          <vs-col w="12">
            <vs-button @click="save" class="mt-1" block success gradient>{{ $t('post.payment') }}</vs-button>
          </vs-col>
        </vs-row>
      </template>
    </vs-dialog>
  </div>
</template>

<script>
import SaleService from "@/modules/post/post/sale.service";
import {TokenService} from "@/services/storage.service";
import PaymentService from "@/modules/references/payment/payment.service";
import ZReportService from "@/modules/post/post/z-report.service";
import DepartmentService from "@/modules/management/department/department.service";

export default {
  name: "index",
  data() {
    return {
      items: [],
      search: '',
      windowWidth: window.innerWidth,
      whItems: [],
      fun: false,
      found: false,
      columns: [
        {name: 'id', align: 'center', label: this.$t('doc.index'), field: 'index'},
        {name: 'cashierName', align: 'center', label: this.$t('post.seller'), field: 'cashierName'},
        {name: 'regNumber', align: 'center', label: this.$t('post.regNumber'), field: 'regNumber'},
        {name: 'regDate', align: 'center', label: this.$t('post.regDate'), field: 'regDate'},
        {name: 'saleCount', align: 'center', label: this.$t('post.sold_price'), field: 'saleСount'},
        {name: 'actions', align: 'center', label: this.$t('doc.action'), field: 'actions'}
      ],
      totalCount: 0,
      fromDepartmentId: 0,
      cashierId: 0,
      comment: '',
      resale: false,
      saleform: {
        cashboxId: null,
        cashboxName: "",
        comment: "",
        contragentId: null,
        contragentName: "",
        fromDepartmentId: null,
        fromDepartmentName: "",
        regDate: "",
        regNumber: "",
        status: "ACTIVE",
        toDepartmentId: null,
        zetReportId: null,
        toDepartmentName: "",
        paymentTypeId: null,
        ammount: 0,
        totolCount: 0,
        whItems:[],
        paymentDtos: []
      },
      paymentDtos: {
        ammount: 0,
        id: 0,
        paymentTypeId: 0,
        paymentTypeName: "",
        totolCount: 0
      },
      paymentList: [],
      notFuny: '',
      info: {},
      saleDocId: null,
      checkZetReport: false,
      lol: {},
      depList: []
    }
  },
  watch: {
    "search": {
      handler(e) {
        this.getItemByRegNumber(e)
      }
    },
    'paymentList': {
      handler(e) {
      },
      deep: true
    }
  },

  computed: {
    calculateTotal() {
      return  this.saleform.whItems.reduce((total, item) => {
        return this.saleform.totolCount = total + item.count
      }, 0)
    },
    calculate() {
      return this.saleform.whItems.reduce((total, item) => {
        return this.saleform.ammount = total + item.count * item.salePrice
      }, 0)
    },
  },
  methods: {
    getItemByRegNumber(regNumber) {
      // let form = {}
      /*/form.fromDepartmentId = parseInt(this.fromDepartmentId)
      form.cashierId = this.cashierId
      form.regNumber = parseInt(this.search)*/
      // regNumber = this.search
      SaleService.getByRegNumber(regNumber).then(res => {
        this.found  = true
        this.items = []
        this.items = res.data
      })
    },
    getDescription(id) {
      SaleService.getReturnById(id).then(res => {
        this.whItems = []
        this.whItems = res.data.whDocItems
        this.saleDocId = res.data.id
        this.fun = true
      })
    },
    async returnGoods() {
      let bool
      await ZReportService.CheckZetReport(localStorage.getItem('dep_id'), localStorage.getItem('cashboxId')).then(res => {
        bool = res.data.open
        if(bool === true) {
          this.checkZetReport = true
        }
      })
      if(this.checkZetReport === true) {
          this.whItems.forEach(e => {
            Object.assign(e, {returnCount: 0})
            e.returnCount = e.count
          })
          await SaleService.returnItems(this.saleDocId, this.comment, this.whItems).then(res => {
            this.createDoc()
            this.found  = false
          })
        } else {
          this.$vs.notification({
            title: this.$t('must_open_zetReport'),
            progress: 'auto',
            duration: 1000,
            color: 'warning',
            position: 'top-right'
          })
        }
    },
    createDoc() {
      SaleService.CreateEmptyDoc().then(res => {
        this.getPaymentList()
        this.saleform = {
          whItems: [
            {salePrice: null}
          ]
        }
        this.saleform = res.data
        this.saleform.whItems = this.whItems
        this.saleform.fromDepartmentId = this.info.departmentId
        this.resale = true
        this.fun = false
      }).catch(e => {
        this.$vs.notification({
          title: e.message,
          duration: 1000,
          progress: 'auto',
          color: 'danger',
          position: 'top-right'
        })
      })
    },
    clear() {
      this.saleform.whItems = []
      this.totalPorducts = 0
      this.totalSum = 0
      this.payment = false
      this.itemsTotal = null
    },
    getPaymentList() {
      PaymentService.getPaymentList().then(res => {
        this.paymentList = res.data
        this.paymentList.forEach(pay => {
          pay.amount = 0
        })
      })
    },
    calculatePrice(payment, index) {
      let sum = 0
      this.paymentList.forEach(pay => {
        pay.amount = parseFloat(pay.amount);
        if (pay.amount)
          sum += pay.amount
      })
      payment.amount = this.calculate - sum;
      this.notFuny = payment.amount
      this.$set(this.paymentList, index, payment);
    },
    deleteDynamicItem(index) {
      this.saleform.whItems.splice(index, 1)
      this.itemsTotal--
    },
    save() {
      this.saleform.status = 'READY'
      this.saleform.cashboxId = localStorage.getItem('cashboxId')
      this.saleform.zetReportId = this.checkedZetId
      this.saleform.paymentDtos = this.paymentList.map(e => {
        return {
          paymentTypeId:e.id,
          amount:e.amount,
          name:e.name
        }
      }).filter(e => e.amount && e.amount>0 )
      parseInt(this.saleform.whItems.salePrice)
      this.saleform.fromDepartmentId = this.lol.id
      this.saleform.fromDepartmentName = this.lol.name
      SaleService.saveSale(this.saleform).then(res => {
        this.resale = false
        this.clear()
        this.$vs.notification({
          title: this.$t('success_updated'),
          progress: 'auto',
          duration: 1000,
          color: 'success',
          position: 'top-right'
        })
      })
    }
  },
  created() {
    this.fromDepartmentId = TokenService.getDepartmentId()
    this.info = TokenService.getUserInfo()
    this.cashierId = this.info.id
    DepartmentService.getDepByAccess().then(res => {
      this.depList = res.data || []
      this.depList.forEach(dep => {
        if(dep.id == TokenService.getDepartmentId()){
          return this.lol = dep
        }
      })
    })

  }
}
</script>

<style scoped>
.small {
  font-size: 10px;
  right: -150px;
  top: -10px;
}
.desktop {
  font-size: 10px;
  right: -380px;
  top: -12px;
}
</style>
