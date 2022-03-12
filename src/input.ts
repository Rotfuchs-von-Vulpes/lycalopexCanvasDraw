import { Mouse, Keyboard, createPoint, createObserver } from "./utils";


export function createKeyboard(): Keyboard {
	return {
		keys: new Set,
		keyDown(ev) {
			if (!this.keys.has(ev.key)) {
				this.keys.add(ev.key);

				this.down.emit();
	
				console.log(ev.key);
				console.log(mouse.mode);
			}
		},
		keyUp(ev) {
			this.keys.delete(ev.key);

			this.up.emit();
		},
		down: createObserver(),
		up: createObserver(),
		offFocus() {
			this.keys.clear();
		}
	}
}

export let mouse: Mouse = {
	position: createPoint(0, 0),
	mode: 'nothing',
	move: createObserver(),
	click: createObserver(),
};

export function mouseMove(event: MouseEvent) {
	mouse.position.x = event.offsetX;
	mouse.position.y = event.offsetY;
}
