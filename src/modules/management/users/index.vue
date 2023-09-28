<template>
  <div>
    <q-toolbar>
      <q-toolbar-title shrink v-if="windowWidth > 600">
        {{ $t('management.user') }}
      </q-toolbar-title>
      <vs-select v-model="depId" v-else primary active class="mb-1 mt-1" :key="`departmentList-${departmentList.length}`" :label="$t('management.department')">
<!--        <vs-option-group>-->
<!--          <div>{{ $t('management.department') }}</div>-->
          <vs-option v-for="(dep, i) in departmentList" :key="i" :label="dep.name" :value="dep.id">
            {{ dep.name }}
          </vs-option>
<!--        </vs-option-group>-->
      </vs-select>
      <q-space/>
      <vs-button class="mb-1" success animation-type="rotate" @click="createForm">
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
            <q-item v-for="(dep, index) in departmentList" :key="`deps-${index}`" @click="selected = dep.name" clickable
                    v-ripple :active="selected === dep.name">
              <q-item-section avatar>
                <q-icon name="shopping_cart"/>
              </q-item-section>
              <q-item-section>{{ dep.name }}</q-item-section>
            </q-item>
          </q-list>
        </div>
      </template>
      <template v-slot:after>
        <q-tab-panels v-model="selected" animated infinite swipeable keep-alive vertical>
          <q-tab-panel v-for="(tab, index) in departmentList" :key="`tab-panel-${index}`" :name="tab.name">
            <q-table
              class="shadow-10"
              :data="users"
              row-key="id"
              row="row"
              :columns="columnsUser"
              :loading="loadingUsers"
              :hide-pagination="true"
              :rows-per-page-options="[0]"
            >
              <template v-slot:body-cell-id="data">
                <q-td class="text-center">
                  {{ data.rowIndex+1 }}
                </q-td>
              </template>
              <template v-slot:body-cell-roleName="data">
                <q-td class="text-center">
                  <q-badge>{{ data.row.roleName }}</q-badge>
                </q-td>
              </template>
              <template v-slot:body-cell-status="data">
                <q-td class="text-center">
                  <vs-switch  v-model="data.row.status=='ACTIVE'?true:false" success @click="editStatusUser(data.row)">
                    <template #on>
                      ACTIVE
                    </template>
                    <template #off>
                      DELETED
                    </template>
                  </vs-switch>
                </q-td>
              </template>
              <template v-slot:body-cell-actions="data">
                <q-td class="text-center">
                  <vs-button  style="display: inline-block" flat icon primary @click="editForm(data.row)">
                    <q-icon name="edit"/>
                  </vs-button>
                  <vs-button style="display: inline-block" flat icon success @click="permDepForm(data.row)">
                    <q-icon name="verified_user"/>
                  </vs-button>
<!--                  <vs-button style="display: inline-block" flat icon danger @click="deleteForm(data.row.id)">-->
<!--                    <q-icon name="delete"/>-->
<!--                  </vs-button>-->
                </q-td>
              </template>
            </q-table>

          </q-tab-panel>
        </q-tab-panels>
      </template>
    </q-splitter>
    <div v-else>
      <q-expansion-item
          v-for="user in users"
          :key="user.id"
          group="shopDep"
          :label="user.name"
          icon="account_circle"
          style="border-radius: 30px;"
          expand-icon-class="text-white"
          header-class="bg-primary text-white"
          class="shadow-24 overflow-hidden mt-1 mr-3 ml-3"
      >
        <q-card>
          <q-card-section>
            <div class="text-left ml-2"><b>{{ $t('management.fullName') }}:</b> <span class="text-subtitle-2">{{ user.name }}</span></div>
              <hr>
            <div class="text-left ml-2"><b>{{ $t('doc.phone_number') }}:</b> <span class="text-subtitle-2">{{ user.phoneNumber }}</span></div>
              <hr>
            <div class="text-left ml-2"><b>{{ $t('doc.roleName') }}:</b> <span class="text-subtitle-2">{{ user.roleName }}</span></div>
              <hr>
            <div class="text-left ml-2"><b>{{ $t('doc.status') }}:</b>
              <span class="text-subtitle-2">
                <vs-switch v-model="user.status=='ACTIVE'?true:false" success @click="editStatusUser(user)">
                    <template #on>
                      ACTIVE
                    </template>
                    <template #off>
                      DELETED
                    </template>
                  </vs-switch>
              </span>
            </div>
          </q-card-section>
          <q-card-actions>
            <vs-row>
              <vs-col justify="center" align="center">
                <vs-button @click="editForm(user)" primary class="" style="display: inline-block" gradient>
                  <i class="mdi mdi-pencil"/>
                </vs-button>
                <vs-button style="display: inline-block" flat icon success @click="permDepForm(user)">
                  <q-icon name="verified_user"/>
                </vs-button>
