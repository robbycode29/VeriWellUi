<template>
    <div class="flex flex-col gap-5 p-8 sm:p-10 sm:pt-5">
        <LeaderboardComponent/>
        <CheckClaimComponent/>
        <ResearchComponent/>
    </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import LeaderboardComponent from "@/components/Leaderboard.vue";
import CheckClaimComponent from "@/components/CheckClaim.vue";
import ResearchComponent from "@/components/Research.vue";

export default defineComponent({
    name: 'DashboardView',
    components: {
        LeaderboardComponent,
        CheckClaimComponent,
        ResearchComponent,
    },
})
</script>