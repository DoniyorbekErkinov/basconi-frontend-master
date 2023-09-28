<template>
  <div>
    {{itemsLength}}
    <q-toolbar>
      {{getDepartmentName}}
      <q-fab style="z-index: 1000; right: 18px; top: -15px; font-size: 16px" padding="xs" color="secondary" glossy icon="keyboard_arrow_down" direction="down">
        <q-fab-action style="z-index: 999; margin-top: -8px" color="primary" padding="xs" text-color="white" icon="mdi-lightning-bolt-circle" @click="openPendingModal"/>
        <q-fab-action @click="CloseZmodal = true" padding="xs" style="z-index: 999; font-size: 16px; font-weight: 600; padding-left: 7px; padding-right: 7px; margin-top: -3px" color="accent" text-color="white" >Z</q-fab-action>
      </q-fab>
      <q-toolbar-title style="font-size: 18px; height: 55px; color: #030385"><b>{{ userInfo.name }}</b> -
        <b>{{  lol.name }}</b>
      </q-toolbar-title>
    </q-toolbar>
    <q-btn @click="makePayment" round icon="shopping_cart" class="q-ml-md fixed bg-blue-grey-13 text-white" style="z-index: 1000; right: 18px; top: 190px; font-size: 18px">
      <q-badge style="margin-top: 5px; " align="middle" color="red" floating>{{ totalItems  }}</q-badge>
    </q-btn>
    <q-separator/>
    <vs-row justify="center">
      <vs-col w="12" class="mt-1">
        <vs-input state="primary" block icon-after class="q-mr-lg" v-model="search" :placeholder="$t('actions.search')">
          <template #icon>
            <q-icon name="search"/>
          </template>
        </vs-input>
      </vs-col>
    </vs-row>
    <div class="row">
      <div class="mt-1" :class="windowWidth < 600 ? 'col-4' : 'col-2'" v-for="(con, ind) in productList" :key="`productList-${ind}`">
        <q-card @click="getItemDescription(con)" class="no-padding q-mx-xs"
                :class=" saleform.whItems.findIndex((e) => e.id == con.id) > -1 ? 'bg-green-12' : 'bg-light-blue-3'"
                 style="margin: 2px 2px" align="left">
          <q-badge style="width: 85px; left: -5px;  top: -5px;" rounded  color="red-6" floating>{{ con.price }}: {{$t('uzb_currency')}}</q-badge>
          <q-card-section v-if="windowWidth < 600">
<!--            <div>{{ con.itemName }}</div>-->
            <div>{{ con.itemCku }}</div>
            <div>{{ con.colorName }}</div>
            <div>{{ con.sizeOlcham }} / {{ con.remaining }}</div>
          </q-card-section>
          <q-card-section v-else class="pl-1">
            <div style="display: flex; justify-content: space-between">
              <div style="text-align: left"><b>{{ $t('items.brand') }}:</b> <span
                  class="text-pink-6">{{ con.brandName }}</span></div>
              <div style="text-align: left"><b>{{ $t('items.sku') }}:</b> <span
                  class="text-pink-6">{{ con.itemCku }}</span></div>
            </div>
            <q-separator/>
            <div style="display: flex; justify-content: space-between">
              <div style="text-align: left"><b>{{ $t('items.count') }}:</b> <span
                  class="text-pink-6">{{ con.remaining }}</span></div>
              <div style="text-align: left"><b>{{ $t('items.size') }}:</b> <span
                  class="text-pink-6">{{ con.sizeOlcham }}</span></div>
            </div>
            <q-separator/>
            <div style="display: flex; justify-content: space-between">
              <div style="text-align: left"><b>{{ $t('items.colors') }}:</b> <span
                  class="text-pink-6">{{ con.colorName }}</span></div>
