<!--营业厅页面-->
<template>
  <div class="service_hall"></div>
</template>
<script>
export default {
  name: "service_hall",
  mounted() {
    this.$notify.info({
      title: "提示",
      message: "敬请期待~",
      duration: 2500,
      position: "top-right"
    });
  }
};
</script>
<style lang="less" scoped>
</style>