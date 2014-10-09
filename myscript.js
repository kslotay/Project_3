//LOCATION VARIABLES:
//Locations stored in array to provide central access
var loc = ["Prison Cell",
		   "Dining Room",
		   "Multi-purpose Room",
		   "Courtyard",
		   "Infirmary",
		   "Visiting Room",
		   "Gymnasium",
		   "Warden's Office"];

//Counter used to track how many times player has been to location
var loc_visited = [0, 0, 0, 0, 0, 0, 0, 0];

//Location descriptions stored in array for centralized access, the indexes correspond to matching locations in loc array
var loc_desc0 = ["It is dark, damp and smelly. The cell door is locked. There is a lock pick on the floor.",
				 "There are a number of dining tables. There is food!",
				 "There is no one in the multi-purpose room. The TV is on.",
				 "The courtyard is empty except for the few guards on watch duty.",
				 "There is a doctor in the infirmary, he does not want you there. He calls the guards!",
				 "There is no one in the visiting room. Your family does not want to see you.",
				 "There is a basketball game between inmates currently taking place. They will not allow you to join!",
				 "The Warden is currently on the phone, he ignores you."];

var loc_desc1 = ["It is dark, damp and smelly. The cell door is open.",
				"There are a number of dining tables. There is food!",
				"There are a number of other prison inmates sitting around, they ignore you.",
				"The courtyard is empty except for the few guards on watch duty.",
				"There is no one in the infirmary.",
				"There is no one in the visiting room. Your family does not want to see you.",
				"There is a basketball game between inmates currently taking place, but they will not allow you to join! The situation is quickly turning into a riot!",
				"The Warden ignores you, he is talking on the phone."];
				
var loc_desc2 = ["It is dark, damp and smelly. The cell door is open.",
				 "The dining room is empty. There is food!",
				 "There is no one in the multi-purpose room.",
				 "The courtyard is empty. There electric fence has already been breached and can be climbed out. You have a chance to escape!",
				 "The infirmary is empty! There is a guard radio relaying some news!",
				 "A stand-off between the guards and inmates has ensued! The Warden's office is locked.",
				 "The gymnasium is dark and empty. There are some dead bodies on the basketball court.",
				 "There is a safe inside, but you cannot open it."];

//Contains alternate descriptions that may be used for certain scenarios
var loc_desc_alt = ["It is dark, damp and smelly. The cell door is locked. You have a lock pick!",
				   "The dining room is empty!",
				   "",
				   "",
				   "",
				   "",
				   "",
				   ""];
				   
//Array containing boolean values indicating if location is locked/unlocked
var loc_locked = [true, false, false, false, false, false , false, false];
				 
//Global points variable
var points = 0;

//Error/information messages stored in message array
var message = ["You move to the ",
			   "You cannot go that way!",
			   "Please enter a valid command! (Type help for details)",
			   "You cannot unlock the Cell door. You do not have a lockpick!",
			   "Welcome to Jail Break!\n\nFor every time you visit a new location, you will receive 5 points. You must escape the prison to win the game!\n\nYou are currently in the prison cell.",
			   "You take the lockpick.",
			   "You have taken the food!",
			   "There is nothing to take!",
			   "You have unlocked the cell door!",
			   "There is nothing to unlock!",
			   "You cannot unlock the Warden's office. You do not have a lockpick!",
			   "The Warden's office is locked!",
			   "Warden's office unlocked!",
			   "You have eaten food from your inventory!",
			   "You eat the food from the dining tables.",
			   "There is no food available to eat!",
			   "Congratulations! You have escaped!",
			   "Error!"];

//Variable used to store the index of the current location, used when referencing arrays
var current_loc;

//Inventory variables hold information about player inventory
var inventory = ["food", "lockpick"];
var inventory_q = [0,0];

//All commands for Command box are stored in a central array
var cmd = ["n", "e", "s", "w", "look", "take", "unlock", "help", "climb", "eat", "inventory", "clear"];
			
//Capitalizes the first letter of a string
function capitaliseFirstLetter(str) {
	return str.charAt(0).toUpperCase() + str.slice(1);
}

//Executed on page load
function initialize_page() {
	var msg_box = document.getElementById("ta_Main");
	populate_CmdList();
	current_loc = 0;
	btn_set();
	msg_box.value = message[4];
}

