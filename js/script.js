// Основные переменные игры
let currentScreen = 'start';
let currentRoom = 1;
let timeLeft = 300; // 5 минут в секундах
let timerInterval;
let gameActive = false;

// Данные для комнаты 1
let collectedKeys = [];
let keyOrder = [3, 1, 2]; // Правильный порядок ключей
let switchesState = { switch1: false, switch2: false };

// Данные для комнаты 2
let inventory = [];
let dialogues = {
  butler: "Я видел, как профессор что-то прятал в сейф. Первая цифра кода - 3.",
  professor: "Художник постоянно рисует что-то подозрительное. Вторая цифра - 7.",
  artist: "Дворецкий ведет себя странно с тех пор, как пропали часы. Третья цифра - 5."
};
let safeCode = "";
let correctCode = "375";

// Данные для комнаты 3
let currentTarget = 1;
let destroyedEnemies = [];
let targetOrder = [2, 3, 1]; // Порядок уничтожения: тип 2 (синий), тип 3 (зеленый), тип 1 (красный)
let ammo = 18;
let enemies = [
  { id: 1, type: 1, order: 3, element: null },
  { id: 2, type: 2, order: 1, element: null },
  { id: 3, type: 3, order: 2, element: null },
  { id: 4, type: 1, order: 2, element: null },
  { id: 5, type: 3, order: 1, element: null },
  { id: 6, type: 2, order: 3, element: null }
];

// DOM элементы
const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const endScreen = document.getElementById('end-screen');
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');
const nextRoomBtn = document.getElementById('next-room-btn');
const timerElement = document.getElementById('timer');
const progressFill = document.getElementById('progress-fill');
const progressText = document.getElementById('progress-text');
const roomNameElement = document.getElementById('room-name');
const finalTimeElement = document.getElementById('final-time');

// Инициализация игры
document.addEventListener('DOMContentLoaded', function() {
  // Назначение обработчиков событий
  startBtn.addEventListener('click', startGame);
  restartBtn.addEventListener('click', restartGame);
  nextRoomBtn.addEventListener('click', nextRoom);

  // Инициализация комнат
  initRoom1();
  initRoom2();
  initRoom3();

  // Обработка клавиатуры для платформера
  document.addEventListener('keydown', handleKeyDown);

  // Обработка мыши для шутера
  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('click', handleShoot);
});

// Запуск игры
function startGame() {
  currentScreen = 'game';
  startScreen.classList.remove('active');
  gameScreen.classList.add('active');
  endScreen.classList.remove('active');

  // Сброс игры
  resetGame();

  // Запуск таймера
  startTimer();

  // Активация первой комнаты
  showRoom(1);
}

// Сброс игры
function resetGame() {
  currentRoom = 1;
  timeLeft = 300;
  collectedKeys = [];
  switchesState = { switch1: false, switch2: false };
  inventory = [];
  safeCode = "";
  currentTarget = 1;
  destroyedEnemies = [];
  ammo = 18;
  gameActive = true;

  updateTimerDisplay();
  updateProgress();
  updateRoomName();

  // Сброс элементов комнат
  resetRoom1();
  resetRoom2();
  resetRoom3();
}

// Таймер
function startTimer() {
  clearInterval(timerInterval);
  timerInterval = setInterval(function() {
    if (timeLeft > 0 && gameActive) {
      timeLeft--;
      updateTimerDisplay();

      // Обновление прогресса
      updateProgress();

      // Если время вышло
      if (timeLeft === 0) {
        endGame(false);
      }
    }
  }, 1000);
}

function updateTimerDisplay() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function updateProgress() {
  const progress = ((300 - timeLeft) / 300) * 100;
  progressFill.style.width = `${progress}%`;
  progressText.textContent = `${Math.round(progress)}%`;
}

function updateRoomName() {
  const roomNames = [
    "",
    "1",
    "2",
    "3"
  ];
  roomNameElement.textContent = roomNames[currentRoom];
}

