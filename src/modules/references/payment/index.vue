<template>
<div>
  <q-table
    class="q-mx-auto shadow-10"
    bordered
    row-key="id"
    row="row"
    :data="paymentList"
    :columns="columns"
    :hide-pagination="true"
    :rows-per-page-options="[0]"
  >
    <template v-slot:top>
      <div class="q-table__title">{{ $t('references.payment') }}</div>
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
  </q-table>
  <!--    Create / Edit   -->
  <vs-dialog blur prevent-close v-model="createModal">
    <template #header>
      <b v-if="create">{{ $t('references.new_payment_type') }}</b>
      <b v-else>{{ $t('references.edit_payment_type') }}</b>
    </template>
    <q-separator/>
    <validation-observer ref="paymentForm" v-slot="{}">
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
    </validation-observer>
    <template #footer>
      <vs-button @keyup.enter="save" class="mt-2" block primary gradient @click="save">{{ $t('actions.save') }}</vs-button>
    </template>
  </vs-dialog>
</div>
</template>

<script>
import PaymentService from "./payment.service";

export default {
  name: "index",
  data() {
    return {
      paymentList: [],
      columns: [
        {name: 'id', align: 'center', label: this.$t('doc.index'), field: 'index'},
        {name: 'name', align: 'center', label: this.$t('doc.name'), field: 'name'},
        // {name: 'action', align: 'center', label: this.$t('doc.action'), field: 'action'}
      ],
      create: true,
      createModal: false,
      form: {
        name: null,
      },
    }
  },
  methods: {
    getPaymentList() {
      PaymentService.getPaymentList().then(res => {
        this.paymentList = res.data
      })
    },
    createForm() {
      this.create = true
      this.form = {}
      this.createModal = true
    },
    save() {
      this.$refs.paymentForm.validate().then(valid => {
        if(valid) {
          if(this.create) {
            PaymentService.savePayment(this.form).then(res => {
              this.createModal = false
              this.getPaymentList()
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
            PaymentService.updatePayment(this.form).then(res => {
              this.createModal = false
              this.getPaymentList()
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
          type:'confirm',
          title: e.message,
          duration: 1000,
          progress: 'auto',
          color: 'danger',
          position: 'top-right'
        })
      })
    },
  },
  created() {
    this.getPaymentList()
  }
}
</script>

<style scoped>

</style>