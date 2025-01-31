<template>
    <div v-if="isVisible" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div class="bg-[#1B0E3B] p-6 rounded-lg shadow-lg w-96">
            <h2 class="text-lg font-semibold text-white mb-4">Add New Journal</h2>
            <input v-model="newJournal" type="text" placeholder="Journal Name" class="w-full p-2 mb-4 bg-[#3C2D59] rounded-lg text-white" />
            <div class="flex justify-end gap-2">
                <button @click="closeModal" class="px-4 py-2 bg-gray-600 text-white rounded-lg">Cancel</button>
                <button @click="addJournal" class="px-4 py-2 bg-[#9D76E8] text-white rounded-lg">Add</button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
    name: 'AddJournalModal',
    props: {
        isVisible: {
            type: Boolean,
            required: true,
        },
    },
    emits: ['close', 'add'],
    setup(props, { emit }) {
        const newJournal = ref('');

        const closeModal = () => {
            emit('close');
        };

        const addJournal = () => {
            if (newJournal.value.trim()) {
                emit('add', newJournal.value.trim());
                newJournal.value = '';
                closeModal();
            }
        };

        return {
            newJournal,
            closeModal,
            addJournal,
        };
    },
});
</script>

<style scoped>
/* Add any additional styles if needed */
</style>