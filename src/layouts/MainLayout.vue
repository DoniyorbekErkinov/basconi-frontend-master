<template>
  <div>
    <q-layout view="lhh LpR lff" class="shadow-2 rounded-borders">
      <!---                  Navbar                -->
      <vs-navbar v-if="!horizontalSidebar" v-model="active" class="dontprint" shadow dark text-white fixed>
        <template #left>
          <vs-button
              v-if="!activeSidebar"
              animation-type="rotate"
              icon active floating dark transparent
              style="margin-top: 10px; color: white"
              @click="activeSidebar = !activeSidebar"
          >
            <i class='mdi mdi-menu'/>
            <template #animate>
              <i class='mdi mdi-menu'/>
            </template>
          </vs-button>
          <div v-if="reduce && activeSidebar || hoverSidebar && activeSidebar" style="margin-left: 50px">{{ active }}</div>
          <div v-else>{{ active }}</div>
        </template>
        <template #right>
          <vs-tooltip bottom shadow not-hover v-model="menuLanguage">
            <vs-button animation-type="scale" icon border @click="menuLanguage=!menuLanguage">
              <img v-if="lan == 'ru'" style="width: 25px" src="@/assets/ru.png" alt="">
              <img v-else style="width: 25px" src="@/assets/uz.png" alt="">
              <template #animate >
                <i v-if="!menuLanguage" class="mdi mdi-arrow-down"/>
                <i v-else class="mdi mdi-arrow-up"/>
              </template>
            </vs-button>
            <template #tooltip>
              <vs-button block transparent gradient border v-for="(entry, i) in languages" :key="`languages-${i}`" :value="entry" @click="setLanguage(entry.language, entry.title, entry.flag)"  :active="entry.language == lan">
                <img class="flag" :src="`${entry.flag}`" alt=""> {{ entry.title }}
              </vs-button>
            </template>
          </vs-tooltip>
          <vs-tooltip bottom shadow not-hover v-model="menuAccount">
            <vs-button animation-type="scale" icon border @click="menuAccount=!menuAccount">
              <i class="mdi mdi-account"/>
              <template #animate >
                <i v-if="!menuAccount" class="mdi mdi-arrow-down"/>
                <i v-else class="mdi mdi-arrow-up"/>
              </template>
            </vs-button>
            <template #tooltip>
              <vs-button block color="success" border @click="getProfileInfo">
                <i class="mdi mdi-account mr-1"/> {{ username }}
              </vs-button>
              <vs-button block color="warn" border @click="openPasswordModal">
                <i class="mdi mdi-lock"/> Password
              </vs-button>
              <vs-button block color="danger" upload border @click="logout">
                <i class="mdi mdi-logout mr-1"/> {{ $t('actions.logout') }}
              </vs-button>
            </template>
          </vs-tooltip>
        </template>
      </vs-navbar>
      <vs-navbar v-else v-model="active" class="dontprint" shadow dark text-white fixed>
        <template #left>
          <img src="../assets/navbarImg.png" alt="" width="150">
        </template>
        <div v-for="(menu, index) in menus" :key="`menus-${index}`">
          <div v-if="menu.children">
            <vs-navbar-group>
              <i :class="menu.icon"/> {{ menu.name }}
              <template #items>
                <vs-navbar-item v-for="(m, i) in menu.children" :key="`menu.children-${i}`" :active="active === m.name" :id="m.name" :to="m.to">
                  <i :class="m.icon"/> {{ m.name }}
                </vs-navbar-item>
              </template>
            </vs-navbar-group>
          </div>
          <div v-else>
            <vs-navbar-item :active="active === menu.name" :id="menu.name" :to="menu.to">
              <i :class="menu.icon"/> {{ menu.name }}
            </vs-navbar-item>
          </div>
        </div>
        <template #right>
          <vs-tooltip bottom shadow not-hover v-model="menuLanguage">
            <vs-button animation-type="scale" icon border @click="menuLanguage=!menuLanguage">
              <img v-if="lan == 'ru'" style="width: 25px" src="@/assets/ru.png" alt="">
              <img v-else style="width: 25px" src="@/assets/uz.png" alt="">
              <template #animate >
                <i v-if="!menuLanguage" class="mdi mdi-arrow-down"/>
                <i v-else class="mdi mdi-arrow-up"/>
              </template>
            </vs-button>
            <template #tooltip>
              <vs-button block transparent gradient border v-for="(entry, i) in languages" :key="i" :value="entry" @click="setLanguage(entry.language, entry.title, entry.flag)" :active="entry.language == lan">
                 <img class="flag" :src="`${entry.flag}`" alt=""> {{ entry.title }}
              </vs-button>
            </template>
          </vs-tooltip>
          <vs-tooltip bottom shadow not-hover v-model="menuAccount">
            <vs-button animation-type="scale" icon border @click="menuAccount=!menuAccount">
              <i class="mdi mdi-account"/>
              <template #animate >
                <i v-if="!menuAccount" class="mdi mdi-arrow-down"/>
                <i v-else class="mdi mdi-arrow-up"/>
              </template>
            </vs-button>
            <template #tooltip>
              <vs-button block color="success" border @click="getProfileInfo">
                <i class="mdi mdi-account mr-1"/> {{ username }}
              </vs-button>
              <vs-button block color="warn" border @click="openPasswordModal">
                <i class="mdi mdi-lock"/> Password
              </vs-button>
              <vs-button block color="danger" upload border @click="logout">
                <i class="mdi mdi-logout mr-1"/> {{ $t('actions.logout') }}
              </vs-button>
            </template>
          </vs-tooltip>
        </template>
      </vs-navbar>

      <!---                  Left-Sidebar                -->
      <vs-sidebar
        active
        v-model="active"
        :reduce="reduce"
        class="dontprint"
        :open.sync="activeSidebar"
        :hover-expand="hoverSidebar"
      >
        <!--                  ...img logo                      -->
        <template #logo>
          <img v-if="reduce || hoverSidebar" src="../assets/dwPosLog.png" alt="">
          <img v-else src="../assets/DwPos.png" alt="">
        </template>
        <div v-for="(menu, index) in menus" :key="`menus-${index}`" @mousemove="mouseMove" @mouseleave="mouseLeave">
          <vs-sidebar-group v-if="menu.main">
            <template #header>
              <vs-sidebar-item arrow >
                <template #icon>
                  <i :class='menu.icon'/>
                </template>
                {{ menu.name }}
              </vs-sidebar-item>
            </template>
            <vs-sidebar-item v-for="item in menu.children"  :key="item.id" :id="item.name" :to="item.to"   @mousemove="mouseMove" @mouseleave="mouseLeave">
              <div @click="closeSideBar">
                <i :class='item.icon'/>
                {{ item.name }}
              </div>
            </vs-sidebar-item>
          </vs-sidebar-group>
          <vs-sidebar-item v-else  :id="menu.name" :to="menu.to">
            <template #icon>
              <i :class='menu.icon'/>
            </template>
            {{ menu.name }}
          </vs-sidebar-item>
        </div>
        <template #footer>
          <vs-row v-if="windowWidth > 600" justify="space-between">
            <vs-avatar v-if="!hoverSidebar && !reduce" @click="hoverSide">
              <div style="font-size: 20px" class="mdi mdi-arrow-left"/>
            </vs-avatar>
            <vs-avatar v-if="!reduce && !hoverSidebar" @click="reduceSide">
              <div style="font-size: 20px" class="mdi mdi-arrow-left"/>
            </vs-avatar>
            <vs-avatar v-if="hoverSidebar || reduce" @click="falseAllActivities">
              <div style="font-size: 20px" class="mdi mdi-arrow-right"/>
            </vs-avatar>
          </vs-row>
        </template>
      </vs-sidebar>

      <!---                  Right-Sidebar                -->
      <vs-sidebar :open.sync="settingsSidebar" class="dontprint" active square right>
        <!--                  ...img logo                      -->
        <template #logo>
          <q-spinner-gears size="50"/>
          <p class="text-h6"><b>{{ $t('settings') }}</b></p>
        </template>
        <q-list>
          <q-separator/>
          <q-item-label caption class="mt-1">Menus</q-item-label>
          <q-item tag="label" v-ripple style="width: 100%" >
            <q-item-section side>
              <q-icon name="menu"/>
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ $t('menu') }} : </q-item-label>
            </q-item-section>
            <q-item-section side>
              <vs-switch v-model="horizontalSidebar" @click="windowReload">
                <template #off>
                  {{ $t('horizontal') }}
                </template>
                <template #on>
                  {{ $t('vertical') }}
                </template>
              </vs-switch>
            </q-item-section>
          </q-item>
          <q-item tag="label" v-ripple style="width: 100%" class="mt-2">
            <q-item-section side>
              <q-icon name="menu"/>
            </q-item-section>
            <q-item-section>
              <q-item-label>HOVERED : </q-item-label>
            </q-item-section>
            <q-item-section side>
              <vs-switch v-model="hoverSidebar" success>
                <template #off>
                  <i class='mdi mdi-close'/>
                </template>
                <template #on>
                  <i class='mdi mdi-check'/>
                </template>
              </vs-switch>
            </q-item-section>
          </q-item>
          <q-item tag="label" v-ripple style="width: 100%" class="mt-2">
            <q-item-section side>
              <q-icon name="menu"/>
            </q-item-section>
            <q-item-section>
              <q-item-label>REDUCE : </q-item-label>
            </q-item-section>
            <q-item-section side>
              <vs-switch v-model="reduce" color="#7d33ff">
                <template #off>
                  <i class='mdi mdi-close'/>
                </template>
                <template #on>
                  <i class='mdi mdi-check'/>
                </template>
              </vs-switch>
            </q-item-section>
          </q-item>
          <q-item tag="label" v-ripple style="width: 100%" class="mt-2">
            <q-item-section side>
              <q-icon name="menu"/>
            </q-item-section>
            <q-item-section>
              <q-item-label>ACTIVE : </q-item-label>
            </q-item-section>
            <q-item-section side>
              <vs-switch v-model="activeSidebar" dark>
                <template #off>
                  <i class='mdi mdi-close'/>
                </template>
                <template #on>
                  <i class='mdi mdi-check'/>
                </template>
              </vs-switch>
            </q-item-section>
          </q-item>
          <q-separator spaced />
          <q-item-label class="mt-2" header>Navbar</q-item-label>
          <q-item tag="span" v-ripple style="width: 100%">
            <q-item-section side>
              <q-icon name="palette"/>
            </q-item-section>
            <q-item-section>
              <vs-button dark circle/>
            </q-item-section>
            <q-item-section>
              <vs-button primary circle/>
            </q-item-section>
            <q-item-section>
              <vs-button danger circle/>
            </q-item-section>
            <q-item-section>
              <vs-button success circle/>
            </q-item-section>
            <q-item-section>
              <vs-button warn circle/>
            </q-item-section>
          </q-item>
          <q-item tag="span" v-ripple style="width: 100%">
            <q-item-section side>
              <q-icon name="palette"/>
            </q-item-section>
            <q-item-section>
              <vs-button color="#666666" circle/>
            </q-item-section>
            <q-item-section>
              <vs-button color="#36bce0" circle/>
            </q-item-section>
            <q-item-section>
              <vs-button color="#ec6262" circle/>
            </q-item-section>
            <q-item-section>
              <vs-button color="#45e0a2" circle/>
            </q-item-section>
            <q-item-section>
              <vs-button color="#d4d254" circle/>
            </q-item-section>
          </q-item>
        </q-list>
        <template #footer></template>
      </vs-sidebar>
      <!---                  Page Container                -->
      <q-page-container>
        <q-page>
          <div v-if="windowWidth > 600">
            <q-card v-if="reduce && activeSidebar || hoverSidebar && activeSidebar" flat style="margin: 70px 5px 0 55px; border: 5px solid #2c3e50; border-radius: 20px; padding: 8px">
