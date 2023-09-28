<template>
  <div>
    <q-toolbar>
      <q-toolbar-title shrink class="titleTool">
        {{ $t('management.department') }}
      </q-toolbar-title>
      <q-space/>
      <vs-button  success animation-type="rotate" @click="createForm">
        <q-icon name="add"/>
        <template #animate>
          <q-icon name="add"/>
        </template>
      </vs-button>
    </q-toolbar>
    <q-separator/>
    <q-splitter v-model="splitterModel" v-if="windowWidth > 600">
      <template v-slot:before>
        <div class="q-pa-md">
          <q-list bordered separator>
            <q-item v-for="(dep, index) in departmentList" :key="`deps-${index}`" @click="selected = dep.name" clickable v-ripple :active="selected === dep.name">
              <q-item-section avatar>
                <q-icon name="shopping_cart"/>
              </q-item-section>
              <q-item-section>{{ dep.name }}</q-item-section>
            </q-item>
          </q-list>
        </div>
      </template>
      <template v-slot:after>
        <q-tab-panels v-model="selected" animated>
          <q-tab-panel v-for="(tab, index) in departmentList" :key="`departmentList-${i}`" :name="tab.name">
            <div class="text-h5 q-mb-md">{{ selectedDep.name }}</div>
            <hr>
            <vs-row style="padding: 50px">
              <vs-col w="6" align="left">
                <div v-if="selectedDep.name"><b>{{ $t('doc.name') }}: </b> <span>{{ selectedDep.name }}</span></div>
                <div v-if="selectedDep.address" class="mt-1"><b>{{ $t('doc.address') }}: </b> <span>{{ selectedDep.address }}</span></div>
              </vs-col>
              <vs-col w="6" align="left">
                <div v-if="selectedDep.phoneNumber"><b>{{ $t('doc.phone_number') }}: </b><span>{{ selectedDep.phoneNumber }}</span></div>
              </vs-col>
              <vs-col w="12" align="center" justify="center" class="mt-4">
                <vs-button  @click="editForm(selectedDep)" primary class="mr-4" style="display: inline-block" gradient animation-type="scale">
                  {{ $t('actions.edit') }}
                  <template #animate>
                    <i class="mdi mdi-pencil"/>
                  </template>
                </vs-button>
                <vs-button  @click="deleteModalTrue(selectedDep.id)" danger class="mr-4" style="display: inline-block" gradient animation-type="scale">
                  {{ $t('actions.delete') }}
                  <template #animate>
                    <i class="mdi mdi-delete"/>
                  </template>
                </vs-button>
              </vs-col>
            </vs-row>
          </q-tab-panel>
        </q-tab-panels>
      </template>
    </q-splitter>

    <div v-else class="q-pa-md">
      <q-expansion-item
          v-for="(dep, i) in departmentList"
          :key="`departmentList-${i}`"
          group="shopDep"
          :label="dep.name"
          icon="shopping_cart"
          style="border-radius: 30px"
          expand-icon-class="text-white"
          header-class="bg-primary text-white"
          class="shadow-24 overflow-hidden mt-1"
      >
        <vs-row class="mt-2">
          <vs-col w="12" align="left" class="ml-5"><div v-if="dep.name"><b>{{ $t('doc.name') }}: </b> <span>{{ dep.name }}</span></div></vs-col>
          <vs-col w="12" align="left" class="ml-5"><div v-if="dep.phoneNumber" class="mt-1"><b>{{ $t('doc.phone_number') }}: </b> <span>{{ dep.phoneNumber }}</span></div></vs-col>
          <vs-col w="12" align="left" class="ml-5"><div v-if="dep.address" class="mt-1"><b>{{ $t('doc.address') }}: </b> <span>{{ dep.address }}</span></div></vs-col>
        </vs-row>
        <vs-row class="mt-2 mb-2">
          <vs-col w="12" justify="center" align="center">
            <vs-button  @click="editForm(dep)" primary class="" style="display: inline-block" gradient>
              <i class="mdi mdi-pencil"/>
            </vs-button>
            <vs-button   @click="deleteModalTrue(dep.id)" danger class="" style="display: inline-block" gradient>
              <i class="mdi mdi-delete"/>
            </vs-button>
          </vs-col>
        </vs-row>
      </q-expansion-item>
    </div>



    <!--          Create / Edit          -->
    <vs-dialog blur prevent-close v-model="createModal">
      <template #header>
        <b v-if="create">{{ $t('management.new_department') }}</b>
        <b v-else>{{ $t('management.edit_department') }}</b>
      </template>
      <q-separator/>
      <validation-observer ref="departmentForm" v-slot="{}">
        <vs-row>
          <vs-col w="12">
            <validation-provider v-slot="{valid}" rules="required" name="name">
              <vs-input state="primary" v-model="form.name" class="mt-3" :class="!valid ? 'required' : ''" :danger="!valid"  block :placeholder="$t('doc.name')" :label="$t('doc.name')"/>
            </validation-provider>
            <validation-provider v-slot="{valid}" rules="required" name="address">
              <vs-input state="primary" v-model="form.address" class="mt-3" :class="!valid ? 'required' : ''" :danger="!valid"  block :placeholder="$t('doc.address')" :label="$t('doc.address')"/>
            </validation-provider>
            <validation-provider v-slot="{valid}" rules="required|min:17|max:17" name="phoneNumber">
              <vs-input state="primary" @keyup.enter="save" v-model="form.phoneNumber" class="mt-3" v-mask="'+998-##-###-##-##'"
              :class="!valid ?
              'required' : ''" :danger="!valid"  block :label="$t('doc.phone_number')" :placeholder="$t('doc.phone_number')"/>
            </validation-provider>
          </vs-col>
        </vs-row>
      </validation-observer>
      <template #footer>
        <vs-button class="mt-2" block primary gradient @keyup.enter="save" @click="save">{{ $t('actions.save') }}</vs-button>
      </template>
    </vs-dialog>



    <!--       Delete       -->
    <confirm-modal :model="deleteModal" @submit="deleteDepartment" @close="deleteModal = false" :text="$t('confirm_delete')"/>
  </div>
