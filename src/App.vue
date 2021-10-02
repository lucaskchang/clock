<template>
  <div id="body">
    <section class="section" id="top-bar">
      <nav class="level">
        <div class="level-left" v-if="information_bools[0]">
          <h1 class="title is-1">{{ getCurrentTime(time) }}</h1>
        </div>
        <div class="level-right" v-if="information_bools[1]">
          <h1 class="title is-1">{{ getBlock() }}</h1>
        </div>
      </nav>
    </section>

    <section class="section" id="mid-bar">
      <nav class="level">
        <div class="level-left" v-if="information_bools[2]">
          <h2 class="subtitle is-3" id="date">{{ time.toDateString() }}</h2>
        </div>
        <div class="level-right" v-if="special_schedule_bool && information_bools[3]">
          <h2 class="subtitle is-3" id="date">SPECIAL SCHEDULE</h2>
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
      <nav class="level is-mobile">
        <div class="level-left">
          <div class="level-item">
            <b-button :type="button_colors[0]" tag="a" href="https://www.bayschoolsf.org/" target="_blank">Bay Site</b-button>
          </div>
          <div class="level-item">
            <b-button label="Lunch Menu" :type="button_colors[1]" @click="launchMenu" />
          </div>
          <div class="level-item">
            <b-button label="Custom Schedule" :type="button_colors[2]" @click="isRescheduleModalActive = true" />
          </div>
          <div class="level-item">
            <b-button label="Customize" :type="button_colors[3]" @click="isCustomizeModalActive = true" />
          </div>
        </div>
      </nav>
    </section>

    <b-modal v-model="isRescheduleModalActive" can-cancel="['escape', 'outside']">
      <form>
        <div class="modal-card" style="width: auto">
          <header class="modal-card-head">
            <p class="modal-card-title">Custom Schedule</p>
            <button type="button" class="delete" @click="isRescheduleModalActive = false"/>
          </header>
          <section class="modal-card-body">
            <b-field label="A Block:">
              <b-input v-model="blocks[0]"></b-input>
            </b-field>
            <b-field label="B Block:">
              <b-input v-model="blocks[1]"></b-input>
            </b-field>
            <b-field label="C Block:">
              <b-input v-model="blocks[2]"></b-input>
            </b-field>
            <b-field label="D Block:">
              <b-input v-model="blocks[3]"></b-input>
            </b-field>
            <b-field label="E Block:">
              <b-input v-model="blocks[4]"></b-input>
            </b-field>
            <b-field label="F Block:">
              <b-input v-model="blocks[5]"></b-input>
            </b-field>
          </section>
          <footer class="modal-card-foot">
            <b-button label="Close" @click="isRescheduleModalActive = false"/>
            <b-button label="Save" type="is-primary" @click="saveBlocks"/>
          </footer>
        </div>
      </form>
    </b-modal>

    <b-modal v-model="isCustomizeModalActive" can-cancel="['escape', 'outside']">
      <form>
        <div class="modal-card" style="width: auto">
          <header class="modal-card-head">
            <p class="modal-card-title">Customize</p>
            <button type="button" class="delete" @click="isCustomizeModalActive = false"/>
          </header>
          <section class="modal-card-body">
            <h4 class="subtitle is-4">Information</h4>
            <nav class="level is-mobile">
              <div class="level-left">
                <div class="level-item">
                  <b-field>
                    <b-checkbox v-model="information_bools[0]">
                      Clock
                    </b-checkbox>
                  </b-field>
                </div>
                <div class="level-item">
                  <b-field>
                    <b-checkbox v-model="information_bools[1]">
                      Block Indicator
                    </b-checkbox>
                  </b-field>
                </div>
                <div class="level-item">
                  <b-field>
                    <b-checkbox v-model="information_bools[2]">
                      Date
                    </b-checkbox>
                  </b-field>
                </div>
                <div class="level-item">
                  <b-field>
                    <b-checkbox v-model="information_bools[3]">
                      Special Schedule Indicator
                    </b-checkbox>
                  </b-field>
                </div>
              </div>
            </nav>

            <h4 class="subtitle is-4">Progress Bar</h4>
            <nav class="level is-mobile">
              <div class="level-left">
                <div class="level-item">
                  <b-field label="Color">
                    <b-select placeholder="Select a color" v-model="progress_color">
                      <option v-for="(color, name) in colors" :value="color" :key="color"> {{ name }} </option>
                    </b-select>
                  </b-field>
                </div>
              </div>
            </nav>

            <h4 class="subtitle is-4">Buttons</h4>
            <nav class="level is-mobile">
              <div class="level-left">
                <div class="level-item">
                  <b-field label="Bay Site">
                    <b-select placeholder="Select a color" v-model="button_colors[0]">
                      <option v-for="(color, name) in colors" :value="color" :key="color"> {{ name }} </option>
                    </b-select>
                  </b-field>
                </div>
                <div class="level-item">
                  <b-field label="Lunch Menu">
                    <b-select placeholder="Select a color" v-model="button_colors[1]">
                      <option v-for="(color, name) in colors" :value="color" :key="color"> {{ name }} </option>
                    </b-select>
                  </b-field>
                </div>
                <div class="level-item">
                  <b-field label="Custom Schedule">
                    <b-select placeholder="Select a color" v-model="button_colors[2]">
                      <option v-for="(color, name) in colors" :value="color" :key="color"> {{ name }} </option>
                    </b-select>
                  </b-field>
                </div>
                <div class="level-item">
                  <b-field label="Customize">
                    <b-select placeholder="Select a color" v-model="button_colors[3]">
                      <option v-for="(color, name) in colors" :value="color" :key="color"> {{ name }} </option>
                    </b-select>
                  </b-field>
                </div>
              </div>
            </nav>
          </section>
          <footer class="modal-card-foot">
            <b-button label="Close" @click="isCustomizeModalActive = false"/>
            <b-button label="Save" type="is-primary" @click="saveCustomizations"/>
          </footer>
        </div>
      </form>
    </b-modal>

    <footer class="footer">
      <div class="content has-text-centered">
        <p><a id="easter-egg" @click="easterEgg">Coded</a> by <a href="https://github.com/FairfieldBW" target="_blank">Lucas Chang</a>. Updated on 10/01/21.</p>
        <p>Found a Bug? Email: lchang24@bayschoolsf.org</p>
      </div>
    </footer>
  </div>
