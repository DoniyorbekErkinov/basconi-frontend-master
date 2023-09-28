import {ability} from '../services/ability'

const routes = [
    {
        path: '/',
        component: () => import('../layouts/MainLayout.vue'),
        children: [
            {
                name: 'Dashboard',
                path: '',
                component: () => import('../w-pages/dashboard.vue')
            },
            // <!---------            Management            ---------->
            //               Department
            {
                name: 'Management',
                path: '/management/department',
                component: () => import('../modules/management/department/index.vue'),
                meta: {
                    hasPerm: () =>  ability.can('View', 'Department')
                }
            },
            //               Roles
            {
                name: 'Roles',
                path: '/management/roles',
                component: () => import('../modules/management/roles/index.vue'),
                meta: {
                    hasPerm: () =>  ability.can('View', 'Roles')
                }
            },
            //               Users
            {
                name: 'Users',
                path: '/management/users',
                component: () => import('../modules/management/users/index.vue'),
                meta: {
                    hasPerm: () =>  ability.can('View', 'Users')
                }
            },
            //               CashBox
            {
                name: 'CashBox',
                path: '/management/cash-box',
                component: () => import('../modules/references/cashbox/index.vue'),
                meta: {
                    hasPerm: () =>  ability.can('View', 'Cashbox')
                }
            },
            // <!---------                References               ---------->
            //                Product
            {
                name: 'Product',
                path: '/references/product',
                component: () => import('../modules/references/product/index.vue'),
                meta: {
                    hasPerm: () =>  ability.can('View', 'Items')
                }
            },
            //                Category
            {
                name: 'Category',
                path: '/references/category',
                component: () => import('../modules/references/category-product/index.vue'),
                meta: {
                    hasPerm: () =>  ability.can('View', 'Category')
                }
            },
            //                Brandlar
            {
                name: 'Brands',
                path: '/references/brands',
                component: () => import('../modules/references/brand-product/index.vue'),
                meta: {
                    hasPerm: () =>  ability.can('View', 'Brands')
                }
            },
            //                Units
            // {
            //     name: 'Units',
            //     path: '/references/units',
            //     component: () => import('../modules/references/unit-product/index.vue'),
            //     meta: {
            //         hasPerm: () =>  ability.can('View', 'Units')
            //     }
            //
            // },
            //                  Colors
            {
                name: 'Colors',
                path: '/references/colors',
                component: () => import('../modules/references/color-product/index.vue'),
                meta: {
                    hasPerm: () =>  ability.can('View', 'Colors')
                }
            },
            //                  Size
            {
                name: 'Size',
                path: '/references/size',
                component: () => import('../modules/references/size-product/index.vue'),
                meta: {
                    hasPerm: () =>  ability.can('View', 'Sizes')
                }
            },
            //                  Size
            {
                name: 'Season',
                path: '/references/season',
                component: () => import('../modules/references/seasons/index.vue'),
                meta: {
                    hasPerm: () =>  ability.can('View', 'Seasons')
                }
            },
            //                  Contragent
            {
                name: 'Contragent',
                path: '/references/contragent',
                component: () => import('../modules/references/contragent/index.vue'),
                meta: {
                    hasPerm: () =>  ability.can('View', 'Contragents')
                }
            },
            //                  Payment
            {
                name: 'Payment',
                path: '/references/payment',
                component: () => import('../modules/references/payment/index.vue'),
                meta: {
                    hasPerm: () =>  ability.can('View', 'Payments')
                }
            },
            // <!---------                POS               ---------->
            //                            POST
            {
              name: 'POS',
              path: '/post/main',
              component: () => import('../modules/post/post/index'),
                meta: {
                    hasPerm: () =>  ability.can('View', 'POS')
                }
            },
            //                            RETURN GOODS
            {
                name: 'TRADES',
                path: '/post/return-goods',
                component: () => import('../modules/post/return-goods/index'),
                meta: {
                    hasPerm: () =>  ability.can('View', 'Sale')
                }
            },
            //                            SALES
            {
                name: 'TRADES',
                path: '/post/sales',
                component: () => import('../modules/post/sales/index'),
                meta: {
                    hasPerm: () =>  ability.can('View', 'Sale')
                }
            },
            {
                name: 'SaleNakladnoy',
                path: '/post/sales/z-report-view/:id',
                component: () => import('../modules/post/sales/nakladnoy'),

            },
            // <!---------                WMS               ---------->
            //                  Warehouse
            {
                name: 'Warehouse',
                path: '/wms/warehouse',
                component: () => import('../modules/wms/warehouse/index.vue'),
                meta: {
                    hasPerm: () =>  ability.can('View', 'Warehouse')
                }
            },
            //                  Income
            {
                name: 'Income',
                path: '/wms/income',
                component: () => import('../modules/wms/income/index.vue'),
                meta: {
                    hasPerm: () =>  ability.can('View', 'Incomes')
                }
            },
            //                  Income-nakladnoy
            {
                name: 'IncomeNakladnoy',
                path: '/wms/income-view/:id',
                component: () => import('../modules/wms/income/nakladnoy.vue'),
                meta: {
                    hasPerm: () =>  ability.can('View', 'Incomes')
                }
            },
            //                  Request Transfer
            {
                name: 'Request',
                path: '/wms/request',
                component: () => import('../modules/wms/request/index.vue'),
                meta: {
                    hasPerm: () =>  ability.can('View', 'Transfers')
                }
            },
            //                  Request-Transfer-nakladnoy
            {
                name: 'TransferNakladnoy',
                path: '/wms/request/request-view/:id',
                component: () => import('../modules/wms/request/nakladnoy.vue'),
                meta: {
                    hasPerm: () =>  ability.can('View', 'Transfers')
                }
            },
            //                  Transfer
            {
                name: 'Transfer',
                path: '/wms/transfer',
                component: () => import('../modules/wms/transfer/index.vue'),
                meta: {
                    hasPerm: () =>  ability.can('View', 'Transfers')
                }
            },
            //                  Transfer-nakladnoy
            {
                name: 'TransferNakladnoy',
                path: '/wms/transfer/transfer-view/:id',
                component: () => import('../modules/wms/transfer/nakladnoy.vue'),
                meta: {
                    hasPerm: () =>  ability.can('View', 'Transfers')
                }
            },
            //                  WriteOff
            {
                name: 'WriteOff',
                path: '/wms/writeOff',
                component: () => import('../modules/wms/writeOff/index.vue'),
                meta: {
                    hasPerm: () =>  ability.can('View', 'WriteOffs')
                }
            },
            //                  WriteOff-nakladnoy
            {
                name: 'WriteOffNakladnoy',
                path: '/wms/writeOff/writeOff-view/:id',
                component: () => import('../modules/wms/writeOff/nakladnoy'),
                meta: {
                    hasPerm: () =>  ability.can('View', 'WriteOffs')
                }
            },
            //                  Inventory
            {
                name: 'Inventory',
                path: '/wms/inventory',
                component: () => import('../modules/wms/inventory/index.vue'),
                meta: {
                    hasPerm: () =>  ability.can('View', 'Inventory')
                }
            }
        ]
    },

    //   Login
    {
        path: '/login',
        component: () => import('../w-pages/login.vue'),
        meta: {
            public: true,
            onlyWhenLoggedOut: true
        }
    },

    // Always leave this as last one,
    // but you can also remove it
    {
        path: '*',
        component: () => import('../w-pages/Error404.vue')
    }
]
export default routes
