const scriptUrl = 'https://script.google.com/macros/s/AKfycbwzzTQmfKaVRYwllitpP_z3LUFM2Ast7RL4gGkWnBQztpyhPRt6gwvQyr_xiUv5Y_xs-A/exec'; // Google Apps Script URL

class Animal {
    constructor(name, food, growthStages, buffs, images) {
        this.name = name;
        this.food = food; // 각 동물의 먹이
        this.happiness = 0; // 초기 행복도를 0으로 설정
        this.growthStages = growthStages;
        this.currentStage = 0;
        this.buffs = buffs;
        this.foodOptions = [];
        this.images = images; // 동물 이미지 배열
    }

    // 모든 동물의 먹이를 설정
    setFoodOptions() {
        this.foodOptions = [this.food, this.food, this.food]; // 각 동물의 먹이를 3개로 설정
    }

    feed(index) {
        const selectedFood = this.foodOptions[index];
        if (selectedFood === this.food) { // 올바른 먹이
            this.feedCorrectFood();
        } else if (selectedFood === "보통 먹이") { // 중립 먹이
            this.feedNeutralFood();
        } else { // 잘못된 먹이
            this.feedWrongFood();
        }
    }

    feedCorrectFood() {
        let happinessChange = 0;
        const probability = Math.random();

        // 난이도에 따라 행복도 변화
        if (this.buffs.difficulty === "쉬움") {
            if (probability < 0.9) {
                happinessChange = 20; // 90% 확률로 행복도 20 증가
                alert(`${this.name}가 행복해합니다!`);
            } else {
                happinessChange = -5; // 10% 확률로 행복도 5 감소
                alert(`${this.name}가 이 음식을 좋아하지 않습니다.`);
            }
        } else if (this.buffs.difficulty === "보통") {
            if (probability < 0.7) {
                happinessChange = 20; // 70% 확률로 행복도 20 증가
                alert(`${this.name}가 행복해합니다!`);
            } else {
                happinessChange = -5; // 30% 확률로 행복도 5 감소
                alert(`${this.name}가 이 음식을 좋아하지 않습니다.`);
            }
        } else { // "어려움"
            if (probability < 0.6) {
                happinessChange = 20; // 60% 확률로 행복도 20 증가
                alert(`${this.name}가 행복해합니다!`);
            } else {
                happinessChange = -10; // 40% 확률로 행복도 10 감소
                alert(`${this.name}가 이 음식을 좋아하지 않습니다.`);
            }
        }

        // 성장 버프 적용
        if (this.currentStage > 0) {
            if (this.currentStage === 1) {
                happinessChange *= 1.5; // 1차 성장 버프
            } else if (this.currentStage === 2) {
                happinessChange *= 2; // 2차 성장 버프
            }
        }

        this.happiness += happinessChange;
        this.showCurrentHappiness();
    }

    feedNeutralFood() {
        alert(`${this.name}가 별 반응을 보이지 않습니다.`);
        this.showCurrentHappiness();
    }

    feedWrongFood() {
        let happinessDecrease = 10; // 기본적으로 행복도 10 감소

        if (this.buffs.difficulty === "어려움") {
            happinessDecrease = 15; // 어려움 난이도에서는 15 감소
        }

        this.happiness -= happinessDecrease; // 행복도 감소 적용
        alert(`${this.name}가 이 음식을 좋아하지 않습니다.`);
        this.showCurrentHappiness();
    }

    showCurrentHappiness() {
        const statusDiv = document.getElementById("status");
        const imageDiv = document.getElementById("animal-image");
        if (this.happiness <= 0) {
            statusDiv.innerText = `${this.name}가 죽었습니다. 게임 오버입니다.`;
            imageDiv.src = this.images[0]; // 기본 이미지로 설정
        } else if (this.happiness >= 100) {
            statusDiv.innerText = `${this.name}가 행복도가 100이 되어 성장이 끝났습니다!`;
            imageDiv.src = this.images[3]; // 3차 성장 이미지로 설정
        } else {
            statusDiv.innerText = `${this.name}의 행복도: ${this.happiness}`;
            imageDiv.src = this.images[this.currentStage]; // 현재 성장 단계에 따른 이미지
        }
    }

    checkGrowth() {
        if (this.currentStage < this.growthStages.length && this.happiness >= this.growthStages[this.currentStage]) {
            this.currentStage++;
            alert(`${this.name}가 성장했습니다!`);
            this.showCurrentHappiness(); // 성장 후 상태 업데이트
        }
    }

    isGameOver() {
        return this.happiness <= 0;
    }
}

class Buffs {
    constructor(difficulty) {
        this.difficulty = difficulty;
    }
}

