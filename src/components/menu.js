import i18n from "../i18n";
import {ability} from "../services/ability";

const Menu = [

    {
        main: false,
        name: 'Dashboard',
        icon: 'mdi mdi-view-dashboard',
        to: '/'
    },
    {
      main: true,
      name: i18n.t('post.title'),
      icon: 'mdi mdi-cart',
      children: [
          {
              name: i18n.t('post.sub_title'),
              icon: 'mdi mdi-home',
              to: '/post/main',
              hasPerm: () => ability.can('View', 'POS')
          },
          {
              name: i18n.t('post.return'),
              icon: 'mdi mdi-home-import-outline',
              to: '/post/return-goods',
              hasPerm: () => ability.can('View', 'Sale')
          },
          {
              name: i18n.t('post.sales'),
              icon: 'mdi mdi-cart',
              to: '/post/sales',
              hasPerm: () => ability.can('View', 'Sale')
          }
      ]
    },
    {
        main: true,
        name: i18n.t('wms.title'),
        icon: 'mdi mdi-home',
        children: [
            {
                name: i18n.t('wms.warehouse.title'),
                icon: 'mdi mdi-home',
                to: '/wms/warehouse',
                hasPerm: () => ability.can('View', 'Warehouse')
            },
            {
                name: i18n.t('wms.income.title'),
                icon: 'mdi mdi-home-import-outline',
                to: '/wms/income',
                hasPerm: () => ability.can('View', 'Incomes')
            },
            {
                name: i18n.t('wms.request.title'),
                icon: 'mdi mdi-account-arrow-left',
                to: '/wms/request',
                hasPerm: () => ability.can('View', 'Transfers')
            },
            {
                name: i18n.t('wms.transfer.title'),
                icon: 'mdi mdi-home-export-outline',
                to: '/wms/transfer',
                hasPerm: () => ability.can('View', 'Transfers')
            },
            {
                name: i18n.t('wms.write_off.title'),
                icon: 'mdi mdi-home-minus-outline',
                to: '/wms/writeOff',
                hasPerm: () => ability.can('View', 'WriteOffs')
            },
            // {
            //     name: i18n.t('wms.inventory.title'),
            //     icon: 'mdi mdi-home-edit-outline',
            //     to: '/wms/inventory',
            //     hasPerm: () => ability.can('View', 'Inventory')
            // },
        ]
    },
    {
        main: true,
        name: i18n.t('management.title'),
        icon: 'mdi mdi-account-cog',
        hasPerm: () => ability.can('View', 'Control'),
        children: [
            {
                name: i18n.t('management.department'),
                icon: 'mdi mdi-domain',
                to: '/management/department',
                hasPerm: () => ability.can('View', 'Department')
            },
            {
                name: i18n.t('management.users'),
                icon: 'mdi mdi-briefcase-account',
                to: '/management/users',
                hasPerm: () => ability.can('View', 'Users')
            },
            {
                name: i18n.t('management.roles'),
                icon: 'mdi mdi-account-check',
                to: '/management/roles',
                hasPerm: () => ability.can('View', 'Roles')
            },
            {
                name: i18n.t('management.cash_box'),
                icon: 'mdi mdi-account-cash-outline',
                to: '/management/cash-box',
                hasPerm: () => ability.can('View', 'Cashbox')
            }
        ]
    },
    {
        main: true,
        name: i18n.t('references.title'),
        icon: 'mdi mdi-information',
        children: [
            {
                name: i18n.t('references.product'),
                icon: 'mdi mdi-tag-multiple',
                to: '/references/product',
                hasPerm: () => ability.can('View', 'Items')
            },
            {
                name: i18n.t('references.category_product'),
                icon: 'mdi mdi-information-outline',
                to: '/references/category',
                hasPerm: () => ability.can('View', 'Category')
            },
            {
                name: i18n.t('references.brand'),
                icon: 'mdi mdi-information-outline',
                to: '/references/brands',
                hasPerm: () => ability.can('View', 'Brands')
            },
            // {
            //     name: i18n.t('references.unit'),
            //     icon: 'mdi mdi-information-outline',
            //     to: '/references/units',
            //     hasPerm: () => ability.can('View', 'Units')
            // },
            {
                name: i18n.t('references.size'),
                icon: 'mdi mdi-information-outline',
                to: '/references/size',
                hasPerm: () => ability.can('View', 'Sizes')
            },
            {
                name: i18n.t('references.color'),
                icon: 'mdi mdi-information-outline',
                to: '/references/colors',
                hasPerm: () => ability.can('View', 'Colors')
            },
            {
                name: i18n.t('references.seasons'),
                icon: 'mdi mdi-information-outline',
                to: '/references/season',
                hasPerm: () => ability.can('View', 'Seasons')
            },
            {
                name: i18n.t('references.contragent'),
                icon: 'mdi mdi-account-group',
                to: '/references/contragent',
                hasPerm: () => ability.can('View', 'Contragents')
            },
            {
                name: i18n.t('references.payment'),
                icon: 'mdi mdi-cash-multiple',
                to: '/references/payment',
                hasPerm: () => ability.can('View', 'Payments')
            }
        ]
    }

]

export default Menu