<!--              <div style="text-align: left"><b>{{ $t('items.brand') }}:</b> <span
                  class="text-pink-6">{{ con.brandName }}</span></div>-->
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
    <vs-row justify="center">
      <vs-col w="6" justify="center">
        <vs-button block :disabled="totalList < 20" @click="getMore" primary gradient>Load More</vs-button>
      </vs-col>
    </vs-row>
    <!-- Modal For Get Item By Id -->
    <vs-dialog v-model="itemModel" blur style="margin-bottom: 105px" width="100%" @close="makeEmpty">
      <q-toolbar>
        <q-toolbar-title>{{ $t('references.reference_product') }}</q-toolbar-title>
      </q-toolbar>
      <div class="no-padding no-margin">
        <q-card class="no-padding mb-1">
          <q-card-section class="pl-1">
            <div style="display: flex; justify-content: space-between">
              <div style="text-align: left"><b>{{ $t('items.brand') }}:</b> <span
                  class="text-pink-6">{{ productInfo.brandName }}</span></div>
              <div style="text-align: left"><b>{{ $t('items.sku') }}:</b> <span
                  class="text-pink-6">{{ productInfo.itemCku }}</span></div>
            </div>
            <q-separator/>
            <div style="display: flex; justify-content: space-between">
              <div style="text-align: left"><b>{{ $t('items.count') }}:</b> <span
                  class="text-pink-6">{{ productInfo.remaining }}</span></div>
              <div style="text-align: left"><b>{{ $t('items.size') }}:</b> <span
                  class="text-pink-6">{{ productInfo.sizeOlcham }}</span></div>
            </div>
            <q-separator/>
            <div style="display: flex; justify-content: space-between">
              <div style="text-align: left"><b>{{ $t('items.colors') }}:</b> <span
                  class="text-pink-6">{{ productInfo.colorName }}</span></div>
              <!--<div style="text-align: left"><b>{{ $t('items.brand') }}:</b> <span
                  class="text-pink-6">{{ productInfo.brandName }}</span></div>-->
            </div>
            <q-separator/>
            <div class="mt-1" style="text-align: left">
              <b>{{ $t('items.price') }}:</b>
              <span class="text-pink-6 mt-1 ml-1" style="font-size: 16px;">{{productInfo.price }}</span>
            </div>
          </q-card-section>
        </q-card>
      </div>
      <vs-row class="mt-2">
        <vs-col w="6">
          <vs-input type="number" state="primary" block v-model="dynamicItem.salePrice"/>
        </vs-col>
        <vs-col w="6">
          <q-btn-group>
            <q-btn padding="xs" @click="dynamicItem.count > 0 ? dynamicItem.count-- : null" color="green"
                   icon="arrow_left"/>
            <q-btn >{{ dynamicItem.count }}</q-btn>
            <q-btn :disable="dynamicItem.count === productInfo.remaining" padding="xs"
                   @click="dynamicItem.count >= 0 ? dynamicItem.count++ : null" color="green" icon="arrow_right"/>
          </q-btn-group>
        </vs-col>
        <vs-row justify="center">
          <vs-col class="mt-1" w="8">
            <vs-button @click="addSaleList" block color="success" style="font-size: 12px; font-weight: 400; letter-spacing: 1px;">
              <i class="mdi mdi-cart-plus mr-1"/> {{ $t('post.add') }}
            </vs-button>
          </vs-col>
        </vs-row>
      </vs-row>
    </vs-dialog>
<!--     Z-Modal -->
    <vs-dialog v-model="Zmodal" blur prevent-close @close="goHome" width="60%">
      <q-toolbar>
        <q-toolbar-title>{{ $t('post.z-report') }} / {{ $t('doc.code') }}: {{ zCode }}</q-toolbar-title>
      </q-toolbar>
      <q-separator/>
      <vs-row justify="center">
        <vs-input block class="mt-1" state="primary" v-model="code"/>
        <vs-col :w="windowWidth < 600 ? '6' : '2'" class="mt-1">
          <vs-button class="ml-3" @click="closeZcode">{{ $t('actions.save') }}</vs-button>
        </vs-col>
      </vs-row>
    </vs-dialog>
