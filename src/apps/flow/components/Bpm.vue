<template>
  <div>
    <q-card bordered class="shadow-0">
      <q-splitter
        disable
        :model-value="$q.screen.gt.sm && !instance ? split : 100">
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
    },
    instance: {
      type: Object
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
      let viewer = this.viewer

      if (this.xml == "" && viewer instanceof BpmnModdle) {
        viewer.createDiagram()
        return
      }
      let xml = !this.isBase64 ? this.xml : decode(this.xml)
      viewer.importXML(xml).then(result => {

        const {warnings} = result;
        if (warnings && warnings.length > 0)
          console.warn(warnings)
        this.reset()

        if (this.instance) {
          let instance = this.instance
          let registry = viewer.get('elementRegistry')
          let overlays = viewer.get('overlays')
          let canvas = viewer.get('canvas')

          this.instance.events.forEach(event => {
            if (event.elementType == 'PROCESS' || event.status == 'RESOLVED')
              return
            let shape = registry.get(event.elementId)
            // console.log(event)
            // overlays.add(event.elementId, {
            //   position: {
            //     top: 0,
            //     left: 0
            //   },
            //   html: `<div style="background-color: rgba(33,186,69,0.3); width: ${shape.width}px;height: ${shape.height}px;"></div>`
            // });

            let clazz = 'highlight-grey'
            if (event.status == 'INCIDENT')
              clazz = 'highlight-red'
            else if (event.status == 'CANCELED' || event.status == 'COMPLETED')
              clazz = 'highlight-grey'
            else if (event.status == 'ACTIVE')
              clazz = 'highlight-green'
            canvas.addMarker(event.elementId, clazz);
          })
        }
      }).catch(err => {
        const {warnings, message} = err;
        console.warn('something went wrong:', warnings, message);
        this.$throw(err)
      });
    },
    export(format = false) {
      return this.viewer.saveXML({format: format}).then(res => {
        res.name = this.viewer.get('canvas').getPlane('base').rootElement.id
        return res
      })
    }
  },
  watch: {
    xml() {
      this.load()
    },
    scale() {
      this.viewer.get('canvas').zoom(this.scale)
    }
  },
  mounted() {

    this.viewer = this.instance ?
      new BpmnViewer({
        container: '#' + this.canvasId,
        additionalModules: [TouchModule]
      })
      : new BpmnModdle({
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

<style>
.highlight-green:not(.djs-connection) .djs-visual > :nth-child(1) {
  fill: rgba(174, 243, 174, 0.93) !important;
  stroke: rgba(0, 128, 0, 0.84) !important;
}

.highlight-red:not(.djs-connection) .djs-visual > :nth-child(1) {
  fill: rgb(245, 184, 183) !important;
  stroke: rgb(213, 13, 7) !important;
}

.highlight-grey:not(.djs-connection) .djs-visual > :nth-child(1) {
  fill: rgb(197, 189, 189) !important;
  stroke: rgb(87, 85, 85) !important;
}
</style>
