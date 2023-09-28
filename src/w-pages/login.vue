<template>
  <div class="index">
    <div id="indexLizi" style="background-color: #253953 !important;"/>
    <div :class="marginTop">
      <vs-row>
        <vs-col>
          <img width="40%" src="../assets/DwPos.png" alt="">
        </vs-col>
      </vs-row>
      <validation-observer ref="loginForm" v-slot="{}">
        <vs-row class="mt-5" align="center" justify="center">
          <vs-col :w="windowWidth > 800 ? '6' : (windowWidth <= 800 && windowWidth > 600) ? '7' :  (windowWidth <= 600 && windowWidth > 400) ? '9' : '11'">
            <validation-provider v-slot="{valid}" rules="required" name="username">
              <vs-input state="primary" v-model="form.username" :danger="!valid" block primary :class="!valid ? 'required' : ''" :placeholder="$t('doc.username')">
                <template #icon>
                  <i class="mdi mdi-account"/>
                </template>
              </vs-input>
            </validation-provider>
          </vs-col>
        </vs-row>
        <vs-row class="mt-3" align="center" justify="center">
          <vs-col :w="windowWidth > 800 ? '6' : (windowWidth <= 800 && windowWidth > 600) ? '7' :  (windowWidth <= 600 && windowWidth > 400) ? '9' : '11'">
            <validation-provider v-slot="{valid}" rules="required" name="password">
              <vs-input state="primary" @keyup.enter="login" v-model="form.password" :type="isPassword ? 'password' : 'text'" :danger="!valid" block primary :class="!valid ? 'required' : ''" :placeholder="$t('management.password')">
                <template #icon>
                  <i class="mdi mdi-lock"/>
                </template>
              </vs-input>
              <vs-button @click="isPassword = !isPassword" shadow class="text-dark" style="position: absolute; top: -5px; right: -5px; height: 39px">
                <i style="font-size: 17px" :class="isPassword ? 'mdi mdi-eye-off' : 'mdi mdi-eye'"/>
              </vs-button>
            </validation-provider>
          </vs-col>
        </vs-row>
        <vs-row class="mt-2" align="center" justify="center">
          <vs-button gradient @click="login">
            <i class="mdi mdi-lock mr-1"/> {{ $t('actions.login') }}
            <template #animate>
              <i class='mdi mdi-lock-open-variant mr-1'></i> {{ $t('actions.login') }}
            </template>
          </vs-button>
        </vs-row>
      </validation-observer>
    </div>
  </div>
</template>

<script>
import THREE from "./three/three";
import AuthService from "../services/auth.service";
import { mapActions } from "vuex";

