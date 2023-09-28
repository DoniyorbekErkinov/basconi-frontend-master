<template>
  <div>
    <q-table
        class="q-mx-auto shadow-10"
        bordered
        row-key="id"
        row="row"
        :data="sizes"
        :columns="columns"
        :hide-pagination="true"
        :rows-per-page-options="[0]"
    >
      <template v-slot:top>
        <div class="q-table__title">{{ $t('references.size') }}</div>
        <q-space/>
        <vs-button v-if="$can('Save', 'Size')"  success animation-type="rotate" @click="createForm">
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
      <template v-slot:body-cell-id="props">
        <q-td class="text-center">{{ props.rowIndex+1 }}</q-td>
      </template>
      <template v-slot:body-cell-action="props">
        <q-td

        class="text-center">
          <vs-button v-if="$can('Update', 'Size')" style="display: inline-block" flat icon primary @click="editForm(props.row)">
            <q-icon name="edit"/>
          </vs-button>
          <vs-button v-if="$can('Delete', 'Size')" style="display: inline-block" flat icon danger @click="deleteModalTrue(props.row.id)">
            <q-icon name="delete"/>
          </vs-button>
        </q-td>
      </template>
    </q-table>

    <!--    Create / Edit   -->
    <vs-dialog blur prevent-close v-model="createModal">
      <template #header>
        <b v-if="create">{{ $t('references.new_size') }}</b>
        <b v-else>{{ $t('references.edit_size') }}</b>
      </template>
      <q-separator/>
      <validation-observer ref="categoryForm" v-slot="{}">
        <validation-provider v-slot="{valid}" rules="required" name="name">
          <vs-input
            block
            primary
            class="mt-3"
            :danger="!valid"
            v-model="form.olcham"
            :label="$t('doc.name')"
            :placeholder="$t('doc.name')"
            :class="!valid ? 'required' : ''"
            @keyup.enter="save"
          />
        </validation-provider>
      </validation-observer>
      <template #footer>
        <vs-button @keyup.enter="save" class="mt-2" block primary gradient @click="save">{{ $t('actions.save') }}</vs-button>
      </template>
    </vs-dialog>

    <!--     Delete     -->
    <confirm-modal :model="deleteModal" @submit="deleteSize" @close="deleteModal = false" :text="$t('confirm_delete')"/>
  </div>
</template>

<script>
import ConfirmModal from "../../../components/confirmModal";
import SizeService from "./size.service";




export default {
  name: "index",
  components: {ConfirmModal},
  data() {
    return {
      sizes: [],
      columns: [
        {name: 'id', align: 'center', label: this.$t('doc.index'), field: 'index'},
        {name: 'name', align: 'center', label: this.$t('doc.name'), field: 'olcham'},
        // {name: 'code', align: 'center', label: this.$t('doc.code'), field: 'code'},
        {name: 'action', align: 'center', label: this.$t('doc.action'), field: 'action'}
      ],
      create: true,
      createModal: false,
      form: {},
      categoryId: null,
      deleteModal: false,
    }
  },
  watch: {},
  methods: {
    getSizesList() {
      SizeService.getSizes().then(res => {
        this.sizes = res.data
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
    createForm() {
      this.create = true
      this.form = {}
      this.createModal = true
    },
    editForm(item) {
      this.create = false
      this.form = item
      this.createModal = true
    },
    deleteModalTrue(id) {
      this.categoryId = id
      this.deleteModal = true
    },
    deleteSize() {
      SizeService.deleteSize(this.categoryId).then(res => {
        this.deleteModal = false
        this.getSizesList();
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
    save() {
      this.$refs.categoryForm.validate().then(valid => {
        if (valid) {
          if (this.create) {
            SizeService.createSize(this.form).then(res => {
              this.createModal = false
              this.getSizesList();
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
            SizeService.updateSize(this.form).then(res => {
              this.createModal = false
              this.getSizesList();
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
        } else {
          this.$vs.notification({
            title: this.$t('required_error'),
            progress: 'auto',
            duration: 1000,
            color: 'danger',
            position: 'top-right'
          })
        }
      }).catch(e => {
        this.$vs.notification({
          title: e.message,
          progress: 'auto',
          duration: 1000,
          color: 'danger',
          position: 'top-right'
        })
      })
    }
  },
  created() {
    this.getSizesList();
  }
}
</script>

<style scoped>

</style>
