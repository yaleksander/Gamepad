import { RPM } from "../path.js"

const pluginName = "Gamepad";
const inject = RPM.Manager.Plugins.inject;

// https://w3c.github.io/gamepad/#remapping
const list =
[
	[false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
	[false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
	[false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
	[false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false]
];
var deadzone = 0.15;

setInterval(function ()
{
	const gp = navigator.getGamepads();
	for (var i = 0; i < gp.length; i++)
	{
		if (!!gp.item(i))
		{
			for (var j = 0; j < gp.item(i).buttons.length; j++)
				list[i][j] = gp.item(i).buttons[j].pressed;
		}
		else
		{
			for (var j = 0; j < list[i].length; j++)
				list[i][j] = false;
		}
	}

/*
Datas.Keyboards.controls[abbreviation] = key;
Datas.Systems.switchFullscreen();
event.preventDefault();

let key = event.keyCode;

// If not repeat, call simple press RPM event
if (!event.repeat) {
	if (Inputs.keysPressed.indexOf(key) === -1) {
		Inputs.keysPressed.push(key);
		Manager.Stack.onKeyPressed(key);
		// If is loading, that means a new scene was created, return
		if (Manager.Stack.isLoading()) {
			return;
		}
	}
}
// Also always call pressed and repeat RPM event
Manager.Stack.onKeyPressedAndRepeat(key);

if (Main.loaded && !Manager.Stack.isLoading()) {
	let key = event.keyCode;
	// Remove this key from pressed keys list
	Inputs.keysPressed.splice(Inputs.keysPressed.indexOf(key), 1);
	// Call release RPM event
	Manager.Stack.onKeyReleased(key);
}
else {
	Inputs.keysPressed = [];
}

*/
}, 16);

RPM.Manager.Plugins.registerCommand(pluginName, "Change deadzone", (value) =>
{
	deadzone = Math.min(Math.max(value, 0.05), 0.95);
});

/*
window.addEventListener("gamepadconnected", (e) =>
{
	console.log("connect", e);
});

window.addEventListener("gamepaddisconnected", (e) =>
{
	console.log("disconnect", e);
});
*/