//Populates the command textbox datalist
function populate_CmdList() {
	var txtCommand_list = document.getElementById("txtCommand_list");
	for (i = 0; i < cmd.length; i++) {
		var txtCommand_item = document.createElement("option");	
		var cmd_name = capitaliseFirstLetter(cmd[i]);
		
		txtCommand_item.value = cmd_name;
		txtCommand_item.text = cmd_name;
		
		txtCommand_list.appendChild(txtCommand_item);
	}
}

//Returns matching location description according to how many times a player has visited the location
function loc_desc_used(x) {
	if (x === 1) {
		switch (loc_visited[current_loc]) {
		case 0:
			return "loc_desc0";
			break;
		case 1:
			return "loc_desc1";
			break;
		default:
			return "loc_desc2";
			break;
		}
	}
	else {
		switch (loc_visited[current_loc]) {
			case 0:
				return loc_desc0;
				break;
			case 1:
				return loc_desc1;
				break;
			default:
				return loc_desc2;
		}
	}
}

//Executed when the player achieves the objective
function player_win() {
	var msg_box = document.getElementById("ta_Main");
	var txtCommand = document.getElementById("txtCommand");
	var btn_Enter = document.getElementById("btn_Enter");
	btn_disable("all");
	msg_box.value = message[16];
	txtCommand.disabled = true;
	btn_Enter.disabled = true;
}

//ERROR HANDLING
//Navigation error handler
function navigationError() {
	var msg_box = document.getElementById("ta_Main");
	msg_box.value = message[1] + "\n\n" + msg_box.value;
}

//Gameplay error handler
function gameplayError(err) {
	var msg_box = document.getElementById("ta_Main");
	switch (err) {
		case 0:
			msg_box.value = message[7] + "\n\n" + msg_box.value;
			break;
		case 1:
			msg_box.value = message[9] + "\n\n" + msg_box.value;
			break;
		case 2:
			msg_box.value = message[15] + "\n\n" + msg_box.value;
			break;
		case 3:
			msg_box.value = message[2] + "\n\n" + msg_box.value;
			break;
		default:
			msg_box.value = message[17] + "\n\n" + msg_box.value;
	}
}

//Separate function with reusable code for all btn_click functions
function param_change() {
	var loc_box = document.getElementById("txtLocation");
	var msg_box = document.getElementById("ta_Main");
	var txt_points = document.getElementById("txtPoints");
	var map_loc_id = "loc" + current_loc.toString();
	var map_loc = document.getElementById(map_loc_id);
	
	loc_box.value = loc[current_loc];
	
	//Changes current map location color to red
	map_loc.style.background = "#E80000" ;
	
	if (loc_visited[current_loc] === 0) {
		points += 5;
		txt_points.value = points;
		loc_visited[current_loc]++;
	}
	else {
		loc_visited[current_loc]++;
	}

	//Updates display
	msg_box.value = message[0] + loc[current_loc] + "\n\n" + loc_desc_used()[current_loc] + "\n\n" + msg_box.value;
	
	//Disables/enables the appropriate direction buttons
	btn_set();
}

//Restores map location color to default on movement away
function map_loc_color_restore() {
	var map_loc_id = "loc" + current_loc.toString();
	var map_loc = document.getElementById(map_loc_id);
	map_loc.style.background = "";
}

//Disable direction button(s) function
function btn_disable(button_d) {
	var btn_ = ""
	if (button_d === "all") {
		for (i = 0; i < 4; i++) {
			btn_ = document.getElementById("btn" + i);
			if (btn_.disabled === false) {
				btn_.disabled = true;
			}
		}
	}
	else {
		for (i = 0; i < arguments.length; i++) {
			btn_ = document.getElementById(arguments[i]);
			if (btn_.disabled === false) {
				btn_.disabled = true;
			}
		}
	}
}

//Enable direction button(s) function
function btn_enable(button_e) {
	var btn_ = ""
	if (button_e === "all") {
		for (i = 0; i < 4; i++) {
			btn_ = document.getElementById("btn" + i);
			if (btn_.disabled === true) {
				btn_.disabled = false;
			}
		}
	}
	else {
		for (i = 0; i < arguments.length; i++) {
			btn_ = document.getElementById(arguments[i]);
			if (btn_.disabled === true) {
				btn_.disabled = false;
			}
		}
	}
}

