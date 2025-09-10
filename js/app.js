document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modal-body');
    const closeBtn = document.querySelector('.close-btn');

    const openModal = () => modal.style.display = 'flex';
    const closeModal = () => modal.style.display = 'none';

    closeBtn.addEventListener('click', closeModal);
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Learning Pal
    document.getElementById('learning-pal').addEventListener('click', () => {
        modalBody.innerHTML = `
            <h2>Learning Pal</h2>
            <div id="chat-container"></div>
            <input type="text" id="chat-input" placeholder="Ask a question...">
        `;
        openModal();

        const chatContainer = document.getElementById('chat-container');
        const chatInput = document.getElementById('chat-input');

        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && chatInput.value.trim() !== '') {
                const userQuery = chatInput.value.trim().toLowerCase();
                appendMessage('user', userQuery);

                const answer = qaPairs[userQuery] || "Sorry, I don't have an answer for that. Try asking something else!";
                setTimeout(() => appendMessage('bot', answer), 500);

                chatInput.value = '';
            }
        });

        function appendMessage(sender, text) {
            const msgDiv = document.createElement('div');
            msgDiv.classList.add(sender === 'user' ? 'user-msg' : 'bot-msg');
            msgDiv.textContent = text;
            chatContainer.appendChild(msgDiv);
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }
    });

    // Task Track
    document.getElementById('task-track').addEventListener('click', () => {
        modalBody.innerHTML = `
            <h2>Task Track</h2>
            <ul id="task-list"></ul>
            <input type="text" id="new-task-input" placeholder="Add a new task...">
            <button id="add-task-btn">Add</button>
        `;
        openModal();
        renderTasks();

        document.getElementById('add-task-btn').addEventListener('click', addTask);
        document.getElementById('new-task-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') addTask();
        });
    });

    function renderTasks() {
        const taskList = document.getElementById('task-list');
        taskList.innerHTML = '';
        tasks.forEach((task, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <input type="checkbox" id="task-${index}" ${task.done ? 'checked' : ''}>
                <label for="task-${index}" style="${task.done ? 'text-decoration: line-through;' : ''}">${task.text}</label>
            `;
            li.querySelector('input').addEventListener('change', () => {
                tasks[index].done = !tasks[index].done;
                renderTasks();
            });
            taskList.appendChild(li);
        });
    }

    function addTask() {
        const input = document.getElementById('new-task-input');
        if (input.value.trim() !== '') {
            tasks.push({ text: input.value.trim(), done: false });
            input.value = '';
            renderTasks();
        }
    }

    // Learn Box
    document.getElementById('learn-box').addEventListener('click', () => {
        let currentCard = 0;
        modalBody.innerHTML = `
            <h2>Learn Box</h2>
            <div id="flashcard-container">
                <div class="flashcard">
                    <div class="card-face card-front"></div>
                    <div class="card-face card-back"></div>
                </div>
            </div>
            <div id="flashcard-nav">
                <button id="prev-card">Prev</button>
                <button id="next-card">Next</button>
            </div>
        `;
        openModal();

        const flashcard = document.querySelector('.flashcard');
        const cardFront = document.querySelector('.card-front');
        const cardBack = document.querySelector('.card-back');

        function showCard() {
            flashcard.classList.remove('is-flipped');
            cardFront.textContent = flashcards[currentCard].question;
            cardBack.textContent = flashcards[currentCard].answer;
        }

        showCard();

        flashcard.addEventListener('click', () => {
            flashcard.classList.toggle('is-flipped');
        });

        document.getElementById('prev-card').addEventListener('click', () => {
            currentCard = (currentCard - 1 + flashcards.length) % flashcards.length;
            showCard();
        });

        document.getElementById('next-card').addEventListener('click', () => {
            currentCard = (currentCard + 1) % flashcards.length;
            showCard();
        });
    });

    // Quick Scribble
    document.getElementById('quick-scribble').addEventListener('click', () => {
        modalBody.innerHTML = `
            <h2>Quick Scribble</h2>
            <textarea id="notes-area">${notes}</textarea>
        `;
        openModal();

        document.getElementById('notes-area').addEventListener('input', (e) => {
            notes = e.target.value;
        });
    });

    // Footer Navigation
    const footerIcons = document.querySelectorAll('.footer-icon');
    const featureCards = {
        'footer-home': null,
        'footer-tasks': document.getElementById('task-track'),
        'footer-ai-pal': document.getElementById('learning-pal'),
        'footer-learn-box': document.getElementById('learn-box')
    };

    function setActiveIcon(iconId) {
        footerIcons.forEach(icon => {
            icon.classList.remove('active');
        });
        document.getElementById(iconId).classList.add('active');
    }

    footerIcons.forEach(icon => {
        icon.addEventListener('click', (e) => {
            e.preventDefault();
            const iconId = icon.id;
            const targetCard = featureCards[iconId];

            setActiveIcon(iconId);

            if (targetCard) {
                targetCard.click();
            } else {
                // This is the Home button
                closeModal();
            }
        });
    });

    // Also set active icon when closing modal with X or by clicking outside
    const originalCloseModal = closeModal;
    closeModal = function() {
        originalCloseModal();
        setActiveIcon('footer-home');
    }
    closeBtn.addEventListener('click', closeModal);
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
});
