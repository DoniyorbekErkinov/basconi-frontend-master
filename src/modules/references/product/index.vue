<template>
  <div>
    <q-table
      class="shadow-10"
      row-key="id"
      row="row"
      :data="items"
      :columns="columns"
      :hide-pagination="true"
      :rows-per-page-options="[0]"
    >
      <template v-slot:top>
        <div v-if="windowWidth > 600" class="q-table__title">{{ $t('references.product') }}</div>
        <q-space v-if="windowWidth > 600"/>
        <vs-input state="primary" icon-after class="q-mr-lg" v-model="search" :placeholder="$t('actions.search')">
          <template #icon>
            <q-icon name="search"/>
          </template>
        </vs-input>
        <q-space v-if="windowWidth < 600"/>
        <vs-button v-if="$can('Save', 'Item')" success animation-type="rotate" @click="createForm">
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
      <template v-slot:body-cell-sizeId="props">
        <q-td class="text-center">
          <q-badge v-for="size in props.row.sizes" class="mr-1">{{ size.olcham }}</q-badge>
        </q-td>
      </template>
      <template v-slot:body-cell-actions="props">
        <q-td class="text-center">
          <vs-button v-if="$can('Update', 'Item')" style="display: inline-block" flat icon primary @click="editForm(props.row.id)">
            <q-icon name="edit"/>
          </vs-button>
          <vs-button v-if="$can('Delete', 'Item')" style="display: inline-block" flat icon danger @click="deleteForm(props.row.id)">
            <q-icon name="delete"/>
          </vs-button>
        </q-td>
      </template>
    </q-table>
    <div class="row justify-center q-mt-md">
      <q-pagination v-model="payload.page" :max="maxItem"  :max-pages="4" direction-links boundary-links push/>
    </div>

    <!--           Create / Edit           -->
    <vs-dialog v-model="createEditModal" @close="getProductList" prevent-close>
      <template #header>
        <b v-if="create">{{ $t('references.new_item') }}</b>
        <b v-else>{{ $t('references.edit_item') }}</b>
      </template>
      <q-separator/>
      <validation-observer ref="itemForm" v-slot="{}">
        <vs-row>
          <vs-col>
<!--            <validation-provider v-slot="{valid}" rules="required" name="name">-->
<!--              <vs-input-->
<!--                  block-->
<!--                  primary-->
<!--                  class="mt-3"-->
<!--                  :danger="!valid"-->
<!--                  v-model="formItem.name"-->
<!--                  :label="$t('items.name')"-->
<!--                  :placeholder="$t('items.name')"-->
<!--                  :class="!valid ? 'required' : ''"-->
<!--              />-->
<!--            </validation-provider>-->
<!--            <validation-provider v-slot="{valid}" rules="required" name="unitId">-->
<!--              <vs-select-->
<!--                  block-->
<!--                  class="mt-3"-->
<!--                  :danger="!valid"-->
<!--                  :label="$t('items.unit')"-->
<!--                  :placeholder="$t('items.unit')"-->
<!--                  v-model="formItem.unitId"-->
<!--                  :class="!valid ? 'required' : ''"-->
<!--              >-->
<!--                <vs-option-group>-->
<!--                  <div>{{ $t('items.unit') }}</div>-->
<!--                  <vs-option v-for="(u, index) in units" :key="`select-unit-${index}`" :label="u.name" :value="u.id">-->
<!--                    {{ u.name }}-->
<!--                  </vs-option>-->
<!--                </vs-option-group>-->
<!--              </vs-select>-->
<!--            </validation-provider>-->
            <validation-provider v-slot="{valid}" rules="required" name="categoryId">
              <vs-select
                  block
                  class="mt-3"
                  :danger="!valid"
                  :label="$t('items.category')"
                  :placeholder="$t('items.category')"
                  v-model="formItem.categoryId"
                  :class="!valid ? 'required' : ''"
                  :key="`categories-${categories.length}`"
              >
                <vs-option-group>
                  <div>{{ $t('items.category') }}</div>
                  <vs-option v-for="cat in categories" :key="cat.id" :label="cat.name" :value="cat.id">
                    {{ cat.name }}
                  </vs-option>
                </vs-option-group>
              </vs-select>
            </validation-provider>
            <validation-provider name="brandId">
              <vs-select
                block
                class="mt-3"
                :label="$t('items.brand')"
                :placeholder="$t('items.brand')"
                v-model="formItem.brandId"
                :key="`brands-${brands.length}`"
              >
                <vs-option-group>
                  <div>{{ $t('items.brand') }}</div>
                  <vs-option v-for="(b,inde) in brands" :key="`brand-${inde}`" :label="b.name" :value="b.id">
                    {{ b.name }}
                  </vs-option>
                </vs-option-group>
              </vs-select>
            </validation-provider>
            <validation-provider  name="colorId">
              <vs-select
                block
                class="mt-3"
                v-model="formItem.colorId"
                :label="$t('references.color')"
                :placeholder="$t('references.color')"
                :key="`colors-${colors.length}`"
              >
                <vs-option-group>
                  <div>{{ $t('references.color') }}</div>
                  <vs-option v-for="(c,col) in colors" :key="`brand-${col}`" :label="c.name" :value="c.id">
                    {{ c.name }}
                  </vs-option>
                </vs-option-group>
              </vs-select>
            </validation-provider>
            <validation-provider v-slot="{valid}" rules="required" name="sizeIds">
              <vs-select
                  block
                  multiple
                  class="mt-3"
                  :danger="!valid"
                  v-model="sizeIds"
                  :label="$t('references.size')"
                  :placeholder="$t('references.size')"
                  :class="!valid ? 'required' : ''"
                  :key="`sizes-${sizes.length}`"
              >
                <vs-option-group>
                  <div>{{ $t('references.size') }}</div>
                  <vs-option v-for="(s,si) in sizes" :key="`size-${si}`" :label="s.olcham" :value="s.id">
                    {{ s.olcham }}
                  </vs-option>
                </vs-option-group>
              </vs-select>
            </validation-provider>
            <validation-provider v-slot="{valid}" rules="required" name="seasons" style="position: relative">
              <vs-select
                  block
                  class="mt-3"
                  v-model="formItem.seasonsId"
                  :label="$t('references.seasons')"
                  :placeholder="$t('references.seasons')"
                  :key="`seasonList-${seasonList.length}`"
              >
                <vs-option-group>
                  <div>{{ $t('references.seasons') }}</div>
                  <vs-option v-for="(c,se) in seasonList" :key="`brand-${se}`" :label="c.name" :value="c.id">
                    {{ c.name }}
                  </vs-option>
                </vs-option-group>
              </vs-select>
            </validation-provider>
            <validation-provider v-slot="{valid}" rules="required" name="scu" style="position: relative">
              <vs-input
                  block
                  primary
                  class="mt-3"
                  :danger="!valid"
                  v-model="formItem.cku"
                  :label="$t('items.sku')"
                  :placeholder="$t('items.sku')"
                  :class="!valid ? 'required' : ''"
              />
              <vs-button icon primary :class="windowWidth > 600 ? 'desktop' : 'mobile'" @click="generateSku">
                <q-icon name="refresh"/>
              </vs-button>
            </validation-provider>
          </vs-col>
        </vs-row>
      </validation-observer>
      <template #footer>
        <vs-button class="mt-2" block primary gradient @click="save">{{ $t('actions.save') }}</vs-button>
      </template>
    </vs-dialog>

    <!--           Delete           -->
    <confirm-modal :model="deleteModal" @submit="deleteItem" @close="deleteModal = false" :text="$t('confirm_delete')"/>
  </div>
