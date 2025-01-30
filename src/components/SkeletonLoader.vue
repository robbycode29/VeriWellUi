<template>
    <div class="skeleton-loader" :style="style"></div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

export default defineComponent({
    name: 'SkeletonLoader',
    props: {
        width: {
            type: String as PropType<string>,
            default: '100%',
        },
        height: {
            type: String as PropType<string>,
            default: '20px',
        },
        borderRadius: {
            type: String as PropType<string>,
            default: '4px',
        },
    },
    computed: {
        style(): any {
            return {
                width: this.width,
                height: this.height,
                borderRadius: this.borderRadius,
            }
        },
    },
})
</script>

<style scoped>
.skeleton-loader {
    background-color: #3C2D59;
    animation: pulse 1.5s infinite;
}

@keyframes pulse {
    0% {
        opacity: 1;
    }
    50% {
        opacity: 0.5;
    }
    100% {
        opacity: 1;
    }
}
</style>