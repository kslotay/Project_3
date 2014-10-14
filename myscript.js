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

	//Array containing boolean values indicating if location is locked/unlocked
	var loc_locked = [true, false, false, false, false, false , false, false];

	//Variable used to store the index of the current location, used when referencing arrays
	var current_loc;

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
					 "The courtyard is empty except for the few guards on watch duty.",
					 "The infirmary is empty. There is a radio relaying some news!",
					 "A stand-off between the guards and inmates has ensued! The Warden's office is locked.",
					 "The gymnasium is dark and empty. There are some dead bodies on the basketball court. There is a lock pick on the floor.",
					 "There is a safe inside, but you cannot open it."];

	//Contains alternate descriptions that may be used for certain scenarios
	var loc_desc_alt = ["It is dark, damp and smelly. The cell door is locked. You have a lock pick!",
					   "The dining room is empty!",
					   "",
					   "The courtyard is empty. The electric fence has been breached! You have a chance to escape!",
					   "",
					   "",
					   "The gymnasium is dark and empty. There are some dead bodies on the basketball court.",
					   "There is a safe inside, but you cannot open it."];
				 
//Global points variable
var points = 0;

//INVENTORY VARIABLES:
	//Inventory names
	var inventory = ["food", "lock pick(s)"];
	//Inventory quantity
	var inventory_q = [0,0];

//All commands for Command box are stored in a central array
var cmd = ["n", "e", "s", "w", "look", "take", "unlock", "help", "climb", "eat", "inventory", "clear", "listen"];
			
