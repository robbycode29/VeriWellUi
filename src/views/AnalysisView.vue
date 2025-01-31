<template>
    <div class="flex flex-col gap-5 p-8 pt-2 sm:p-16 sm:pt-5 bg-[#130A29] rounded-xl text-white w-full">
        <button @click="goBack" class="self-start sm:-translate-x-5">
            <img src="@/assets/arrow-left.png" class="w-6 h-6" />
        </button>
        <div class="flex flex-col gap-2">
            <h1 class="text-lg sm:text-2xl font-semibold">Research Tasks</h1>
            <span class="text-sm sm:text-base text-[#BBA2C7]">Run an in-depth analysis on an influencer or multiple influencers. This will help you make an informed decision on whether to trust the influencer(s) or not.</span>
        </div>

        <!-- Researches Table -->
        <div class="overflow-x-auto overflow-y-auto max-h-[300px] rounded-xl bg-[#1B0E3B] border-[2px] border-[#3C2D59] shadow-lg custom-scrollbar">
            <table class="min-w-full">
                <thead class="sticky top-0 bg-[#1B0E3B] h-12">
                <tr>
                    <th class="px-4 py-2 text-left text-sm font-medium text-[#BBA2C7]">Research ID</th>
                    <th class="px-4 py-2 text-left text-sm font-medium text-[#BBA2C7]">Type</th>
                    <th class="px-4 py-2 text-left text-sm font-medium text-[#BBA2C7]">Influencers</th>
                    <th class="px-4 py-2 text-left text-sm font-medium text-[#BBA2C7]">Date</th>
                </tr>
                </thead>
                <tbody>
                <tr v-if="isLoading" class="border-t border-[#3C2D59] h-12">
                    <td class="px-4 py-2 text-sm" colspan="1">
                        {{ researchType === 'single' ? `RS - ${researchId}` : `RB - ${researchId}`}}
                    </td>
                    <td class="px-4 py-2 text-sm" colspan="1">
                        <SkeletonLoader width="100%" height="20px" />
                    </td>
                    <td class="px-4 py-2 text-sm" colspan="1">
                        <SkeletonLoader width="100%" height="20px" />
                    </td>
                    <td class="px-4 py-2 text-sm" colspan="1">
                        <SkeletonLoader width="100%" height="20px" />
                    </td>
                </tr>
                <tr v-for="research in researches" :key="research.id" class="border-t border-[#3C2D59] h-12">
                    <td class="px-4 py-2 text-sm">{{ research.name }}</td>
                    <td class="px-4 py-2 text-sm">{{ research.type }}</td>
                    <td class="px-4 py-2 text-sm">
                        <router-link v-for="(influencer, index) in research.influencersArray" :key="index" :to="{ name: 'Detail', params: { name: encodeURIComponent(influencer) } }" class="text-[#9D76E8] hover:underline">
                            {{ influencer }}<span v-if="index < research.influencersArray.length - 1">, </span>
                        </router-link>
                    </td>
                    <td class="px-4 py-2 text-sm">{{ research.date }}</td>
                </tr>
                </tbody>
            </table>
        </div>

        <!-- Message while research is in progress -->
        <div v-if="isLoading" class="flex flex-row items-center gap-2 p-5 bg-[#1B0E3B] border-[2px] border-[#3C2D59] rounded-xl">
            <img src="@/assets/ai-brain.png" class="w-6 h-6 pulse" />
            <span class="text-xs sm:text-base text-[#BBA2C7]">Research is in progress...</span>
        </div>

        <!-- Error message -->
        <div v-if="failed" class="flex flex-row items-center gap-2 p-5 bg-[#1B0E3B] border-[2px] border-[#3C2D59] rounded-xl">
            <img src="@/assets/error.png" class="w-6 h-6" />
            <span class="text-xs sm:text-base text-[#BBA2C7]">Perplexity API output error. Please try again.</span>
        </div>

        <!-- Loading configuration (same layout) -->
        <div v-if="isLoading" class="flex flex-col gap-5 p-5 bg-[#1B0E3B] border-[2px] border-[#3C2D59] rounded-xl">
            <div class="flex flex-row gap-1 w-full">
                <SkeletonLoader width="50%" height="20px" />
                <SkeletonLoader width="50%" height="20px" />
            </div>

            <div class="flex flex-col gap-2 p-2 border-[2px] border-[#3C2D59] rounded-lg">
                <div class="flex flex-wrap gap-2">
                    <SkeletonLoader width="50%" height="20px" />
                    <SkeletonLoader width="50%" height="20px" />
                    <SkeletonLoader width="50%" height="20px" />
                    <SkeletonLoader width="50%" height="20px" />
                </div>
                <SkeletonLoader width="100%" height="20px" />
            </div>
            <button class="p-2 bg-[#3C2D59] rounded-lg border-2 border-[#3C2D59]">
                <SkeletonLoader width="100%" height="20px" />
            </button>
        </div>

        <!-- Configuration Section -->
        <div v-if="!isLoading" class="flex flex-col gap-5 p-5 bg-[#1B0E3B] border-[2px] border-[#3C2D59] rounded-xl">
            <div class="flex flex-row gap-1 w-full">
                <button @click="selectResearchType('single')" :class="{'bg-[#3C2D59] border-[#9D76E8]': researchType === 'single', 'bg-[#130A29] border-[#3C2D59]': researchType !== 'single'}" class="p-2 rounded-lg w-full border-2">Specific Influencer</button>
                <button @click="selectResearchType('bulk')" :class="{'bg-[#3C2D59] border-[#9D76E8]': researchType === 'bulk', 'bg-[#130A29] border-[#3C2D59]': researchType !== 'bulk'}" class="p-2 rounded-lg w-full border-2">Discover New</button>
            </div>
            <div class="flex flex-col sm:flex-row gap-5">
                <div class="grid grid-cols-2 gap-2 w-full">
                    <button v-for="range in timeRanges" :key="range" @click="selectTimeRange(range)" :class="{'bg-[#3C2D59] border-[#9D76E8]': selectedTimeRange === range, 'bg-[#130A29] border-[#3C2D59]': selectedTimeRange !== range}" class="p-2 rounded-lg border-2">{{ range }}</button>
                </div>
                <div class="flex flex-col gap-2 w-full">
                    <div v-if="researchType === 'single'" class="flex flex-col">
                        <label for="influencerName" class="text-sm sm:text-base text-[#BBA2C7]">Influencer Name</label>
                        <input v-model="influencerName" type="text" id="influencerName" class="p-2 bg-[#3C2D59] rounded-lg text-white" />
                        <label for="claimsToAnalyze" class="text-sm sm:text-base text-[#BBA2C7]">Claims to Analyze</label>
                        <input v-model="claimsToAnalyze" type="number" id="claimsToAnalyze" class="p-2 bg-[#3C2D59] rounded-lg text-white" />
                    </div>
                    <div v-else class="flex flex-col">
                        <label for="numInfluencers" class="text-sm sm:text-base text-[#BBA2C7]">Number of Influencers to Analyze</label>
                        <input v-model="numInfluencers" type="number" id="numInfluencers" class="p-2 bg-[#3C2D59] rounded-lg text-white" />
                    </div>
                </div>
            </div>
            <div class="flex flex-row items-center gap-2">
                <span class="text-sm sm:text-base text-[#BBA2C7]">Verify with scientific journals</span>
                <input type="checkbox" v-model="verifyWithJournals" @change="populateSelectedJournals" class="toggle-checkbox" />
            </div>
            <div v-if="verifyWithJournals" class="flex flex-col gap-2 p-2 border-[2px] border-[#3C2D59] rounded-lg">
                <div class="grid grid-cols-2 gap-2">
                    <label
                        v-for="journal in journals"
                        :key="journal"
                        @click="selectJournal(journal)"
                        :class="{
                'flex flex-row justify-between items-center gap-2 border border-[#3C2D59] p-2 rounded-lg cursor-pointer': true,
                'bg-[#3C2D59] border-[#9D76E8]': selectedJournals.includes(journal)
            }"
                    >
                        {{ journal }}
                    </label>
                </div>
                <button @click="openAddJournalModal" class="text-[#BBA2C7] mt-4">+ Add New Journal</button>
            </div>
            <textarea v-model="notes" class="resize-none h-[140px] p-2 bg-[#3C2D59] rounded-lg text-white" placeholder="Notes for Research Assistant"></textarea>
            <div class="flex flex-col gap-2">
                <label for="apiKey" class="text-sm sm:text-base text-[#BBA2C7]">API Key</label>
                <input v-model="apiKey" type="text" id="apiKey" class="p-2 bg-[#3C2D59] rounded-lg text-white border-2 border-[#3C2D59]" placeholder="Default key will be used if empty" />
            </div>
            <div v-if="apiKey" class="flex flex-col gap-2">
                <label for="model" class="text-sm sm:text-base text-[#BBA2C7]">Model</label>
                <select v-model="model" id="model" class="p-2 bg-[#3C2D59] rounded-lg text-white border-2 border-[#3C2D59]">
                    <option value="sonar">Sonar</option>
                    <option value="sonar-pro">Sonar Pro</option>
                </select>
            </div>
            <button @click="createResearch" class="p-2 bg-[#3C2D59] rounded-lg border-2 border-[#3C2D59]">Create Research</button>
        </div>

        <!-- Disclaimer section -->
        <div class="flex flex-col gap-2 border-[2px] border-gray-600 bg-gray-800 rounded-xl p-2">
            <span class="text-sm sm:text-base text-[#BBA2C7]">Disclaimer: The research will add the claims to the influencer's profile if it already exists. The research may not return the number of claims requested in the configuration if the claim duplicates an existing one (duplicates are calculated based on Levenshtein distance, when similarity is greater than 0.6), thus researches may not always increase the number of claims on a profile (may not always yield results).</span>
        </div>

        <!-- Add journal modal -->
        <AddJournalModal :isVisible="isAddJournalModalVisible" @close="closeAddJournalModal" @add="handleAddJournal" />
    </div>