// Управление комнатами
function showRoom(roomNumber) {
  // Скрыть все комнаты
  document.querySelectorAll('.room').forEach(room => {
    room.classList.remove('active');
  });

  // Показать нужную комнату
  document.getElementById(`room${roomNumber}`).classList.add('active');
  currentRoom = roomNumber;
  updateRoomName();

  // Обновить кнопку следующей комнаты
  if (roomNumber === 3) {
    nextRoomBtn.innerHTML = '<i class="fas fa-flag-checkered"></i> ЗАВЕРШИТЬ ИГРУ';
  } else {
    nextRoomBtn.innerHTML = '<i class="fas fa-forward"></i> Следующая комната';
  }
}

function nextRoom() {
  // Проверка завершения текущей комнаты
  if (currentRoom === 1 && !checkRoom1Complete()) {
    alert("Соберите все ключи в правильном порядке, чтобы открыть дверь!");
    return;
  }

  if (currentRoom === 2 && !checkRoom2Complete()) {
    alert("Откройте сейф с правильным кодом, чтобы продолжить!");
    return;
  }

  if (currentRoom === 3 && !checkRoom3Complete()) {
    alert("Уничтожьте всех врагов в правильной последовательности!");
    return;
  }

  // Переход к следующей комнате или завершение игры
  if (currentRoom < 3) {
    showRoom(currentRoom + 1);
  } else {
    endGame(true);
  }
}

// Завершение игры
function endGame(success) {
  gameActive = false;
  clearInterval(timerInterval);

  currentScreen = 'end';
  startScreen.classList.remove('active');
  gameScreen.classList.remove('active');
  endScreen.classList.add('active');

  // Обновление результатов
  const minutes = Math.floor((300 - timeLeft) / 60);
  const seconds = (300 - timeLeft) % 60;
  finalTimeElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  if (success) {
    document.getElementById('genres-mixed').textContent = "УСПЕШНО";
    document.getElementById('rooms-completed').textContent = "3/3";
  } else {
    document.getElementById('genres-mixed').textContent = "НЕУДАЧА";
    document.getElementById('rooms-completed').textContent = `${currentRoom-1}/3`;
  }
}

// Перезапуск игры
function restartGame() {
  startGame();
}

// Комната 1: Платформер с головоломкой
function initRoom1() {
  const player = document.getElementById('player');
  const keys = document.querySelectorAll('.key');
  const switches = document.querySelectorAll('.switch');
  const door = document.querySelector('.door');

  // Начальная позиция игрока
  player.style.left = '20px';
  player.style.bottom = '30px';

  // Обработка кликов по ключам
  keys.forEach(key => {
    key.addEventListener('click', function() {
      if (!collectedKeys.includes(parseInt(this.dataset.order))) {
        // Проверка доступности ключа (только если активированы переключатели)
        if ((parseInt(this.dataset.order) === 1 && switchesState.switch1) ||
          (parseInt(this.dataset.order) === 2 && switchesState.switch2) ||
          (parseInt(this.dataset.order) === 3 && (switchesState.switch1 || switchesState.switch2))) {

          collectedKeys.push(parseInt(this.dataset.order));
          updateCollectedKeys();
          this.style.opacity = '0.3';
          this.style.pointerEvents = 'none';

          // Проверка завершения комнаты
          if (checkRoom1Complete()) {
            door.innerHTML = '<i class="fas fa-door-open"></i>';
            door.style.background = 'linear-gradient(45deg, #00ff00, #00cc00)';
          }
        } else {
          alert("Сначала активируйте нужные переключатели!");
        }
      }
    });
  });

  // Обработка переключателей
  switches.forEach(switchEl => {
    switchEl.addEventListener('click', function() {
      const switchId = this.id;
      switchesState[switchId] = !switchesState[switchId];

      if (switchesState[switchId]) {
        this.innerHTML = '<i class="fas fa-toggle-on"></i>';
        this.style.color = '#00ff00';
      } else {
        this.innerHTML = '<i class="fas fa-toggle-off"></i>';
        this.style.color = '#ff5555';
      }
    });
  });
}

function resetRoom1() {
  collectedKeys = [];
  switchesState = { switch1: false, switch2: false };

  // Сброс элементов
  const keys = document.querySelectorAll('.key');
  keys.forEach(key => {
    key.style.opacity = '1';
    key.style.pointerEvents = 'auto';
  });

  const switches = document.querySelectorAll('.switch');
  switches.forEach(switchEl => {
    switchEl.innerHTML = switchEl.id === 'switch1' ?
      '<i class="fas fa-toggle-on"></i>' : '<i class="fas fa-toggle-off"></i>';
    switchEl.style.color = switchEl.id === 'switch1' ? '#00ff00' : '#ff5555';
  });

  const door = document.querySelector('.door');
  door.innerHTML = '<i class="fas fa-door-closed"></i>';
  door.style.background = 'linear-gradient(45deg, #8b4513, #a0522d)';

  updateCollectedKeys();
}