<!--              <transition-->
<!--                  appear-->
<!--                  enter-active-class="animate__animated animate__slideInRight"-->
<!--                  leave-active-class="animate__animated animate__slideOutLeft"-->
<!--              >-->
                <router-view/>
<!--              </transition>-->
              <q-inner-loading :showing="visible" color="white" style="border: 5px solid #ffffff; border-radius: 20px"/>
            </q-card>
            <q-card v-else flat style="margin: 70px 5px 0 5px; border: 5px solid #2c3e50; border-radius: 20px; padding: 8px">
              <q-card-section>
<!--                <transition-->
<!--                    appear-->
<!--                    enter-active-class="animate__animated animate__slideInRight"-->
<!--                    leave-active-class="animate__animated animate__slideOutLeft"-->
<!--                >-->
                  <router-view/>
<!--                </transition>-->
              </q-card-section>
            </q-card>
          </div>
          <div v-else>
            <q-card flat style="margin: 65px 3px 0 3px; border: 4px solid #2c3e50; border-radius: 20px">
              <q-card-section>
<!--                <transition-->
<!--                    appear-->
<!--                    enter-active-class="animate__animated animate__slideInRight"-->
<!--                    leave-active-class="animate__animated animate__slideOutLeft"-->
<!--                >-->
                  <router-view/>