// 각 동물별로 먹이와 이미지 지정합니다.
const animals = {
    "플라밍고 드래곤": new Animal(
        "플라밍고 드래곤",
        "물",
        [30, 60],
        new Buffs("쉬움"),
        [
            "images/flamingo_dragon.png", // 기본 모습
            "images/flamingo_dragon_stage1.png", // 1차 성장 후 모습
            "images/flamingo_dragon_stage2.png", // 2차 성장 후 모습
            "images/flamingo_dragon_stage3.png" // 3차 성장 후 모습
        ]
    ),
    "구름 사슴": new Animal(
        "구름 사슴",
        "구름 젤리",
        [40, 60],
        new Buffs("보통"),
        [
            "images/cloud_deer.png", // 기본 모습
            "images/cloud_deer_stage1.png", // 1차 성장 후 모습
            "images/cloud_deer_stage2.png", // 2차 성장 후 모습
            "images/cloud_deer_stage3.png" // 3차 성장 후 모습
        ]
    ),
    "기계 토끼": new Animal(
        "기계 토끼",
        "전기 과자",
        [50, 70],
        new Buffs("어려움"),
        [
            "images/mechanical_rabbit.png", // 기본 모습
            "images/mechanical_rabbit_stage1.png", // 1차 성장 후 모습
            "images/mechanical_rabbit_stage2.png", // 2차 성장 후 모습
            "images/mechanical_rabbit_stage3.png" // 3차 성장 후 모습
        ]
    )
};

let selectedAnimal;

// 간식 이미지 배열
const snacks = {
    "물": "images/water.png",
    "구름 젤리": "images/cloud_jelly.png",
    "전기 과자": "images/electric_snack.png"
};

// 로그인 함수
function login() {
    const studentId = document.getElementById("student-id").value;
    const studentName = document.getElementById("student-name").value;

    // Google Apps Script로 요청 보내기
    fetch(`${scriptUrl}?action=login&studentId=${encodeURIComponent(studentId)}&studentName=${encodeURIComponent(studentName)}`, {
        method: 'GET'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('네트워크 응답이 좋지 않습니다.');
        }
        return response.json();
    })
    .then(data => {
        // 응답 처리
        if (data.isValid) {
            document.getElementById("login-form").style.display = "none"; // 로그인 폼 숨기기
            document.getElementById("animal-selection").style.display = "flex"; // 동물 선택 화면 표시
            document.getElementById("login-status").innerText = ""; // 로그인 상태 초기화
        } else {
            document.getElementById("login-status").innerText = "로그인 실패! 학번과 이름을 확인하세요.";
        }
    })
    .catch(error => {
        console.error('Error:', error); // 오류 처리
        document.getElementById("login-status").innerText = "로그인 요청 중 오류가 발생했습니다.";
    });
}



function startGame(animalName) {
    selectedAnimal = animals[animalName];
    if (!selectedAnimal) {
        alert("동물이 선택되지 않았습니다.");
        return;
    }
    document.getElementById("animal-name").innerText = selectedAnimal.name;
    document.getElementById("animal-image").src = selectedAnimal.images[0]; // 기본 이미지 설정
    document.getElementById("animal-selection").style.display = "none";
    document.getElementById("game-play").style.display = "block";

    selectedAnimal.setFoodOptions(); // 고정된 먹이 설정
    showFoodOptions();
}

function showFoodOptions() {
    const foodOptionsDiv = document.getElementById("food-options");
    foodOptionsDiv.innerHTML = '';
    selectedAnimal.foodOptions.forEach((food, index) => {
        // 간식 이미지 추가
        const snackImage = snacks[food];
        foodOptionsDiv.innerHTML += `
            <div class="food-card" onclick="feedAnimal(${index})">
                <img src="${snackImage}" alt="${food}" class="food-image"/> <!-- 간식 이미지 -->
                <span class="food-name">${food}</span> <!-- 간식 이름 -->
            </div>
        `;
    });
}

function feedAnimal(index) {
    selectedAnimal.feed(index);
    selectedAnimal.checkGrowth();
}

// 게임 종료 버튼 클릭 시 호출되는 함수
function endGame() {
    document.getElementById("game-play").style.display = "none"; // 게임 진행 화면 숨기기
    const animalSelection = document.getElementById("animal-selection");
    animalSelection.style.display = "block"; // 동물 선택 화면 재표시

    // CSS 초기화
    animalSelection.style.alignItems = "center"; // 중앙 정렬로 설정
    animalSelection.style.justifyContent = "center"; // 중앙 정렬로 설정

    // 추가: selection-box의 스타일을 명시적으로 설정
    const selectionBox = document.querySelector('.selection-box');
    selectionBox.style.margin = "0 auto"; // 중앙 정렬을 위한 마진 설정
    selectionBox.style.width = "700px"; // 너비를 고정
}
