<template>
  <div class="bg-gray-50 p-6 rounded-xl space-y-4">
    <div class="flex items-start gap-4">
      <div class="p-3 bg-blue-100 rounded-lg">
        <span class="text-xl">🔔</span>
      </div>
      <div>
        <h3 class="font-semibold">Få besked når varen er på lager</h3>
        <p class="text-sm text-gray-600">
          Vi sender dig en email når produktet er tilbage på lager
        </p>
      </div>
    </div>

    <div class="flex gap-2">
      <input 
        :value="email"
        @input="$emit('update:email', $event.target.value)"
        type="email"
        placeholder="Din email"
        class="flex-1 px-4 py-2 rounded-lg border focus:ring-2 focus:ring-black/5"
      >
      <button 
        @click="$emit('submit')"
        :disabled="!isValid"
        class="bg-blue-500 text-white px-6 py-2 rounded-lg disabled:opacity-50
          hover:bg-blue-600 transition-colors duration-200"
      >
        {{ status || 'Tilmeld' }}
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  email: { type: String, required: true },
  status: { type: String, default: '' },
  isValid: { type: Boolean, required: true }
});

defineEmits(['update:email', 'submit']);
</script> 