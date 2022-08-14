<template>
  <div class="simple-header">
    <div class="simple-header-title"><strong>{{ title }}</strong></div>
    <div class="simple-header-content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: { type: String, default: "Title" },
  },
};
</script>

<style>
.simple-header {
  display: flex;
  height: 49px;
  line-height: 50px;
  border-bottom: #ccc 1px solid;
}
.simple-header-title {
  padding: 0 20px;
  color: #606266;
  font-size:14px;
}
</style>