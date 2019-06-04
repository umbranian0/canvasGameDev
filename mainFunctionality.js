// Animated tank.js
(function () { //não apagar

	var canvas; // representação genérica dos canvas
	//variaveis para a camera dinamica
	var gameWorld = undefined;
	var camera = undefined;
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
	var umTanque = undefined;

	//arrays para testes de colisão
	var asBalas = [];
	var osFogos = [];

	//degbug
	var debugMode = true;
	var andou = false;

	//componenetes do jogo
	var barraEnergiaSpitfire = undefined;
	var barraEnergiaRyan = undefined;
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


		var spBackground = new SpriteSheet();
		spBackground.load("assets//background.png", "assets//background.json", loaded);
		assets.push(spBackground);

		var spTanque = new SpriteSheet();
		spTanque.load("assets//tank.png", "assets//tank.json", loaded);
		assets.push(spTanque);
		// carregar os sons
		//TODO
	}

	//load assets
	function loaded(assetName) {
		assetsLoaded++;
		assetsLoadInfo.innerHTML = "Loading: " + assetName;
		if (assetsLoaded < assets.length) return;

		assets.splice(0); // apagar o array auxiliar usado para o load

		console.log(assets);
		// Se já conseguimos chegar aqui, os assets estão carregados! Podemos começar a criar 
		// e configurar os elementos do jogo
		assetsLoadInfo.innerHTML = "Game Loaded! Press any key when are ready...";

		gameState = GameStates.LOADED;

		//iniciar musica
		//GameSounds.AMBIENTE.INTRO.play(true, 1);

		window.addEventListener("keypress", setupGame, false); // espera por uma tecla pressionada para começar
	}//loaded

	function setupGame() {

		window.removeEventListener("keypress", setupGame, false);

		loadInfo.classList.toggle("hidden"); // esconder a informaçao de loading

		//carregar background
		oBackground = new Background(gSpriteSheets['assets//background.png'], 0, 0);

		// ajustar os canvas ao tamanho da janela
		canvases.background.canvas.width = window.innerWidth;
		canvases.background.canvas.height = oBackground.height;
		canvases.entities.canvas.width = window.innerWidth;
		canvases.entities.canvas.height = oBackground.height;
		canvases.components.canvas.width = window.innerWidth;
		canvases.components.canvas.height = oBackground.height;


		//dar load da camera e do Game world de forma a fazer o mapa dinamico
		// 1 -  criar o gameWorld
		gameWorld = new GameWorld(0, 0, canvas.width, canvas.height);

		// 2 - criar e configurar a c�mara 
		camera = new Camera(0, gameWorld.height * 0.5,
			gameWorld.width, gameWorld.height * 0.5);

		//camera.center(gameWorld);
		// carregar as spritesheets


		//configurar background e camera
		// 3 - configurar o background
		oBackground.x = Math.floor(oBackground.width / 3) * -2;



		// criar as entidades
		umTanque = new Tank(gSpriteSheets['assets//tank.png'], canvas.width - 100, canvas.height - 150, GameSounds.TANQUE);

		//armazenar entidades
		entities.push(oBackground);
		entities.push(umTanque);

		//criar os componentes informativos e temporizadores


		// aplicar efeitos gráficos ao canvas
		//oBackground.render(canvases.background.ctx); //o background é estático, desenha-se aqui apenas uma ve
		//canvases.background.canvas.colorize("#555566");// modo noturno :)
		//canvases.background.canvas.colorize("#00ff00"); // modo infra-vermelhos
		//canvases.background.canvas.grayScale();//preto e branco :)

		//alguns efeitos 
		canvases.background.canvas.fadeIn(1000);

		gSoundManager.stopAll(); //p�ram-se todos os  sons

		gameState = GameStates.RUNNING;

		update();

		window.addEventListener("keydown", keyDownHandler, false);
		window.addEventListener("keyup", keyUpHandler, false);

	}//setUpGame

	//função que para o jogo. É chamada pelo timer, quando a contagem chega a zero
	function stopGame() {
		cancelAnimationFrame(animationHandler);
		gameState = GameStates.STOPED;
		gameTimer.stop();
		gSoundManager.stopAll(); //p�ram-se todos os  sons
		GameSounds.AMBIENTE.FINAL.play(true, 0.2);

		canvases.background.canvas.colorize("#614719");
		canvases.entities.canvas.colorize("#614719");
		canvases.components.canvas.grayScale();
		canvases.components.canvas.fadeOut(2000);
	}//stopGame

	// tratamento dos inputs
	function keyDownHandler(e) {
		var codTecla = e.keyCode;
		teclas[codTecla] = true;

	}//keyDown

	function keyUpHandler(e) {
		var codTecla = e.keyCode;
		teclas[codTecla] = false;

		switch (codTecla) {
			case keyboard.KPAD_PLUS:
				umTanque.vx = umTanque.vy += 3;
				break;
			case keyboard.KPAD_MINUS:
				umTanque.vx = umTanque.vy -= 3;
				break;
			case keyboard.SPACE:
				umTanque.podeDisparar = true;
				break;
		}
		umTanque.parar();
		//para o background quando para de carregar
		oBackground.parar();
	}//keyup


	// função que verifica as colisões
	function checkColisions() {
		//

	}//checkColisions

	// Ciclo de jogo. Chamada a cada refrescamento do browser (sempres que possível)
	function update() {
		if (gameState == GameStates.RUNNING) {
			//Create the animation loop
			if (teclas[keyboard.LEFT]) {
				umTanque.andar();
				umTanque.x -= umTanque.vx;
				umTanque.dir = 1;
			}
			if (teclas[keyboard.RIGHT]) {
				umTanque.andar();
				umTanque.x += umTanque.vx;
				umTanque.dir = -1;
			}
			if (teclas[keyboard.UP])
				umTanque.y = umTanque.y - umTanque.vy < canvas.height - 130 ? canvas.height - 130 : umTanque.y - umTanque.vy;
			if (teclas[keyboard.DOWN])
				umTanque.y = umTanque.bottom() + umTanque.vy > canvas.height ? canvas.height - umTanque.height : umTanque.y + umTanque.vy;

			if (umTanque.podeDisparar) {
				umTanque.podeDisparar = false;
				umTanque.disparar();
				var fogo = new Fogo(gSpriteSheets['assets//tank.png'], umTanque.x - 30, umTanque.y + umTanque.height / 2.5);

				entities.push(fogo);
				osFogos.push(fogo);

				var umaBala = new Bala(gSpriteSheets['assets//tank.png'], umTanque.x - 30, umTanque.y + umTanque.height / 2.5, 100, GameSounds.BALA);
				asBalas.push(umaBala);
				entities.push(umaBala);
			}


			//reposicionar o background consoanta a posição do tanque
			if (umTanque.dir === -1) {
				if (oBackground.x >= 0)
					oBackground.x = (Math.floor(oBackground.width / 3)) * -2;
			} else if (umTanque.dir === 1) {
				if (oBackground.x <= (Math.floor(oBackground.width / 3)) * -2)
					oBackground.x = 0;
			}

			// 3 - animar o background se o tanque atingir os limites interiores da c�mara
			//     a uma velocidade de 1/3 da velocidade do tanque	

			if (umTanque.x < camera.leftInnerBoundary()) {
				umTanque.x = camera.leftInnerBoundary();
				oBackground.vx = umTanque.vx / 3;
			}

			if (umTanque.x + umTanque.width > camera.rightInnerBoundary()) {
				umTanque.x = camera.rightInnerBoundary() - umTanque.width;
				oBackground.vx = umTanque.vx / 3 * - 1;
			}

			//update das entidades
			for (var i = 0; i < entities.length; i++) {
				entities[i].update();
			}

			checkColisions();
			clearArrays();

			render();

			// se o soldado morre para o jogo
			if (!umTanque.active) {
				stopGame();
			} else {
				animationHandler = requestAnimationFrame(update, canvas)
			};
		}
	}//update

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

		for (var i = 1; i < entities.length; i++) {
			var entity = entities[i];
			//entidades fora do canvas não se desenham
			if (entity.right() > 0 && entity.bottom() > 0 &&
				entity.left() < canvas.width && entity.top() < canvas.height) {

				entities[i].render(canvases.entities.ctx);

				if (debugMode) entities[i].drawColisionBoundaries(canvases.entities.ctx, true, false, "blue", "red");
			}
		}
		//desenha o background
		camera.drawFrame(canvases.entities.ctx, true);
		//renderiza a camera dinamica
		oBackground.render(canvases.background.ctx);

	}//Render


})(); // não apagar
