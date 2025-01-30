<template>
    <div class="flex flex-col gap-5 p-8 pt-2 sm:p-16 sm:pt-5 bg-[#130A29] rounded-xl text-white w-full">
        <button @click="goBack" class="self-start sm:-translate-x-5">
            <img src="@/assets/arrow-left.png" class="w-6 h-6" />
        </button>
        <div class="flex flex-row gap-5">
            <img src="@/assets/profile.png" class="w-16 h-16 sm:w-20 sm:h-20" />
            <div>
                <div class="flex flex-row items-center gap-2">
                    <h1 class="text-xl sm:text-3xl font-semibold">{{ decodedName }}</h1>
                </div>
                <div class="flex flex-wrap gap-2 mt-2">
                    <span v-for="category in uniqueCategories.slice(1)" :key="category" class="p-2 rounded-full text-white text-xs bg-[#1B0E3B]">{{ category }}</span>
                </div>
            </div>
        </div>
        <span>{{ claims.length > 0 ? claims[0].influencer.bio : '' }}</span>

        <!-- Sorting, Searching, and Filtering Section -->
        <div class="flex flex-col gap-2 p-4 bg-[#1B0E3B] border-[2px] border-[#3C2D59] rounded-xl">
            <div class="flex flex-row gap-2 items-center w-full">
                <input id="search" v-model="searchQuery" @input="filterClaims" type="text" class="p-2 w-full bg-[#3C2D59] rounded-lg text-white" placeholder="Search claims..."/>
            </div>
            <div class="flex flex-row justify-between w-full">
                <div class="flex flex-col gap-2 w-full sm:w-auto">
                    <span class="text-sm sm:text-base text-[#BBA2C7]">Categories</span>
                    <div class="flex flex-wrap gap-2">
                        <button
                            v-for="category in uniqueCategories"
                            :key="category"
                            @click="selectCategory(category)"
                            :class="{'bg-[#3C2D59]': selectedCategory === category, 'bg-[#1B0E3B]': selectedCategory !== category}"
                            class="p-2 border-[2px] border-[#3C2D59] rounded-full text-white text-xs"
                        >
                            {{ category }}
                        </button>
                    </div>
                    <span class="text-sm sm:text-base text-[#BBA2C7]">Verification Status</span>
                    <div class="flex flex-col sm:flex-row gap-2 sm:items-center">
                        <div class="flex flex-wrap gap-2 flex-grow">
                            <button
                                v-for="status in uniqueStatuses"
                                :key="status"
                                @click="selectStatus(status)"
                                :class="{'bg-[#3C2D59]': selectedStatus === status, 'bg-[#1B0E3B]': selectedStatus !== status}"
                                class="p-2 border-[2px] border-[#3C2D59] rounded-full text-white text-xs"
                            >
                                {{ status }}
                            </button>
                        </div>
                    </div>
                    <div class="flex w-full sm:w-auto sm:hidden flex-col gap-2 items-start sm:self-end">
                        <label for="sort-by" class="text-sm sm:text-base text-[#BBA2C7]">Sort by:</label>
                        <div class="flex flex-row justify-between w-full gap-2">
                            <select id="sort-by" v-model="sortBy" @change="sortClaims" class="p-2 bg-[#3C2D59] rounded-lg text-white">
                                <option value="date">Date</option>
                                <option value="trustScore">Trust Score</option>
                            </select>
                            <button @click="toggleSortOrder" class="flex items-center justify-center gap-2 border-[2px] border-[#3C2D59] rounded-full p-2">
                                <img v-if="sortOrder === 'asc'" src="@/assets/sort-from-bottom-to-top.png" alt="sort" class="w-6 h-6" />
                                <img v-else-if="sortOrder === 'desc'" src="@/assets/sort-from-top-to-bottom.png" alt="sort" class="w-6 h-6" />
                            </button>
                        </div>
                    </div>
                </div>
                <div class="hidden sm:flex flex-col gap-2 items-start self-end">
                    <label for="sort-by" class="text-sm sm:text-base text-[#BBA2C7]">Sort by:</label>
                    <div class="flex flex-row justify-between w-full gap-2">
                        <select id="sort-by" v-model="sortBy" @change="sortClaims" class="p-2 bg-[#3C2D59] rounded-lg text-white">
                            <option value="date">Date</option>
                            <option value="trustScore">Trust Score</option>
                        </select>
                        <button @click="toggleSortOrder" class="flex items-center justify-center gap-2 border-[2px] border-[#3C2D59] rounded-full p-2">
                            <img v-if="sortOrder === 'asc'" src="@/assets/sort-from-bottom-to-top.png" alt="sort" class="w-6 h-6" />
                            <img v-else-if="sortOrder === 'desc'" src="@/assets/sort-from-top-to-bottom.png" alt="sort" class="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div v-for="claim in filteredClaims" :key="claim.id" class="flex flex-col gap-2">
            <div class="flex flex-row gap-2 items-center justify-between">
                <div class="flex flex-row gap-5">
                    <h1 v-if="claim.status === 'questionable'" class="h-fit text-xs sm:text-sm font-semibold rounded-xl border-[3px] p-2 border-[#FF7F27] bg-[#1B0E3B] text-[#FF7F27]">{{ claim.status }}</h1>
                    <h1 v-else-if="claim.status === 'verified'" class="h-fit text-xs sm:text-sm font-semibold rounded-xl border-[2px] p-2 border-[#00FFA3] bg-[#1B0E3B] text-[#00FFA3]">{{ claim.status }}</h1>
                    <h1 v-else-if="claim.status === 'debunked'" class="h-fit text-xs sm:text-sm font-semibold rounded-xl border-[2px] p-2 border-[#BF2A1D] bg-[#1B0E3B] text-[#BF2A1D]">{{ claim.status }}</h1>
                    <div class="flex flex-row gap-2 items-center">
                        <span class="text-sm sm:text-base text-[#BBA2C7]">{{ claim.claim }}</span>
                    </div>
                </div>
                <div class="flex flex-col gap-1 translate-y-1">
                    <h1 v-if="claim.status === 'questionable'" class="text-lg sm:text-2xl font-semibold text-[#FF7F27]">{{ claim.trust_score * 100 }}%</h1>
                    <h1 v-else-if="claim.status === 'verified'" class="text-lg sm:text-2xl font-semibold text-[#00FFA3]">{{ claim.trust_score * 100 }}%</h1>
                    <h1 v-else-if="claim.status === 'debunked'" class="text-lg sm:text-2xl font-semibold text-[#BF2A1D]">{{ claim.trust_score * 100 }}%</h1>
                    <span class="text-sm sm:text-base text-[#BBA2C7]">Trust Score</span>
                </div>
            </div>
            <div class="flex flex-row gap-2 items-center">
                <span class="text-sm sm:text-base text-[#BBA2C7] flex flex-row gap-1 items-center"><img src="@/assets/calendar.png" class="w-4 h-4"/>{{ new Date(claim.date).toLocaleDateString() }}</span>
            </div>
            <div class="flex flex-row gap-2 items-center">
                <img src="@/assets/ai-brain.png" class="w-4" />
                <span class="text-sm sm:text-base text-[#BBA2C7]">AI Analysis</span>
            </div>
            <div class="flex flex-col gap-2 ml-5">
                <span class="text-sm sm:text-base text-[#BBA2C7]">Evidence:</span>
                <a v-for="item in claim.evidence" target="_blank" :key="item.id" :href="item.link" class="flex flex-row justify-between text-sm sm:text-base text-[#9D76E8] p-1 border border-[#3C2D59] rounded-lg">{{ item.title }} <img src="@/assets/arrow-up-right.png" class="w-4 h-4"/></a>
                <span v-if="claim.evidence.length === 0" class="text-sm text-[#BBA2C7] italic">No evidence found</span>
            </div>
            <div class="flex flex-col gap-2 ml-5">
                <span class="text-sm sm:text-base text-[#BBA2C7]">Counter-evidence:</span>
                <a v-for="item in claim.counter_evidence" target="_blank" :key="item.id" :href="item.link" class="flex flex-row justify-between text-sm sm:text-base text-[#9D76E8] p-1 border border-[#3C2D59] rounded-lg">{{ item.title }} <img src="@/assets/arrow-up-right.png" class="w-4 h-4"/></a>
                <span v-if="claim.counter_evidence.length === 0" class="text-sm text-[#BBA2C7] italic">No counter-evidence found</span>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export default defineComponent({
    name: 'DetailView',
    setup() {
        const route = useRoute()
        const router = useRouter()
        const decodedName = computed(() => decodeURIComponent(route.params.name as string))
        const claims = ref([])
        const filteredClaims = ref([])
        const selectedCategory = ref('All')
        const selectedStatus = ref('All Statuses')
        const sortBy = ref('date')
        const sortOrder = ref('desc')
        const searchQuery = ref('')

        const fetchClaims = async (name: string) => {
            try {
                const response = await fetch(`http://localhost:8000/api/v1/claims?influencer_name=${name}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                claims.value = await response.json()
                filteredClaims.value = claims.value
            } catch (error) {
                console.error(error)
            }
        }

        const uniqueCategories = computed(() => {
            const categoriesSet = new Set(claims.value.map((claim: any) => claim.category))
            return ['All', ...Array.from(categoriesSet).slice(0, 6)]
        })

        const uniqueStatuses = computed(() => {
            const statusesSet = new Set(claims.value.map((claim: any) => claim.status))
            return ['All Statuses', ...Array.from(statusesSet)]
        })

        const sortClaims = () => {
            if (sortBy.value === 'date') {
                filteredClaims.value.sort((a: any, b: any) => {
                    const dateA = new Date(a.date).getTime();
                    const dateB = new Date(b.date).getTime();
                    return dateA - dateB;
                });
            } else if (sortBy.value === 'trustScore') {
                filteredClaims.value.sort((a: any, b: any) => a.trust_score - b.trust_score);
            }
            if (sortOrder.value === 'desc') {
                filteredClaims.value.reverse();
            }
        }

        const toggleSortOrder = () => {
            sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
            sortClaims()
        }

        const filterClaims = () => {
            filteredClaims.value = claims.value.filter((claim: any) => {
                const matchesSearch = claim.claim.toLowerCase().includes(searchQuery.value.toLowerCase())
                const matchesStatus = selectedStatus.value === 'All Statuses' || claim.status === selectedStatus.value
                const matchesCategory = selectedCategory.value === 'All' || claim.category === selectedCategory.value
                return matchesSearch && matchesStatus && matchesCategory
            })
            sortClaims()
        }

        const selectCategory = (category: string) => {
            selectedCategory.value = category
            filterClaims()
        }

        const selectStatus = (status: string) => {
            selectedStatus.value = status
            filterClaims()
        }

        const goBack = () => {
            router.back()
        }

        onMounted(() => {
            fetchClaims(decodedName.value)
        })

        return { decodedName, claims, filteredClaims, uniqueCategories, uniqueStatuses, selectedCategory, selectedStatus, sortBy, sortOrder, searchQuery, goBack, sortClaims, filterClaims, selectCategory, selectStatus, toggleSortOrder }
    }
})
</script>