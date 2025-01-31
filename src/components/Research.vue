<template>
    <div class="flex flex-col gap-5 p-2 sm:p-5 bg-[#130A29] rounded-xl text-white w-full">
        <div class="flex flex-col gap-2">
            <h1 class="text-lg sm:text-2xl font-semibold flex flex-row items-center gap-3 text-center">Run research <img @click="goToAnalysis" src="@/assets/arrow-right.png" class="w-8 h-8 cursor-pointer"/></h1>
            <span class="text-sm sm:text-base text-[#BBA2C7]">Run an in-depth analysis on an influencer or multiple influencers. This will help you make an informed decision on whether to trust the influencer(s) or not.</span>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    name: 'ResearchComponent',
    methods: {
        goToAnalysis() {
            this.$router.push({ name: 'Analysis' })
        }
    }
})
</script>