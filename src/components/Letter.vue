<template>
  <div id="body">
    <section class="section">
      <b-steps>
        <b-step-item label="Personal Information" icon="card-account-mail" clickable>
          <b-field label="Name">
            <b-input v-model="name"></b-input>
          </b-field>

          <b-field label="Email">
            <b-input type="email" value="@bayschoolsf.org" maxlength="30" v-model="email"></b-input>
          </b-field>
        </b-step-item>
        <b-step-item label="Recipient" icon="account" clickable>
          <b-field>
            <b-radio v-model="recipient" native-value="Rep1"> Rep 1 </b-radio>
            <b-radio v-model="recipient" native-value="Rep2"> Rep 2 </b-radio>
            <b-radio v-model="recipient" native-value="Rep3"> Rep 3 </b-radio>
            <b-radio v-model="recipient" native-value="Rep4"> Rep 4 </b-radio>
            <b-radio v-model="recipient" native-value="Rep5"> Rep 5 </b-radio>
          </b-field>
        </b-step-item>
        <b-step-item label="Bills" icon="note-text" clickable>
          <b-field>
            <b-radio v-model="bill" native-value="Bill1"> Bill 1 </b-radio>
            <b-radio v-model="bill" native-value="Bill2"> Bill 2 </b-radio>
            <b-radio v-model="bill" native-value="Bill3"> Bill 3 </b-radio>
            <b-radio v-model="bill" native-value="Bill4"> Bill 4 </b-radio>
            <b-radio v-model="bill" native-value="Bill5"> Bill 5 </b-radio>
          </b-field>
        </b-step-item>
      </b-steps>
      <b-button @click="submit">Submit</b-button>
      <b-input v-model="message" type="textarea"></b-input>
    </section>
  </div>
</template>

<script>
export default {
  data() {
    return {
      recipient: "Rep1",
      bill: "Bill1",
      message: "",
      name: "",
      email: ""
    }
  },
  methods: {
    submit() {
      this.message = "Dear " + this.recipient + ", \nHi my name is " + this.name + "\nPlease sign " + this.bill + "\nRegards,\n" + this.name
    }
  }
}
</script>