export default {
  name: "login",
  data() {
    return {
      windowWidth: window.innerWidth,
      form: {
        username: '',
        password: ''
      },
      isPassword: true
    }
  },
  computed: {
    marginTop() {
      if (this.windowWidth > 800) {
        return 'mt5'
      } else if (this.windowWidth <= 800 && this.windowWidth > 600) {
        return 'mt10'
      } else if (this.windowWidth <= 600 && this.windowWidth > 400) {
        return 'mt15'
      } else {
        return 'mt20'
      }
    }
  },
  methods: {
    ...mapActions('currentUser', ['userLogin']),

    liziInit() {
      var SCREEN_WIDTH = window.innerWidth;
      var SCREEN_HEIGHT = window.innerHeight;
      var SEPARATION = 90;
      var AMOUNTX = 50;
      var AMOUNTY = 50;
      var container;
      var particles, particle;
      var count;
      var camera;
      var scene;
      var renderer;
      var mouseX = 0;
      var mouseY = 0;
      var windowHalfX = window.innerWidth / 2;
      var windowHalfY = window.innerHeight / 2;
      init();
      this.interval = setInterval(loop, 1000 / 40);

      function init() {
        container = document.createElement("div");
        container.style.position = "relative";
        container.style.top = "200px";
        document.getElementById("indexLizi").appendChild(container);
        camera = new THREE.Camera(75, SCREEN_WIDTH / SCREEN_HEIGHT, 1, 10000);
        camera.position.z = 1000;
        scene = new THREE.Scene();
        renderer = new THREE.CanvasRenderer();
        renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
        particles = new Array();
        var i = 0;
        var material = new THREE.ParticleCircleMaterial(0x097bdb, 1);
        for (var ix = 0; ix < AMOUNTX; ix++) {
          for (var iy = 0; iy < AMOUNTY; iy++) {
            particle = particles[i++] = new THREE.Particle(material);
            particle.position.x = ix * SEPARATION - AMOUNTX * SEPARATION / 2;
            particle.position.z = iy * SEPARATION - AMOUNTY * SEPARATION / 2;
            scene.add(particle);
          }
        }
        count = 0;
        container.appendChild(renderer.domElement);
        document.addEventListener("mousemove", onDocumentMouseMove, false);
        document.addEventListener("touchmove", onDocumentTouchMove, false);
      }

      var mousemovetimer = null;

      function onMouseMove(event) {
        window.clearTimeout(mousemovetimer);
        mouseX = event.clientX - windowHalfX;
        mouseY = event.clientY - windowHalfY;
        mousemovetimer = null;
      }

      function onDocumentMouseMove(event) {
        if (!mousemovetimer)
          mousemovetimer = window.setTimeout(onMouseMove, 50, event);
      }

      function onDocumentTouchMove(event) {
        if (event.touches.length == 1) {
          event.preventDefault();
          mouseX = event.touches[0].pageX - windowHalfX;
          mouseY = event.touches[0].pageY - windowHalfY;
        }
      }

      function loop() {
        camera.position.x += (mouseX - camera.position.x) * 0.05;
        // camera.position.y += ( - mouseY - camera.position.y ) * 0.05;
        camera.position.y = 364;
        var i = 0;
        for (var ix = 0; ix < AMOUNTX; ix++) {
          for (var iy = 0; iy < AMOUNTY; iy++) {
            particle = particles[i++];
            particle.position.y =
                Math.sin((ix + count) * 0.3) * 50 +
                Math.sin((iy + count) * 0.5) * 50;
            particle.scale.x = particle.scale.y =
                (Math.sin((ix + count) * 0.3) + 1) * 2 +
                (Math.sin((iy + count) * 0.5) + 1) * 2;
          }
        }
        renderer.render(scene, camera);
        count += 0.1;
      }
    },
    login() {
      this.$refs.loginForm.validate().then(valid => {
        if (valid) {
          AuthService.login(this.form).then(res => {
            if (res) {
              this.$vs.notification({
                duration: 2500,
                title: this.$t('success_login'),
                progress: 'auto',
                color: 'success',
                position: 'top-right'
              })
              this.$router.push('/')
            }
          }).catch(e => {
            this.$vs.notification({
              title: e.message,
              duration: 2500,
              progress: 'auto',
              color: 'danger',
              position: 'top-right'
            })
          })
        } else {
          this.$vs.notification({
            duration: 1500,
            title: this.$t('required_error'),
            progress: 'auto',
            color: 'danger',
            position: 'top-right'
          })
        }
      })
    }
  },
  mounted() {
    this.liziInit();
  },
  beforeDestroy() {
    if (this.interval) clearInterval(this.interval);
  }
}
</script>

<style scoped>

.mt5 {
  margin-top: 5%;
}
.mt10 {
  margin-top: 10%;
}
.mt15 {
  margin-top: 25%;
}
.mt20 {
  margin-top: 40%;
}

.index {
  width: 100%;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  text-align: center;
  background-color: #141a48;
  background-repeat: no-repeat;
  background-size: cover;
  overflow: hidden;
}

.index h1 {
  height: 150px;
}

.index h1 img {
  height: 100%;
}

.index h2 {
  color: #666;
  margin-bottom: 200px;
}

.index h2 p {
  margin: 0 0 50px;
}

.index .ivu-row-flex {
  height: 100%;
}

#indexLizi {
  position: absolute;
  width: 100%;
  top: 0;
  bottom: 0;
  overflow: hidden;
}
</style>