</template>

<script>
import ProductService from "./product.service";
import ConfirmModal from "../../../components/confirmModal.vue"
import CategoryService from "../category-product/category.service";
import SizeService from '../size-product/size.service';
import ColorService from '../color-product/color.service';
import SeasonService from "@/modules/references/seasons/seasons.service";

export default {
  name: "index",
  components: {ConfirmModal,},
  data() {
    return {
      search: '',
      windowWidth: window.innerWidth,
      items: [],
      totalItems: 0,
      columns: [
        {name: 'id', align: 'center', label: this.$t('items.index'), field: 'index'},
        {name: 'brandName', align: 'center', label: this.$t('items.brand'), field: 'brandName'},
        // {name: 'name', align: 'center', label: this.$t('items.name'), field: 'name'},
        {name: 'categoryName', align: 'center', label: this.$t('items.category'), field: 'categoryName'},
        {name: 'cku', align: 'center', label: this.$t('items.sku'), field: 'cku'},
        {name: 'sizeId', align: 'center', label: this.$t('items.size'), field: 'sizeId'},
        // {name: 'unitName', align: 'center', label: this.$t('items.unit'), field: 'unitName'},
        {name: 'color', align: 'center', label: this.$t('items.colors'), field: 'colorName'},
        {name: 'seasonsName', align: 'center', label: this.$t('items.seasons'), field: 'seasonsName'},
        {name: 'actions', align: 'center', label: this.$t('items.action'), field: 'actions'},
      ],
      create: true,
      createEditModal: false,
      deleteModal: false,
      itemId: null,
      // units: [],
      brands: [],
      categories: [],
      colors: [],
      sizes: [],
      sizeIds: [],
      payload: {
        page: 1,
        limit: 20
      },
      formItem: {
        // name: null,
        // unitId: '',
        brandId: '',
        colorId: '',
        sizeId: '',
        barcode: '',
        categoryId: '',
        cku: '',
        seasonsId: ''
      },
      seasonList: []
    }
  },
  computed: {
    maxItem() {
      let max = this.totalItems / this.payload.limit
      return Math.ceil(max)
    }
  },
  methods: {
    getProductList() {
      ProductService.getItemsList(this.payload, this.search).then(res => {
        this.items = res.data.list
        this.totalItems = res.data.total
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
    getSeasonsList() {
      SeasonService.getSeasons().then(res => {
        this.seasonList = res.data
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
    // getUnit() {
    //   ProductService.getReferenceUnit().then(res => {
    //     this.units = res.data
    //   }).catch(e => {
    //     this.$vs.notification({
    //       title: e.message,
    //       duration: 1000,
    //       progress: 'auto',
    //       color: 'danger',
    //       position: 'top-right'
    //     })
    //   })
    // },
    getBrand() {
      ProductService.getReferenceBrand().then(res => {
        this.brands = res.data
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
    getSizeLIst() {
      SizeService.getSizes().then(res => {
        this.sizes = res.data
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
    getColorsList() {
      ColorService.getColors().then(res => {
        this.colors = res.data
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
    getCategories() {
      CategoryService.getCategory().then(res => {
        this.categories = res.data
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
    paginate(itemsPerPage, currentPage, index) {
      currentPage = currentPage - 1
      return itemsPerPage * currentPage + (index + 1)
    },
    generateSku() {
      if (this.formItem.categoryId) {
        ProductService.generateSku(this.formItem.categoryId).then(res => {
          this.formItem.cku = res.data
        }).catch(e => {
          this.$vs.notification({
            title: e.message,
            duration: 1000,
            progress: 'auto',
            color: 'danger',
            position: 'top-right'
          })
        })
      } else {
        this.$vs.notification({
          title: this.$t('required_category'),
          progress: 'auto',
          duration: 1000,
          color: 'warn',
          position: 'top-right'
        })
      }
    },
    // generateBarcode() {
    //   ProductService.generateBarcode().then(res => {
    //     this.formItem.barcode = res.data
    //   }).catch(e => {
    //     this.$vs.notification({
    //       title: e.message,
    //       duration: 1000,
    //       progress: 'auto',
    //       color: 'danger',
    //       position: 'top-right'
    //     })
    //   })
    // },
    createForm() {
      this.create = true
      // this.formItem.name = null
      this.formItem.barcode = null
      this.formItem.cku = ''
      // this.formItem.unitId = ''
      this.formItem.categoryId = ''
      this.formItem.brandId = ''
      this.formItem.colorId = ''
      this.formItem.sizeId = ''
      this.formItem.seasonsId = ''
      this.createEditModal = true
    },
    editForm(id) {
      this.itemId = id
      this.create = false
      this.items.forEach(lol => {
        if(lol.id === this.itemId) {
          let item = lol
          this.createEditModal = true
          this.formItem = item
          this.formItem.id = `${item.id}`
          // this.formItem.name = `${item.name}`
          this.formItem.cku = `${item.cku}`
          // this.formItem.unitId = `${item.unitId}`
          this.formItem.categoryId = `${item.categoryId}`
          this.formItem.brandId = `${item.brandId}`
          this.formItem.colorId = `${item.colorId}`
          this.formItem.sizeId = `${item.sizeId}`
          this.formItem.seasonsId = `${item.seasonsId}`
          this.create = false
        }
      })
    },
    save() {
      this.$refs.itemForm.validate().then(valid => {
        if (valid) {
          if (this.create) {
            this.formItem.sizeId = this.sizeIds
            ProductService.createItem(this.formItem).then(res => {
              this.getProductList()
              this.createEditModal = false
            }).catch(e => {
              this.$vs.notification({
                title: e.message,
                duration: 1000,
                progress: 'auto',
                color: 'danger',
                position: 'top-right'
              })
            })
            this.formItem = {}
            this.sizeIds = []
          } else {
            ProductService.updateItem(this.formItem).then(res => {
              this.createEditModal = false
              this.getProductList();
              this.formItem = {}
              this.sizeIds = []
              this.itemId = null
            }).catch(e => {
              this.$vs.notification({
                title: e.message,
                duration: 1000,
                progress: 'auto',
                color: 'danger',
                position: 'top-right'
              })
            })
            this.formItem = {}
          }
        }
      })
    },
    deleteForm(id) {
      this.itemId = id
      this.deleteModal = true
    },
    deleteItem() {
      ProductService.deleteItem(this.itemId).then(res => {
        this.deleteModal = true
        duration: 1000,
        this.getProductList()
        this.deleteModal = false
      }).catch(e => {
        this.$vs.notification({
          title: e.message,
          progress: 'auto',
          color: 'danger',
          position: 'top-right'
        })
      })
    }
  },
  watch: {
    'search': {
      handler(e) {
        this.getProductList();
      }
    },
    'payload.page': {
      handler(e) {
        this.getProductList();
      }
    }
  },
  created() {
    this.getSeasonsList()
    // this.getUnit();
    this.getBrand();
    this.getCategories();
    this.getSizeLIst();
    this.getColorsList();
    this.getProductList();
  }
}
</script>

<style scoped>
.desktop{
  position: absolute;
  top: 28px;
  left: 145px
}
.mobile{
  position: absolute;
  top: 26px;
  left: 110px
}
</style>
