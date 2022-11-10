<template>
  <div class="rules-container">
    <v-container>
      <v-expansion-panels>
        <v-expansion-panel v-for="rule in rules" :key="rule.url">
          <v-expansion-panel-header>
            {{ rule.url }}
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-layout>
              <v-flex label="Url">
                <v-text-field label="url" v-model="rule.url" />
              </v-flex>
              <v-flex xs1 class="px-2">
                <v-switch v-model="rule.enabled" />
              </v-flex>
              <v-flex xs1 class="mt-3">
                <v-btn icon @click="deleteRule(rule)">
                  <v-icon>
                    mdi-delete
                  </v-icon>
                </v-btn>
              </v-flex>
            </v-layout>
            <v-divider />
            <v-layout v-for="blocked_class in rule.blocked_classes" :key="blocked_class">
              <v-flex>
                <v-text-field label="hide rule" v-model="blocked_class.class" />
              </v-flex>
              <v-flex xs1 class="px-2">
                <v-switch v-model="blocked_class.enabled" />
              </v-flex>
              <v-flex xs1 class="mt-3">
                <v-btn icon @click="deleteClass(rule, blocked_class)">
                  <v-icon>
                    mdi-delete
                  </v-icon>
                </v-btn>
              </v-flex>
            </v-layout>
            <v-layout>
              <v-flex>
                <v-spacer />
              </v-flex>
              <v-flex xs2>
                <v-btn @click="addClass(rule)">
                  Add
                </v-btn>
              </v-flex>
            </v-layout>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-container>
    <v-container>
      <v-layout>
        <v-flex xs2>
          <v-btn @click="add">
            Add
          </v-btn>
        </v-flex>
        <v-flex>
          <v-spacer />
        </v-flex>
        <v-flex xs2>
          <v-btn @click="save">
            Save
          </v-btn>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>
<script>
export default {
  name: 'Rules',
  props: [],
  components: {
  },
  data: () => ({
    rules: []
  }),
  computed: {
  },
  watch: {
  },
  methods: {
    get_rules: function () {
      let self = this;
      /* eslint-disable */
      chrome.storage.sync.get('block_rules', function(data) {
        console.log(data);
        if (data.block_rules) {
          self.rules = data.block_rules;
        } else {
          self.rules = [];
        }
      })
      /* eslint-enable */
    },
    add: function () {
      let self = this;
      /* eslint-disable */
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        self.rules.push({
          url: tabs[0].url,
          enabled: true,
          blocked_classes: []
        })
      })
      /* eslint-enable */
    },
    deleteRule: function(rule) {
      this.rules.splice(this.rules.indexOf(rule), 1);
    },
    deleteClass: function(rule, blocked_class) {
      rule.blocked_classes.splice(rule.blocked_classes.indexOf(blocked_class), 1);
    },
    addClass :function (rule) {
      rule.blocked_classes.push({
        enabled: true,
        class: ""
      });
    },
    save: function () {
      /* eslint-disable */
      chrome.storage.sync.set({ block_rules: this.rules });

      let message = "update_css";

      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {type:message}, function(){
          // callback
        });
      });
      /* eslint-enable */
    }
  },
  mounted () {
    this.get_rules();
  }
}
</script>
<style lang="scss" scoped>
.rules-container {
  width: 800px;

}
</style>