<!--     Close Z-Modal   -->
    <vs-dialog v-model="CloseZmodal" blur prevent-close @close="getItemsByDepId" width="100%">
      <q-toolbar>
        <q-toolbar-title>
          {{$t('post.close-z')}}
        </q-toolbar-title>
      </q-toolbar>
      <vs-row justify="space-around" width="100%">
        <vs-col w="5">
          <vs-button @click="closeZReport" block success gradient>{{$t('actions.yes')}}</vs-button>
        </vs-col>
        <vs-col w="5">
          <vs-button @click="CloseZmodal = false" block danger gradient>{{$t('actions.no')}}</vs-button>
        </vs-col>
      </vs-row>
    </vs-dialog>
<!--    To'lov-->
    <vs-dialog v-model="payment"  blur prevent-close width="100%">
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
                  class="text-pink-6">{{ item.itemCku }}</span></div>
            </div>
            <q-separator/>
            <div style="display: flex; justify-content: space-between;" class="mt-1 mb-1">
              <div style="text-align: left"><b>{{ $t('items.count') }}:</b>
                <q-btn-group style="padding: 2px;" class="ml-1">
                  <q-btn padding="xs" @click="item.count > 0 ? item.count-- : null" color="green"
                         icon="arrow_left"/>
                  <q-btn >{{ item.count }}</q-btn>
                  <q-btn :disable="item.count === productInfo.remaining" padding="xs"
                         @click="item.count >= 0 ? item.count++ : null" color="green" icon="arrow_right"/>
                </q-btn-group>
              </div>
              <div style="text-align: left"><b>{{ $t('items.size') }}:</b> <span
                  class="text-pink-6">{{ item.sizeOlcham }}</span></div>
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
          <vs-col :w="windowWidth > 600 ? '6' : '12'">
            <vs-button @click="save('READY')" :class="windowWidth > 600 ? 'mt-1 mr-1' : 'mt-1'" block success gradient>{{ $t('post.payment') }}</vs-button>
          </vs-col>
          <vs-col :w="windowWidth > 600 ? '6' : '12'">
            <vs-button  @click="save('SUSPENDED')" :class="windowWidth > 600 ? 'mt-1 mr-1' : ''" block warn gradient>{{ $t('actions.save') }}</vs-button>
          </vs-col>
        </vs-row>
      </template>
    </vs-dialog>
    <!--  Pending Modal  -->
    <vs-dialog v-model="pendingModal"  blur prevent-close :width="windowWidth > 600 ? '100%' : '60%'">
      <q-toolbar>
        <vs-row>
          <vs-col w="12">
            <q-toolbar-title>{{ $t('post.payment') }}</q-toolbar-title>
          </vs-col>
        </vs-row>
      </q-toolbar>
      <q-separator/>
      <div class="row">
        <div class="col-10 mt-1" style="margin: 0 auto">
          <q-expansion-item v-for="item in saleList" :key="item.id" :label="item.regNumber" style="border-radius: 15px" header-class="bg-primary text-white" expand-icon-class="text-white" class="shadow-1 overflow-hidden mt-1">
            <q-card class="mb-1 bg-grey-2">
              <q-card-section>
                <div style="text-align: left">
                  <b>{{ $t('doc.regDate') }}: </b>
                  <span class="text-pink-6 ml-2">{{ item.regDate }}</span>
                </div>
                <div style="text-align: left" >
                  <b >{{ $t('doc.regNumber') }}:</b>
                  <span style="text-align: right; margin-left: 3px" class="text-pink-6">{{ item.regNumber }}</span>
                </div>
                <q-card class="q-pa-sm mb-1 " v-for="(subItem, i) in item.whDocItems" :key="`subItem-${i}`">
                  <div style="text-align: left">
                    <b>{{ $t('items.sku') }}: </b>
                    <span class="text-pink-6 ml-2">{{ subItem.cku }}</span>
                  </div>
                  <div style="text-align: left">
                    <b>{{ $t('items.size') }}: </b>
                    <span class="text-pink-6">{{ subItem.sizeOlcham }}</span>
                  </div>
                  <div style="text-align: left">
                    <b>{{ $t('items.count') }}: </b>
                    <span class="text-pink-6 ml-2">{{ subItem.count }}</span>
                  </div>
                  <div style="text-align: left">
                    <b>{{ $t('post.sold_price') }}:</b>
                    <span class="text-pink-6 ml-2">{{ subItem.salePrice }}</span>
                  </div>
                </q-card>
              </q-card-section>
              <q-card-actions>
                <div class="row" style="justify-content: space-between; margin: 0 auto">
                  <div class="col-5">
                    <vs-button  @click="editSale(item.id)"  block primary gradient>
                      <q-icon name="edit"/>
                    </vs-button>
                  </div>
                  <div class="col-5">
                    <vs-button  @click="openDeleteModal(item.id)"block danger gradient>
                      <q-icon name="delete"/>
                    </vs-button>
                  </div>
                </div>
              </q-card-actions>
            </q-card>
          </q-expansion-item>
        </div>
      </div>
    </vs-dialog>
    <!--          BeforePos          -->
    <vs-dialog v-model="beforePostModal" @close="goHome"  blur prevent-close :width="windowWidth > 600 ? '100%' : '60%'">
      <q-toolbar>
        <q-toolbar-title>
          {{$t('post.start_sale')}}
        </q-toolbar-title>
      </q-toolbar>
      <vs-select
        block
        class="mt-3"
        @change="getCashBoxById($event)"
        v-model="depId1"
        :key="`depList-${depList.length}`"
        :label="$t('doc.department')"
      >
        <vs-option v-for="dep in depList" :key="dep.id" :value="dep.id" :label="dep.name">
          {{dep.name}}
        </vs-option>
      </vs-select>
      <vs-select
          block
          class="mt-3"
          v-model="beforePostForm.cashBoxId"
          :key="`${cashBox.length}`"
          :label="$t('management.cash_box_name')"
      >
        <vs-option v-for="cash in cashBox" :key="cash.id" :value="cash.id" :label="cash.name">
          {{cash.name}}
        </vs-option>
      </vs-select>
      <vs-row justify="center">
        <vs-col w="6" class="mt-3">
          <vs-button block @click="setBeforePostIdsToLocale">
            {{$t('post.go_pos')}}
          </vs-button>
        </vs-col>
      </vs-row>
    </vs-dialog>
    <!--       Delete       -->
    <confirm-modal :model="deleteModal" @submit="deleteSaleDoc" @close="deleteModal = false" :text="$t('confirm_delete')"/>
  </div>
