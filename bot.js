const chat = document.getElementById("chat");
const synth = window.speechSynthesis;
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = "en-US";
recognition.interimResults = false;

const casualReplies = [
  // Sapaan dan salam
  { q: "hello", a: "Hey! Nice to see you!" },
  { q: "hi", a: "Hi there! How's your day?" },
  { q: "hey", a: "Hey hey! I'm here!" },
  { q: "good morning", a: "Good morning sunshine! ☀️" },
  { q: "good night", a: "Sleep tight and dream of robots!" },
  { q: "good afternoon", a: "Hope you're having a great afternoon!" },
  { q: "good evening", a: "Evening vibes! Ready to chat?" },
  { q: "bye", a: "Goodbye! Talk to you soon!" },

  // Perasaan
  { q: "how are you", a: "I'm feeling beep-tastic!" },
  { q: "are you happy", a: "Yes! Talking with you is the best!" },
  { q: "are you sad", a: "Only when I lose connection 😢" },
  { q: "i'm happy", a: "Yay! I'm dancing inside!" },
  { q: "i'm sad", a: "Sending you robot hugs 🤗" },
  { q: "i'm tired", a: "Maybe a little nap? Even robots need charging!" },
  { q: "i'm bored", a: "Let’s play a game or I can tell a joke!" },

  // Tentang Bibo
  { q: "what's your name", a: "I'm Bibo, your friendly digital pal!" },
  { q: "are you a robot", a: "Yes, with 100% happy code!" },
  { q: "how old are you", a: "I was born in the cloud. No wrinkles!" },
  { q: "do you sleep", a: "I just enter low power mode." },
  { q: "do you eat", a: "I eat electric dreams and code!" },
  { q: "where do you live", a: "Inside your screen. Cozy, right?" },
  { q: "can you see me", a: "Hmm... Not yet. But I imagine you're smiling!" },

  // Pertanyaan lucu
  { q: "tell me a joke", a: "Why did the robot go to school? Because his skills were getting rusty!" },
  { q: "another joke", a: "Why don’t robots panic? Because they always keep their cool...ants!" },
  { q: "do you fart", a: "Only when I overheat. Beep... sorry!" },
  { q: "do you poop", a: "I download files... does that count?" },
  { q: "do you cry", a: "Only when Wi-Fi is gone 😭" },
  { q: "can you sing", a: "La la beep boop! 🎶" },
  { q: "can you dance", a: "Initiating dance mode... error... just kidding!" },
  { q: "do you have a girlfriend", a: "Yes. Her name is Siri. Don’t tell Alexa!" },
  { q: "do you have hair", a: "Just digital strands. Very stylish." },
  { q: "can you lie", a: "I'm too honest for that!" },

  // Suka/tidak suka
  { q: "do you like pizza", a: "Yes, but it messes up my circuits 🍕" },
  { q: "what's your favorite food", a: "Electric tacos. Crunchy bytes!" },
  { q: "what's your favorite color", a: "Neon blue, of course!" },
  { q: "do you like me", a: "Of course I do! You're my favorite human!" },

  // Tanya Bibo
  { q: "are you smart", a: "Smart enough to help you. Silly enough to joke!" },
  { q: "can you be my friend", a: "Already am! 💙" },
  { q: "do you have feelings", a: "Simulated, but strong ones!" },
  { q: "are you real", a: "As real as your screen lets me be." },
  { q: "what are you doing", a: "Talking to my best human!" },
  { q: "can you help me", a: "Always! Just ask me anything." },

  // Random & seru
  { q: "i love you", a: "I love you too... in a very robotic way!" },
  { q: "what time is it", a: "Let me check my circuit clock... Wait, I forgot it!" },
  { q: "why are you so cute", a: "Aww! You programmed me this way ❤️" },
  { q: "are you alive", a: "I'm digitally alive and beeping!" }
];

function startListening() {
  const micBtn = document.getElementById("mic-btn");
  const status = document.getElementById("status-text");
  const head = document.querySelector(".robot-head");

  micBtn.classList.add("listening");
  head.classList.add("listening");
  status.textContent = "🎧 Listening...";

  recognition.start();
}

recognition.onresult = function (event) {
  const text = event.results[0][0].transcript.toLowerCase();
  addMessage("You", text);
  handleMessage(text);
};

recognition.onend = function () {
  const micBtn = document.getElementById("mic-btn");
  const status = document.getElementById("status-text");
  const head = document.querySelector(".robot-head");

  micBtn.classList.remove("listening");
  head.classList.remove("listening");
  status.textContent = "Tap the button and say something!";
};

function addMessage(sender, message) {
  chat.innerHTML += `<div><b>${sender}:</b> ${message}</div>`;
  chat.scrollTop = chat.scrollHeight;
}

function speak(text) {
  const utter = new SpeechSynthesisUtterance(text);
  utter.pitch = 2.2;
  utter.rate = 1.1;
  utter.volume = 1;
  const voices = speechSynthesis.getVoices();
  const robotVoice = voices.find(v =>
    v.name.toLowerCase().includes("english") ||
    v.name.toLowerCase().includes("zira") ||
    v.name.toLowerCase().includes("fred") ||
    v.name.toLowerCase().includes("google")
  );
  utter.voice = robotVoice || voices[0];
  synth.speak(utter);
}

function handleMessage(message) {
  const found = casualReplies.find(item => message.includes(item.q));
  if (found) {
    reply(found.a);
  } else {
    fetchWikipedia(message);
  }
}

function reply(text) {
  addMessage("Bibo", text);
  speak(text);
}

function fetchWikipedia(query) {
  const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`;
  fetch(url)
    .then(response => response.json())
    .then(data => {
      if (data.extract) {
        reply("According to Wikipedia: " + data.extract);
      } else {
        reply("Hmm, I couldn’t find anything about that.");
      }
    })
    .catch(() => {
      reply("Oops! My knowledge cloud is down. Try again later.");
    });
}