//Enable/disable direction buttons according to current location	
function btn_set() {
	switch (current_loc) {
		case 0:
			if (loc_locked[current_loc] === true) {
				btn_disable("all");
			}
			else {
				btn_enable("btn0");
				btn_disable("btn1","btn2","btn3");
			}
			break;
		case 1:
			btn_enable("btn0","btn1");
			btn_disable("btn2","btn3");
			break;
		case 2:
			btn_enable("all");
			break;
		case 3:
			btn_enable("btn0","btn3");
			btn_disable("btn1","btn2");
			break;
		case 4:
			btn_enable("btn1","btn2");
			btn_disable("btn0","btn3");
			break;
		case 5:
			if ((loc_visited[current_loc] > 1) && (loc_locked[7] = true)) {
				btn_enable("btn1","btn2","btn3");
				btn_disable("btn0");
			}
			else {
			btn_enable("all");
			}
			break;
		case 6:
			btn_enable("btn2","btn3");
			btn_disable("btn0","btn1");
			break;
		case 7:
			btn_enable("btn2");
			btn_disable("btn0","btn1","btn3");
			break;
	}
}

//Edits the description for a location when alternate location required
function edit_desc(locx) {
	switch (locx) {
		case 0:
			loc_desc0[current_loc] = loc_desc_alt[current_loc];
			break;
		case 1:
			loc_desc0[current_loc] = loc_desc_alt[current_loc];
			loc_desc1[current_loc] = loc_desc_alt[current_loc];
			loc_desc2[current_loc] = loc_desc_alt[current_loc];
			break;
	}
}

//COMMAND FUNCTIONS:
//Executes on look command
function cmd_Look() {
	var msg_box = document.getElementById("ta_Main");
	msg_box.value = loc_desc_used()[current_loc] + "\n\n" + msg_box.value;
}

//Executes on take command
function cmd_Take() {
	var msg_box = document.getElementById("ta_Main");
	switch (current_loc) {
		case 0:
			if (loc_visited[current_loc] === 0) {
				msg_box.value = message[5] + "\n\n" + msg_box.value;
				edit_desc(current_loc);
				inventory_q[1]++;
			}
			break;
		case 1:
			if (loc_desc_used()[current_loc] != loc_desc_alt[current_loc]) {
				msg_box.value = message[6] + "\n\n" + msg_box.value;
				edit_desc(current_loc);
				inventory_q[0]++;
			}
			break;
		default:
			gameplayError(0);
	}
}

//Executes on unlock command
function cmd_Unlock() {
	var msg_box = document.getElementById("ta_Main");
	switch (current_loc) {
		case 0:
			//If location is the prison cell, and the player has lockpick(s) in inventory, unlock door
			if ((loc_locked[current_loc] === true) && (inventory_q[1] != 0)) {
				msg_box.value = message[8] + "\n\n" + msg_box.value;
				loc_locked[current_loc] = false;
				loc_visited[current_loc]++;
				inventory_q[1]--;
			}
			else if ((loc_locked[current_loc] === true) && (inventory_q[1] === 0)) {
				msg_box.value = message[3] + "\n" + loc_desc_used()[current_loc] + "\n\n" + msg_box.value;
			}
			break;
		case 5:
			//if the location is visiting room, and the player has lockpick(s) in inventory, unlocks door to Warden's office
			if ((loc_visited[current_loc] > 1) && (inventory_q[1] === 0)) {
				msg_box.value = message[10] + "\n\n" + msg_box.value;
			}
			else if ((loc_visited[current_loc] > 1) && (inventory_q[1] != 0)) {
				msg_box.value = message[12] + "\n\n" + msg_box.value;
			}
			break;
		default:
			gameplayError(1);
	}
	btn_set();
}

//Executes on help command
function cmd_Help() {
	
}

//Executes on eat command
function cmd_Eat() {
	var msg_box = document.getElementById("ta_Main");
	//If inventory already contains food, eat from there
	if (inventory_q[0] != 0) {
		msg_box.value = message[13] + "\n\n" + msg_box.value;
		inventory_q[0]--;
	}
	//Otherwise if player is currently in the dining room and does not have any food in inventory, eat directly
	else if ((current_loc === 1) && (loc_desc_used()[1] != loc_desc_alt[1]) && (inventory_q[0] == 0)) {
		msg_box.value = message[14] + "\n\n" + msg_box.value;
		edit_desc(current_loc);
	}
	else {
		gameplayError(2);
	}
}

//Forms a string to show inventory
function write_Inventory() {
	var inv_list = "";
	for (i = 0; i < 2; i++) {
		inv_list = capitaliseFirstLetter(inventory[i]).toString() + " = " + inventory_q[i].toString() + "\n" + inv_list;
	}
	return inv_list;
}

