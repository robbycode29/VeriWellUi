<template>
    <div class="flex flex-col gap-5 p-2 sm:p-5 bg-[#130A29] rounded-xl text-white w-full">
        <div class="flex flex-col gap-2">
            <h1 class="text-lg sm:text-2xl font-semibold">Influencer Trust Leaderboard</h1>
            <span class="text-sm sm:text-base text-[#BBA2C7]">Rankings of health influencers based on scientific accuracy, credibility and transparency. Updated using AI-powered analysis.</span>
        </div>

        <!--Statistics section-->
        <div class="flex flex-col justify-between w-full sm:flex-row gap-2 sm:gap-5">
            <div class="flex flex-row w-full justify-center gap-4 sm:gap-4 p-2 sm:p-5 py-5 sm:py-10 bg-[#1B0E3B] border-[2px] border-[#3C2D59] rounded-xl shadow-lg">
                <img src="@/assets/people.png" class="w-10 h-10 self-center" />
                <div class="flex flex-col gap-1">
                    <h3 class="text-lg font-medium">{{ influencerCount }}</h3>
                    <span class="text-sm text-[#BBA2C7]">Active Influencers</span>
                </div>
            </div>
            <div class="flex flex-row w-full justify-center gap-4 sm:gap-4 p-2 sm:p-5 py-5 sm:py-10 bg-[#1B0E3B] border-[2px] border-[#3C2D59] rounded-xl shadow-lg">
                <img src="@/assets/verified.png" class="w-10 h-10 self-center" />
                <div class="flex flex-col gap-1">
                    <h3 class="text-lg font-medium">{{ claimsVerified }}</h3>
                    <span class="text-sm text-[#BBA2C7]">Claims Verified</span>
                </div>
            </div>
            <div class="flex flex-row w-full justify-center gap-4 sm:gap-4 p-2 sm:p-5 py-5 sm:py-10 bg-[#1B0E3B] border-[2px] border-[#3C2D59] rounded-xl shadow-lg">
                <img src="@/assets/graph.png" class="w-10 h-10 self-center" />
                <div class="flex flex-col gap-1">
                    <h3 class="text-lg font-medium">{{ avgTrustScore }}</h3>
                    <span class="text-sm text-[#BBA2C7]">Average Trust Score</span>
                </div>
            </div>
        </div>

        <!-- Category filter and sort by trust score -->
        <div class="flex flex-col sm:flex-row justify-between gap-2 sm:gap-5">
            <div class="flex flex-wrap gap-2">
                <button
                    v-for="category in categories"
                    :key="category"
                    @click="selectCategory(category)"
                    :class="{'bg-[#3C2D59]': selectedCategory === category, 'bg-[#1B0E3B]': selectedCategory !== category}"
                    class="p-2 border-[2px] border-[#3C2D59] rounded-full text-white text-xs"
                >
                    {{ category }}
                </button>
            </div>
            <button @click="toggleSortOrder" class="flex items-center justify-center gap-2 border-[2px] border-[#3C2D59] rounded-full p-2">
                <img
                    src="@/assets/sort.png"
                    alt="sort"
                    class="w-6 h-6"
                />
                <span v-if="sortOrder === 'desc'" class="text-sm text-[#BBA2C7] mr-2">Highest First</span>
                <span v-else class="text-sm text-[#BBA2C7] mr-2">Lowest First</span>
            </button>
        </div>

        <!--Leaderboard section-->
        <div class="overflow-x-auto overflow-y-auto max-h-[500px] rounded-xl bg-[#1B0E3B] border-[2px] border-[#3C2D59] shadow-lg custom-scrollbar">
            <table class="min-w-full">
                <thead class="sticky top-0 bg-[#1B0E3B] h-12">
                    <tr>
                        <th class="px-4 py-2 text-left text-sm font-medium text-[#BBA2C7]">Rank</th>
                        <th class="px-4 py-2 text-left text-sm font-medium text-[#BBA2C7]">Influencer</th>
                        <th class="px-4 py-2 text-left text-sm font-medium text-[#BBA2C7]">Category</th>
                        <th class="px-4 py-2 text-left text-sm font-medium text-[#BBA2C7]">Followers</th>
                        <th class="px-4 py-2 text-left text-sm font-medium text-[#BBA2C7]">Trust Score</th>
                        <th class="px-4 py-2 text-left text-sm font-medium text-[#BBA2C7]">Verified Claims</th>
                    </tr>
                </thead>
                <tbody>
                    <tr @click="navigateToDetail(item.name)" v-for="(item, index) in leaderboardData" :key="index" class="border-t border-[#3C2D59] h-12 cursor-pointer hover:bg-[#3C2D59]">
                        <td class="px-4 py-2 text-sm">#{{ item.rank }}</td>
                        <td class="px-4 py-2 text-sm flex flex-row gap-2 items-center min-h-12"><img src="@/assets/profile.png" class="hidden sm:block w-4 h-4"/>{{ item.name }}</td>
                        <td class="px-4 py-2 text-sm">{{ item.category }}</td>
                        <td class="px-4 py-2 text-sm">{{ item.followers }}</td>
                        <td v-if="parseFloat(item.trustScore)/100 > 0.80" class="px-4 py-2 text-sm font-semibold text-green-400">{{ item.trustScore }}</td>
                        <td v-else-if="parseFloat(item.trustScore)/100 < 0.20" class="px-4 py-2 text-sm font-semibold text-red-400">{{ item.trustScore }}</td>
                        <td v-else class="px-4 py-2 text-sm font-semibold text-orange-400">{{ item.trustScore }}</td>
                        <td class="px-4 py-2 text-sm">{{ item.verifiedClaims }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
    name: 'LeaderboardComponent',
    data() {
        return {
            influencersRaw: [] as any[],
            leaderboardData: [] as any[],
            influencerCount: 0,
            claimsVerified: 0,
            avgTrustScore: '',
            categories: [] as string[],
            selectedCategory: 'All',
            sortOrder: 'desc',
        }
    },
    setup() {
        const router = useRouter()
        const navigateToDetail = (name: string) => {
            router.push({ name: 'Detail', params: { name: encodeURIComponent(name) } })
        }
        return { navigateToDetail }
    },
    methods: {
        async fetchInfluencers() {
            try {
                const response = await fetch(`http://localhost:8000/api/v1/influencers/`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                this.influencersRaw = await response.json()
            } catch (error) {
                console.error(error)
            }
        },
        async fetchCategories() {
            try {
                const response = await fetch(`http://localhost:8000/api/v1/influencers/categories/`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                this.categories = await response.json()
            } catch (error) {
                console.error(error)
            }
        },
        curateCategories() {
            this.categories = this.categories.filter((item: string) => item !== null)
            this.categories = ['All', ...this.categories.slice(1).sort(() => 0.5 - Math.random()).slice(0, 6)]

        },
        curateLeaderboard() {
            this.leaderboardData = this.influencersRaw
                .filter((item: any) => item.name !== 'Default')
                .sort((a: any, b: any) => b.trustScore - a.trustScore)
                .map((item: any, index: number) => {
                    return {
                        rank: index + 1,
                        name: item.name,
                        category: item.category,
                        followers: item.followers,
                        trustScore: String(item.trust_score*100)+"%",
                        verifiedClaims: item.verified_claims
                    }
                })
        },
        calculateStatistics() {
            this.influencerCount = this.leaderboardData.length
            this.claimsVerified = this.leaderboardData.reduce((acc: number, item: any) => acc + item.verifiedClaims, 0)
            const avgTrustScore = (this.leaderboardData.reduce((acc: number, item: any) => acc + parseFloat(item.trustScore), 0) / this.influencerCount).toFixed(2)
            this.avgTrustScore = String(parseFloat(avgTrustScore)) + "%"
        },
        selectCategory(category: string) {
            this.selectedCategory = category
            this.filterByCategory()
        },
        filterByCategory() {
            this.curateLeaderboard()
            if (this.selectedCategory === 'All') {
                return
            }
            this.leaderboardData = this.leaderboardData.filter((item: any) => item.category === this.selectedCategory)
        },
        toggleSortOrder() {
            this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc'
            this.sortLeaderboard()
        },
        sortLeaderboard() {
            this.leaderboardData.sort((a: any, b: any) => {
                return this.sortOrder === 'asc' ? parseFloat(a.trustScore) - parseFloat(b.trustScore) : parseFloat(b.trustScore) - parseFloat(a.trustScore)
            })
        },
    },
    mounted()  {
        this.fetchInfluencers().then(() => {
            this.curateLeaderboard()
            this.calculateStatistics()
        })
        this.fetchCategories().then(() => {
            this.curateCategories()
        })
    }
})
</script>
<style scoped>
.custom-scrollbar::-webkit-scrollbar {
    width: 8px;
    height: 8px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background-color: #3C2D59;
    border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
}
</style>