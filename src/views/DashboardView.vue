<template>
    <div class="flex flex-col gap-5 p-8 sm:p-10 sm:pt-5">
        <LeaderboardComponent/>
    </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import LeaderboardComponent from "@/components/Leaderboard.vue";

export default defineComponent({
    name: 'DashboardView',
    components: {LeaderboardComponent},
})
</script>