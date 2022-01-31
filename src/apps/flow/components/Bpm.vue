<template>
  <q-responsive :ratio="16/9">
    <div class="cv" :id="canvasId">
      <!--    <q-btn label="zoom" @click="zoom"/>-->
    </div>
  </q-responsive>
</template>

<script>
import {decode} from 'js-base64'
import BpmnViewer from 'bpmn-js/lib/NavigatedViewer';
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
      viewer: null
    }
  },
  computed: {
    canvasId() {
      return 'Bpm_' + this._.uid + '_canvas'
    }
  },
  methods: {
    zoom() {
      console.log("?")
      this.viewer.get('canvas').zoom('fit-viewport')
    },
    load() {

      let xml = !this.isBase64 ? this.xml : decode(this.xml)
      let viewer = this.viewer
      console.log(viewer)
      viewer.importXML(xml).then(function (result) {

        console.log(result)
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
