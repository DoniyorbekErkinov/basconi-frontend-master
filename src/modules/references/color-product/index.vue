<template>
  <div>
    <q-table
      class="q-mx-auto shadow-10"
      bordered
      row-key="id"
      row="row"
      :data="colors"
      :columns="columns"
      :hide-pagination="true"
      :rows-per-page-options="[0]"
    >
      <template v-slot:top>
        <div class="q-table__title">{{ $t('references.color') }}</div>
        <q-space/>
        <vs-button v-if="$can('Save', 'Color')" success animation-type="rotate" @click="createForm">
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
        <q-td class="text-center">{{ props.rowIndex + 1 }}</q-td>
      </template>
      <template v-slot:body-cell-action="props">
        <q-td class="text-center">
          <vs-button v-if="$can('Update', 'Color')" style="display: inline-block" flat icon primary @click="editForm(props.row)">
            <q-icon name="edit"/>
          </vs-button>
          <vs-button v-if="$can('Delete', 'Color')" style="display: inline-block" flat icon danger @click="deleteModalTrue(props.row.id)">
            <q-icon name="delete"/>
          </vs-button>
        </q-td>
      </template>
    </q-table>

    <!--    Create / Edit   -->
    <vs-dialog blur prevent-close v-model="createModal">
      <template #header>
        <b v-if="create">{{ $t('references.new_color') }}</b>
        <b v-else>{{ $t('references.edit_color') }}</b>
      </template>
      <q-separator/>
      <validation-observer ref="categoryForm" v-slot="{}">
        <validation-provider v-slot="{valid}" rules="required" name="name">
          <vs-input
              state="primary"
              block
              class="mt-3"
              :danger="!valid"
              v-model="form.name"
              :label="$t('doc.name')"
              :placeholder="$t('doc.name')"
              :class="!valid ? 'required' : ''"
          />
        </validation-provider>
        <validation-provider v-slot="{valid}" rules="required" name="code">
          <vs-input
              state="primary"
            block
              class="mt-3"
            :danger="!valid"
            v-model="form.code"
            :label="$t('doc.code')"
            :placeholder="$t('doc.code')"
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
    <confirm-modal :model="deleteModal" @submit="deleteColor" @close="deleteModal = false" :text="$t('confirm_delete')"/>
  </div>
</template>

<script>
import ConfirmModal from "../../../components/confirmModal";
import ColorService from "./color.service";

export default {
  name: "index",
  components: {ConfirmModal},
  data() {
    return {
      colors: [],
      columns: [
        {name: 'id', align: 'center', label: this.$t('doc.index'), field: 'index'},
        {name: 'name', align: 'center', label: this.$t('doc.name'), field: 'name'},
        {name: 'code', align: 'center', label: this.$t('doc.code'), field: 'code'},
        {name: 'action', align: 'center', label: this.$t('doc.action'), field: 'action'}
      ],
      create: true,
      createModal: false,
      form: {
        name: null,
        code: null
      },
      colorId: null,
      deleteModal: false,
    }
  },
  watch: {
    'form.name': {
      handler(e) {
        this.form.code = e.toLowerCase();
      }
    }
  },
  methods: {
    getColorsLIst() {
      ColorService.getColors().then(res => {
        this.colors = res.data
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
      this.form = {}
      this.createModal = true
    },
    editForm(item) {
      this.create = false
      this.form = item
      this.createModal = true
    },
    deleteModalTrue(id) {
      this.colorId = id
      this.deleteModal = true
    },
    deleteColor() {
      ColorService.deleteColor(this.colorId).then(res => {
        this.deleteModal = false
        this.getColorsLIst();
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
    },
    save() {
      this.$refs.categoryForm.validate().then(valid => {
        if (valid) {
          if (this.create) {
            ColorService.createColor(this.form).then(res => {
              this.createModal = false
              this.getColorsLIst();
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
          } else {
            ColorService.updateColor(this.form).then(res => {
              this.createModal = false
              this.getColorsLIst();
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
          title: e.message,
          duration: 1000,
          progress: 'auto',
          color: 'danger',
          position: 'top-right'
        })
      })
    }
  },
  created() {
    this.getColorsLIst();
  },

}
</script>

<style scoped>

</style>
