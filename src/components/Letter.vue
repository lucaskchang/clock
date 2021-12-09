<template>
  <div id="body">
    <section class="section">
      <b-steps>
        <b-step-item label="Personal Information" icon="card-account-mail" clickable>
          <b-field label="Name">
            <b-input v-model="name"></b-input>
          </b-field>

          <b-field label="Email">
            <b-input type="email" maxlength="30" v-model="email"></b-input>
          </b-field>
        </b-step-item>
        <b-step-item label="Recipient" icon="account" clickable>
          <b-field>
            <b-radio v-model="recipient" v-for="legislator in Object.keys(legislators)" :key="legislator" :native-value="legislator"> {{ legislator }} </b-radio>
          </b-field>
        </b-step-item>
        <b-step-item label="Bills" icon="note-text" clickable>
          <b-field v-if='legislators[recipient]["type"] == "rep"'>
            <b-tooltip v-for="item in house_bills" :key="item" :label="bill_data[item]['Description']" position="is-right" size="is-large" multilined>
                <b-radio v-model="bill" :native-value="item"> {{ item }} </b-radio>
            </b-tooltip>
          </b-field>
          <b-field v-if='legislators[recipient]["type"] == "senate"'>
            <b-tooltip v-for="item in senate_bills" :key="item" :label="bill_data[item]['Description']" position="is-right" size="is-large" multilined>
                <b-radio v-model="bill" :native-value="item"> {{ item }} </b-radio>
            </b-tooltip>
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
      recipient: "Example Representative",
      bill: "",
      message: "",
      name: "Lucas Chang",
      email: "lchang24@bayschoolsf.org",
      time: new Date(),
      legislators: {
        "Example Representative": {"type": "rep"},
        "Example Senator": {"type": "senate"}
      },
      house_bills: ["H.R.677 - JUSTICE Act", "H.R.1693 - EQUAL Act of 2021", "H.R.176 - Restricting the Use of Solitary Confinement Act", "H.R.128 - RAISE Act of 2021", "H.R.132 - Federal Prison Bureau Nonviolent Offender Relief Act of 2021"],
      senate_bills: ["S.312 - COVID–19 Safer Detention Act of 2021", "S.1014 - First Step Implementation Act of 2021", "S.601 - Prohibiting Punishment of Acquitted Conduct Act of 2021", "S.2899 - Prison Camera Reform Act of 2021", "S.324 - COVID–19 in Corrections Data Transparency Act"],
      bill_data: {
        "S.312 - COVID–19 Safer Detention Act of 2021": {"Description": "This bill shortens the waiting period for judicial review during the COVID–19 pandemic. It also focuses on expanding eligibility for the elderly home detention pilot program and more specificity rules on the compassionate covid 19 releases and other ‘technical’ corrections.", "Status": "introduced to the senate"},
        "H.R.677 - JUSTICE Act": {"Description": "This bill addresses problems with law enforcement officers and police departments. It incentives certain practices with grants. For example, the use of body-worn cameras, sharing systems for disciplinary records of law enforcement officers, and prohibiting officers from engaging in sexual acts while working. Local governments must also report use of force incidents and no knock warrants. It also makes falsifying police reports a crime. It directs the Department of Justice to train in de-escalation tactics, behavioral health crises, alternatives to the use of force, and the duty to intervene when another officer uses excessive force. Finally, the bill creates an organization called the National Criminal Justice Commission.This commision would develop the best practices for police.", "Status": "introduced to the house"},
        "S.1014 - First Step Implementation Act of 2021": {"Description": "This bill “allows for a reduction in mandatory minimum sentences for drug offenses considered non-violent and limits the types of prior offenses that could be used for enhancement. The FSIA would also expand the ability of courts to impose a sentence below a mandatory minimum in drug cases if the court finds the defendant’s criminal history over represents the seriousness of their criminal record or the person is considered not likely to commit other crimes.”", "Status": "introduced to the senate"},
        "S.601 - Prohibiting Punishment of Acquitted Conduct Act of 2021": {"Description": "This bill would end the practice of allowing judges to consider conduct previously acquitted or dismissed in courts, when determining a present sentence.", "Status": "introduced to the senate"},
        "H.R.1693 - EQUAL Act of 2021": {"Description": "This would eliminate the federal crack and powder cocaine sentencing disparity and apply it mainly to those already convicted or sentenced of crimes relating to crack and cocaine.", "Status": "passed in the house"},
        "S.2899 - Prison Camera Reform Act of 2021": {"Description": "This bill requires the Director of the Bureau of Prisons to make sure all camera and radio systems are in working order, to keep guards and inmates safe.", "Status": "passed in the senate"},
        "S.324 - COVID–19 in Corrections Data Transparency Act": {"Description": "This bill would require prisons to collect all the data from collect data on Covid-19 tests, test results, cases, case outcomes, and vaccinations in correctional facilities. It would also require them to make this data publicly available.", "Status": "introduced to the senate"},
        "H.R.176 - Restricting the Use of Solitary Confinement Act": {"Description": "This bill would prevent any inmates from being placed into solitary confinement for any reasons other than protection of harm from others while in jail. It would also require comprehensive medical and mental health examinations of those placed in solitary confinement. Further, inmates who fall under the category of “vulnerable person” would be placed in a medical or other unit instead of solitary confinement. This would also prohibit denying those in solitary confinement basic needs such as medical care, food, or water. It would also limit the amount of time a person can be put into solitary confinement.", "Status": "introduced to the house"},
        "H.R.128 - RAISE Act of 2021": {"Description": "This bill allow judges to impose lower than minimum sentences if the crime is nonviolent.", "Status": "introduced to the house"},
        "H.R.132 - Federal Prison Bureau Nonviolent Offender Relief Act of 2021": {"Description": "This bill would increase the number of nonviolent offenders over the age of 45, who are released from prison early. They must have never been convicted of a violent crime, and can have no history of violently violating their disciplinary regulations. ", "Status": "introduced to the house"}
      }
    }
  },
  methods: {
    submit() {
      this.message = `${this.time.toDateString()}
${this.name}
35 Keyes Ave
San Francisco, CA 94129
${this.email}

Dear ${this.recipient},

I am writing this letter to bring your attention to ${this.bill}. ${this.bill_data[this.bill]["Description"]} This bill is currently ${this.bill_data[this.bill]["Status"]}, but with your help it can pass.

Personal connection

Thank you for taking the time to read this letter. I hope that you take this into account and co-sponsor this bill to help criminal justice reform in the United States.

Sincerely,
${this.name}`
    }
  }
}
</script>