function updateCollectedKeys() {
  const keysList = document.getElementById('collected-keys-list');
  const sequenceSlots = document.querySelectorAll('.sequence-slot');

  // Очистка
  keysList.innerHTML = '';

  // Отображение собранных ключей
  collectedKeys.forEach((key, index) => {
    const keyElement = document.createElement('div');
    keyElement.className = 'key-mini';
    keyElement.innerHTML = `<i class="fas fa-key"></i> Ключ ${key}`;
    keyElement.style.background = 'gold';
    keyElement.style.color = '#333';
    keyElement.style.padding = '5px 10px';
    keyElement.style.borderRadius = '5px';
    keyElement.style.margin = '5px';
    keyElement.style.display = 'inline-block';
    keysList.appendChild(keyElement);

    // Заполнение слотов последовательности
    if (index < sequenceSlots.length) {
      sequenceSlots[index].textContent = key;
      sequenceSlots[index].style.background = 'gold';
      sequenceSlots[index].style.color = '#333';
      sequenceSlots[index].style.border = '2px solid gold';
    }
  });

  // Очистка оставшихся слотов
  for (let i = collectedKeys.length; i < sequenceSlots.length; i++) {
    sequenceSlots[i].textContent = '?';
    sequenceSlots[i].style.background = 'rgba(0, 0, 0, 0.5)';
    sequenceSlots[i].style.color = '#fff';
    sequenceSlots[i].style.border = '2px dashed #00ffff';
  }
}

function checkRoom1Complete() {
  // Проверка правильного порядка ключей
  return JSON.stringify(collectedKeys) === JSON.stringify(keyOrder);
}

// Комната 2: Детектив с RPG
function initRoom2() {
  const characters = document.querySelectorAll('.character');
  const clues = document.querySelectorAll('.clue');
  const safeButtons = document.querySelectorAll('.safe-btn');
  const clearButton = document.getElementById('clear-code');

  // Обработка персонажей
  characters.forEach(character => {
    character.addEventListener('click', function() {
      const charName = this.dataset.character;
      const dialogueText = document.getElementById('dialogue-text');
      dialogueText.textContent = dialogues[charName];

      // Добавление улики в инвентарь
      const clue = this.dataset.clue;
      if (!inventory.includes(clue)) {
        inventory.push(clue);
        updateInventory();

        // Добавление подсказки о коде
        updateCodeHints();
      }
    });
  });

  // Обработка улик
  clues.forEach(clue => {
    clue.addEventListener('click', function() {
      const clueName = this.dataset.clue;
      if (!inventory.includes(clueName)) {
        inventory.push(clueName);
        updateInventory();
        this.style.opacity = '0.3';
        this.style.pointerEvents = 'none';
      }
    });
  });

  // Обработка кнопок сейфа
  safeButtons.forEach(button => {
    if (!button.classList.contains('clear')) {
      button.addEventListener('click', function() {
        if (safeCode.length < 3) {
          safeCode += this.dataset.number;
          updateSafeDisplay();

          if (safeCode.length === 3) {
            checkSafeCode();
          }
        }
      });
    }
  });

  // Обработка кнопки сброса
  clearButton.addEventListener('click', function() {
    safeCode = "";
    updateSafeDisplay();
  });
}

function resetRoom2() {
  inventory = [];
  safeCode = "";

  // Сброс элементов
  const clues = document.querySelectorAll('.clue');
  clues.forEach(clue => {
    clue.style.opacity = '1';
    clue.style.pointerEvents = 'auto';
  });

  updateInventory();
  updateSafeDisplay();
  updateCodeHints();

  const dialogueText = document.getElementById('dialogue-text');
  dialogueText.textContent = "Выберите персонажа для допроса...";
}

