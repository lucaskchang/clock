<template>
  <div id="body">
    <section class="section" id="top-bar">
      <nav class="level">
        <div class="level-left" v-if="information_bools['Clock']">
          <h1 class="title is-1">{{ getCurrentTime(time, true) }}</h1>
        </div>
        <div class="level-right" v-if="information_bools['Block Indicator']">
          <h1 class="title is-1">{{ getBlock() }}</h1>
        </div>
      </nav>
    </section>

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

    <div id="block-container" v-if="time.getDay() != 0 && time.getDay() != 6">
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

    <section class="section">
      <nav class="level">
        <div class="level-left">
          <div class="level-item">
            <b-button :type="button_colors['Bay Site']" tag="a" href="https://www.bayschoolsf.org/" target="_blank" rounded>Bay Site</b-button>
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

    <b-modal v-model="isLunchModalActive">
      <p class="image">
        <img src="./data/menu/1.jpg">
      </p>
      <p class="image">
        <img src="./data/menu/2.jpg">
      </p>
    </b-modal>

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
        </section>
        <footer class="modal-card-foot">
          <b-button label="Close" @click="isRescheduleModalActive = false"/>
          <b-button label="Save" type="is-primary" @click="saveBlocks"/>
        </footer>
      </div>
    </b-modal>

    <b-modal v-model="isCustomizeModalActive" can-cancel="['escape', 'outside']">
      <div class="modal-card" style="width: auto">
        <header class="modal-card-head">
          <p class="modal-card-title">Customize</p>
          <button type="button" class="delete" @click="isCustomizeModalActive = false"/>
        </header>
        <section class="modal-card-body">
          <h4 class="subtitle is-4">Information</h4>
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
          <p>Jay Cob: Design Help?</p>
          <p>Reed: Read</p>
          <p>Tim: Getting into an argument and then realizing we were agreeing with him.</p>
        </section>
        <footer class="modal-card-foot">
          <b-button label="Close" @click="isCreditsModalActive = false"/>
        </footer>
      </div>
    </b-modal>

    <footer class="footer">
      <div class="content has-text-centered">
        <p><a id="easter-egg" @click="easterEgg">Coded</a> by <a href="https://github.com/FairfieldBW" target="_blank">Lucas Chang</a>.</p>
        <p>Found a Bug? Email: lchang24@bayschoolsf.org</p>
        <p><a @click="isCreditsModalActive = true">Other Credits</a>.</p>
      </div>
    </footer>
  </div>
</template>