//Executed on inventory command
function cmd_Inventory_check() {
	var msg_box = document.getElementById("ta_Main");
	msg_box.value = "INVENTORY: \n" +	write_Inventory() + "\n\n" + msg_box.value;
}

//Executed on climb command
function cmd_Climb() {
	if ((current_loc === 3) && (loc_desc_used(1) === "loc_desc2")) {
		player_win();
	}
}

//Executed on clear command, clears text area
function cmd_Clear() {
	var msg_box = document.getElementById("ta_Main");
	if (msg_box.value != "") {
		msg_box.value = "";
	}
}

//Functions for each button, the common reusable code is referenced (param_change() function)
function btnNorth_Click() {
	var msg_box = document.getElementById("ta_Main");
	switch(current_loc) {
		case 0:
			if (loc_locked[current_loc] === true) {
				cmd_Look();
				navigationError();
			}
			else {
				map_loc_color_restore();
				current_loc = 2;
				param_change();
			}
			break;
		case 1:
			map_loc_color_restore();
			current_loc = 4;
			param_change();
			break;
		case 2:
			map_loc_color_restore();
			current_loc = 5;
			param_change();
			break;
		case 3:
			map_loc_color_restore();
			current_loc = 6;
			param_change();
			break;
		case 5:
			if (loc_visited[current_loc] > 1) {
				navigationError();
				msg_box.value = message[11] + "\n\n" + msg_box.value;
			}
			else {
				map_loc_color_restore();
				current_loc = 7;
				param_change();
			}
			break;
		default:
			navigationError();
	}
}
function btnEast_Click() {
	switch(current_loc) {
		case 1:
			map_loc_color_restore();
			current_loc = 2;
			param_change();
			break;
		case 2:
			map_loc_color_restore();
			current_loc = 3;
			param_change();
			break;
		case 4:
			map_loc_color_restore();
			current_loc = 5;
			param_change();
			break;
		case 5:
			map_loc_color_restore();
			current_loc = 6;
			param_change();
			break;
		default:
			navigationError()();
	}
}
function btnWest_Click() {
	switch(current_loc) {
		case 2:
			map_loc_color_restore();
			current_loc = 1;
			param_change();
			break;
		case 3:
			map_loc_color_restore();
			current_loc = 2;
			param_change();
			break;
		case 5:
			map_loc_color_restore();
			current_loc = 4;
			param_change();
			break;
		case 6:
			map_loc_color_restore();
			current_loc = 5;
			param_change();
			break;
		default:
			navigationError()();
	}
}
function btnSouth_Click() {
	switch(current_loc) {
		case 2:
			map_loc_color_restore();
			current_loc = 0;
			param_change();
			break;
		case 4:
			map_loc_color_restore();
			current_loc = 1;
			param_change();
			break;
		case 5:
			map_loc_color_restore();
			current_loc = 2;
			param_change();
			break;
		case 6:
			map_loc_color_restore();
			current_loc = 3;
			param_change();
			break;
		case 7:
			map_loc_color_restore();
			current_loc = 5;
			param_change();
			break;
		default:
			navigationError()();
	}
}

//Checks if enter key is pressed in the command text box
function enterKey_check(e) {
	var txtCommand = document.getElementById("txtCommand");
	if ((e.keyCode === 13) && (txtCommand.value != "")) {
		btnEnter_click();
	}
}

function btnEnter_click() {
	var msg_box = document.getElementById("ta_Main");
	var txtCommand = document.getElementById("txtCommand");
	var usrCommand = (txtCommand.value);
	var cmd_number = cmd.indexOf(usrCommand.toLowerCase());
	switch(cmd_number) {
		case 0:
			btnNorth_Click();
			break;
		case 1:
			btnEast_Click();
			break;
		case 2:
			btnSouth_Click();
			break;
		case 3:
			btnWest_Click();
			break;
		case 4:
			cmd_Look();
			break;
		case 5:
			cmd_Take();
			break;
		case 6:
			cmd_Unlock();
			break;
		case 7:
			cmd_Help();
			break;
		case 8:
			cmd_Climb();
			break;
		case 9:
			cmd_Eat();
			break;
		case 10:
			cmd_Inventory_check();
			break;
		case 11:
			cmd_Clear();
			break;
		default:
			gameplayError(3);
	}
	txtCommand.value = "";
}