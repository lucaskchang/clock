<template>
  <div id="body">
    <!-- Clock and Time Left in Block -->
    <section class="section" id="top-bar">
      <nav class="level">
        <div class="level-left" v-if="information_bools['Clock']">
          <h1 class="title is-1">{{ getCurrentTime(time, true) }}</h1>
        </div>
        <div class="level-right" v-if="information_bools['Time Left']">
          <h1 class="title is-1">{{ getBlock() }}</h1>
        </div>
      </nav>
    </section>

    <!-- Date and Special Schedule Indicator -->
    <section class="section" id="mid-bar">
      <nav class="level">
        <div class="level-left" v-if="information_bools['Date']">
          <h2 class="subtitle is-3 subtext" id="date">{{ time.toDateString() }}</h2>
        </div>
        <div class="level-right" v-if="special_schedule_bool && information_bools['Special Schedule Indicator']">
          <h2 class="subtitle is-3 subtext" id="date">SPECIAL SCHEDULE</h2>
        </div>
      </nav>
    </section>

    <!-- Container for Blocks -->
    <div id="block-container" v-if="show_schedule">
      <section class="section block" v-for="(value, key) in getDayDict()" :key="key">
        <b-progress :value="getProgress(value)" size="is-large" :type="progress_color" show-value>
          <nav class="level is-mobile">
            <div class="level-left">
              <p class="level-item">{{ getName(key) }}</p>
            </div>
            <div class="level-right">
              <p class="level-item">{{ getTime(value[0]) + " - " + getTime(value[1]) }}</p>
            </div>
          </nav>
        </b-progress>
      </section>
    </div>

    <!-- Useful Links Dropdown + Buttons to Toggle Modals -->
    <section class="section">
      <nav class="level">
        <div class="level-left">
          <div class="level-item">
            <b-dropdown aria-role="list">
              <template #trigger="{ active }">
                <b-button
                  label="Useful Links"
                  :type="button_colors['Useful Links']"
                  :icon-right="active ? 'menu-up' : 'menu-down'" 
                  rounded
                  />
              </template>

              <b-dropdown-item has-link aria-role="listitem"><a href="https://www.bayschoolsf.org/" target="_blank">Bay Site</a></b-dropdown-item>
              <b-dropdown-item has-link aria-role="listitem"><a href="https://bayschoolsf.instructure.com/" target="_blank">Canvas</a></b-dropdown-item>
              <b-dropdown-item has-link aria-role="listitem"><a href="https://bayschoolsf.myschoolapp.com/" target="_blank">My Bay</a></b-dropdown-item>
            </b-dropdown>
          </div>
          <div class="level-item">
            <b-button label="Lunch Menu" :type="button_colors['Lunch Menu']" @click="isLunchModalActive = true" rounded/>
          </div>
          <div class="level-item">
            <b-button label="Custom Schedule" :type="button_colors['Custom Schedule']" @click="isRescheduleModalActive = true" rounded/>
          </div>
          <div class="level-item">
            <b-button label="Customize" :type="button_colors['Customize']" @click="isCustomizeModalActive = true" rounded/>
          </div>
        </div>
      </nav>
    </section>

    <!-- Lunch Menu Modal -->
    <b-modal v-model="isLunchModalActive">
      <p v-for="index in menu_length" :key="index" class="image">
        <img :src="require('./data/menu/' + index + '.jpg')">
      </p>
    </b-modal>

    <!-- Reschedule Modal for Custom Blocks -->
    <b-modal v-model="isRescheduleModalActive" can-cancel="['escape', 'outside']">
      <div class="modal-card" style="width: auto">
        <header class="modal-card-head">
          <p class="modal-card-title">Custom Schedule</p>
          <button type="button" class="delete" @click="isRescheduleModalActive = false"/>
        </header>
        <section class="modal-card-body">
          <b-field v-for="block in Object.keys(blocks)" :key="block" :label="block + ' Block:'">
            <b-input v-model="blocks[block]"></b-input>
          </b-field>
          <b-field label="Activities + Sports/Drama Block">
            <b-input v-model="activity_name"></b-input>
          </b-field>
          <nav class="level">
            <div class="level-left">
              <div class="level-item">
                <h6 class="title is-6">Activities Schedule</h6>
              </div>
              <div class="level-item">
                <b-tag type="is-info" rounded>New!</b-tag>
              </div>
            </div>
          </nav>
          <b-tabs v-model="activities_tabs">
            <b-tab-item v-for="(value, key) in activities_schedule" :label="key" :key="key">
              <b-timepicker v-model="value[0]" placeholder="Start Time" icon="clock"></b-timepicker>
              <b-timepicker v-model="value[1]" placeholder="End Time" icon="clock"></b-timepicker>
            </b-tab-item>
          </b-tabs>
        </section>
        <footer class="modal-card-foot">
          <b-button label="Close" @click="isRescheduleModalActive = false"/>
          <b-button label="Save" type="is-primary" @click="saveBlocks"/>
        </footer>
      </div>
    </b-modal>

    <!-- Customizable Styles Modal -->
    <b-modal v-model="isCustomizeModalActive" can-cancel="['escape', 'outside']">
      <div class="modal-card" style="width: auto">
        <header class="modal-card-head">
          <p class="modal-card-title">Customize</p>
          <button type="button" class="delete" @click="isCustomizeModalActive = false"/>
        </header>
        <section class="modal-card-body">
          <h4 class="subtitle is-4">Information</h4>
          <h5 class="subtitle is-5">Toggles</h5>
          <nav class="level">
            <div class="level-left">
              <div class="level-item">
                <b-field>
                  <b-checkbox v-for="item in Object.keys(information_bools)" :key="item" v-model="information_bools[item]">
                    {{ item }}
                  </b-checkbox>
                </b-field>
              </div>
            </div>
          </nav>
          <h5 class="subtitle is-5">Other Options</h5>
          <nav class="level">
            <div class="level-left">
              <div class="level-item">
                <b-field>
                  <b-checkbox v-for="item in Object.keys(other_options)" :key="item" v-model="other_options[item]">
                    {{ item }}
                  </b-checkbox>
                </b-field>
              </div>
              <div class="level-item">
                <b-field>
                  <b-checkbox v-model="activities_bool">
                    Toggle Activities
                  </b-checkbox>
                </b-field>
              </div>
            </div>
          </nav>

          <h4 class="subtitle is-4">Progress Bar</h4>
          <nav class="level">
            <div class="level-left">
              <div class="level-item">
                <b-field label="Color">
                  <b-select placeholder="Select a color" v-model="progress_color">
                    <option disabled>Default Colors:</option>
                    <option v-for="(color, name) in bar_possible_colors" :value="color" :key="color"> {{ name }} </option>
                    <option disabled>Olympic Team Colors:</option>
                    <option v-for="(color, name) in olympic_teams" :value="color" :key="color"> {{ name.replace(/^\w/, (c) => c.toUpperCase()) }} </option>
                  </b-select>
                </b-field>
              </div>
            </div>
          </nav>

          <h4 class="subtitle is-4">Buttons</h4>
          <nav class="level">
            <div class="level-left">
              <div v-for="(button_color, button_name) in button_colors" :key="button_color" class="level-item">
                <b-field :label="button_name">
                  <b-select placeholder="Select a color" v-model="button_colors[button_name]">
                    <option disabled>Default Colors:</option>
                    <option v-for="(color, name) in btn_possible_colors" :value="color" :key="color"> {{ name }} </option>
                    <option disabled>Olympic Team Colors:</option>
                    <option v-for="(color, name) in olympic_teams" :value="color" :key="color"> {{ name.replace(/^\w/, (c) => c.toUpperCase()) }} </option>
                  </b-select>
                </b-field>
              </div>
            </div>
          </nav>

          <h4 class="subtitle is-4">Presets</h4>
          <h5 class="subtitle is-5">Rep your Olympic Team!</h5>
          <b-field>
            <b-radio-button v-for="color in Object.keys(olympic_teams)" :key="color" v-model="preset" :native-value="color" :type="'is-'+color+'-team is-light is-outlined'" @click.native.prevent="setPreset(color)">
              <span>{{ color.replace(/^\w/, (c) => c.toUpperCase()) }}</span>
            </b-radio-button>
          </b-field>
          <h5 class="subtitle is-5">Other</h5>
          <b-field>
            <b-radio-button v-for="(value, name) in presets" :key="name" v-model="preset" :native-value="name" :type="'is-'+value['color']+' is-light is-outlined'" @click.native.prevent="setPreset(name)">
              <span>{{ name }}</span>
            </b-radio-button>
          </b-field>
        </section>
        <footer class="modal-card-foot">
          <b-button label="Close" @click="isCustomizeModalActive = false"/>
          <b-button label="Save" type="is-primary" @click="saveCustomizations"/>
        </footer>
      </div>
    </b-modal>

    <!-- Credits Modal -->
    <b-modal v-model="isCreditsModalActive" can-cancel="['escape', 'outside']">
      <div class="modal-card" style="width: auto">
        <header class="modal-card-head">
          <p class="modal-card-title">Credits</p>
          <button type="button" class="delete" @click="isCreditsModalActive = false"/>
        </header>
        <section class="modal-card-body">
          <p>Bao AiDan: Design Help and the Original Idea</p>
          <p>Mr. Swag: Design Help</p>
          <p>Timbo: Moral Support</p>
          <p>Jay Cob:</p>
          <p>Reed: Read</p>
          <p>Tim: Getting into an argument and then realizing we were agreeing with him.</p>
        </section>
        <footer class="modal-card-foot">
          <b-button label="Close" @click="isCreditsModalActive = false"/>
        </footer>
      </div>
    </b-modal>

    <!-- Footer -->
    <footer class="footer">
      <div class="content has-text-centered">
        <p>Coded by <a href="https://github.com/FairfieldBW" target="_blank">Lucas Chang</a></p>
        <p>
          <a href="https://github.com/FairfieldBW/clock" target="_blank">Github Repo</a> / 
          <a @click="isCreditsModalActive = true">Credits</a> / 
          <a @click="bugReport()">Bug Report</a>
        </p>
      </div>
    </footer>
  </div>
