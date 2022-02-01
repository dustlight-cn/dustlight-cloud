<template>
  <div>
    <q-card bordered class="shadow-0">
      <q-splitter
        disable
        :model-value="$q.screen.gt.sm ? split : 100">
        <template v-slot:before>
          <q-responsive :ratio="16/9">
            <div :id="canvasId">
            </div>
          </q-responsive>
        </template>
        <template v-if="$q.screen.gt.sm" v-slot:after>
          <div :id="planeId" class=""></div>
        </template>
      </q-splitter>
    </q-card>
    <div v-if="!$q.screen.gt.sm" :id="planeId" class=""></div>
  </div>
</template>

<script>
import {decode} from 'js-base64'
import BpmnViewer from 'bpmn-js/lib/NavigatedViewer';
import TouchModule from 'diagram-js/lib/navigation/touch';
import BpmnModdle from 'camunda-bpmn-js/lib/camunda-cloud/Modeler';

import 'camunda-bpmn-js/dist/assets/diagram-js.css'
import 'camunda-bpmn-js/dist/assets/bpmn-font/css/bpmn.css'
import 'camunda-bpmn-js/dist/assets/bpmn-js-properties-panel.css'

export default {
  name: "Bpm",
  props: {
    xml: String,
    isBase64: {
      type: Boolean,
      default() {
        return false
      }
    }
  },
  data() {
    return {
      viewer: null,
      split: 80
    }
  },
  computed: {
    canvasId() {
      return 'Bpm_' + this._.uid + '_canvas'
    },
    planeId() {
      return 'Bpm_' + this._.uid + '_plane'
    }
  },
  methods: {
    reset() {
      this.viewer.get('canvas').zoom('fit-viewport')
    },
    load() {

      let xml = !this.isBase64 ? this.xml : decode(this.xml)
      let viewer = this.viewer

      viewer.importXML(xml).then(result => {

        const {warnings} = result;
        if (warnings && warnings.length > 0)
          console.warn(warnings)
        this.reset()
      }).catch(err => {
        const {warnings, message} = err;
        console.warn('something went wrong:', warnings, message);
        this.$throw(err)
      });
    },
    export(format = false) {
      return this.viewer.saveXML({format: format}).then(res => res.xml)
    }
  },
  watch: {
    xml() {
      this.load()
    },
    scale(){
      this.viewer.get('canvas').zoom(this.scale)
    }
  },
  mounted() {
    // this.viewer = new BpmnViewer({
    //   container: '#' + this.canvasId,
    //   additionalModules: [TouchModule]
    // })
    this.viewer = new BpmnModdle({
      container: '#' + this.canvasId,
      propertiesPanel: {
        parent: '#' + this.planeId
      },
      additionalModules: [
        TouchModule,
      ]
    })
    this.load()
  }
}
</script>

<style scoped>
.plane {

}
</style>
