export type mode = 'nothing' | 'drawing';

export type keySet = Set<string>;
export type Callback = (...args: any[]) => void;

export interface Observer {
	on: (callback: Callback) => void;
	emit: (...args: any[]) => void;
}

export interface Point {
	x: number;
	y: number;
}

export interface Mouse {
	position: Point;
	mode: mode;
	move: Observer;
	click: Observer;
}

export interface Keyboard {
	keys: keySet;
	down: Observer;
	up: Observer;
	keyDown: (event: KeyboardEvent) => void,
	keyUp: (event: KeyboardEvent) => void;
	offFocus: () => void;
}

export interface Style {
	color?: string;
	lineWidth?: number;
	lineCap?: CanvasLineCap;
	lineJoin?: CanvasLineJoin;
	milterLimit?: number;
}

export interface GenericFigure {
	closed?: boolean;
	style: Style;
	points: Point[];
	setStyle: (ctx: CanvasRenderingContext2D) => void;
	tracePath: (ctx: CanvasRenderingContext2D) => void;
	drawGhost: (ctx: CanvasRenderingContext2D, end: Point) => void;
	draw: (ctx: CanvasRenderingContext2D) => void;
}

export interface Figure extends GenericFigure {
	addPoint: (point: Point) => boolean;
}

export function createObserver(): Observer {
	let callBacks: Callback[] = [];

	return {
		on(callBack: Callback) {
			callBacks.push(callBack);
		},
		emit(...args) {
			callBacks.forEach(fun => fun(...args));
		}
	}
}

export function createPoint(x: number = 0, y: number = 0): Point {
	return {x: x + 0.5, y: y + 0.5};
}

export function createPointsArray(...points: [number, number][]): Point[] {
	let pointsArray: Point[] = [];

	points.forEach((arr) => pointsArray.push(createPoint(arr[0], arr[1])));

	return pointsArray;
}
