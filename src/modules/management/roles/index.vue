<template>
  <div>
    <q-table
      class="shadow-10"
      bordered
      :data="roles"
      row-key="id"
      row="row"
      virtual-scroll
      :columns="columns"
      :hide-pagination="true"
      :rows-per-page-options="[0]"
    >
      <template v-slot:top>
        <div class="q-table__title">{{ $t('management.roles') }}</div>
        <q-space/>
        <vs-button v-if="$can('create', 'role')" success animation-type="rotate" @click="createForm">
          <q-icon name="add"/>
          <template #animate>
            <q-icon name="add"/>
          </template>
        </vs-button>
      </template>

      <template v-slot:body-cell-code="props">
        <q-td class="text-center">
          <q-badge>{{ props.row.code }}</q-badge>
        </q-td>
      </template>
      <template v-slot:body-cell-action="props">
        <q-td class="text-center">
          <vs-button style="display: inline-block" flat icon primary @click="editForm(props.row)">
            <q-icon name="edit"/>
          </vs-button>
          <vs-button style="display: inline-block" flat icon success @click="permissionForm(props.row)">
            <q-icon name="security"/>
          </vs-button>
          <vs-button style="display: inline-block" flat icon danger @click="deleteModalTrue(props.row.id)">
            <q-icon name="delete"/>
          </vs-button>
        </q-td>
      </template>
    </q-table>
    <!--    Create / Edit   -->
    <vs-dialog blur prevent-close v-model="createModal">
      <template #header>
        <b v-if="create">{{ $t('management.new_role') }}</b>
        <b v-else>{{ $t('management.edit_role') }}</b>
      </template>
      <q-separator/>
      <form ref="roleForm">
        <vs-input state="primary" v-model="form.name" class="mt-3" :class="form.name == '' ? 'required' : ''" :danger="form.name == ''" block :label="$t('doc.name')" :placeholder="$t('doc.name')"></vs-input>     
      </form>
      <template #footer>
        <vs-button class="mt-2" @keyup.enter="save" block primary gradient @click="save">{{ $t('actions.save') }}</vs-button>
      </template>
    </vs-dialog>
    <!--     Permissions     -->
    <q-dialog maximized persistent transition-show="slide-up" transition-hide="slide-down" v-model="permissionModal">
      <q-card style="margin-top: 60px; padding-bottom: 60px">
        <q-toolbar class="bg-grey-8">
          <q-btn round push icon="close" class="text-red-5" v-close-popup @click="permissionIds = [], roleId = null">
            <q-tooltip class="bg-white text-primary">Close</q-tooltip>
          </q-btn>
          <q-space/>
          <vs-button success gradient @click="savePermissions">{{ $t('actions.save') }}</vs-button>
        </q-toolbar>
        <q-card-section>
          <q-card v-for="(perm, i) in permissions" :key="`item-${i}`">
            <q-list bordered padding separator>
              <q-item tag="label" v-ripple>
                <q-item-section>
                  <q-item-label>{{ $t(`permissions.${perm.name}`) }}</q-item-label>
                </q-item-section>
                <q-item-section side top>
                  <q-toggle v-model="permissionIds" :val="perm.id"/>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!--     Delete     -->
    <confirm-modal :model="deleteModal" @submit="deleteRole" @close="deleteModal = false" :text="$t('confirm_delete')"/>
  </div>
</template>

<script>
import RolesService from "./role.service";
import ConfirmModal from "../../../components/confirmModal";

export default {
  name: "index",
  components: {ConfirmModal},
  computed: {
    isChecked() {
      return false
    }
  },
  data() {
    return {
      windowWidth: window.innerWidth,
      search: '',
      createModal: false,
      permissionModal: false,
      editingItem: {},
      permissions: [{ id: 1, name: 'add user'}],
      permissionIds: [],
      roles: [{ id: 1, name: 'admin', code: 'admin' },
      {id: 2, name: 'admin', code: 'admin'}],
      roleId: '',
      form: {
        id: null,
        code: null,
        name: null
      },
      create: true,
      deleteModal: false,
      columns: [
        {name: 'id', align: 'center', label: this.$t('doc.index'), field: 'id'},
        {name: 'name', align: 'left', label: this.$t('doc.name'), field: 'name'},
        {name: 'code', align: 'center', label: this.$t('doc.code'), field: 'code'},
        {name: 'action', align: 'center', label: this.$t('doc.action'), field: 'action'}
      ]
    }
  },
  methods: {
    async getRoleList() {
      await RolesService.getRoleList().then(res => {
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
    editForm(item) {
      this.create = false
      this.form = Object.assign({}, item)
      this.createModal = true
    },
    createForm() {
      this.create = true
      this.form = {}
      this.createModal = true
    },
    save() {
      if (this.create) {
        if (this.form.name && this.form.code) {
          RolesService.createRole(this.form).then(res => {
            this.createModal = false
            this.$vs.notification({
              type:'confirm',
              duration: 1000,
              title: this.$t('success_created'),
              progress: 'auto',
              color: 'success',
              position: 'top-right'
            })
            this.getRoleList();
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
          if (!this.form.name) {
            this.$refs.roleForm[0].className += ' required'
          }
          if (!this.form.code) {
            this.$refs.roleForm[1].className += ' required'
          }
        }
      } else {
        if (this.form.name && this.form.code) {
          RolesService.updateRole(this.form.id, this.form).then(res => {
            this.createModal = false
            this.$vs.notification({
              type:'confirm',
              duration: 1000,
              title: this.$t('success_updated'),
              progress: 'auto',
              color: 'success',
              position: 'top-right'
            })
            this.getRoleList();
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
      }
    },
    permissionForm(item) {
      this.roleId = null
      this.permissionModal = true
      this.permissionIds = [1,2,3,4,5,6]
      this.permissions = [
        {id: 1, name: 'add'}
      ]
      // RolesService.getPermissionList().then(res => {
      //   this.roleId = item.id
      //   this.permissions = res.data
      //   this.permissionIds = item.permissionIds
      //   this.permissionModal = true
      // }).catch(e => {
      //   this.$vs.notification({
      //     type:'confirm',
      //     duration: 1000,
      //     title: e.message,
      //     progress: 'auto',
      //     color: 'danger',
      //     position: 'top-right'
      //   })
      // })
    },
    savePermissions() {
      RolesService.updateRolePermissionsById(this.roleId, this.permissionIds).then(res => {
        this.permissionModal = false
        this.roleId = null
        this.permissionIds = []
        this.getRoleList();
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
    },
    deleteModalTrue(id) {
      this.roleId = null
      this.deleteModal = true
      this.roleId = id
    },
    deleteRole() {
      RolesService.deleteRole(this.roleId).then(res => {
        this.deleteModal = false
        this.$vs.notification({
          type:'confirm',
          duration: 1000,
          title: this.$t('success_deleted'),
          progress: 'auto',
          color: 'success',
          position: 'top-right'
        })
        this.getRoleList();
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
  created() {
    this.getRoleList();
  }
}
</script>

<style scoped>
.table {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  border-collapse: collapse;
  width: 80%;
  margin: 0 auto;
  font-size: 18px;
  text-align: center;
}

.table td,
.table th {
  border: 1px solid #ddd;
  padding: 8px;
}

table.table tbody tr.selected {
  background-color: #f2f2f2;
}

.table tr:hover {
  background-color: #ddd !important;
}

.table th {
  padding-top: 12px;
  padding-bottom: 12px;
  text-align: left;
  background-color: #4caf50;
  color: white;
}


</style>
