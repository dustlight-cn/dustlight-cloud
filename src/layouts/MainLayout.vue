<template>
  <q-layout view="hHh Lpr fFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>

          <q-btn :to="{name:'index'}" no-caps icon="img:/icons/favicon-128x128.png" flat :label="$t('title')"/>
          <q-btn-dropdown flat :label="$t('services')">
            <q-list>
              <q-item clickable v-close-popup @click="onItemClick">
                <q-item-section>
                  <q-item-label>Photos</q-item-label>
                </q-item-section>
              </q-item>

              <q-item clickable v-close-popup @click="onItemClick">
                <q-item-section>
                  <q-item-label>Videos</q-item-label>
                </q-item-section>
              </q-item>

              <q-item clickable v-close-popup @click="onItemClick">
                <q-item-section>
                  <q-item-label>Articles</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </q-toolbar-title>

        <language-selector/>
        <auth-avatar-button color="secondary" :loginPage="{name:'login'}"/>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
    >
      <q-list>
        <q-item-label
          header
        >
          Essential Links
        </q-item-label>

      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer style="z-index: 0">
      <Footer/>
    </q-footer>
  </q-layout>
</template>

<script>
import Footer from "../components/common/Footer";
import LanguageSelector from "../components/common/LanguageSelector";
export default {
  name: 'MainLayout',
  components: {LanguageSelector, Footer},
  data(){
    return {
      leftDrawerOpen: false
    }
  }
}
</script>