</template>

<script type="text/javascript">
  import scheduleData from "./data/schedule.json";
  import specialScheduleData from "./data/special_schedule.json";

  export default {
    data() {
      return {
        schedule: scheduleData,
        special_schedule: specialScheduleData,
        special_schedule_bool: false,
        information_bools: [true, true, true, true],
        now: new Date(),
        time: new Date(),
        isRescheduleModalActive: false,
        isCustomizeModalActive: false,
        blocks_index: ["A", "B", "C", "D", "E", "F"],
        blocks: ["A", "B", "C", "D", "E", "F"],
        colors: {"White": "is-white", "Black": "is-black", "Light Gray": "is-light", "Dark Gray": "is-dark", "Purple": "is-primary", "Blue": "is-info", "Green": "is-success", "Yellow": "is-warning", "Red": "is-danger"},
        progress_color: "is-success",
        button_colors: ["is-info", "is-warning", "is-danger", "is-primary"],
      }
    },
    methods: {
      saveCustomizations() {
        var customizations = {"information_bools": this.information_bools, "progress_color": this.progress_color, "button_colors": this.button_colors}
        const parsed = JSON.stringify(customizations);
        localStorage.setItem('customizations', parsed);
        this.isCustomizeModalActive = false;
      },
      getName(key) {
        if (this.blocks_index.indexOf(key) != -1) {
          return this.blocks[this.blocks_index.indexOf(key)]
        }
        return key
      },
      saveBlocks() {
        const parsed = JSON.stringify(this.blocks);
        localStorage.setItem('blocks', parsed);
        this.isRescheduleModalActive = false;
      },
      loadSchedule(scheduleData) {
        var output_schedule = scheduleData
        for (const block of Object.values(output_schedule)) {
          for (const start_end of Object.values(block)) {
            start_end[0] = new Date(this.now.getFullYear(), this.now.getMonth(), this.now.getDate(), start_end[0][0], start_end[0][1])
            start_end[1] = new Date(this.now.getFullYear(), this.now.getMonth(), this.now.getDate(), start_end[1][0], start_end[1][1])
          }        
        }
        return output_schedule
      },
      easterEgg() {
        this.$buefy.dialog.alert('Coded this for so long that my eye started twitching!')
      },
      launchMenu() {
        this.$buefy.dialog.alert('Coming Soon.')
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
      getCurrentTime(time) {
        let hour = time.getHours();
        let min = time.getMinutes();
        let sec = time.getSeconds();
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
        return hour + ":" + min + ":" + sec + am_pm
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
          for (const [key, value] of Object.entries(dayDict)) {
            if (this.time >= value[0] && this.time < value[1]) {
              return "Block: " + this.getName(key);
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
      if (localStorage.getItem('blocks')) {
        try {
          this.blocks = JSON.parse(localStorage.getItem('blocks'));
        } catch(e) {
          localStorage.removeItem('blocks');
        }
      }
      if (localStorage.getItem('customizations')) {
        try {
          var customizations = JSON.parse(localStorage.getItem('customizations'));
          this.information_bools = customizations["information_bools"];
          this.progress_color = customizations["progress_color"];
          this.button_colors = customizations["button_colors"];
        } catch(e) {
          localStorage.removeItem('customizations');
        }
      }
    }
  }
</script>