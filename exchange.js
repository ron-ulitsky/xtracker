// this script is written to trigger on the RecvMessage event

let msg = event.text.getString();

let msgJson = event.text.getJson();

let isExchangeStartMsg = msg.endsWith("exchanges present.");
let isReinforceMsg = msg.toLowerCase().includes("reinforced");
let isInputMsg = msg.startsWith("Input: ");
let isOutputMsg = msg.startsWith("Output: ");
let isAvailableMsg = (msg.endsWith("exchanges available.") || msg.endsWith("exchange available."));
let isLocationMsg = msgJson.includes("Location: ");

if (isExchangeStartMsg){
    Chat.log("Found exchange")
    GlobalVars.putBoolean("isExchange", true);
   
    let tokens = msg.split("/")
    GlobalVars.putString("exchangeIndex", tokens[0].split("(")[1])
    GlobalVars.putString("exchangesPresent", tokens[1].split(")")[0])
    
} else if (isInputMsg){
    let tokens = msg.split(" ")
    GlobalVars.putString("input_amount", tokens[1])
    GlobalVars.putString("input_item", msg.split(tokens[1] + " ")[1])
    GlobalVars.putBoolean("isInputNBT", true);
    
} else if (isOutputMsg){
    GlobalVars.putBoolean("isInputNBT", false);
    let tokens = msg.split(" ")
    GlobalVars.putString("output_amount", tokens[1])
    GlobalVars.putString("output_item", msg.split(tokens[1] + " ")[1])
    GlobalVars.putBoolean("isOutputNBT", true);
    
} else if (isAvailableMsg && GlobalVars.getBoolean("isExchange")){
    GlobalVars.putBoolean("isOutputNBT", false);
    GlobalVars.putString("available", msg.split(" ")[0]);
    Chat.log("Exchange ends.")
    
} else if (isLocationMsg && GlobalVars.getBoolean("isExchange")){
    GlobalVars.putBoolean("isExchange", false);

    let pos = msgJson.split("Location: ")[1].split("\"}")[0].split(" ");
    let fhandle = FS.open("~/.xtracker/data.csv");
    fhandle.append("\n")
    
    
    let dataRow = [
        Time.time().toString(),
        pos[0],
        pos[1],
        pos[2],
        GlobalVars.getString("exchangeIndex"),
        GlobalVars.getString("exchangesPresent"),
        GlobalVars.getString("input_amount"),
        GlobalVars.getString("input_item"),
        GlobalVars.getString("output_amount"),
        GlobalVars.getString("output_item"),
        GlobalVars.getString("available")
    ]
    
    for (let value of dataRow){
		fhandle.append("\"" + value + "\",");
	}    
    
    Chat.log("Exchange logged successfully.")
    
} else if (GlobalVars.getBoolean("isInputNBT") && !isInputMsg && !isReinforceMsg){
    GlobalVars.putString("input_item", GlobalVars.getString("input_item") + "-" + msg)
    
} else if (GlobalVars.getBoolean("isOutputNBT") && !msg.startsWith("Output: ") && !isReinforceMsg){
    GlobalVars.putString("output_item", GlobalVars.getString("output_item") + "-" + msg)
    
} else if (GlobalVars.getBoolean("isExchange")){
    Chat.log("Exchange logging interrupted. Aborting...")
    GlobalVars.putBoolean("isExchange", false);
}
