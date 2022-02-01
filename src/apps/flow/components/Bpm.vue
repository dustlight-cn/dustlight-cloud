<template>
  <div>
    <q-responsive :ratio="16/9">
      <q-card class="cursor-pointer shadow-0 flex" bordered v-touch-pan.prevent.mouse="handlePan" :id="canvasId">
      </q-card>
    </q-responsive>
    <div class="text-right q-mt-xs">
      <q-fab flat color="primary" icon="menu" direction="up">
        <q-fab-action color="primary" @click="reset" icon="refresh" />
        <q-slider class="q-mb-sm" reverse vertical v-model="scale" :step="0.1" :max="2" :min="0.1"/>
      </q-fab>
    </div>

  </div>
</template>

<script>
import {decode} from 'js-base64'
import BpmnViewer from 'bpmn-js/lib/Viewer';
import BpmnModdle from 'bpmn-moddle';

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
    handlePan({evt, ...info}) {
      this.viewer.get('canvas').scroll({dx: info.delta.x, dy: info.delta.y})
    },
    reset() {
      this.viewer.get('canvas').zoom('fit-viewport')
    },
    load() {

      let xml = !this.isBase64 ? this.xml : decode(this.xml)
      let viewer = this.viewer
      console.log(viewer)
      viewer.importXML(xml).then(function (result) {

        const {warnings} = result;

        console.log('success !', warnings);

        viewer.get('canvas').zoom('fit-viewport');
      }).catch(function (err) {

        const {warnings, message} = err;

        console.log('something went wrong:', warnings, message);
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
    this.viewer = new BpmnViewer({
      container: '#' + this.canvasId,
      width: "100%",
      height: "100%"
    })
    this.load()
  }
}
</script>

<style scoped>
/*.cv {*/
/*  width: 200%;*/
/*}*/
</style>
