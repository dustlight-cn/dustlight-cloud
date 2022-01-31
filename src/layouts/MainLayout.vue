<template>
  <q-layout view="hHh Lpr fff">
    <q-header elevated>
      <q-toolbar>
        <logo class="q-mr-sm"/>
        <q-btn-dropdown dense no-caps flat
                        :label="$q.screen.lt.md && isAppPage?$t(currentApp.name + '.title'):$t('services')">
          <q-list>
            <q-item v-for="(app,index) in apps" :key="index" clickable v-close-popup
                    :to="app.menus && app.menus.length > 0 ? {name: app.name + '/' + app.menus[0].routeName} : {path: '/' + app.name }">
              <q-item-section>
                <q-item-label>{{ $t(app.name + ".title") }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
        <q-space/>

        <client-selector v-if="isAppPage"/>
        <auth-avatar-button color="secondary" :loginPage="{name:'login',query:{redirect_uri:this.$route.fullPath}}"
                            :text="{signIn: $t('signIn'),signOut: $t('signOut'),signOutSuccess: $t('signOutSuccess')}"/>
      </q-toolbar>

      <!-- 顶部导航栏 -->
      <q-tabs inline-label v-if="$q.screen.lt.md && isAppPage" v-model="tab">

        <q-space/>
        <q-route-tab no-caps
                     v-if="isMenuEnabled"
                     v-for="(menu,index) in currentApp.menus"
                     :name="menu.name"
                     :to="{name: currentApp.name + '/' + menu.routeName}"
                     :label="menu.i18nKey ? $t(currentApp.name + '.' + menu.i18nKey) : menu.name"
                     :icon="menu.icon ? menu.icon : undefined"/>
        <q-space/>
      </q-tabs>
    </q-header>

    <!-- 侧边导航栏 -->
    <q-drawer
      :width="200"
      side="left"
      v-if="$q.screen.gt.sm && isMenuEnabled"
      show-if-above
      bordered>
      <q-tabs inline-label v-model="tab" vertical active-color="primary">
        <q-item>
          <q-item-section>
            <q-item-label class="text-h6">
              {{ $t(currentApp.name + ".title") }}
            </q-item-label>
          </q-item-section>
        </q-item>
        <q-route-tab no-caps
                     v-for="(menu,index) in currentApp.menus"
                     :name="menu.name"
                     :to="{name: currentApp.name + '/' + menu.routeName}"
                     :label="menu.i18nKey ? $t(currentApp.name + '.' + menu.i18nKey) : menu.name"
                     :icon="menu.icon ? menu.icon : undefined"/>

      </q-tabs>
    </q-drawer>

    <q-page-container>
      <router-view/>
    </q-page-container>

    <q-footer>
      <Footer/>
    </q-footer>
  </q-layout>
</template>

<script>
import Footer from "../components/common/Footer";
import LanguageSelector from "../components/common/LanguageSelector";
import apps from "../apps";
import ClientSelector from "../components/common/ClientSelector";
import Logo from "../components/common/Logo";

export default {
  name: 'MainLayout',
  components: {Logo, ClientSelector, LanguageSelector, Footer},
  data() {
    return {
      leftDrawerOpen: false,
      apps: apps,
      tab: "",
      currentApp: null
    }
  },
  computed: {
    isAppPage() {
      return this.currentApp
    },
    isMenuEnabled() {
      return this.isAppPage && this.currentApp.menus
    }
  },
  methods: {
    updateCurrentApp() {
      let t = this.$route
      let name = null
      if (t.matched.length > 0 && t.matched[t.matched.length - 1].components.default != null) {
        name = (t.matched[t.matched.length - 1].components.default).app
      }
      if (name == null)
        this.currentApp = null
      else if (this.apps[name] == null)
        this.currentApp = null
      else {
        this.currentApp = this.apps[name]
      }
    }
  },
  mounted() {
    this.updateCurrentApp()
  },
  watch: {
    '$route': {
      handler: function (t, f) {
        this.updateCurrentApp()
      }
    }
  }
}
</script>