</template>

<script type="text/javascript">
  import scheduleData from "./data/schedule.json";
  import specialScheduleData from "./data/special_schedule.json";
  import immersivesData from "./data/immersives.json";
  import breaksData from "./data/breaks.json"
  import presetsData from "./data/presets.json";

  export default {
    data() {
      return {
        // Time Variable
        time: new Date(),

        // JSON Data
        schedule: scheduleData,
        special_schedule: specialScheduleData,
        immersives: immersivesData,
        breaks: breaksData,
        presets: presetsData,

        // Modal Bools
        isRescheduleModalActive: false,
        isCustomizeModalActive: false,
        isLunchModalActive: false,
        isCreditsModalActive: false,

        // Customizable Styles Variables
        information_bools: {"Clock": true, "Time Left": true, "Date": true, "Special Schedule Indicator": true},
        other_options: {"Detailed Time Left": false},
        button_colors: {"Useful Links": "", "Lunch Menu": "", "Custom Schedule": "", "Customize": ""},
        olympic_teams: {'blue': "is-blue-team", 'crimson': "is-crimson-team", 'orange': "is-orange-team", "gold": "is-gold-team", "green": "is-green-team", "grey": "is-grey-team", "pink": "is-pink-team", "purple": "is-purple-team"},
        blocks: {"A": "A", "B": "B", "C": "C", "D": "D", "E": "E", "F": "F"},
        btn_possible_colors: {"Black": "is-black", "Gray": "is-dark", "Green": "is-primary", "Blue": "is-info", "Yellow": "is-warning", "Red": "is-danger", "None": ""},
        bar_possible_colors: {"Gray": "is-dark", "Green": "is-primary", "Blue": "is-info", "Yellow": "is-warning", "Red": "is-danger"},
        progress_color: "is-primary",
        preset: "",

        // Activities Variables
        activities_bool: true,
        activities_schedule: {"Monday": [[15, 45], [17, 0]], "Tuesday": [[15, 45], [17, 0]], "Wednesday": [[15, 45], [17, 0]], "Thursday": [[14, 35], [16, 0]], "Friday": [[14, 35], [16, 0]]},
        
        activity_name: "Activities + Sports/Drama Block",
        activities_tabs: 0,

        // Other Variables
        menu_length: 0,
        special_schedule_bool: false,
        show_schedule: true
      }
    },
    methods: {
      bugReport() {
        this.$buefy.dialog.alert('Email lchang24@bayschoolsf.org')
      },
      // Sets the preset given either an olympic color or a preset defined in the 'presets.json' file
      setPreset(preset) {
        this.preset = preset;
        if (preset in this.olympic_teams) {
          var color_class = "is-" + preset + "-team"
          this.progress_color = color_class
          this.button_colors = {"Useful Links": color_class, "Lunch Menu": color_class, "Custom Schedule": color_class, "Customize": color_class}
        } else {
          this.progress_color = this.presets[preset]["progress_color"]
          this.button_colors = this.presets[preset]["button_colors"]
        }
      },
      // Saves Custom Styles to Local Storage
      saveCustomizations() {
        var customizations = {"information_bools": this.information_bools, "progress_color": this.progress_color, "button_colors": this.button_colors, "other_options": this.other_options}
        const parsed = JSON.stringify(customizations);
        localStorage.setItem('customizations', parsed);
        this.isCustomizeModalActive = false;
      },
      // Saves Custom Blocks to Local Storage
      saveBlocks() {
        const parsed = JSON.stringify(this.blocks);
        localStorage.setItem('blocks', parsed);

        var temp_activities_schedule = {}
        for (const [name, start_end] of Object.entries(this.activities_schedule)) {
          temp_activities_schedule[name] = [[start_end[0].getHours(), start_end[0].getMinutes()], [start_end[1].getHours(), start_end[1].getMinutes()]]
        }

        var activity_data = {"activities_bool": this.activities_bool, "activities_schedule": temp_activities_schedule, "activity_name": this.activity_name}
        const parsed2 = JSON.stringify(activity_data);
        localStorage.setItem("activity_data", parsed2)

        this.isRescheduleModalActive = false;
      },
      // Returns the name of blocks
      getName(key) {
        if (key == "Activities + Sports/Drama Block") {
          return this.activity_name
        }
        if (key in this.blocks) {
          return this.blocks[key]
        }
        return key
      },
      // Turns lists of numbers into date objects so that they can be compared
      loadSchedule(scheduleData) {
        var output_schedule = scheduleData;
        var now = this.time;
        for (const block of Object.values(output_schedule)) {
          if (Object.prototype.toString.call(block) == '[object Array]') {
            block[0] = new Date(block[0]);
            block[1] = new Date(block[1]);
          } else {
            for (const start_end of Object.values(block)) {
              start_end[0] = new Date(now.getFullYear(), now.getMonth(), now.getDate(), start_end[0][0], start_end[0][1])
              start_end[1] = new Date(now.getFullYear(), now.getMonth(), now.getDate(), start_end[1][0], start_end[1][1])
            }
          }   
        }
        return output_schedule
      },
      // Get the amount of time left in the current block
      getTimeLeft(time) {
        var output = "";
        var mins = 0;
        if (this.other_options["Detailed Time Left"]) {
          var hours = Math.floor(time/3600000)
          mins = Math.floor((time%3600000)/60000)
          var secs = Math.floor(((time%3600000)%60000)/1000)
          if (hours != 0) {output += hours + ":"}
          mins = mins < 10 ? "0" + mins : mins;
          secs = secs < 10 ? "0" + secs : secs;
          output += mins + ":" + secs
        } else {
          mins = Math.floor(time/60000)
          output += mins + " minutes"
        }
        return output
      },
      // Returns the schedule dictionary for the current day
      getDayDict() {
        // Checks for special schedule
        for (const date of Object.keys(this.special_schedule)) {
          var date_object = new Date(date);
          if (date_object.getFullYear() === this.time.getFullYear() && date_object.getMonth() === this.time.getMonth() && date_object.getDate() === this.time.getDate()) {
            this.special_schedule_bool = true;
            return this.special_schedule[date]
          }
        }

        // Checks if it is an immersive
        if (this.time > this.immersives["Immersive1"][0] && this.time < this.immersives["Immersive1"][1]) {
          return this.immersives["Immersive1 Schedule"]
        } else if (this.time > this.immersives["Immersive2"][0] && this.time < this.immersives["Immersive2"][1]) {
          return this.immersives["Immersive2 Schedule"]
        }

        this.special_schedule_bool = false;
        if (this.activities_bool) {
          var temp_schedule = Object.values(this.schedule)[this.time.getDay() - 1]
          temp_schedule["Activities + Sports/Drama Block"] = Object.values(this.activities_schedule)[this.time.getDay() - 1]
          return temp_schedule
        }
        return Object.values(this.schedule)[this.time.getDay() - 1]
      },
      // Turns date object into time formatted in the HH:MM:SS format with optional meridiem
      getCurrentTime(time, meridiem_bool) {
        let hour = this.time.getHours();
        let min = this.time.getMinutes();
        let sec = this.time.getSeconds();
        var am_pm = "AM";
        if (hour > 11) {
          if (hour != 12){
            hour -=12
          }
          am_pm = "PM";
        }
        min = min < 10 ? "0" + min : min;
        sec = sec < 10 ? "0" + sec : sec;
        if (meridiem_bool) {
          return hour + ":" + min + ":" + sec + am_pm
        }
        else {
          return hour + ":" + min + ":" + sec
        }
      },
      // Returns how far it is into the current block as a number betwen 0 and 100
      getProgress(block) {
        var block_length = parseInt((block[1] - block[0])/1000)/60
        var progress = parseInt((this.time - block[0])/1000)/60

        return Math.round(progress / block_length * 100)
      },
      // Turns date object into time formatted in the HH:MM format
      getTime(time) {
        let hour = time.getHours();
        let min = time.getMinutes();
        if (hour > 11) {
          if (hour != 12){
            hour -=12
          }
        }
        hour = hour < 10 ? "0" + hour : hour;
        min = min < 10 ? "0" + min : min;
        return hour + ":" + min
      },
      // Returns First Period Given the Schedule for the Day
      getFirstPeriod(day) {
        return Object.values(day)[0][0]
      },
      // Returns Last Period Given the Schedule for the Day
      getLastPeriod(day) {
        return Object.values(day)[Object.keys(day).length - 1][1]
      },
      // Returns "block"; Returns either the name of the current break, 'Weekend', 'School hasn't started', 'School is over', the amount of time left in the block, or 'Passing'
      getBlock() {
        // Get the Schedule for Today
        for (const [name, start_end] of Object.entries(this.breaks)) {
          var break_start = new Date(start_end[0]);
          var break_end = new Date(start_end[1]);
          if (this.time > break_start && this.time < break_end) {
            this.show_schedule = false;
            return name
          }
        }
        if (this.time.getDay() == 0 || this.time.getDay() == 6) {
          this.show_schedule = false;
          return "Weekend";
        }

        var dayDict = this.getDayDict()
        delete dayDict["Activities + Sports/Drama Block"]

        if (this.time < this.getFirstPeriod(dayDict))
        {
          this.show_schedule = true;
          return "School hasn't started";
        }
        else if (this.time > this.getLastPeriod(dayDict))
        {
          this.show_schedule = true;
          return "School is over";
        }
        else {
          this.show_schedule = true;
          for (const value of Object.values(dayDict)) {
            if (this.time >= value[0] && this.time < value[1]) {
              var dif = value[1] - this.time
              return this.getTimeLeft(dif) + " left"
            }
          }
          return "Passing"
        }
      },
      // Update Time and Page Title Every Second
      tick () {
        this.time = new Date();
        document.title = this.getBlock()
      }
    },
    created () {
      // Load Schedules; Turn Lists of start and end times into dates
      this.schedule = this.loadSchedule(this.schedule)
      this.immersives = this.loadSchedule(this.immersives)
      this.special_schedule = this.loadSchedule(this.special_schedule)

      if (localStorage.getItem('blocks')) {
        try {
          this.blocks = JSON.parse(localStorage.getItem('blocks'));
          for (const block_name of Object.keys(this.blocks)) {
            if (block_name == "Activies + Sports/Drama") {
              delete this.blocks["Activies + Sports/Drama"]
              this.saveBlocks()
            } else if (block_name == "Activities + Sports/Drama") {
              delete this.blocks["Activities + Sports/Drama"]
              this.saveBlocks()
            }
          }
        } catch(e) {
          localStorage.removeItem('blocks');
        }
      }

      // Load Saved Styles from Local Storage
      if (localStorage.getItem('customizations')) {
        try {
          var custom_looks = JSON.parse(localStorage.getItem('customizations'));
          this.information_bools = custom_looks["information_bools"];
          this.progress_color = custom_looks["progress_color"];
          this.button_colors = custom_looks["button_colors"];
          this.other_options = custom_looks["other_options"]
        } catch(e) {
          localStorage.removeItem('customizations');
        }
      }

      // Load Activity Data from Local Storage
      if (localStorage.getItem('activity_data')) {
        try {
          var activity_datum = JSON.parse(localStorage.getItem('activity_data'));
          this.activities_bool = activity_datum["activities_bool"];
          this.activities_schedule = activity_datum["activities_schedule"];
          this.activity_name = activity_datum["activity_name"];
        } catch(e) {
          localStorage.removeItem('activity_data');
        }
      }

      for (const [name, start_end] of Object.entries(this.activities_schedule)) {
        this.activities_schedule[name] = [new Date(this.time.getFullYear(), this.time.getMonth(), this.time.getDate(), start_end[0][0], start_end[0][1]), new Date(this.time.getFullYear(), this.time.getMonth(), this.time.getDate(), start_end[1][0], start_end[1][1])]
      }

      // Set Menu Length
      const menu = require.context('@/data/menu')
      this.menu_length = menu.keys().length

      // Repeat Tick Function Every One Second
      setInterval(this.tick, 1000);
    }
  }
</script>