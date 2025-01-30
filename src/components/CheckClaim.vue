<template>
    <div class="flex flex-col gap-5 p-2 sm:p-5 bg-[#130A29] rounded-xl text-white w-full">
        <div class="flex flex-col gap-2">
            <h1 class="text-lg sm:text-2xl font-semibold">Quickly check a claim</h1>
            <span class="text-sm sm:text-base text-[#BBA2C7]">Check the credibility of a health claim by entering it below. Our AI-powered analysis will provide you with the trust score and credibility of the claim as well as with references to the articles proving or disproving it.</span>
        </div>

        <!--Input field-->
        <div class="flex flex-col gap-2">
            <label for="claim" class="text-sm sm:text-base text-[#BBA2C7]">Enter the claim</label>
            <textarea
                v-model="claim"
                type="text"
                id="claim"
                class="resize-none h-[140px] p-2 sm:p-5 bg-[#1B0E3B] border-[2px] border-[#3C2D59] rounded-xl text-white"
            />
            <div class="flex flex-row w-full sm:justify-end">
                <button @click="checkClaim" class="bg-[#3C2D59] p-2 sm:p-3 w-full sm:w-24 rounded-xl text-white text-xs font-medium">Check Claim</button>
            </div>
        </div>

        <!--Loading skeletons-->
        <div v-if="isLoading && researchId" class="flex flex-col gap-2">
            <SkeletonLoader width="50%" height="20px" />
            <SkeletonLoader width="100%" height="20px" />
            <SkeletonLoader width="100%" height="20px" />
            <SkeletonLoader width="100%" height="20px" />
        </div>

        <!--Result section-->
        <div v-if="!isLoading && status" class="flex flex-col gap-2">
            <div class="flex flex-row gap-2 items-center justify-between">
                <div>
                    <h1 v-if="status === 'questionable'" class="text-xs sm:text-sm font-semibold rounded-xl border-[3px] p-2 border-[#FF7F27] bg-[#1B0E3B] text-[#FF7F27]">{{ status }}</h1>
                    <h1 v-else-if="status === 'verified'" class="text-xs sm:text-sm font-semibold rounded-xl border-[2px] p-2 border-[#00FFA3] bg-[#1B0E3B] text-[#00FFA3]">{{ status }}</h1>
                    <h1 v-else-if="status === 'debunked'" class="text-xs sm:text-sm font-semibold rounded-xl border-[2px] p-2 border-[#BF2A1D] bg-[#1B0E3B] text-[#BF2A1D]">{{ status }}</h1>
                </div>
                <div class="flex flex-col gap-1 translate-y-1">
                    <h1 v-if="status === 'questionable'" class="text-lg sm:text-2xl font-semibold text-[#FF7F27]">{{ trustScore*100 }}%</h1>
                    <h1 v-else-if="status === 'verified'" class="text-lg sm:text-2xl font-semibold text-[#00FFA3]">{{ trustScore*100 }}%</h1>
                    <h1 v-else-if="status === 'debunked'" class="text-lg sm:text-2xl font-semibold text-[#BF2A1D]">{{ trustScore*100 }}%</h1>
                    <span class="text-sm sm:text-base text-[#BBA2C7]">Trust Score</span>
                </div>
            </div>
            <div class="flex flex-row gap-2 items-center">
                <img src="@/assets/ai-brain.png" class="w-4" /> <!-- AI brain image -->
                <span class="text-sm sm:text-base text-[#BBA2C7]">AI Analysis</span>
            </div>
            <div class="flex flex-col gap-2 ml-5">
                <span class="text-sm sm:text-base text-[#BBA2C7]">Evidence:</span>
                <a v-for="item in evidence" target="_blank" :key="item.id" :href="item.link" class="flex flex-row justify-between text-sm sm:text-base text-[#9D76E8] p-1 border border-[#3C2D59] rounded-lg">{{ item.title }} <img src="@/assets/arrow-up-right.png" class="w-4 h-4"/></a>
                <span v-if="evidence.length === 0" class="text-sm text-[#BBA2C7] italic">No evidence found</span>
            </div>
            <div class="flex flex-col gap-2 ml-5">
                <span class="text-sm sm:text-base text-[#BBA2C7]">Counter-evidence:</span>
                <a v-for="item in counterEvidence" target="_blank" :key="item.id" :href="item.link" class="flex flex-row justify-between text-sm sm:text-base text-[#9D76E8] p-1 border border-[#3C2D59] rounded-lg">{{ item.title }} <img src="@/assets/arrow-up-right.png" class="w-4 h-4"/></a>
                <span v-if="counterEvidence.length === 0" class="text-sm text-[#BBA2C7] italic">No counter-evidence found</span>
            </div>
        </div>

        <!--Failed section-->
        <div v-if="failed" class="flex flex-col gap-2 w-full items-center">
            <h1 class="w-full sm:w-96 text-center text-xs sm:text-sm font-semibold rounded-xl border-[2px] p-2 border-[#FF7F27] bg-[#1B0E3B] text-[#FF7F27]">Failed</h1>
            <span class="text-sm sm:text-base text-[#BBA2C7]">The claim could not be verified. Please try again later.</span>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import SkeletonLoader from "@/components/SkeletonLoader.vue";

export default defineComponent({
    name: 'CheckClaimComponent',
    components: {
        SkeletonLoader,
    },
    data() {
        return {
            claim: '',
            researchId: null,
            isLoading: false,
            evidence: [],
            counterEvidence: [],
            status: '',
            trustScore: 0,
            failed: false,
        }
    },
    methods: {
        async createResearch() {
            const response = await fetch(`http://localhost:8000/api/v1/influencers/begin_research/?research_type=claim`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            const data = await response.json()
            this.researchId = data.research_id
            this.isLoading = true
        },
        async initCheck(claim: any, researchId: any) {
            await fetch(`http://localhost:8000/api/v1/influencers/check_claim/?claim=${claim}&research=${researchId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
        },
        async fetchResearch(researchId: any) {
            const response = await fetch(`http://localhost:8000/api/v1/claim_researches/${researchId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            const data = await response.json()
            return data
        },
        checkClaim() {
            this.createResearch().then(() => {
                this.initCheck(this.claim, this.researchId)
                const intervalId = setInterval(async () => {
                    const data = await this.fetchResearch(this.researchId)
                    if (data.claim || data.failed) {
                        clearInterval(intervalId)
                        this.isLoading = false
                        // handle the response data
                        if (data.failed) {
                            this.failed = true
                        } else {
                            this.evidence = data.claim.evidence
                            this.counterEvidence = data.claim.counter_evidence
                            this.status = data.claim.status
                            this.trustScore = data.claim.trust_score
                        }
                    }
                }, 5000)
            })
        }
    }
})
</script>