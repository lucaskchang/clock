<template>
  <div id="body">
    <section class="section">
      <h3 class="title is-3">Input Classes:</h3>
      <nav class="level" v-for="block in Object.keys(blocks)" :key="block">
        <div class="level-left">
          <div class="level-item">
            <b-field :label="block + ' Block:'">
              <b-input v-model="blocks[block]"></b-input>
            </b-field>
          </div>
          <div class="level-item">
            <b-field label="Color">
              <b-select placeholder="Select a color" v-model="color_guide[block]">
                <option v-for="(color, name) in btn_possible_colors" :value="color" :key="color"> {{ name }} </option>
              </b-select>
            </b-field>
          </div>
        </div>
      </nav>
    </section>
    <section class="section">
      <h3 class="title is-3">Schedule:</h3>
      <div class="tile is-ancestor">
        <div class="tile is-parent" v-for="day in Object.keys(schedule)" :key="day">
          <article class="tile is-child notification">
            <p class="title">{{ day }}</p>
          </article>
        </div>
      </div>
      <div class="tile is-ancestor">
        <div class="tile is-parent is-vertical" v-for="(schedule_, day) in schedule" :key="day">
          <article v-bind:class="['tile', 'is-child', 'notification', color_guide[block]]" v-for="(start_end, block) in schedule_" :key="block">
            <p class="title">{{ getName(block) }}</p>
            <p class="subtitle">{{ start_end[0][0] + ":" + start_end[0][1] + "-" + start_end[1][0] + ":" + start_end[1][1]}}</p>
          </article>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  data() {
    return {
      schedule: {"Monday":{"Morning Meeting":[[8,30],[8,50]],"A":[[8,55],[10,10]],"B":[[10,15],[11,30]],"Lunch":[[11,30],[12,30]],"C":[[12,30],[13,45]],"D":[[13,50],[15,5]],"Tutorial":[[15,5],[15,35]]},"Tuesday":{"Group Advisory/1-on-1s":[[8,30],[8,50]],"E":[[8,55],[10,10]],"F":[[10,15],[11,30]],"Lunch":[[11,30],[12,30]],"A":[[12,30],[13,45]],"B":[[13,50],[15,5]],"Tutorial":[[15,5],[15,35]]},"Wednesday":{"Morning Meeting":[[8,30],[8,50]],"C":[[8,55],[10,10]],"D":[[10,15],[11,30]],"Lunch":[[11,30],[12,30]],"E":[[12,30],[13,45]],"F":[[13,50],[15,5]],"Tutorial":[[15,5],[15,35]]},"Thursday":{"Group Advisory/1-on-1s":[[8,30],[8,50]],"B":[[8,55],[10,25]],"A":[[10,35],[12,5]],"Lunch":[[12,5],[12,55]],"C":[[12,55],[14,25]],"Tutorial":[[14,25],[14,55]]},"Friday":{"Morning Meeting":[[8,30],[8,50]],"D":[[8,55],[10,25]],"F":[[10,35],[12,5]],"Lunch":[[12,5],[12,55]],"E":[[12,55],[14,25]]}},
      color_guide: {"A": "is-jude-green", "B": "is-primary", "C": "is-jude-yellow", "D": "is-jude-red", "E": "is-jude-pink", "F": "is-jude-orange"},
      blocks: {"A": "A", "B": "B", "C": "C", "D": "D", "E": "E", "F": "F"},
      btn_possible_colors: {"Black": "is-black", "Gray": "is-dark", "Green": "is-jude-green", "Blue": "is-primary", "Yellow": "is-jude-yellow", "Red": "is-jude-red", "Pink": "is-jude-pink", "Orange": "is-jude-orange"}
    }
  },
  methods: {
    getName(key) {
      if (key in this.blocks) {
        return this.blocks[key]
      }
      return key
    },
  }
}
</script>