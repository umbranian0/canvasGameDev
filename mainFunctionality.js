// Animated tank.js
(function () { //não apagar

	var canvas; // representação genérica dos canvas
	//variaveis para a camera dinamica
	var gameWorld = undefined;
	var camera = undefined;
	var oBackground;
	//count dos loops para adicionar os inimigos
	var countBackgroundLoops = 0;
	var previousCountBackgroundLoops = 1;
	//contador para o niveis
	var gamelevelCounter = 0;

	//guarda material necessario para o jogo
	var canvases = {
		background: {
			canvas: null,
			ctx: null
		}, // canvas, drawingSurface (contex2d)
		entities: {
			canvas: null,
			ctx: null
		},
		components: {
			canvas: null,
			ctx: null
		}
	};//canvases

	var entities = [];
	var teclas = new Array(255);
	//variaveis para os objetos do jogo
	var oPlayer = undefined;
	var enemy;
	var enemyArray = [];
	//arrays para testes de colisão
	var ataquesAliados = [];
	var ataquesInimigos = [];

	//degbug
	var debugMode = false;
	var andou = false;

	//componenetes do jogo
	var barraEnergiaEnemy = undefined;
	var barraEnergiaHero = undefined;
	var gameTimer = undefined;
	//animações de entrada
	var animationHandler;
	var loadInfo = undefined;
	var assetsLoadInfo = undefined;
	var assetsLoaded = 0;
	var assets = [];
	//arrrays de sons
	var GameSounds = {
		MISSIL: {},
		AVIAO: {},
		SOLDADO: {},
		TANQUE: {},
		BALA: {},
		BALASOLDADO: {},
		AMBIENTE: {}
	};//game sounds

	var gameState = undefined;
	var GameStates = {
		RUNNING: 1,
		PAUSED: 2,
		STOPED: 3,
		LOADING: 4,
		LOADED: 5
	}//gameStates


	window.addEventListener("load", init, false);

	function init() {
		//trazer variaveis do HTML
		canvases.background.canvas = document.querySelector("#canvasBack");
		canvases.background.ctx = canvases.background.canvas.getContext("2d");

		canvases.entities.canvas = document.querySelector("#canvasEnt");
		canvases.entities.ctx = canvases.entities.canvas.getContext("2d");

		canvases.components.canvas = document.querySelector("#canvasComp");
		canvases.components.ctx = canvases.components.canvas.getContext("2d");

		// canvas é uma referencia global genérica para as definições globais dos canvas (largura e altura)
		canvas = canvases.entities.canvas; //
		load();
	}//init


	function load() {
		loadInfo = document.querySelector("#loadInfo");
		assetsLoadInfo = document.querySelector("#assetLoaded");

		gameState = GameStates.LOADING;

		loadSpriteSheet();
		loadSounds();
		// carregar os sons

	}//load

	//TODO
	function loadSounds() {

	}//loadSounds

	function loadSpriteSheet() {
		//TODO
		let spBackground = new SpriteSheet();
		spBackground.load("assets//background_2.png", "assets//background_2.json", loaded);
		assets.push(spBackground);

		/*
		let spBackground2 = new SpriteSheet();
		spBackground.load("assets//background_2.png", "assets//background_2.json", loaded);
		assets.push(spBackground2);
*/
		let spTanque = new SpriteSheet();
		spTanque.load("assets//tank.png", "assets//tank.json", loaded);
		assets.push(spTanque);

		let spriteMale = new SpriteSheet();
		spriteMale.load("assets//male.png", "assets//male.json", loaded);
		assets.push(spriteMale);

		let spriteRobot = new SpriteSheet();
		spriteRobot.load("assets//robot.png", "assets//robot.json", loaded);
		assets.push(spriteRobot);

		let spriteFemale = new SpriteSheet();
		spriteFemale.load("assets//female.png", "assets//female.json", loaded);
		assets.push(spriteFemale);

		let spriteAtaque = new SpriteSheet();
		spriteAtaque.load("assets//ataque.png", "assets//ataque.json", loaded);
		assets.push(spriteAtaque);
	}//loadSpriteSheet

	//load assets
	function loaded(assetName) {
		if (gamelevelCounter === 0) {
			assetsLoaded++;
			assetsLoadInfo.innerHTML = "Loading: " + assetName;
			if (assetsLoaded < assets.length) return;

			assets.splice(0); // apagar o array auxiliar usado para o load

			console.log(assets);
			// Se já conseguimos chegar aqui, os assets estão carregados! Podemos começar a criar 
			// e configurar os elementos do jogo
			assetsLoadInfo.innerHTML = "Game Loaded! Press any key when are ready...";

			console.log(gamelevelCounter);

			gameState = GameStates.LOADED;
			window.addEventListener("keypress", setupGame, false); // espera por uma tecla pressionada para começar
		}
		//iniciar musica
		//GameSounds.AMBIENTE.INTRO.play(true, 1);

	}//loaded

	function setupGame() {

		window.removeEventListener("keypress", setupGame, false);

		loadInfo.classList.toggle("hidden"); // esconder a informaçao de loading

		chargeBackground();
		//carregar background


		//aplica definições para a camera de jogo 
		setUpGameCamera();
		// instancia os spritesheets necessarios para o jogo
		setUpSprites();

		//criar os componentes informativos e temporizadores
		setUpGameComponents();
		//alguns efeitos 
		canvases.background.canvas.fadeIn(1000);

		gSoundManager.stopAll(); //p�ram-se todos os  sons

		gameState = GameStates.RUNNING;

		update();

		window.addEventListener("keydown", keyDownHandler, false);
		window.addEventListener("keyup", keyUpHandler, false);

	}//setUpGame

	function setUpGameComponents() {
		//criar os componentes informativos e temporizadores
		barraEnergiaEnemy = new EnergyBar(5, 5, 120, 12, canvases.components.ctx, 'Enemy\'s Life Level ', "black", "black", "red");

		barraEnergiaHero = new EnergyBar(canvas.width - 135, 5, 120, 12, canvases.components.ctx, 'Hero\'s Life Level', "black", "black", "blue");
		gameTimer = new GameTimer((canvas.width >> 1) - 25, 5, 50, 50, canvases.components.ctx, '', "red", "black", "white", update, stopGame);

	}//*set up components

	function chargeBackground() {
		switch (gamelevelCounter) {
			case 0:
				oBackground = new Background(
					gSpriteSheets['assets//background_2.png'], 0, 0);
				break;
			case 1:
				levelPauseAndResumeByLevel(2);
				break;
			case 2:
				levelPauseAndResumeByLevel(3);
				break;

			case 3:
				levelPauseAndResumeByLevel(4);
				break;

			case 4:
				levelPauseAndResumeByLevel(5);
				break;

			case 5:
				levelPauseAndResumeByLevel(6);
				break;
		}

	}//chargeBackground

	//not finished
	function levelPauseAndResumeByLevel(level) {
		//pausing game
		gameState = GameStates.STOPED;
		oPlayer.visible = false;
	
		oPlayer.parar();
		//change level
		oBackground.changeBackground(level);
		countBackgroundLoops = 0;
		previousCountBackgroundLoops = 0;
		//resuming game
		gameState = GameStates.RUNNING;
		oPlayer.visible = true;
	}//levelPauseAndResume


	function setUpSprites() {
		// criar as entidades
		oPlayer = new Robot(gSpriteSheets['assets//robot.png'], camera.x + 100, canvas.height - 150, GameSounds.TANQUE);
		enemy = new Zombies(gSpriteSheets['assets//female.png'], camera.width - 100, canvas.height - 150, GameSounds.TANQUE);
		enemy2 = new Zombies(gSpriteSheets['assets//male.png'], camera.width - 100, canvas.height - 150, GameSounds.TANQUE);

		enemy2.flipH = -1;//roda o inimigo
		enemy2.bot = true;

		enemy.flipH = -1;//roda o inimigo
		enemy.bot = true;

		//player vars
		oPlayer.visible = true;
		//armazenar entidades
		entities.push(oBackground);
		entities.push(oPlayer);
		entities.push(enemy);
		entities.push(enemy2);

	}//setUpSprites


	function setUpGameCamera() {
		// aplicar efeitos gráficos ao canvas
		//oBackground.render(canvases.background.ctx); //o background é estático, desenha-se aqui apenas uma ve
		//canvases.background.canvas.colorize("#555566");// modo noturno :)
		//canvases.background.canvas.colorize("#00ff00"); // modo infra-vermelhos
		//canvases.background.canvas.grayScale();//preto e branco :)

		// ajustar os canvas ao tamanho da janela
		canvases.background.canvas.width = window.innerWidth;
		canvases.background.canvas.height = oBackground.height;
		canvases.entities.canvas.width = window.innerWidth;
		canvases.entities.canvas.height = oBackground.height;
		canvases.components.canvas.width = window.innerWidth;
		canvases.components.canvas.height = oBackground.height;
		oBackground.x = 0;
		//	oBackground.x = Math.floor(oBackground.width * (-2 / 3));
		//dar load da camera e do Game world de forma a fazer o mapa dinamico
		// 1 -  criar o gameWorld
		gameWorld = new GameWorld(0, 0, canvas.width, canvas.height);

		// 2 - criar e configurar a c�mara 
		camera = new Camera(0, gameWorld.height * 0.5,
			gameWorld.width, gameWorld.height * 0.5);

		//camera.center(gameWorld);
	}//setUpGameCamera

	//função que para o jogo. É chamada pelo timer, quando a contagem chega a zero
	function stopGame() {
		cancelAnimationFrame(animationHandler);
		gameState = GameStates.STOPED;
		//gameTimer.stop();
		gSoundManager.stopAll(); //p�ram-se todos os  sons
		//GameSounds.AMBIENTE.FINAL.play(true, 0.2);

		canvases.background.canvas.colorize("#614719");
		canvases.entities.canvas.colorize("#614719");
		canvases.components.canvas.grayScale();
		canvases.components.canvas.fadeOut(2000);
	}//stopGame

	// tratamento dos inputs
	function keyDownHandler(e) {
		var codTecla = e.keyCode;
		teclas[codTecla] = true;
		//
		if (teclas[keyboard.SPACE]) {
			oPlayer.jump = true;
		}

	}//keyDown

	function keyUpHandler(e) {
		var codTecla = e.keyCode;
		teclas[codTecla] = false;

		switch (codTecla) {
			case keyboard.KPAD_PLUS:
				oPlayer.vx = oPlayer.vy += 3;
				break;
			case keyboard.KPAD_MINUS:
				oPlayer.vx = oPlayer.vy -= 3;
				break;
			case keyboard.LSHIFT, keyboard.RSHIFT:
				oPlayer.podeAtacar = true;
				break;
		}

		oPlayer.parar();
		//para o background quando para de carregar
		oBackground.parar();
	}//keyup


	// função que verifica as colisões
	function checkColisions() {
		//validação para incrementar niveis
		if (countBackgroundLoops == 2) {
			gamelevelCounter++;
			//voltar a carregar o jogo
			chargeBackground();
		}

		checkBoundColision();
	}//checkColisions


	function checkBoundColision() {
		if (!enemy.visible && !enemy2.visible) {
			//reposicionar o background consoante a posição do tanque
			if (oPlayer.dir === -1) {
				if (oBackground.x <= (Math.floor(oBackground.width / 3)) * - 2) {
					oBackground.x = 0;
					countBackgroundLoops++;
				}//direita
			} else if (oPlayer.dir === 1) {
				if (oBackground.x >= 0) {
					oBackground.x = (Math.floor(oBackground.width / 3)) * - 2;
				}//esquera
			}
			// 3 - animar o background se o tanque atingir os limites interiores da c�mara
			//     a uma velocidade de 1/3 da velocidade do tanque	
			if (oPlayer.x + oPlayer.width - 10 > camera.rightInnerBoundary()) {
				oPlayer.x = camera.rightInnerBoundary() - oPlayer.width;
				oBackground.vx = oPlayer.vx / 3 * - 1;

			}
		}
		else {//enemy is visible
			oBackground.x = oBackground.x;

			if (!enemy.isDead || !enemy2.isDead) {//se nao estiver morto
				oPlayer.blockRectangle(enemy);
				oPlayer.blockRectangle(enemy2);
			}//bloqueia contra o inimigo


			for (var i = 0; i < ataquesAliados.length; i++) {

				if ((!ataquesAliados[i].isColliding
					&& enemy.hitTestRectangle(ataquesAliados[i]) || (!ataquesAliados[i].isColliding
						&& enemy2.hitTestRectangle(ataquesAliados[i])))) {
					ataquesAliados[i].isColliding = true;
					if (enemy.visible) {
						enemy.morto();
					} else {
						enemy2.morto();

					}
				};

			}
		}
	}//checkBoundColision

	function setAccelerationAndFriction(obj, direction) {
		if (direction === "left") {
			obj.accelerationX = -0.2;
			obj.friction = 1;
		} else if (direction === "right") {//case right
			obj.accelerationX = 0.2;
			obj.friction = 1;
		}
	}//setAcelerationAndFriction


	// Ciclo de jogo. Chamada a cada refrescamento do browser (sempres que possível)
	function update() {
		if (gameState == GameStates.RUNNING) {
			//execute game play validations
			gamePlay();

			//update das entidades
			for (var i = 0; i < entities.length; i++) {
				entities[i].update();
			}

			//set zombie to visible
			if (countBackgroundLoops == previousCountBackgroundLoops) {//adiciona o inimigo
				enemy.parar();
				enemy2.parar();
				if (countBackgroundLoops !== 0) {
					if (countBackgroundLoops % 2 === 0) {
						enemy2.visible = true;
						enemy2.isDead = false;
					} else {
						enemy.visible = true;
						enemy.isDead = false;
					}
				}
				previousCountBackgroundLoops++;
			}

			checkColisions();
			clearArrays();

			// se o soldado morre para o jogo
			if (!oPlayer.active) {
				stopGame();
			} else {
				animationHandler = requestAnimationFrame(update, canvas);
			};

			render();
		}//running game

	}//update

	function gamePlay() {
		//Create the animation loop
		if (teclas[keyboard.LEFT] && oPlayer.x > 0) {
			oPlayer.andar();
			oPlayer.x -= oPlayer.vx;
			oPlayer.dir = 1;
			oPlayer.flipH = -1;
			setAccelerationAndFriction("left");
		}
		if (teclas[keyboard.RIGHT] && (oPlayer.x < camera.width - oPlayer.width || enemy.isDead === true)) {
			oPlayer.andar();
			oPlayer.x += oPlayer.vx;
			oPlayer.dir = -1;
			oPlayer.flipH = 1;
			setAccelerationAndFriction("right");
		}
		if (teclas[keyboard.UP])
			oPlayer.y = oPlayer.y - oPlayer.vy < canvas.height - 150 ? canvas.height - 150 : oPlayer.y - oPlayer.vy;
		if (teclas[keyboard.DOWN])
			oPlayer.y = oPlayer.bottom() + oPlayer.vy > canvas.height ? canvas.height - oPlayer.height : oPlayer.y + oPlayer.vy;

		if (oPlayer.podeAtacar) {
			oPlayer.atacar();
			var ataque = new Ataque(gSpriteSheets['assets//ataque.png'], oPlayer.x - 30, oPlayer.y + oPlayer.height / 3);
			ataque.toogleState(ataque.states.Bullet);
			ataquesAliados.push(ataque);
			entities.push(ataque);
			//status == atack
			//criar novo ataque
			/*
					let aBala = new Bala(gSpriteSheets['assets//ataque.png'],
					oPlayer.x - 30, oPlayer.y + oPlayer.height / 2.5
					, 100,  oPlayer.dir, 
					GameSounds.BALA);
					aBala.toogleState(ataque.states.Bullet);
					entities.push(aBala);
					ataquesAliados.push(aBala);
		*/
			oPlayer.podeAtacar = false;
			console.log("atacou");
		}//atacar

		//console.log(oPlayer.isOnGround);
		//Space
		if (oPlayer.jump) {
			oPlayer.saltar();
		}//salta

	}//gamePlay


	// Limpeza das entidades desativadas
	function clearArrays() {
		entities = entities.filter(filterByActive);
	}//clearArrays

	function filterByActive(obj) {
		if (obj.active == true)
			return obj;
	}//filterByActive

	// Desenho dos elementos gráficos
	function render() {

		canvases.entities.ctx.clearRect(0, 0, canvas.width, canvas.height); //limpa canvas
		canvases.background.ctx.clearRect(0, 0, canvas.width, canvas.height); //limpa canvas

		for (var i = 1; i < entities.length; i++) {
			var entity = entities[i];
			//entidades fora do canvas não se desenham
			if (entity.right() > 0 && entity.bottom() > 0 &&
				entity.left() < canvas.width && entity.top() < canvas.height) {

				entities[i].render(canvases.entities.ctx);

				if (debugMode) entities[i].drawColisionBoundaries(canvases.entities.ctx, false, false, "blue", "red");
			}
		}
		//desenha o frame da camera 
		//debug
		//	camera.drawFrame(canvases.entities.ctx, true);
		//renderiza a camera dinamica
		oBackground.render(canvases.background.ctx);
		barraEnergiaEnemy.render();
		barraEnergiaHero.render();
	}//Render


})(); // não apagar
