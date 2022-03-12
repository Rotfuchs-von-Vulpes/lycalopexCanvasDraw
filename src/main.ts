import { mouse, createKeyboard } from './input';
import { createInputEl, createOptions } from './components';
import createACanvas from './canvas';
import { figureType } from './graphics';
import { createPoint } from './utils';

const drawBar = document.getElementById('draw') as HTMLElement;
const lineStyleBar = document.getElementById('lineStyle') as HTMLElement;

let keyboard = createKeyboard();
let canvas = createACanvas(
	document.getElementById('canvas') as HTMLCanvasElement,
	mouse,
	keyboard
);

drawBar.append(
	createInputEl('button', '\u25A1', 'New path', () => {
		mouse.mode = 'drawing';
		canvas.addFigure(figureType.path);
	}),
	createInputEl('button', '/', 'New line', () => {
		mouse.mode = 'drawing';
		canvas.addFigure(figureType.line);
	}),
	createInputEl('button', '\u25AD', 'New rectangle', () => {
		mouse.mode = 'drawing';
		canvas.addFigure(figureType.rectangle);
	}),
);
lineStyleBar.append(
	createInputEl('color', '#000000', 'Color', (el) =>
		canvas.setStyle({ color: el.value })
	),
	createInputEl(
		'number',
		'1',
		'Line Width',
		(el) => canvas.setStyle({ lineWidth: +el.value }),
		[['min', '1']]
	),
	createOptions('Line Cap', ['butt', 'round', 'square'], (el) =>
		canvas.setStyle({ lineCap: el.value as CanvasLineCap })
	),
	createOptions('Line Join', ['miter', 'round', 'square'], (el) =>
		canvas.setStyle({ lineJoin: el.value as CanvasLineJoin })
	),
	createInputEl(
		'number',
		'10',
		'Milter Limit',
		(el) => canvas.setStyle({ milterLimit: +el.value }),
		[['min', '0']]
	)
);

mouse.move.on(() => canvas.render());
mouse.move.on((ev: MouseEvent) => {
	mouse.position = createPoint(ev.offsetX, ev.offsetY);
});
keyboard.down.on((ev: KeyboardEvent) => {
	let key = ev.key;

	if (!keyboard.keys.has(key)) keyboard.keys.add(key);
});
keyboard.down.on(() => canvas.keydom());
keyboard.down.on(() => canvas.render());
keyboard.up.on((ev: KeyboardEvent) => {
	let key = ev.key;

	keyboard.keys.delete(key);
});
keyboard.up.on(() => canvas.render());

canvas.el.addEventListener('mousemove', (ev) => {
	mouse.move.emit(ev);
});
canvas.el.addEventListener('click', () => {
	canvas.click();
});

window.addEventListener('keydown', (ev) => keyboard.down.emit(ev));
window.addEventListener('keyup', (ev) => keyboard.up.emit(ev));
window.addEventListener('blur', () => keyboard.offFocus());
window.addEventListener('pagehide', () => keyboard.offFocus());

canvas.render();
