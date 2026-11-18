<template>
    <h1>page1！5！</h1>
    <input v-model="content">
    <div>{{ content }}</div>
</template>

<script setup>

import { ref } from 'vue';
import utils from '@/common/util.js';
const content = ref('');


</script>

<style lang="less" scoped>

h1 {
    color: cadetblue;
}

</style>