<!--                <vs-button @click="deleteForm(user.id)" danger class="" style="display: inline-block" gradient>-->
<!--                  <i class="mdi mdi-delete"/>-->
<!--                </vs-button>-->
              </vs-col>
            </vs-row>
          </q-card-actions>
        </q-card>
      </q-expansion-item>
    </div>

    <!--    Create / Edit    =>     User     -->
    <vs-dialog blur prevent-close v-model="createModalUser">
      <template #header>
        <b v-if="create">{{ $t('management.new_user') }}</b>
        <b v-else>{{ $t('management.edit_user') }}</b>
      </template>
      <q-separator/>
      <validation-observer ref="userForm" v-slot="{}">
        <validation-provider v-slot="{valid}" rules="required" name="username">
          <vs-input
              state="primary"
              block
              class="mt-3"
              v-model="formUser.name"
              :label="$t('management.fullName')"
              :danger="!valid || nameRequired"
              :class="!valid || nameRequired ? 'required' : ''"
          />
          <span v-if="nameRequired" class="text-red">{{ $t('user_error') }}</span>
        </validation-provider>
        <validation-provider v-slot="{valid}" rules="required" name="username">
          <vs-input
              state="primary"
              block
              class="mt-3"
              v-model="formUser.username"
              :label="$t('management.username')"
              :danger="!valid || usernameRequired"
              :class="!valid || usernameRequired ? 'required' : ''"
          ><template #icon>@</template></vs-input>
          <span v-if="usernameRequired" class="text-red">{{ $t('user_error') }}</span>
        </validation-provider>
        <validation-provider v-slot="{valid}" rules="required" name="password">
          <vs-input
              block
              state="primary"
              class="mt-3"
              :danger="!valid"
              v-model="formUser.password"
              :class="!valid ? 'required' : ''"
              :label="$t('management.password')"
          />
        </validation-provider>
        <validation-provider v-slot="{valid}" rules="required" name="rePassword">
          <vs-input
              block
              state="primary"
              class="mt-3"
              :danger="!valid"
              v-model="formUser.rePassword"
              :class="!valid ? 'required' : ''"
              :label="$t('management.repeat_password')"
          />
        </validation-provider>
        <validation-provider v-slot="{valid}" rules="required" name="phoneNumber">
          <vs-input
              block
              state="primary"
              class="mt-3"
              :danger="!valid"
              v-model="formUser.phoneNumber"
              v-mask="'+998-##-###-##-##'"
              :class="!valid ? 'required' : ''"
              :label="$t('management.phone_number')"
          />
        </validation-provider>
        <validation-provider v-slot="{valid}" rules="required" name="departmentId">
          <vs-select
            block
            class="mt-3"
            :danger="!valid"
            v-model="formUser.departmentId"
            :label="$t('management.department')"
            :class="!valid ? 'required' : ''"
            :key="`departmentList-${departmentList.length}`"
          >
            <vs-option-group>
              <div>{{ $t('management.department') }}</div>
              <vs-option v-for="(dep, i) in departmentList" :key="i" :label="dep.name" :value="dep.id">
                {{ dep.name }}
              </vs-option>
            </vs-option-group>
          </vs-select>
        </validation-provider>
        <validation-provider v-slot="{valid}" rules="required" name="roleIds">
          <vs-select
            block
            class="mt-3"
            :danger="!valid"
            v-model="formUser.roleId"
            :label="$t('management.roles')"
            :class="!valid ? 'required' : ''"
            :key="`roles-${roles.length}`"
          >
            <vs-option-group>
              <div >{{ $t('management.roles') }}</div>
              <vs-option v-for="(tmp, i) in roles" :key="i" :label="tmp.name" :value="tmp.id">
                {{ tmp.name }}
              </vs-option>
            </vs-option-group>
          </vs-select>
        </validation-provider>
      </validation-observer>
      <template #footer>
        <vs-button class="mt-2" block primary gradient @click="saveUser">{{ $t('actions.save') }}</vs-button>
      </template>
    </vs-dialog>
    <!--    Perm Department    =>     User     -->
    <vs-dialog blur prevent-close v-model="permDepModal">
      <template #header>
        <b>{{ $t('management.perm_dep') }}</b>
      </template>
      <q-separator/>
      <q-list v-for="(dep, index) in departmentList" :key="`dep-${index}`" padding separator>
        <q-item tag="label" v-ripple>
          <q-item-section>
            <q-item-label>{{ dep.name }}</q-item-label>
          </q-item-section>
          <q-item-section side top>
            <q-toggle v-model="departmentIds" :val="dep.id"/>
          </q-item-section>
          <q-item-section side top>
            <q-toggle v-model="saleDepartmentIds" :val="dep.id" :key="index"/>
          </q-item-section>
        </q-item>
      </q-list>
      <template #footer>
        <vs-button class="mt-2" block primary gradient @click="savePermDep">{{ $t('actions.save') }}</vs-button>
      </template>
    </vs-dialog>
    <!--           Delete          -->