<!--                </transition>-->
              </q-card-section>
            </q-card>
          </div>
          <q-page-sticky v-if="windowWidth > 600" position="right" :offset="[1, 1]">
            <vs-button dark @click="settingsSidebar = !settingsSidebar">
              <q-spinner-gears size="2em"/>
            </vs-button>
          </q-page-sticky>
          <q-page-scroller position="bottom-right" :scroll-offset="50" :offset="[18, 18]">
            <img src="../assets/arrow-up.png" width="40" style="cursor: pointer">
          </q-page-scroller>
        </q-page>
      </q-page-container>
    </q-layout>
    <!--                     Profile                     -->
    <vs-dialog v-model="profileModal" blur prevent-close >
      <template #header>
        <b style="font-size: 16px; margin-bottom: -15px; letter-spacing: 2px;">{{ $t('profile') }}</b>
        <vs-button v-if="!viewProfile" @click="viewProfile = true" style="position: absolute; right: 150px; top: 4px" danger gradient>{{ $t('actions.cancel') }}</vs-button>
      </template>
      <q-separator/>
       <q-list bordered separator>
        <q-item>
          <q-item-section>
            <q-item-label overline>{{ $t('management.username') }}</q-item-label>
            <q-item-label class="mt-1"><b style="font-size: 16px; letter-spacing: 2px;">{{ userInfo.username }}</b></q-item-label>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <q-item-label overline>{{$t('doc.department')}}</q-item-label>
            <q-item-label class="mt-1"><b style="font-size: 16px; letter-spacing: 2px;">{{userInfo.departmentName}}</b></q-item-label>
          </q-item-section>
        </q-item>
        <q-item>
           <q-item-section>
            <q-item-label overline>{{$t('doc.phone_number')}}</q-item-label>
            <q-item-label class="mt-1"><b style="font-size: 16px; letter-spacing: 2px;">{{userInfo.phoneNumber}}</b></q-item-label>
          </q-item-section>
        </q-item>
    </q-list>
    </vs-dialog>
    <!--                     Update Password                     -->
    <vs-dialog v-model="updatePasswordModal" blur prevent-close w="4" h="8">
      <template #header>
        <h1 style="margin-bottom: -15px; margin-top: -5px" class="text-h6">Parolni Tahrirlash</h1>
      </template>
      <q-separator/>
      <validation-observer ref="userForm" v-slot="{}">
        <validation-provider style="position: relative; width: 80%;" v-slot="{valid}" rules="required" name="password">
          <vs-row align="center" justify="center">
            <vs-col w="8">
              <div class="mt-1" style="text-align: left">{{ $t('management.repeat_password') }}</div>
              <vs-input
                  state="primary"
                block
                :danger="!valid"
                v-model="userPassword"
                :class="!valid ? 'required' : ''"
              />
            </vs-col>
          </vs-row>
        </validation-provider>
        <validation-provider v-slot="{valid}" rules="required" name="password">
          <vs-row align="center" justify="center">
            <vs-col w="8">
              <div class="mt-1" style="text-align: left">{{ $t('management.password') }}</div>
              <vs-input
                  state="primary"
                :type="!formUser.isPassword ? 'password' : 'text'"
                block
                :danger="!valid"
                v-model="formUser.password"
                :class="!valid ? 'required' : ''"
              >
                <template #icon>
                  <i class='mdi mdi-lock'></i>
                </template>
              </vs-input>
              <vs-button @click="formUser.isPassword = !formUser.isPassword" shadow class="text-dark" style="position: absolute; top: 25px; right: -5px; height: 39px">
                <i style="font-size: 17px" :class="!formUser.isPassword ? 'mdi mdi-eye-off' : 'mdi mdi-eye'"/>
              </vs-button>
            </vs-col>
          </vs-row>
        </validation-provider>
        <validation-provider v-slot="{valid}" rules="required" name="rePassword">
         <vs-row align="center" justify="center" >
           <vs-col w="8">
             <div class="mt-1" style="text-align: left">{{ $t('management.repeat_password') }}</div>
             <vs-input
                 state="primary"
                :type="!formUser.isPassword2 ? 'password' : 'text'"
                block
                :danger="!valid"
                v-model="formUser.rePassword"
                :class="!valid ? 'required' : ''"
              >
              <template #icon>
                <i class='mdi mdi-lock'></i>
              </template>
              </vs-input>
              <vs-button @click="formUser.isPassword2 = !formUser.isPassword2" shadow class="text-dark" style="position: absolute; top: 28px; right: -5px; height: 39px">
                <i :class="!formUser.isPassword2 ? 'mdi mdi-eye-off' : 'mdi mdi-eye'"/>
              </vs-button>
           </vs-col>
         </vs-row>
        </validation-provider>
      </validation-observer>
      <template #footer>
        <vs-button class="mt-2" block primary gradient @click="updatePassword">{{ $t('actions.save') }}</vs-button>
      </template>
    </vs-dialog>
  </div>