function updateInventory() {
  const inventoryItems = document.getElementById('inventory-items');
  inventoryItems.innerHTML = '';

  inventory.forEach(item => {
    const itemElement = document.createElement('div');
    itemElement.className = 'inventory-item';
    itemElement.textContent = item;
    itemElement.style.background = 'rgba(255, 255, 255, 0.1)';
    itemElement.style.padding = '8px 12px';
    itemElement.style.borderRadius = '5px';
    itemElement.style.margin = '5px';
    itemElement.style.display = 'inline-block';
    inventoryItems.appendChild(itemElement);
  });
}

function updateSafeDisplay() {
  const safeDisplay = document.getElementById('safe-display');
  let displayText = "Введите код: ";

  for (let i = 0; i < 3; i++) {
    if (i < safeCode.length) {
      displayText += safeCode[i] + " ";
    } else {
      displayText += "_ ";
    }
  }

  safeDisplay.textContent = displayText;
}

function updateCodeHints() {
  const codeHints = document.getElementById('code-hints');
  codeHints.innerHTML = '';

  if (inventory.includes("Перчатки")) {
    const hint = document.createElement('p');
    hint.innerHTML = '<i class="fas fa-key"></i> Первая цифра: 3';
    codeHints.appendChild(hint);
  }

  if (inventory.includes("Очки")) {
    const hint = document.createElement('p');
    hint.innerHTML = '<i class="fas fa-key"></i> Вторая цифра: 7';
    codeHints.appendChild(hint);
  }

  if (inventory.includes("Кисть")) {
    const hint = document.createElement('p');
    hint.innerHTML = '<i class="fas fa-key"></i> Третья цифра: 5';
    codeHints.appendChild(hint);
  }
}

function checkSafeCode() {
  if (safeCode === correctCode) {
    alert("Сейф открыт! Код правильный.");
    return true;
  } else {
    alert("Неверный код! Попробуйте снова.");
    safeCode = "";
    updateSafeDisplay();
    return false;
  }
}

function checkRoom2Complete() {
  return safeCode === correctCode;
}

// Комната 3: Шутер с пазлом
function initRoom3() {
  const enemiesElements = document.querySelectorAll('.enemy');
  const crosshair = document.getElementById('crosshair');

  // Инициализация врагов
  enemies.forEach((enemy, index) => {
    enemy.element = enemiesElements[index];

    // Назначаем обработчик клика для каждого врага
    enemy.element.addEventListener('click', function() {
      if (gameActive && currentRoom === 3 && ammo > 0) {
        shootEnemy(enemy);
      }
    });
  });

  // Обновление интерфейса
  updateAmmo();
  updateCurrentTarget();
}

function resetRoom3() {
  currentTarget = 1;
  destroyedEnemies = [];
  ammo = 18;

  // Сброс врагов
  const enemiesElements = document.querySelectorAll('.enemy');
  enemiesElements.forEach(enemy => {
    enemy.style.opacity = '1';
    enemy.style.pointerEvents = 'auto';
    enemy.style.transform = 'scale(1)';
  });

  // Сброс последовательности
  document.querySelectorAll('.sequence-item').forEach((item, index) => {
    item.classList.remove('active');
    if (index === 0) item.classList.add('active');
  });

  updateAmmo();
  updateCurrentTarget();
  updateDestroyedEnemies();
}

function shootEnemy(enemy) {
  // Проверка патронов
  if (ammo <= 0) {
    alert("Патроны закончились! Но вы можете продолжить без стрельбы.");
    return;
  }

  // Уменьшение патронов
  ammo--;
  updateAmmo();

  // Проверка правильности порядка
  if (enemy.type === targetOrder[currentTarget - 1]) {
    // Правильный враг
    destroyedEnemies.push(enemy.id);
    enemy.element.style.opacity = '0.3';
    enemy.element.style.pointerEvents = 'none';
    enemy.element.style.transform = 'scale(0.5)';

    // Обновление интерфейса
    updateDestroyedEnemies();

    // Переход к следующей цели
    if (currentTarget < 3) {
      currentTarget++;
      updateCurrentTarget();
    } else {
      // Все цели уничтожены
      checkRoom3Complete();
    }
  } else {
    // Неправильный враг
    alert("Не та последовательность! Начинайте сначала.");
    currentTarget = 1;
    updateCurrentTarget();
  }
}

