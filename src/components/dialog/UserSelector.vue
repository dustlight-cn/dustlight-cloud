<template>
  <q-dialog ref="dialog">
    <q-card class="q-dialog-plugin">
      <q-card-section class="text-subtitle1">
        <q-icon name="person"/>
        {{ $t("userSelector") }}
      </q-card-section>
      <q-card-section>
        <div class="q-pa-sm">
          <q-input
            :placeholder="$q.lang.label.search"
            v-model="searchUser.key"
            :loading="searchUser.searching"
            :debounce="500"
            filled
            clearable
            type="search"
            color="primary" dense>
            <template v-slot:prepend>
              <q-icon name="search"/>
            </template>
          </q-input>
        </div>

        <div style="min-height: 150px;">
          <q-list separator v-if="searchUser.data && searchUser.data.length > 0">
            <transition
              v-for="u in searchUser.data" :key="u.uid"
              appear
              enter-active-class="animated fadeIn"
              leave-active-class="animated fadeOut">
              <q-item style="word-break: break-all;" clickable v-ripple @click="()=>onSelect(u)" v-close-popup>
                <q-item-section avatar>
                  <slot name="avatar" :user="u">
                    <auth-avatar :user="u"/>
                  </slot>
                </q-item-section>
                <q-item-section>
                  <slot :user="u">
                    <q-item-label>{{ u.nickname && u.nickname.trim() ? u.nickname.trim() : u.username }}</q-item-label>
                    <q-item-label v-if="u.email" caption>
                      <q-icon name="email"/>
                      <span> {{ u.email }}</span>
                    </q-item-label>
                    <q-item-label v-if="u.phone" caption>
                      <q-icon name="phone"/>
                      <span> {{ u.phone }}</span>
                    </q-item-label>
                  </slot>
                </q-item-section>
                <q-item-section side>
                  <slot :user="u" name="side"></slot>
                </q-item-section>
              </q-item>
            </transition>
          </q-list>

          <no-results v-if="searchUser.count ==0"/>
        </div>
      </q-card-section>

      <q-card-actions align="center">
        <q-pagination
          style="margin: 0 auto;"
          v-if="searchUser.count>0"
          color="primary"
          v-model="searchUser.page"
          :max="Math.ceil(searchUser.count / searchUser.limit)"
          :input="true"/>
      </q-card-actions>
      <q-card-actions align="right">
        <q-btn flat color="primary" :label="$q.lang.label.ok" v-close-popup/>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import {UsersApi, Configuration} from "@dustlight/auth-client-axios-js"
import NoResults from "../common/NoResults";

// @ts-ignore
const authEndpoint = process.env.auth["config.apiEndpoint"]

export default {
  name: "UserSelector",
  components: {NoResults},
  props: {
    token: String
  },
  emits: ["onSelect"],
  data() {
    return {
      searchUser: {
        search: false,
        searching: false,
        key: "",
        page: 1,
        limit: 5,
        data: [],
        count: 0,
        neverSearch: true
      }
    }
  },
  watch: {
    "searchUser.key"() {
      if (this.searchUser.key == null)
        this.searchUser.key = "";
      this.doSearchUser(true);
    },
    "searchUser.page"() {
      this.doSearchUser(false);
    }
  },
  computed: {
    /**
     *
     * @returns {UsersApi}
     */
    usersApi() {
      return new UsersApi(new Configuration({basePath: authEndpoint, accessToken: this.token}))
    }
  },
  methods: {
    show() {
      this.$refs.dialog.show()
    },
    hide() {
      this.$refs.dialog.hide()
    },
    onSearchUser() {
      this.searchUser.search = true;
      if (this.searchUser.neverSearch) {
        this.searchUser.neverSearch = false;
        this.doSearchUser(true);
      }
    },
    onSelect(user) {
      this.$emit("ok", user)
      this.hide()
    },
    doSearchUser(refresh) {
      if (this.searchUser.searching)
        return;
      if (refresh) {
        this.searchUser.page = 1;
      }
      let k = this.searchUser.key;
      this.searchUser.searching = true;
      this.usersApi.getUsers(null,
        k,
        this.searchUser.limit * (this.searchUser.page - 1),
        this.searchUser.limit,
        [])
        .then(res => {
          this.searchUser.count = res.data.count;
          this.searchUser.data = res.data.data;
          return res;
        })
        .finally(() => {
          this.searchUser.searching = false;
          if (k != this.searchUser.key)
            this.doSearchUser(refresh);
        });
    }
  }
}
</script>

<style scoped>

</style>