</template>
<script>
import {TokenService} from "../../../services/storage.service";
import UsersService from "../../management/users/users.service";
import DepartmentService from "../../management/department/department.service";
import WareHaseService from "../../wms/warehouse/warehouse.service";
import SaleService from "./sale.service";
import ConfirmModal from "../../../components/confirmModal"
import CashBoxService from "../../references/cashbox/cashbox.service";
import ZReportService from "./z-report.service";
import PaymentService from "../../references/payment/payment.service";
export default {
  name: "index",
  data() {
    return {
      windowWidth: window.innerWidth,
      userInfo: {},
      saleList: [],
      totalList: 0,
      search1: '',
      depList: [],
      productList: [],
      productInfo: {},
      pagination: {
        page: 1,
        limit: 20
      },
      payload: {
        page: 1,
        limit: 20
      },
      totalItems: 0,
      depId: '',
      selected: '',
      search: '',
      itemId: '',
      dynamicItem: {
        count: 1,
        salePrice: 0
      },
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
      Zmodal: false,
      CloseZmodal: false,
      payment: false,
      code: null,
      zCode: 123,
      itemsTotal: 0,
      itemModel: false,
      totalPorducts: 0,
      totalSum: 0,
      pendingModal: false,
      docId: null,
      suspendedList: [],
      deleteModal: false,
      beforePostModal: false,
      beforePostForm: {
        departmentId: '',
        cashBoxId: ''
      },
      cashBox: [],
      lol: {},
      zForm: {
        id: null,
        cashboxId: null,
        cashboxName: "",
        departmentId: null,
        departmentName: "",
        end: "",
        open: true,
        start: ""
      },
      close_Z_Form: {
        id: null,
        cashboxId: null,
        cashboxName: "",
        departmentId: null,
        departmentName: "",
        end: "",
        start: ""
      },
      checkedZetId: null,
      paymentList: [],
      depId1: '',
      paymentAmount: ''
    }
  },
  components: {
    ConfirmModal
  },
  computed: {
    calculate() {
      return this.saleform.whItems.reduce((total, item) => {
        return this.saleform.ammount = total + item.count * item.salePrice
      }, 0)
    },
    calculateTotal() {
      return  this.saleform.whItems.reduce((total, item) => {
        return this.saleform.totolCount = total + item.count
      }, 0)
    },
    itemsLength() {
      this.totalItems = this.saleform.whItems.length
    },
    getDepartmentName() {
      this.depList.forEach(dep => {
        if(dep.id == TokenService.getDepartmentId()){
          return this.lol = dep
        }
      })
    },
  },
  watch: {
    'search': {
      handler(e) {
        this.getItemsByDepId();
      }
    },
    'paymentList': {
      handler(e) {
      },
      deep: true
    }
  },
  methods: {
    getCashBoxById(depId1){
      this.GetCashBoxList(depId1);
    },
    calculatePrice(payment, index) {
      let sum = 0
      this.paymentList.forEach(pay => {
        pay.amount = parseFloat(pay.amount);
        if (pay.amount)
          sum += pay.amount
      })
      payment.amount = this.calculate - sum;
      this.paymentAmount = payment.amount
      this.$set(this.paymentList, index, payment);
    },
    getPaymentList() {
      PaymentService.getPaymentList().then(res => {
        this.paymentList = res.data
        this.paymentList.forEach(pay => {
          pay.amount = 0
        })
      })
    },
    getMore() {
      this.pagination.page = this.pagination.page +1
      this.depId = TokenService.getDepartmentId()
      let list = {}
      WareHaseService.getItemByDepIdAndSearch(this.depId, this.search, this.pagination).then(res => {
        list = res.data.list
        this.totalList = res.data.total
        this.productList = Object.assign(this.productList.concat(list))
      })
    },
    getCurrentUser() {
      let user = TokenService.getUserInfo()
      UsersService.getUsersById(user.id).then(res => {
        this.userInfo = res.data
      })
    },
    getItemsByDepId() {
      this.depId = localStorage.getItem('dep_id')
      WareHaseService.getItemByDepIdAndSearch(this.depId, this.search, this.pagination).then(res => {
        this.productList = res.data.list
        this.totalList = res.data.total
      })
    },
    getSaleSuspended() {
      let getSusForm = {}
      getSusForm.cashboxId = localStorage.getItem('cashboxId')
      getSusForm.departmentId = localStorage.getItem('dep_id')
      SaleService.getSaleSuspendedList(getSusForm).then(res => {
        this.saleList = res.data
      }).catch(e => {
        this.$vs.notification({
          duration: 1000,
          title: e.message,
          progress: 'auto',
          color: 'danger',
          position: 'top-right'
        })
      })
    },
    openPendingModal() {
      this.pendingModal = true
    },
    async makePayment() {
      await this.getPaymentList()
      this.payment = true
    },
    addSaleList() {
      if (this.dynamicItem.count > 0) {
        if (this.itemId) {
          let has = false,
              ind = 0
          this.saleform.whItems.forEach((whItem, index) => {
            if (whItem.id === this.dynamicItem.id) {
              if (whItem.remaining >= this.dynamicItem.count) {
                has = true
                ind = index
              }
            }
          })
          if (has) {
            this.saleform.whItems.splice(ind, 1)
            this.dynamicItem = {}
            this.itemId = ''
            this.itemModel = false
            this.color = true
          }
          this.dynamicItem.salePrice =  +this.dynamicItem.salePrice
          let item = Object.assign({}, this.dynamicItem)
          if (item.remaining >= this.dynamicItem.count) {
            this.saleform.whItems.unshift(item)
            this.itemsTotal = this.saleform.whItems.length
            this.itemModel = false
            this.itemId = ''
            this.dynamicItem.count = null
            this.dynamicItem.salePrice = null
          } else {
            this.$vs.notification({
              // title: this.$t('big-count'),
              title: 'Item Id',
              progress: 'auto',
              duration: 1000,
              color: 'danger',
              position: 'top-right'
            })
          }
        } else {
          this.$vs.notification({
            // title: this.$t('big-count'),
            title: 'Item Id',
            progress: 'auto',
            duration: 1000,
            color: 'danger',
            position: 'top-right'
          })
        }
      } else {
        this.$vs.notification({
          // title: this.$t('big-count'),
          title: 'Son kiritilmagan',
          progress: 'auto',
          duration: 1000,
          color: 'danger',
          position: 'top-right'
        })
      }
    },
    deleteDynamicItem(index) {
      this.saleform.whItems.splice(index, 1)
      this.itemsTotal--
    },
    createSaleForm() {
      if (!this.Zmodal) {
      SaleService.CreateEmptyDoc().then(res => {
        this.saleform = {
          whItems: [
            {salePrice: null}
          ]
        }
        this.saleform = res.data
        this.saleform.fromDepartmentId = this.userInfo.departmentId
        this.dynamicItem = {}
        this.saleform.whItems = []
        this.getItemsByDepId()
        this.getSaleSuspended()
      }).catch(e => {
        this.$vs.notification({
          title: e.message,
          duration: 1000,
          progress: 'auto',
          color: 'danger',
          position: 'top-right'
        })
      })
      }
    },
    getItemDescription(con) {
      this.productInfo = con
      this.dynamicItem = this.productInfo
      this.itemId = con.id
      this.productInfo.count = 1
      this.productInfo.salePrice = con.price
      this.itemModel = true
    },
    makeEmpty() {
      this.dynamicItem = {}
      this.itemId = ''
      this.dynamicItem.count = null
      this.dynamicItem.salePrice = null
    },
    editSale(id) {
      this.docId = id
      SaleService.getSaleListById(this.docId).then(res => {
        this.dynamicItem = {}
        this.itemId = ''
        this.saleform = {
          ...res.data,
          salePrice: res.data.whDocItems.salePrice,
          whItems: res.data.whDocItems,
          whDocItems: null
        }
        this.payment = true
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
    openDeleteModal(id) {
      this.docId = null
      this.docId = id
      this.deleteModal = true
    },
    deleteSaleDoc() {
      SaleService.deleteSaleDoc(this.docId).then(res => {
        this.getSaleSuspended();
        this.getItemsByDepId();
        this.pendingModal = false
        this.deleteModal = false
        this.$vs.notification({
          duration: 1000,
          title: this.$t('success_deleted'),
          progress: 'auto',
          color: 'success',
          position: 'top-right'
        })
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
    BeforePost() {
      if(localStorage.getItem('cashboxId') === null && localStorage.getItem('dep_id') === null){
        this.beforePostModal = true
        this.checkZReport()
        this.GetDepartmentList()
        this.GetCashBoxList()
      } else {
        this.createSaleForm()
        this.beforePostModal = false
      }
    },
    goHome() {
      this.$router.push({name: 'Dashboard'})
    },
    GetDepartmentList() {
      DepartmentService.getDepByAccess().then(res => {
        this.depList = res.data || []
      })
    },
    GetCashBoxList() {
      CashBoxService.getByDebId(this.depId1).then(res => {
        this.cashBox = res.data || []
      })
    },
    setBeforePostIdsToLocale() {
      this.beforePostForm.departmentId = this.depId1
      if(this.beforePostForm.cashBoxId && this.beforePostForm.departmentId) {
        TokenService.saveCashBoxId(this.beforePostForm.cashBoxId)
        TokenService.setDepartmentId(this.beforePostForm.departmentId)
        this.createSaleForm()
        this.getItemsByDepId()
        this.beforePostModal = false
      }
      this.checkZReport()
    },
    closeZcode() {
      if (this.zCode == this.code) {
        this.zForm.cashboxId = localStorage.getItem('cashboxId')
        this.zForm.departmentId = localStorage.getItem('dep_id')
        ZReportService.CreateZ_Report(this.zForm).then(res => {
          this.checkedZetId = res.data.id
          this.createSaleForm()
          this.Zmodal = false
        })
      }
    },
    checkZReport() {
      ZReportService.CheckZetReport(localStorage.getItem('dep_id'), localStorage.getItem('cashboxId')).then(res => {
        this.checkedZetId = res.data.id
        if(res.data.open) {
          this.createSaleForm()
          this.Zmodal = false
        } else {
          this.Zmodal = true
        }
      })
    },
    closeZReport() {
      this.close_Z_Form.cashboxId = localStorage.getItem('cashboxId')
      this.close_Z_Form.departmentId = localStorage.getItem('dep_id')
      this.close_Z_Form.id = this.checkedZetId
      ZReportService.CloseZReport(this.close_Z_Form).then(res => {
        this.CloseZmodal = false
        this.checkZReport()
        this.BeforePost()
      }).catch(e => {
        this.$vs.notification({
          title: this.$t('post.z_report_close_error'),
          type:'confirm',
          color: 'dangir',
          position: 'top-center',
          duration: 2000
        })
      })
    },
    save(status) {
      if(this.paymentDtos !== []) {
        if(this.paymentAmount !== '') {
          this.saleform.status = status
          this.saleform.whDocItems = null
          let tmp = true
          if(status === 'READY') {
            if(this.saleform.whItems.length > 0) {
              tmp = true
            } else {
              tmp = false
              this.$vs.notification({
                title: this.$t('item_required_error'),
                progress: 'auto',
                type:'confirm',
                duration: 1000,
                color: 'danger',
                position: 'top-right'
              })
            }
          }
          if(tmp) {
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
              this.payment = false
              this.createSaleForm()
              this.clear()
              this.$vs.notification({
                title: this.$t('success_updated'),
                progress: 'auto',
                type:'confirm',
                duration: 1500,
                color: 'success',
                position: 'top-right'
              })
            })
          } else {
            this.getSaleSuspended()
          }

        } else {
          this.$vs.notification({
            title: this.$t('payment_error'),
            progress: 'auto',
            duration: 1000,
            color: 'danger',
            position: 'top-right'
          })
        }
      } else {
        this.$vs.notification({
          title: this.$t('payment_error'),
          progress: 'auto',
          duration: 1000,
          color: 'danger',
          position: 'top-right'
        })
      }
    },
    /*saveSuspended(id) {
      this.saleform.whDocItems = null
      this.docId = id
        this.saleform.status = 'READY'
        SaleService.saveSale(this.saleform).then(res => {
          this.payment = false
          this.createSaleForm()
          this.clear()
          this.$vs.notification({
            title: this.$t('success_updated'),
            progress: 'auto',
            duration: 1000,
            color: 'success',
            position: 'top-right'
          })
        })
    },*/
  },
  beforeMount() {
    this.BeforePost()
  },
  mounted() {
    this.getCurrentUser();
    this.getSaleSuspended();
    this.GetDepartmentList()
    this.getItemsByDepId()
    this.checkZReport()
  }
}
</script>

<style scoped>
.small {
  font-size: 10px;
  right: -180px;
  top: -10px;
}
.desktop {
  font-size: 10px;
  right: -380px;
  top: -12px;
}
</style>