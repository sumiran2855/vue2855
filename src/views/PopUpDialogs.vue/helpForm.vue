<template>
  <v-dialog v-model="dialog" max-width="600px" class="p-4">
    <v-card class="rounded-lg shadow-lg border border-gray-200">
      <v-card-title class="text-xl font-semibold text-gray-800">
        <span class="headline">Submit an Issue</span>
      </v-card-title>
      <v-card-text>
        <v-form ref="form" class="space-y-4">
          <v-text-field
            v-model="issue.title"
            label="Title of Issue"
            variant="outlined"
            required
            class="rounded-md border-gray-300 shadow-sm focus:ring-blue-500"
          ></v-text-field>
          <v-textarea
            v-model="issue.description"
            label="Description"
            variant="outlined"
            required
            class="rounded-md border-gray-300 shadow-sm focus:ring-blue-500"
          ></v-textarea>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="closeDialog" class="bg-gray-200 rounded-md hover:bg-gray-300">
          Cancel
        </v-btn>
        <v-btn
          text
          @click="submitIssue"
          class="bg-blue-500 text-black rounded-md hover:bg-blue-600"
        >
          Submit
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const dialog = ref(false)
const issue = ref({
  title: '',
  description: ''
})

const closeDialog = () => {
  dialog.value = false
}

const submitIssue = async () => {
  if (!issue.value.title || !issue.value.description) {
    alert('Please fill in all fields')
    return
  }

  try {
    await axios.post('http://localhost:3000/issues/save', issue.value)
    console.log(issue.value)
    alert('Issue submitted successfully')
    issue.value = {
      title: '',
      description: ''
    }
    closeDialog()
  } catch (error) {
    console.error('Error submitting issue:', error)
    alert('Failed to submit issue')
  }
}

const openDialog = () => {
  dialog.value = true
}

onMounted(() => {
  window.addEventListener('open-help-form', openDialog)
})
</script>
