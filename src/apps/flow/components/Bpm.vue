<template>
  <div>
    <q-responsive :ratio="16/9">
      <q-card class="cursor-pointer shadow-0" bordered :id="canvasId">

      </q-card>
    </q-responsive>
    <div class="text-right q-mt-xs">
      <q-btn flat round color="primary" @click="reset" icon="my_location"/>
    </div>
    <div id="ggg"></div>
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
      scale: 1
    }
  },
  computed: {
    canvasId() {
      return 'Bpm_' + this._.uid + '_canvas'
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
        parent: '#ggg'
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

</style>
