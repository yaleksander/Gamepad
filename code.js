import { RPM } from "../path.js"

const pluginName = "Gamepad";
const inject = RPM.Manager.Plugins.inject;

setInterval(function ()
{
	const gp = navigator.getGamepads();
	for (var i = 0; i < gp.length; i++)
		if (!!gp.item(i))
			for (var j = 0; j < gp.item(i).buttons.length; j++)
				if (gp.item(i).buttons[j].pressed)
					console.log(j);
}, 16);

window.addEventListener("gamepadconnected", (e) =>
{
	console.log("connect", e);
});

window.addEventListener("gamepaddisconnected", (e) =>
{
	console.log("disconnect", e);
});
