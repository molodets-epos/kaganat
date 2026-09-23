import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Твои реальные ключи из Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBRkzOUhINImQi69kBdElZhyOmMCUlDNnQ",
    authDomain: "kaganat-5c070.firebaseapp.com",
    projectId: "kaganat-5c070",
    storageBucket: "kaganat-5c070.appspot.com",
    messagingSenderId: "601843425761",
    appId: "1:601843425761:web:429cd2775df0661543f2a0"
};

// Инициализация Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Обработчик клика по кнопке регистрации
document.getElementById("registerBtn").addEventListener("click", async () => {
    const inputVal = document.getElementById("nicknameInput").value;
    await registerPlayer(inputVal);
});

async function registerPlayer(nicknameInput) {
    const user = auth.currentUser;
    if (!user) {
        alert("Сначала войдите в систему через Google!");
        return;
    }

    const cleanNickname = nicknameInput.trim();
    const nicknameKey = cleanNickname.toLowerCase();

    if (cleanNickname.length < 3) {
        alert("Никнейм должен содержать минимум 3 символа.");
        return;
    }

    try {
        // Проверяем уникальность никнейма в базе данных
        const nickRef = doc(db, "nicknames", nicknameKey);
        const nickSnap = await getDoc(nickRef);

        if (nickSnap.exists()) {
            alert("Этот никнейм уже занят! Выберите другой.");
            return;
        }

        // Занимаем ник за текущим UID
        await setDoc(nickRef, { uid: user.uid });

        // Создаем профиль персонажа
        const userRef = doc(db, "users", user.uid);
        await setDoc(userRef, {
            uid: user.uid,
            nickname: cleanNickname,
            level: 1,
            gold: 100,
            hp: 100,
            createdAt: new Date().toISOString()
        });

        alert(`Регистрация успешна! Добро пожаловать, ${cleanNickname}!`);
        window.location.href = "/game.html";

    } catch (error) {
        console.error("Ошибка регистрации:", error);
        alert("Произошла ошибка при регистрации. Попробуйте снова.");
    }
}
