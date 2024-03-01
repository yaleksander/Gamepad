import { RPM } from "../path.js"

const pluginName = "Gamepad";
const inject = RPM.Manager.Plugins.inject;

const leftStickEventID = RPM.Manager.Plugins.getParameter(pluginName, "Left stick event ID");
const rightStickEventID = RPM.Manager.Plugins.getParameter(pluginName, "Right stick event ID");

var deadzone = 0.15;
var repeatDelay = 30;

// https://w3c.github.io/gamepad/#remapping
var buttonsList =
[
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
];

var axesMenuList =
[
	[0, 0, 0, 0],
	[0, 0, 0, 0],
	[0, 0, 0, 0],
	[0, 0, 0, 0]
];

function getKey(id)
{
	switch (id)
	{
		case  0: return "A";
		case  1: return "B";
		case  2: return "X";
		case  3: return "Y";
		case  4: return "LB";
		case  5: return "RB";
		case  6: return "LT";
		case  7: return "RT";
		case  8: return "Back";
		case  9: return "Start";
		case 10: return "L3";
		case 11: return "R3";
		case 12: return "Up";
		case 13: return "Down";
		case 14: return "Left";
		case 15: return "Right";
		case 16: return "Home";
	}
	return "Error";
}

setInterval(function ()
{
	if (!RPM.Main.loaded || RPM.Manager.Stack.isLoading())
		return;
	const gp = navigator.getGamepads();
	if (!RPM.Manager.Stack.isLoading())
	{
		for (var i = 0; i < gp.length; i++)
		{
			if (!!gp.item(i))
			{
				for (var j = 0; j < gp.item(i).buttons.length; j++)
				{
					if (gp.item(i).buttons[j].pressed === true)
					{
						if (RPM.Common.Inputs.keysPressed.indexOf(getKey(j)) === -1)
							RPM.Common.Inputs.keysPressed.push(getKey(j))
						if (buttonsList[i][j] === 0)
						{
							RPM.Manager.Stack.onKeyPressed(getKey(j));
							if (!RPM.Manager.Stack.isLoading())
								RPM.Manager.Stack.onKeyPressedAndRepeat(getKey(j));
						}
						buttonsList[i][j] = Math.min(buttonsList[i][j] + 1, repeatDelay);
						if (!RPM.Manager.Stack.isLoading() && buttonsList[i][j] === repeatDelay)
							RPM.Manager.Stack.onKeyPressedAndRepeat(getKey(j));
					}
					else
					{
						if (RPM.Common.Inputs.keysPressed.indexOf(getKey(j)) !== -1)
							RPM.Common.Inputs.keysPressed.splice(getKey(j), 1);
						if (buttonsList[i][j] > 0)
							RPM.Manager.Stack.onKeyReleased(getKey(j));
						buttonsList[i][j] = 0;
					}
				}
				const lh = gp.item(i).axes[0];
				const lv = gp.item(i).axes[1];
				const rh = gp.item(i).axes[2];
				const rv = gp.item(i).axes[3];
				if (RPM.Manager.Stack.top instanceof RPM.Scene.Map && !RPM.Scene.Map.current.loading)
				{
					if (Math.sqrt(lh * lh + lv * lv) > deadzone)
						RPM.Manager.Events.sendEventDetection(null, -1, false, leftStickEventID, [null, RPM.System.DynamicValue.createNumber(lh), RPM.System.DynamicValue.createNumber(lv)]);
					if (Math.sqrt(rh * rh + rv * rv) > deadzone)
						RPM.Manager.Events.sendEventDetection(null, -1, false, rightStickEventID, [null, RPM.System.DynamicValue.createNumber(rh), RPM.System.DynamicValue.createNumber(rv)]);
				}
				else
				{
					if (lv < -0.5 || rv < -0.5)
					{
						axesMenuList[i][0] = Math.min(axesMenuList[i][0] + 1, repeatDelay);
						if (axesMenuList[i][0] === 1 || axesMenuList[i][0] === repeatDelay)
							RPM.Manager.Stack.onKeyPressedAndRepeat(getKey(12));
					}
					else
						axesMenuList[i][0] = 0;
					if (lv > 0.5 || rv > 0.5)
					{
						axesMenuList[i][1] = Math.min(axesMenuList[i][1] + 1, repeatDelay);
						if (axesMenuList[i][1] === 1 || axesMenuList[i][1] === repeatDelay)
							RPM.Manager.Stack.onKeyPressedAndRepeat(getKey(13));
					}
					else
						axesMenuList[i][1] = 0;
					if (lh < -0.5 || rh < -0.5)
					{
						axesMenuList[i][2] = Math.min(axesMenuList[i][2] + 1, repeatDelay);
						if (axesMenuList[i][2] === 1 || axesMenuList[i][2] === repeatDelay)
							RPM.Manager.Stack.onKeyPressedAndRepeat(getKey(14));
					}
					else
						axesMenuList[i][2] = 0;
					if (lh > 0.5 || rh > 0.5)
					{
						axesMenuList[i][3] = Math.min(axesMenuList[i][3] + 1, repeatDelay);
						if (axesMenuList[i][3] === 1 || axesMenuList[i][3] === repeatDelay)
							RPM.Manager.Stack.onKeyPressedAndRepeat(getKey(15));
					}
					else
						axesMenuList[i][3] = 0;
				}
			}
			else
			{
				for (var j = 0; j < buttonsList[i].length; j++)
				{
					if (buttonsList[i][j] > 0)
					{
						RPM.Common.Inputs.keysPressed.splice(getKey(j), 1);
						RPM.Manager.Stack.onKeyReleased(getKey(j));
					}
					buttonsList[i][j] = 0;
				}
			}
		}
	}
}, 16);

document.addEventListener("gamepadconnected", (e) =>
{
	RPM.Datas.Keyboards.controls["Action"     ].sc.push(["A"]);
	RPM.Datas.Keyboards.controls["Cancel"     ].sc.push(["B"]);
	RPM.Datas.Keyboards.controls["MainMenu"   ].sc.push(["B"]);
	RPM.Datas.Keyboards.controls["MainMenu"   ].sc.push(["Start"]);
	RPM.Datas.Keyboards.controls["LeftCamera" ].sc.push(["LB"]);
	RPM.Datas.Keyboards.controls["LeftCamera" ].sc.push(["LT"]);
	RPM.Datas.Keyboards.controls["RightCamera"].sc.push(["RB"]);
	RPM.Datas.Keyboards.controls["RightCamera"].sc.push(["RT"]);
	RPM.Datas.Keyboards.controls["UpMenu"     ].sc.push(["Up"]);
	RPM.Datas.Keyboards.controls["UpHero"     ].sc.push(["Up"]);
	RPM.Datas.Keyboards.controls["DownMenu"   ].sc.push(["Down"]);
	RPM.Datas.Keyboards.controls["DownHero"   ].sc.push(["Down"]);
	RPM.Datas.Keyboards.controls["LeftMenu"   ].sc.push(["Left"]);
	RPM.Datas.Keyboards.controls["LeftHero"   ].sc.push(["Left"]);
	RPM.Datas.Keyboards.controls["RightMenu"  ].sc.push(["Right"]);
	RPM.Datas.Keyboards.controls["RightHero"  ].sc.push(["Right"]);
});

RPM.Manager.Plugins.registerCommand(pluginName, "Change deadzone", (value) =>
{
	deadzone = Math.min(Math.max(value, 0.05), 0.95);
});
