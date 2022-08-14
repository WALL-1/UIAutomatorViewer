<template>
  <div class="phone-view">
    <phone-keys-bar @pressed="onKeyPressed"></phone-keys-bar>
    <phone-nav-bar @pressed="onKeyPressed"></phone-nav-bar>
    <div
      ref="phoneScreen"
      class="phone-screen"
      :style="phoneScreenStyle"
      v-html="hierarchy.showElements"
    ></div>
  </div>
</template>

<script>
import PhoneKeysBar from "./PhoneKeysBar.vue";
import PhoneNavBar from "./PhoneNavBar.vue";
import hierarchy from "./hierarchy";

export default {
  components: { PhoneKeysBar, PhoneNavBar },
  data() {
    return {
      width: 320,
      height: 480,
      realWidth: 0,
      realHeight: 0,
      imageURL: "",
      xml: "",
    };
  },
  computed: {
    virtualWidth() {
      return this.width - 40;
    },
    virtualHeight() {
      return this.height - 90;
    },
    phoneScreenStyle() {
      return {
        width: this.virtualWidth + "px",
        height: this.virtualHeight + "px",
        "background-image": `url(${this.imageURL})`,
        "background-size": `${this.virtualWidth}px ${this.virtualHeight}px`,
      };
    },
    hierarchy() {
      return hierarchy.transform(
        this.xml,
        this.realWidth,
        this.realHeight,
        this.virtualWidth,
        this.virtualHeight
      );
    },
  },
  methods: {
    onKeyPressed(key) {
      this.$emit("keypressed", key);
    },
    onElementClick(e) {
      this.$emit(
        "elementclick",
        this.hierarchy.showDict[e.target.getAttribute("uuid")]
      );
    },
    onElementDoubleClick(e) {
      this.$emit(
        "elementdoubleclick",
        this.hierarchy.showDict[e.target.getAttribute("uuid")]
      );
    },
  },
  mounted() {
    setInterval(() => {
      if (this.$refs.phoneScreen !== undefined) {
        let children = this.$refs.phoneScreen.children;
        for (let i = 0; i < children.length; i++) {
          let item = children[i];
          item.onclick = this.onElementClick;
          item.ondblclick = this.onElementDoubleClick
        }
      }
    }, 1000);
  },
};
</script>

<style>
.phone-view {
  position: relative;
  border: #999 15px outset;
  border-radius: 20px;
  width: calc(100% - 30px);
  height: calc(100% - 30px);
}

.phone-screen {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: calc(100% - 50px);
  background: #000;
}

.phone-nav-bar {
  position: absolute;
  bottom: 0;
}

.phone-keys-bar {
  position: absolute;
  top: 30px;
  right: -20px;
  z-index: 1;
}

.show-element {
  position: absolute;
  border: #ccc 1px dashed;
}

.show-element:hover{
  border: blue 2px solid;
}
</style>