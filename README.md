# Bay Clock

Bay Clock is a website that shows the current schedule and block for the Bay School of San Francisco.

View it Here: [https://www.bayclock.org/](https://www.bayclock.org/)

## Features
- Date and Time
- Block Countdown
- Special Schedule Indicator
- Breaks and Immersives
- Live Progress Bars
- Useful Links
- Lunch Menu
- Customizable Blocks
- Lots and Lots of Customizable Styles!

## Maintaining


## Automated Schedule Updating

To enable automated updating, go to `/src/components/Home.vue` and comment the import statements
in lines 307-310, while uncommenting those in 315-318. The wizard at https://BaySchoolMARMOTS.github.io/schedule_update.html uses your student calendar to automatically format the entire year's schedule.
This process will need to be performed at the beginning of each school year (preferably before school
starts), as well as whenever the school decides that they need to change any of the blocks or schedules.  Automatic updating will require an Github API token; speak to Tate Rowney or a member of the IT Department to access this token.
If this is enabled, the instructions under "Manually Updating the Schedule", "Adding a Special Schedule", "Editing Immersives", and "Adding/Editing Breaks" are not necessary. You will still have to update the lunch menu manually. However, if you want to manually update the schedule while automatic updating is on, go to the repo where the code for this feature is stored (https://github.com/BaySchoolMARMOTS/BaySchoolMARMOTS.github.io) and modify the json files there.
This feature was made by taterowney@gmail.com btw


### Manually Updating the Schedule:
In order to update the schedule you must edit the `schedule.json` file located in the `data` folder. The `schedule.json` file is formatted into a dictionary with weekdays as the keys, and the corresponding schedule as the value. The schedule dictionary has the block name as the keys and a list containg two more lists for the start and finish of each block as the value.

Here is the current schedule for Monday as an example:
````json
"Monday": {
	"Morning Meeting": [
		[8, 30],
		[8, 50]
	],
	"A": [
		[8, 55],
		[10, 10]
	],
	"B": [
		[10, 15],
		[11, 30]
	],
	"Lunch": [
		[11, 30],
		[12, 30]
	],
	"C": [
		[12, 30],
		[13, 45]
	],
	"D": [
		[13, 50],
		[15, 5]
	],
	"Tutorial": [
		[15, 5],
		[15, 35]
	]
},
````
### Adding a Special Schedule:
In order to update the schedule you must edit the `special_schedule.json` file located in the `data` folder. Special schedules are formatted the same as normal schedules, but the key to the schedule is a date instead of a weekday. Dates should be written as `YYYY/MM/DD`.

Here is an example special schedule entry:
```json
"2021/09/30": {
	"Group Advisory/1-on-1s": [
		[8, 30],
		[8, 50]
	],
	"A": [
		[8, 55],
		[10, 10]
	],
	"B": [
		[10, 15],
		[11, 30]
	],
	"Lunch": [
		[11, 30],
		[12, 30]
	],
	"Field Day": [
		[12, 30],
		[14, 50]
	]
},
```
### Editing Immersives
In order to update when immersives start and end and the immersive schedule you must edit the `immersives.json` file located in the `data` folder. The starting and ending dates of the immersives are located in a list with the immersive number as the key. The immersive schedule is located in a dictionary with the immersive number plus the word 'schedule' as the key

Here is an example of the starting and ending dates for an immersive:
```json
"Immersive1": ["2021/12/1", "2021/12/31"],
```
Here is an example of an immersive schedule:
```json
"Immersive1 Schedule": {
	"Immersive 1": [
		[9, 0],
		[15, 0]
	]
},
```
### Adding/Editing Breaks:
In order to update  or add new breaks you must edit the `breaks.json` file located in the `data` folder. Each break is represented as a entry in the dictionary with the name of the break as the key and the start and end dates in a list as the value.

Here is an example break entry:
```json
"S1 Midterm Break": ["2021/10/16", "2021/10/24"]
```
### Updating the Lunch Menu:
In order to update the lunch menu you must replace the files in the `data/menu` folder. The images must be in .jpg format and should be named `1.jpg`, `2.jpg`, etc.