//GENERAL USE FUNCTIONS			
	//Capitalizes the first letter of a string
	function capitaliseFirstLetter(str) {
		return str.charAt(0).toUpperCase() + str.slice(1);
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
	
	//Checks if enter key is pressed in the command text box
	function enterKey_check(e) {
		var txtCommand = document.getElementById("txtCommand");
		if ((e.keyCode === 13) && (txtCommand.value != "")) {
			btnEnter_click();
		}
	}

//BUTTON ENABLE/DISABLE:
	//Disables indicated direction buttons
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
	
	//Enables indicated direction buttons
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
				if ((loc_visited[current_loc] > 1) && (loc_locked[7] === true)) {
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

//Returns matching location description according to how many times a player has visited the location
function loc_desc_used() {
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

//LOCATION/MAP/POINTS/TEXTAREA UPDATING:
	//Update textarea
	function update_Display(num, type) {
		var msg_box = document.getElementById("ta_Main");
		var message = [];
		switch (type) {
			case 0:
				message = ["You move to the ",
						   "Welcome to Jail Break!\n\nFor every time you visit a new location, you will receive 5 points. You must escape the prison to win the game!\n\nYou are currently in the prison cell.",
					       "You take the lock pick.",
					       "You have taken the food!",
					       "You have unlocked the cell door!",
					       "Warden's office unlocked!",
					       "You have eaten food from your inventory!",
					       "You eat the food from the dining tables.",
					       "'ALERT! ALERT! The fence in the courtyard has been breached!'",
					       "Congratulations! You have escaped!"];
				break;
			case 1:
				message = ["You cannot go that way!",
						   "Navigation Error!"];
				break;
			case 2:
				message = ["There is nothing to take!",
 					       "There is nothing to unlock!",
  					       "There is nothing to climb!",
					       "You cannot unlock the Warden's office. You do not have a lock pick!",
					       "There is no food available to eat!",
					       "Please enter a valid command! (Type help for details)",
					       "You cannot unlock the cell door. You do not have a lock pick!",
					       "The Warden's office is locked!",
					       "There is nothing to listen to!",
					       "Gameplay Error!"];
				break;
		}
		if (type === 0) {
			if (num === 0) {
				msg_box.value = message[num] + loc[current_loc] + "\n\n" + loc_desc_used()[current_loc] + "\n\n" + msg_box.value;
			}
			else if (num === 9) {
				msg_box.value = message[num];
			}
			else {
				msg_box.value = message[num] + "\n\n" + msg_box.value;
			}
		}
		else if ((type === 1) || (type === 2)) {
			if (num != undefined) {
				msg_box.value = message[num] + "\n\n" + msg_box.value;
			}
			else {
				msg_box.value = message[(message.length - 1)] + "\n\n" + msg_box.value;
			}	
		}
	}
	
	function update_display_msg(msg) {
		update_Display(msg, 0);
	}

	//Updates location value in location box
	function update_Loc() {
		var loc_box = document.getElementById("txtLocation");
		loc_box.value = loc[current_loc];
	}

	//Updates points value if location has not been visited before
	function update_Points() {
		var txt_points = document.getElementById("txtPoints");
		if (loc_visited[current_loc] === 0) {
			points += 5;
			txt_points.value = points;
		}
	}

	//Changes current map location color
	function update_Map(x) {
		var map_loc_id = "loc" + current_loc.toString();
		var map_loc = document.getElementById(map_loc_id);
		switch (x) {
			case 0:
				map_loc.style.background = "";
				break;
			case 1:
				map_loc.style.background = "#E80000";
				break;
		}
	}

	//Edits the description for a location when alternate location required
	function edit_desc(locx) {
		switch (locx) {
			case 0:
				loc_desc0[locx] = loc_desc_alt[locx];
				break;
			case 1:
				loc_desc0[locx] = loc_desc_alt[locx];
				loc_desc1[locx] = loc_desc_alt[locx];
				loc_desc2[locx] = loc_desc_alt[locx];
				break;
			case 3:
				loc_desc2[locx] = loc_desc_alt[locx];
				break;
			case 6:
				loc_desc2[locx] = loc_desc_alt[locx];
				break;
			case 7:
				loc_desc0[locx] = loc_desc_alt[locx];
				loc_desc1[locx] = loc_desc_alt[locx];
				break;
		}
	}
	
	function breach_c_Fence() {
		edit_desc(3);
	}
	
//Executed when the player achieves the game objective
function player_Win() {
	var txtCommand = document.getElementById("txtCommand");
	var btn_Enter = document.getElementById("btn_Enter");
	btn_disable("all");
	update_display_msg(9);
	txtCommand.disabled = true;
	btn_Enter.disabled = true;
}
	
//Executed on page load
function initialize_page() {
	populate_CmdList();
	current_loc = 0;
	btn_set();
	update_display_msg(1);
}

//ERROR HANDLING
	//Navigation error handler
	function navigationError(err) {
		update_Display(err, 1);
	}

	//Gameplay error handler
	function gameplayError(err) {
		update_Display(err, 2);
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
					update_display_msg(2);
					edit_desc(current_loc);
					inventory_q[1]++;
					break;
				}
			case 1:
				if (loc_desc_used()[current_loc] != loc_desc_alt[current_loc]) {
					update_display_msg(3);
					edit_desc(current_loc);
					inventory_q[0]++;
					break;
				}
			case 6:
				if ((loc_visited[current_loc] > 1) && (loc_desc_used()[current_loc] != loc_desc_alt[current_loc])) {
					update_display_msg(2);
					edit_desc(current_loc);
					inventory_q[1]++;
					break;
				}
			default:
				gameplayError(0);
		}
	}

	//Executes on unlock command
	function cmd_Unlock() {
		var msg_box = document.getElementById("ta_Main");
		switch (current_loc) {
			case 0:
				//If location is the prison cell, and the player has lock pick(s) in inventory, unlock door
				if ((loc_locked[current_loc] === true) && (inventory_q[1] != 0)) {
					update_display_msg(4);
					loc_locked[current_loc] = false;
					loc_visited[current_loc]++;
					inventory_q[1]--;
					break;
				}
				else if ((loc_locked[current_loc] === true) && (inventory_q[1] === 0)) {
					cmd_Look();
					gameplayError(6);
					break;
				}
			case 5:
				//If location is visiting room, and the player has lock pick(s) in inventory, unlocks door to Warden's office
				if ((loc_visited[current_loc] > 1) && (inventory_q[1] != 0)) {
					loc_locked[7] = false;
					if (loc_visited[7] < 2) {
						edit_desc(7);
					}
					update_display_msg(5);
					break;
				}
				else if ((loc_visited[current_loc] > 1) && (inventory_q[1] === 0)) {
					gameplayError(3);
					break;
				}
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
			update_display_msg(6);
			inventory_q[0]--;
		}
		//Otherwise if player is currently in the dining room and does not have any food in inventory, eat directly
		else if ((current_loc === 1) && (loc_desc_used()[current_loc] != loc_desc_alt[current_loc]) && (inventory_q[0] == 0)) {
			update_display_msg(7);
			edit_desc(current_loc);
		}
		else {
			gameplayError(4);
		}
	}

	//Executed on inventory command
	function cmd_Inventory_check() {
		var inv_list = "";
		var msg_box = document.getElementById("ta_Main");
		for (i = 0; i < inventory.length; i++) {
			inv_list = capitaliseFirstLetter(inventory[i]).toString() + " = " + inventory_q[i].toString() + "\n" + inv_list;
		}
		msg_box.value = "INVENTORY: \n" + inv_list + "\n\n" + msg_box.value;
	}

	//Executed on climb command
	function cmd_Climb() {
		if ((current_loc === 3) && (loc_desc_used()[current_loc] === loc_desc_alt[current_loc])) {
			player_Win();
		}
		else {
			gameplayError(2);
		}
	}

	//Executed on clear command, clears text area
	function cmd_Clear() {
		var msg_box = document.getElementById("ta_Main");
		if (msg_box.value != "") {
			msg_box.value = "";
		}
	}
	
	//Executed on listen command
	function cmd_Listen() {
		if ((loc_visited[current_loc] > 1) && (current_loc === 4)) {
			update_display_msg(8);
			breach_c_Fence();
		}
		else {
			gameplayError(8);
		}
	}

//Combines all functions that run when location changes/location button(s) used
function param_change() {
	update_Loc();
	update_Map(1);
	update_Points();
	loc_visited[current_loc]++;
	update_display_msg(0);
	btn_set();
	if ((loc_visited[current_loc] > 1) && (current_loc === 5)) {
		loc_locked[7] = true;
		breach_c_Fence();
	}
}

//BUTTON FUNCTIONS:
	//Direction button functions
	function btnNorth_Click() {
		var msg_box = document.getElementById("ta_Main");
		switch(current_loc) {
			case 0:
				if (loc_locked[current_loc] === true) {
					cmd_Look();
					navigationError(0);
				}
				else {
					update_Map(0);
					current_loc = 2;
					param_change();
				}
				break;
			case 1:
				update_Map(0);
				current_loc = 4;
				param_change();
				break;
			case 2:
				update_Map(0);
				current_loc = 5;
				param_change();
				break;
			case 3:
				update_Map(0);
				current_loc = 6;
				param_change();
				break;
			case 5:
				if (loc_locked[7] === true) {
					navigationError(0);
					gameplayError(7);
				}
				else {
					update_Map(0);
					current_loc = 7;
					param_change();
				}
				break;
			default:
				navigationError(0);
		}
	}

	function btnEast_Click() {
		switch(current_loc) {
			case 1:
				update_Map(0);
				current_loc = 2;
				param_change();
				break;
			case 2:
				update_Map(0);
				current_loc = 3;
				param_change();
				break;
			case 4:
				update_Map(0);
				current_loc = 5;
				param_change();
				break;
			case 5:
				update_Map(0);
				current_loc = 6;
				param_change();
				break;
			default:
				navigationError(0);
		}
	}

	function btnSouth_Click() {
		switch(current_loc) {
			case 2:
				update_Map(0);
				current_loc = 0;
				param_change();
				break;
			case 4:
				update_Map(0);
				current_loc = 1;
				param_change();
				break;
			case 5:
				update_Map(0);
				current_loc = 2;
				param_change();
				break;
			case 6:
				update_Map(0);
				current_loc = 3;
				param_change();
				break;
			case 7:
				update_Map(0);
				current_loc = 5;
				param_change();
				break;
			default:
				navigationError(0);
		}
	}

	function btnWest_Click() {
		switch(current_loc) {
			case 2:
				update_Map(0);
				current_loc = 1;
				param_change();
				break;
			case 3:
				update_Map(0);
				current_loc = 2;
				param_change();
				break;
			case 5:
				update_Map(0);
				current_loc = 4;
				param_change();
				break;
			case 6:
				update_Map(0);
				current_loc = 5;
				param_change();
				break;
			default:
				navigationError(0);
		}
	}

	//Enter button function
	function btnEnter_click() {
		var msg_box = document.getElementById("ta_Main");
		var txtCommand = document.getElementById("txtCommand");
		var usrCommand = (txtCommand.value.toLowerCase());
		
		if (usrCommand === "north") {
			usrCommand = "n";
		}
		else if (usrCommand === "east") {
			usrCommand = "e";
		}
		else if (usrCommand === "south") {
			usrCommand = "s";
		}
		else if (usrCommand === "west") {
			usrCommand = "w";
		}
		
		var cmd_number = cmd.indexOf(usrCommand);
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
			case 12:
				cmd_Listen();
				break;
			default:
				gameplayError(5);
		}
		txtCommand.value = "";
	}