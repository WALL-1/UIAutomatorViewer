<template>
  <div
    class="phone-key"
    :style="keyStyle"
    @click="pressed"
    @dbclick="dbPressed"
  >
    <slot></slot>
  </div>
</template>

<script>
// https://blog.csdn.net/COCO56/article/details/117568090
export default {
  props: {
    keycode: { type: [Number, String], default: null },
    keyStyle: {
      type: Object,
      default() {
        return {
          width: "100%",
          height: "50px",
          "margin-top": "5px",
          "border-radius": "0 8px 8px 0",
          "line-height": "50px",
        };
      },
    },
  },
  methods: {
    pressed(e) {
      this.$emit("pressed", this.keycode, this, e);
    },
    dbPressed(e) {
      this.$emit("db-pressed", this.keycode, this, e);
    },
  },
};
</script>

<style>
.phone-key {
  display: flex;
  align-content: center;
  justify-content: center;
  background: #333;
  color: white;
  font-size: 12px;
  font-weight: bold;
  border: #333 1px outset;
  margin-top: 5px;
  cursor: pointer;
  user-select: none;
}

.phone-key:active {
  background: #222;
}
</style>