</template>

<script>
import DepartmentService from "./department.service";
import ConfirmModal from "../../../components/confirmModal.vue"

export default {
  name: "index",
  components: {ConfirmModal},
  data() {
    return {
      loading: false,
      splitterModel: 35,
      windowWidth: window.innerWidth,
      selected: '',
      selectedDep: {},
      departmentList: [],
      tabPanels: [],
      depId: null,
      createModal: false,
      deleteModal: false,
      create: true,
      form: {
        name: '',
        address: '',
        phoneNumber: '+998'
      },
      currency: [],
      depTypes: [],
      saleTypes: [
        {name: 'РОЗНИЧНАЯ ТОРГОВЛЯ', id: 'RETAIL'},
        {name: 'ОПТОВАЯ ТОРГОВЛЯ', id: 'WHOLESALE'}
      ],
    }
  },
  methods: {
    getDepsList() {
      DepartmentService.getDepartmentsList().then(res => {
        this.departmentList = []
        this.departmentList = res.data
        this.selected = res.data[0].name
      }).catch(e => {
        this.$vs.notification({
          duration: 1000,
          title: e.message,
          type:'confirm',
          progress: 'auto',
          color: 'danger',
          position: 'top-right'
        })
      })
    },
    createForm() {
      this.create = true
      this.form = {
        name: '',
        address: '',
        phoneNumber: '+998'
      }
      this.createModal = true
    },
    editForm(item) {
      this.create = false
      this.form = Object.assign({}, item)
      this.createModal = true
    },
    deleteModalTrue(id) {
      this.depId = null
      this.deleteModal = true
      this.depId = id
    },
    deleteDepartment() {
      DepartmentService.deleteDepartment(this.depId).then(res => {
        this.deleteModal = false
        this.$vs.notification({
          type:'confirm',
          duration: 1000,
          title: this.$t('success_deleted'),
          progress: 'auto',
          color: 'success',
          position: 'top-right'
        })
        this.getDepsList();
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
    save() {
      this.$refs.departmentForm.validate().then(valid => {
        if (valid) {
          if (this.create) {
            DepartmentService.createDepartment(this.form).then(res => {
              this.createModal = false
              this.getDepsList();
              this.$vs.notification({
                type:'confirm',
                duration: 1000,
                title: this.$t('success_created'),
                progress: 'auto',
                color: 'success',
                position: 'top-right'
              })
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
            DepartmentService.updateDepartment(this.form).then(res => {
              this.createModal = false
              this.getDepsList();
              this.$vs.notification({
                type:'confirm',
                duration: 1000,
                title: this.$t('success_updated'),
                progress: 'auto',
                color: 'success',
                position: 'top-right'
              })
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
      }).catch(e => {
        this.$vs.notification({
          type:'confirm',
          duration: 1000,
          title: e,
          progress: 'auto',
          color: 'danger',
          position: 'top-right'
        })
      })
    }
  },
  watch: {
    'selected': {
      handler(e) {
        this.departmentList.forEach(t => {
          if (t.name == e) {
            this.selectedDep = t
          }
        })
      }
    }
  },
  created() {
    this.getDepsList();
  }
}
</script>

<style scoped lang="css">

@media (min-width: 250px) {
  .titleTool {
    font-size: 17px;
  }
}
@media (min-width: 600px) {
  .titleTool {
    font-size: 20px;
  }
}

</style>