</template>

<script lang="ts">
import {defineComponent, onMounted, ref} from 'vue'
import SkeletonLoader from "@/components/SkeletonLoader.vue";
import research from "@/components/Research.vue";
import AddJournalModal from "@/components/AddJournalModal.vue";

export default defineComponent({
    name: 'AnalysisView',
    computed: {
        research() {
            return research
        }
    },
    components: {
        SkeletonLoader,
        AddJournalModal
    },
    setup() {
        const researches = ref([]) as any
        const researchType = ref('single') as any
        const timeRanges = ['Last Week', 'Last Month', 'Last Year', 'All Time'] as any
        const selectedTimeRange = ref('All Time') as any
        const influencerName = ref('') as any
        const numInfluencers = ref(1) as any
        const claimsToAnalyze = ref(1) as any
        const verifyWithJournals = ref(false) as any
        const journals = ['PubMed Central', 'Nature', 'Science', 'Cell', 'The Lancet', 'New England Journal of Medicine', 'JAMA Network'] as any
        const selectedJournals = ref([]) as any
        const notes = ref('') as any
        const model = ref('sonar') as any
        const apiKey = ref('') as any
        const isLoading = ref(false) as any
        const researchId = ref('') as any
        const failed = ref(false) as any
        const isAddJournalModalVisible = ref(false);

        const openAddJournalModal = () => {
            isAddJournalModalVisible.value = true;
        };

        const closeAddJournalModal = () => {
            isAddJournalModalVisible.value = false;
        };

        const handleAddJournal = (journal: string) => {
            journals.push(journal);
        };

        const selectJournal = (journal: string) => {
            if (selectedJournals.value.includes(journal)) {
                selectedJournals.value = selectedJournals.value.filter((j: any) => j !== journal);
            } else {
                selectedJournals.value.push(journal);
            }
        };

        const populateSelectedJournals = () => {
            if (verifyWithJournals.value) {
                selectedJournals.value = journals;
            } else {
                selectedJournals.value = [];
            }
        };

        const fetchResearches = async () => {
            try {
                const bulkResponse = await fetch(`http://localhost:8000/api/v1/bulk_researches/`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                const singleResponse = await fetch(`http://localhost:8000/api/v1/single_researches/`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                const bulkResearches = await bulkResponse.json()
                const singleResearches = await singleResponse.json()

                const formattedBulkResearches = bulkResearches
                    .filter((research: any) => research.influencers.length > 0)
                    .map((research: any) => ({
                    id: research.id,
                    type: 'Bulk',
                    name: `RB - ${research.id}`,
                    date: new Date(research.created_at).toLocaleString(),
                    influencers: research.influencers.map((influencer: any) => influencer.name).join(', '),
                    influencersArray: research.influencers.map((influencer: any) => influencer.name)
                }))
                const formattedSingleResearches = singleResearches
                    .filter((research: any) => research.influencer)
                    .map((research: any) => ({
                    id: research.id,
                    type: 'Single',
                    name: `RS - ${research.id}`,
                    date: new Date(research.created_at).toLocaleString(),
                    influencers: research.influencer?.name,
                    influencersArray: [research.influencer?.name]
                }))

                const combinedResearches = [...formattedBulkResearches, ...formattedSingleResearches];

                combinedResearches.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

                researches.value = combinedResearches;
            } catch (error) {
                console.error(error)
            }
        }

        const constructUrl = (baseUrl: string, params: Record<string, any>) => {
            const urlParams = new URLSearchParams();
            for (const key in params) {
                if (params[key]) {
                    urlParams.append(key, params[key]);
                }
            }
            return `${baseUrl}?${urlParams.toString()}`;
        };

        const initCheck = async () => {
            try {
                if (researchType.value === 'single') {
                    const baseUrl = `http://localhost:8000/api/v1/influencers/check_influencer/`;
                    const params = {
                        research: researchId.value,
                        count: claimsToAnalyze.value,
                        influencer: influencerName.value,
                        timeframe: selectedTimeRange.value,
                        journals: selectedJournals.value,
                        comment: notes.value,
                        key: apiKey.value,
                        model: model.value,
                    };

                    const url = constructUrl(baseUrl, params);

                    await fetch(url, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });
                } else if (researchType.value === 'bulk') {
                    const baseUrl = `http://localhost:8000/api/v1/influencers/check_bulk/`;
                    const params = {
                        research: researchId.value,
                        count: numInfluencers.value,
                        timeframe: selectedTimeRange.value,
                        journals: selectedJournals.value,
                        comment: notes.value,
                        key: apiKey.value,
                        model: model.value,
                    };

                    const url = constructUrl(baseUrl, params);

                    await fetch(url, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });
                }
            } catch (error) {
                console.error(error)
            }
        }

        const createResearch = async () => {
            try {
                isLoading.value = true
                const response = await fetch(`http://localhost:8000/api/v1/influencers/begin_research/?research_type=${researchType.value}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                })
                const data = await response.json()
                researchId.value = data.research_id
                isLoading.value = true
                await initCheck().then(() => {
                    pollResearchCompletion(researchId.value)
                })
            } catch (error) {
                console.error(error)
                isLoading.value = false
            }
        }

        const pollResearchCompletion = (researchId: string) => {
            const intervalId = setInterval(async () => {
                try {
                    const endpoint = researchType.value === 'single'
                        ? `http://localhost:8000/api/v1/single_researches/${researchId}/`
                        : `http://localhost:8000/api/v1/bulk_researches/${researchId}/`;

                    const response = await fetch(endpoint, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
                    const data = await response.json();
                    if (data.influencers || data.influencer) {
                        clearInterval(intervalId);
                        isLoading.value = false;
                        await fetchResearches()
                    } else if (data.failed) {
                        clearInterval(intervalId);
                        isLoading.value = false;
                        failed.value = true;
                        // Handle failure case
                        console.error('Research failed');
                    }
                } catch (error) {
                    clearInterval(intervalId);
                    isLoading.value = false;
                    console.error(error);
                }
            }, 5000);
        };

        const selectResearchType = (type: string) => {
            researchType.value = type
        }

        const selectTimeRange = (range: string) => {
            selectedTimeRange.value = range
        }

        const goBack = () => {
            window.history.back()
        }

        onMounted(() => {
            fetchResearches()
        })

        return {
            researches,
            researchType,
            timeRanges,
            selectedTimeRange,
            influencerName,
            numInfluencers,
            claimsToAnalyze,
            verifyWithJournals,
            journals,
            selectedJournals,
            notes,
            model,
            apiKey,
            isLoading,
            failed,
            researchId,
            isAddJournalModalVisible,
            openAddJournalModal,
            closeAddJournalModal,
            handleAddJournal,
            populateSelectedJournals,
            selectJournal,
            createResearch,
            selectResearchType,
            selectTimeRange,
            goBack
        }
    }
})
</script>

<style scoped>
@keyframes pulse {
    0% {
        transform: scale(1);
    }
    50% {
        transform: scale(1.1);
    }
    100% {
        transform: scale(1);
    }
}

.pulse {
    animation: pulse 1.5s infinite;
}

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

.toggle-checkbox {
    appearance: none;
    width: 40px;
    height: 20px;
    background: #3C2D59;
    border-radius: 10px;
    position: relative;
    cursor: pointer;
    outline: none;
    transition: background 0.3s;
}

.toggle-checkbox:checked {
    background:  #9D76E8;
}

.toggle-checkbox:checked::before {
    transform: translateX(20px);
}

.toggle-checkbox::before {
    content: '';
    position: absolute;
    width: 18px;
    height: 18px;
    background: #130A29;
    border-radius: 50%;
    top: 1px;
    left: 1px;
    transition: transform 0.3s;
}
</style>