function updateAmmo() {
  const ammoCount = document.getElementById('ammo-count');
  const ammoFill = document.getElementById('ammo-fill');

  ammoCount.textContent = ammo;
  const ammoPercent = (ammo / 18) * 100;
  ammoFill.style.width = `${ammoPercent}%`;

  // Изменение цвета в зависимости от количества патронов
  if (ammoPercent > 50) {
    ammoFill.style.background = 'linear-gradient(90deg, #00ff00, #ffcc00)';
  } else if (ammoPercent > 20) {
    ammoFill.style.background = 'linear-gradient(90deg, #ffcc00, #ff9900)';
  } else {
    ammoFill.style.background = 'linear-gradient(90deg, #ff9900, #ff0000)';
  }
}

function updateCurrentTarget() {
  const currentTargetElement = document.getElementById('current-target');
  const sequenceItems = document.querySelectorAll('.sequence-item');

  // Обновление активного элемента в последовательности
  sequenceItems.forEach((item, index) => {
    if (index === currentTarget - 1) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });

  // Обновление текста текущей цели
  let targetName = "";
  let targetIcon = "";

  switch(targetOrder[currentTarget - 1]) {
    case 1:
      targetName = "Красный робот";
      targetIcon = '<i class="fas fa-robot"></i>';
      break;
    case 2:
      targetName = "Синий призрак";
      targetIcon = '<i class="fas fa-ghost"></i>';
      break;
    case 3:
      targetName = "Зеленый дракон";
      targetIcon = '<i class="fas fa-dragon"></i>';
      break;
  }

  currentTargetElement.innerHTML = `${targetName} ${targetIcon}`;
}

function updateDestroyedEnemies() {
  const destroyedList = document.getElementById('destroyed-enemies');
  destroyedList.innerHTML = '';

  destroyedEnemies.forEach(enemyId => {
    const enemy = enemies.find(e => e.id === enemyId);
    if (enemy) {
      const enemyElement = document.createElement('div');
      enemyElement.className = 'destroyed-enemy';
      enemyElement.innerHTML = `<i class="fas fa-skull-crossbones"></i> Враг ${enemyId} (тип ${enemy.type})`;
      enemyElement.style.padding = '5px';
      enemyElement.style.margin = '3px 0';
      enemyElement.style.background = 'rgba(255, 0, 0, 0.2)';
      enemyElement.style.borderRadius = '3px';
      destroyedList.appendChild(enemyElement);
    }
  });
}

function checkRoom3Complete() {
  // Проверяем, все ли враги уничтожены в правильном порядке
  if (destroyedEnemies.length >= 3) {
    const exitDoor = document.querySelector('.exit-door');
    exitDoor.innerHTML = '<i class="fas fa-check-circle"></i>';
    exitDoor.style.background = 'linear-gradient(45deg, #00ff00, #00cc00)';
    return true;
  }
  return false;
}

// Обработка клавиатуры для платформера
function handleKeyDown(e) {
  if (!gameActive || currentRoom !== 1) return;

  const player = document.getElementById('player');
  let left = parseInt(player.style.left) || 20;
  let bottom = parseInt(player.style.bottom) || 30;

  switch(e.key.toLowerCase()) {
    case 'a':
    case 'arrowleft':
      left = Math.max(0, left - 20);
      break;
    case 'd':
    case 'arrowright':
      left = Math.min(450, left + 20);
      break;
    case 'w':
    case 'arrowup':
      // Простой прыжок
      bottom += 50;
      player.style.bottom = bottom + 'px';
      setTimeout(() => {
        player.style.bottom = '30px';
      }, 300);
      break;
  }

  player.style.left = left + 'px';
}

// Обработка мыши для шутера
function handleMouseMove(e) {
  if (!gameActive || currentRoom !== 3) return;

  const crosshair = document.getElementById('crosshair');
  const gameArea = document.getElementById('shooter-game');
  const rect = gameArea.getBoundingClientRect();

  // Ограничение движения прицела в пределах игровой области
  let x = e.clientX - rect.left;
  let y = e.clientY - rect.top;

  x = Math.max(15, Math.min(rect.width - 15, x));
  y = Math.max(15, Math.min(rect.height - 15, y));

  crosshair.style.left = x + 'px';
  crosshair.style.top = y + 'px';
}

function handleShoot(e) {
  if (!gameActive || currentRoom !== 3) return;}

// Проверяем, что клик был внутри игровой области
