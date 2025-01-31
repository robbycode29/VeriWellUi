<template>
    <div class="min-h-screen bg-[#130A29]">
        <HeaderComponent/>
        <Disclaimer/>
        <router-view/>
    </div>
</template>
<script setup lang="ts">
import HeaderComponent from "@/components/Header.vue";
import Disclaimer from "@/components/Disclaimer.vue";
</script>