</template>

<script>
import 'animate.css';
import AuthService from "../services/auth.service";
import UsersService from "../modules/management/users/users.service";
import {TokenService} from "../services/storage.service";
import Menu from "../components/menu.js"
import i18n from '../i18n';
function copy (o) {
    return Object.assign({}, o)
}
export default {
  name: "MainLayout",
  data: () => ({
    active: '',
    windowWidth: window.innerWidth,
    visible: false,
    settingsSidebar: false,
    reduce: false,
    hoverSidebar: false,
    activeSidebar: false,
    horizontalSidebar: false,
    menuAccount: false,
    menuLanguage: false,
    menu: false,
    profileModal: false,
    updatePasswordModal: false,
    formUser: {
      password: '',
      rePassword: '',
      isPassword: false,
      isPassword2: false,
    },
    userPassword: null,
    userInfo: {},
    editUserForm: {},
    depList: [],
    viewProfile: true,
    languages: [
        {
          flag: require("@/assets/uz.png"),
          language: "lt",
          title: "O'ZB",
        },
        {
          flag: require("@/assets/uz.png"),
          language: "uz",
          title: "ЎЗБ",
        },
        {
          flag: require("@/assets/ru.png"),
          language: "ru",
          title: "РУ",
        }
      ],
      flag: null,
      lan: i18n.locale
  }),
  methods: {
    closeSideBar() {
      this.activeSidebar = false
    },
     setLanguage(locale,  flag) {
      this.languages.flag = flag;
      TokenService.setLocale(locale);
      this.windowReload();
    },
    windowReload() {
      window.location.reload();
    },
    hoverSide() {
      if (this.windowWidth > 600) {
        this.hoverSidebar = true
        this.activeSidebar = true
      }
    },
    reduceSide() {
      if (this.windowWidth > 600) {
        this.reduce = true
        this.activeSidebar = true
      }
    },
    mouseMove() {
      if (this.reduce) {
        this.visible = true
      }
    },
    mouseLeave() {
      if (this.reduce) {
        this.visible = false
      }
    },
    falseAllActivities() {
      if (this.reduce) {
        this.reduce = false
        this.activeSidebar = true
      } else {
        this.hoverSidebar = false
        this.activeSidebar = true
      }
    },
    async logout() {
      this.menuAccount = false
      await AuthService.logout()
      await this.$router.push('/login')
    },
    getProfileInfo() {
      this.profileModal = true
      let user = TokenService.getUserInfo()
      UsersService.getUsersById(user.id).then(res => {
        this.userInfo = res.data
        this.userInfo.departmentId = `${this.userInfo.departmentId}`
      }).catch(e => {
        this.$vs.notification({
          type:'confirm',
          title: e.message,
          progress: 'auto',
          color: 'danger',
          position: 'top-right'
        })
      })
    },
    openPasswordModal() {
      this.updatePasswordModal = true
    },
    updatePassword() {
      this.$refs.userForm.validate().then(valid => {
        if(valid) {
          if (this.formUser.password === this.formUser.rePassword) {
            let data = {
              currentPassword: this.userPassword,
              newPassword: this.formUser.password
            }
            UsersService.updateUserPassword(data).then(res => {
              AuthService.logout();
              this.updatePasswordModal = false
            }).catch(e => {
              this.$vs.notification({
                type:'confirm',
                title: e.message,
                progress: 'auto',
                color: 'danger',
                position: 'top-right'
              })
            })
          } else {
            this.$vs.notification({
              type:'confirm',
              title: 'Parollar mos emas',
              progress: 'auto',
              color: 'warn',
              position: 'top-right'
            })
          }
        }
      }).catch(e => {
        this.$vs.notification({
          type:'confirm',
          title: e.message,
          progress: 'auto',
          color: 'danger',
          position: 'top-right'
        })
      })
    }
  },
  computed: {
    menus() {
      return [
          ...Menu
      ].map((copy)).filter(function f (o) {
          if ('hasPerm' in o) {
              if (o.hasPerm()) {
                  if (o.children) {
                      o.children = o.children.map(copy).filter(f)
                      return o.children.length
                  } else {
                      return true
                  }
              } else {
                  return false
              }
          } else {
              if (o.children) {
                  o.children = o.children.map(copy).filter(f)
                  return o.children.length
              } else {
                  return true
              }
          }
      })
    },
    username() {
      let userInfo = JSON.parse(localStorage.getItem('user_info'))
      return userInfo.username
    }
  },
  watch: {
    'horizontalSidebar': {
      handler(e) {
        if (e) {
          this.horizontalSidebar = true
          TokenService.setSidebarHorizontal(true)
        } else {
          this.horizontalSidebar = false
          TokenService.setSidebarHorizontal(false)
        }
      }
    }
  },
  created() {
    if (TokenService.getSidebarHorizontal() == undefined) {
      if (window.innerWidth > 600) {
        this.horizontalSidebar = true
        TokenService.setSidebarHorizontal(true)
      } else {
        this.horizontalSidebar = false
        TokenService.setSidebarHorizontal(false)
      }
    } else {
      this.horizontalSidebar = JSON.parse(TokenService.getSidebarHorizontal())
    }
    this.menus.forEach(menu => {
      if (menu.main) {
        menu.children.forEach(m => {
          if (this.$route.fullPath === m.to) {
            this.active = m.name
          }
        })
      } else {
        if (this.$route.fullPath === menu.to) {
          this.active = menu.name
        }
      }
    })
  }
}
</script>

<style scoped>

.flag{
  margin-right: 5px;
  width: 15px;
  height: 15px;
}

@media print {
  .dontprint {
    display: none;
  }
}

</style>