<!--    <confirm-modal :model="deleteModal" @submit="deleteUser" @close="deleteModal = false" :text="$t('confirm_delete')"/>-->
  </div>
</template>

<script>
import DepartmentService from "../department/department.service";
import UsersService from "./users.service";
import ConfirmModal from "../../../components/confirmModal";
import RolesService from "../roles/role.service";


export default {
  name: "index",
  components: {ConfirmModal},
  data() {
    return {
      windowWidth: window.innerWidth,
      formUser: {
        phoneNumber: '+998-',
        password: '',
        rePassword: '',
        id: '',
        username: '',
        name: '',
        roleId: null,
        departmentId: null,
        departmentName: ''
      },
      checkUserForm: {username: ''},
      create: true,
      createModalUser: false,
      permDepModal: false,
      departmentIds: [],
      saleDepartmentIds: [],
      splitterModel: 25,
      loadingUsers: false,
      usernameRequired: false,
      nameRequired: false,
      userId: null,
      selected: '',
      selectedDep: {},
      departmentList: [],
      columnsUser: [
        {name: 'id', align: 'center', label: '№', field: 'id'},
        {name: 'name', align: 'center', label: this.$t('management.fullName'), field: 'name'},
        {name: 'username', align: 'center', label: this.$t('doc.username'), field: 'username'},
        {name: 'phoneNumber', align: 'center', label: this.$t('doc.phone_number'), field: 'phoneNumber'},
        {name: 'roleName', align: 'center', label: this.$t('doc.roleName'), field: 'roleName'},
        {name: 'status', align: 'center', label: this.$t('doc.status'), field: 'status'},
        {name: 'actions', align: 'center', label: this.$t('doc.action'), field: 'actions'},
      ],
      roleId: null,
      depId: '',
      users: [],
      model: this.$t('management.employees'),
      deleteModal: false,
      roles: []
    }
  },
  computed: {},
  methods: {
    async getDepsList() {
      this.loadingUsers = true
      await DepartmentService.getDepartmentsList().then(res => {
        this.depId = `${res.data[0].id}`
        this.departmentList = []
        this.departmentList = res.data
        this.selected = res.data[0].name
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
      this.loadingUsers = false
    },
    async getUsers() {
      this.loadingUsers = true
      await UsersService.getUsersByDepId(this.depId).then(res => {
        this.users = res.data
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
      this.loadingUsers = false
    },
    getRoleList() {
      RolesService.getRoleList().then(res => {
        this.roles = res.data
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
    createForm() {
      this.create = true
      if (this.selected) {
        this.formUser.username = null
        this.formUser.name = null
        this.formUser.password = null
        this.formUser.rePassword = null
        this.formUser.phoneNumber = null
        this.formUser.roleId = ''
        this.formUser.departmentId = `${this.selectedDep.id}`
        this.createModalUser = true
      } else {
        this.$vs.notification({
          type:'confirm',
          duration: 1000,
          title: this.$t('required_dep'),
          progress: 'auto',
          color: 'warn',
          position: 'top-right'
        })
      }
    },
    async editStatusUser(item) {
      this.loadingUsers = true
      let status = ''
      if (item.status == 'ACTIVE') {
        status = 'INACTIVE'
      } else {
        status = 'ACTIVE'
      }
      await UsersService.updateStatusUser(item.id, status).then(res => {
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
      this.loadingUsers = false
      await this.getUsers();
    },
    editForm(item) {
      this.create = false
      this.formUser = item
      this.formUser.roleId = `${item.roleId}`
      this.formUser.departmentId = `${item.departmentId}`
      this.createModalUser = true
    },
    permDepForm(item) {
      this.userId = null
      this.userId = item.id
      this.departmentIds = item.departmentIds
      if (!item.saleDepartmentIds)
        item.saleDepartmentIds = []
      this.saleDepartmentIds = item.saleDepartmentIds
      this.permDepModal = true
    },
    savePermDep() {
      let data = {
        id: this.userId,
        departmentIds: this.departmentIds,
        saleDepartmentIds: this.saleDepartmentIds
      }
      UsersService.savePermDep(data).then(res => {
        this.userId = null
        this.permDepModal = false
        this.getUsers()
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
    // deleteForm(id) {
    //   this.userId = null
    //   this.userId = id
    //   this.deleteModal = true
    // },
    // deleteUser() {
    //   UsersService.deleteUser(this.userId).then(res => {
    //     this.getUsers();
    //     this.deleteModal = false
    //     this.$vs.notification({
    //       type:'confirm',
    //       duration: 1000,
    //       title: this.$t('success_deleted'),
    //       progress: 'auto',
    //       color: 'success',
    //       position: 'top-right'
    //     })
    //   }).catch(e => {
    //     this.$vs.notification({
    //       type:'confirm',
    //       duration: 1000,
    //       title: e.message,
    //       progress: 'auto',
    //       color: 'danger',
    //       position: 'top-right'
    //     })
    //   })
    // },
    saveUser() {
      this.$refs.userForm.validate().then(valid => {
        if (valid) {
          if (this.formUser.password === this.formUser.rePassword) {
            if (this.create) {
              UsersService.createUser(this.formUser).then(res => {
                this.getUsers();
                this.getDepsList();
                this.createModalUser = false
                this.$vs.notification({
                  duration: 1000,
                  type:'confirm',
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
              UsersService.updateUser(this.formUser).then(res => {
                this.getUsers();
                this.getDepsList();
                this.getRoleList();
                this.createModalUser = false
                this.$vs.notification({
                  duration: 1000,
                  type:'confirm',
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
              title: this.$t('password_error'),
              progress: 'auto',
              color: 'danger',
              position: 'top-right'
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
          title: e.message,
          progress: 'auto',
          color: 'danger',
          position: 'top-right'
        })
      })
    },
  },
  watch: {
    'selected': {
      handler(e) {
        this.departmentList.forEach(t => {
          if (t.name == e) {
            this.depId = `${t.id}`
            this.selectedDep = t
          }
        })
        this.getUsers();
        this.loadingUsers = false
      }
    },
    'depId': {
      handler(e) {
        this.getUsers();
        this.loadingUsers = false
      }
    }
  },
  async created() {
    await this.getDepsList();
    await this.getRoleList();
    await this.getUsers();
  }
}
</script>

<style scoped>

</style>
