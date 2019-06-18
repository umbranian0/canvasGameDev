var Background = Entity.extend(function () {
	this.currState = undefined; // estado atual;


	this.states = {
		BACKGROUND: 'background',
		BACKGROUND_2: 'background_2'
	};

	this.constructor = function (spriteSheet, x, y) {
		this.super();
		this.x = x;
		this.y = y;
		this.spriteSheet = spriteSheet;
		this.currState = this.states.BACKGROUND_2;
		this.currentFrame = 0;
		this.vx = 0;
		this.vy = 0;
		setup();
	};

	this.update = function () {
		this.x += this.vx;
		if ((this.x) == Math.round(this.width / 3 * 2))
			this.x = 0;

	};

	this.getSprite = function () {
		return this.frames[this.currentFrame];
	};

	var setup = function () {

		this.eStates[this.eStates.BACKGROUND] = this.spriteSheet.getStats('background');
		//this.eStates[this.eStates.BACKGROUND_2] = this.spriteSheet.getStats('background_2');

		this.frames = this.eStates[this.eStates.BACKGROUND];
		this.width = this.frames[0].width; //atualizar a altura
		this.height = this.frames[0].height; // atualizar os

	}.bind(this);

	this.changeBackground = function () {

		this.eStates[this.eStates.BACKGROUND_2] = this.spriteSheet.getStats('background_2');
		this.frames = this.eStates[this.eStates.BACKGROUND_2];
		this.width = this.frames[0].width; //atualizar a altura
		this.height = this.frames[0].height; // atualizar os
	}
	this.andar = function () {
		this.vx = 1;
	};

	this.parar = function () {
		this.vx = 0;
	};

});
