<template>
    <div v-if="visible" class="disclaimer border-gray-800 bg-gray-800 text-gray-200 p-1 px-6 flex justify-between items-center">
        <span>Application is still in Beta. You might encounter some errors / bugs. Compute time is usually long and can fail without warning. (retry multiple times)</span>
        <button @click="closeDisclaimer" class="text-gray-200 hover:text-gray-200"> X </button>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
    name: 'DisclaimerComponent',
    setup() {
        const visible = ref(true);

        const closeDisclaimer = () => {
            visible.value = false;
        };

        return {
            visible,
            closeDisclaimer,
        };
    },
});
</script>

<style scoped>
/* No additional styles needed as Tailwind CSS is used */
</style>