<script type="text/javascript">
  import scheduleData from "./data/schedule.json";
  import specialScheduleData from "./data/special_schedule.json";
  import presetsData from "./data/presets.json";

  export default {
    data() {
      return {
        time: new Date(),
        schedule: scheduleData,
        special_schedule: specialScheduleData,
        presets: presetsData,
        special_schedule_bool: false,
        isRescheduleModalActive: false,
        isCustomizeModalActive: false,
        isLunchModalActive: false,
        isCreditsModalActive: false,
        information_bools: {"Clock": true, "Block Indicator": true, "Date": true, "Special Schedule Indicator": true},
        button_colors: {"Bay Site": "", "Lunch Menu": "", "Custom Schedule": "", "Customize": ""},
        olympic_teams: {'blue': "is-blue-team", 'crimson': "is-crimson-team", 'orange': "is-orange-team", "gold": "is-gold-team", "green": "is-green-team", "grey": "is-grey-team", "pink": "is-pink-team", "purple": "is-purple-team"},
        blocks: {"A": "A", "B": "B", "C": "C", "D": "D", "E": "E", "F": "F"},
        btn_possible_colors: {"Black": "is-black", "Gray": "is-dark", "Green": "is-primary", "Blue": "is-info", "Yellow": "is-warning", "Red": "is-danger", "None": ""},
        bar_possible_colors: {"Black": "is-black", "Gray": "is-dark", "Green": "is-primary", "Blue": "is-info", "Yellow": "is-warning", "Red": "is-danger"},
        progress_color: "is-success",
        preset: ""
      }
    },
    methods: {
      setPreset(preset) {
        this.preset = preset;
        if (preset in this.olympic_teams) {
          var color_class = "is-" + preset + "-team"
          this.progress_color = color_class
          this.button_colors = {"Bay Site": color_class, "Lunch Menu": color_class, "Custom Schedule": color_class, "Customize": color_class}
        } else {
          this.progress_color = this.presets[preset]["progress_color"]
          this.button_colors = this.presets[preset]["button_colors"]
        }
      },
      saveCustomizations() {
        var customizations = {"information_bools": this.information_bools, "progress_color": this.progress_color, "button_colors": this.button_colors}
        const parsed = JSON.stringify(customizations);
        localStorage.setItem('custom_styles', parsed);
        this.isCustomizeModalActive = false;
      },
      saveBlocks() {
        const parsed = JSON.stringify(this.blocks);
        localStorage.setItem('custom_blocks', parsed);
        this.isRescheduleModalActive = false;
      },
      getName(key) {
        if (key in this.blocks) {
          return this.blocks[key]
        }
        return key
      },
      loadSchedule(scheduleData) {
        var output_schedule = scheduleData;
        var now = this.time;
        for (const block of Object.values(output_schedule)) {
          for (const start_end of Object.values(block)) {
            start_end[0] = new Date(now.getFullYear(), now.getMonth(), now.getDate(), start_end[0][0], start_end[0][1])
            start_end[1] = new Date(now.getFullYear(), now.getMonth(), now.getDate(), start_end[1][0], start_end[1][1])
          }        
        }
        return output_schedule
      },
      easterEgg() {
        this.$buefy.dialog.alert('Coded this for so long that my eye started twitching!')
      },
      getTimeLeft(time) {
        var hours = Math.floor(time/3600000)
        var mins = Math.floor((time%3600000)/60000)
        var secs = Math.floor(((time%3600000)%60000)/1000)
        return hours + ":" + mins + ":" + secs
      },
      getDayDict() {
        for (const date of Object.keys(this.special_schedule)) {
          var date_object = new Date(date);
          if (date_object.getFullYear() === this.time.getFullYear() && date_object.getMonth() === this.time.getMonth() && date_object.getDate() === this.time.getDate()) {
            this.special_schedule_bool = true;
            return this.special_schedule[date]
          }
        }

        this.special_schedule_bool = false;
        return Object.values(this.schedule)[this.time.getDay() - 1]
      },
      dayDictLength() {
        return Object.keys(this.getDayDict()).length
      },
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
        hour = hour < 10 ? "0" + hour : hour;
        min = min < 10 ? "0" + min : min;
        sec = sec < 10 ? "0" + sec : sec;
        if (meridiem_bool) {
          return hour + ":" + min + ":" + sec + am_pm
        }
        else {
          return hour + ":" + min + ":" + sec
        }
      },
      getProgress(block) {
        var block_length = parseInt((block[1] - block[0])/1000)/60
        var progress = parseInt((this.time - block[0])/1000)/60

        return Math.round(progress / block_length * 100)
      },
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
      getFirstPeriod(day) {
        return Object.values(day)[0][0]
      },
      getLastPeriod(day) {
        return Object.values(day)[Object.keys(day).length - 1][1]
      },
      getBlock() {
        var dayDict = this.getDayDict()
        if (this.time.getDay() == 0 || this.time.getDay() == 6) {
          return "Weekend";
        }
        else if (this.time < this.getFirstPeriod(dayDict))
        {
          return "School hasn't started";
        }
        else if (this.time > this.getLastPeriod(dayDict))
        {
          return "School is over";
        }
        else {
          for (const value of Object.values(dayDict)) {
            if (this.time >= value[0] && this.time < value[1]) {
              var dif = this.getCurrentTime(value[1] - this.time, false)
              return this.getTimeLeft(dif) + " left"
            }
          }
          return "Block: Passing"
        }
      },
      tick () {
        this.time = new Date();
        document.title = this.getBlock()
      }
    },
    created () {
      this.schedule = this.loadSchedule(this.schedule)
      this.special_schedule = this.loadSchedule(this.special_schedule)
      setInterval(this.tick, 1000);
    },
    mounted() {
      if (localStorage.getItem('custom_blocks')) {
        try {
          this.blocks = JSON.parse(localStorage.getItem('custom_blocks'));
        } catch(e) {
          localStorage.removeItem('custom_blocks');
        }
      }
      if (localStorage.getItem('custom_styles')) {
        try {
          var custom_looks = JSON.parse(localStorage.getItem('custom_styles'));
          this.information_bools = custom_looks["information_bools"];
          this.progress_color = custom_looks["progress_color"];
          this.button_colors = custom_looks["button_colors"];
        } catch(e) {
          localStorage.removeItem('custom_styles');
        }
      }
    }
  }
</script>