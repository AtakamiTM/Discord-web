document.addEventListener('DOMContentLoaded', () => {
    const channelItems = document.querySelectorAll('.channel-item');
    const mainChannelName = document.getElementById('main-channel-name');
    const welcomeChannel = document.getElementById('welcome-channel');
    const messageInput = document.getElementById('message-input');
    const sendBtn = document.getElementById('send-btn');
    const chatArea = document.getElementById('chat-area');
    const userList = document.getElementById('user-list');
    const membersToggle = document.getElementById('members-toggle');
    const micBtn = document.getElementById('mic-btn');
    const deafenBtn = document.getElementById('deafen-btn');

    const currentUser = {
        name: 'Totek 😸',
        avatar: './img/image.webp',
        rank: 'admin'
    };

    const getChannelName = () => {
        const active = document.querySelector('.channel-item.active-channel span');
        return active ? active.textContent : '';
    };

    const updatePlaceholder = () => {
        messageInput.placeholder = `Napisz wiadomość na #${getChannelName()}`;
    };

    channelItems.forEach(item => {
        item.addEventListener('click', () => {
            channelItems.forEach(el => el.classList.remove('active-channel'));
            item.classList.add('active-channel');

            const channelName = item.querySelector('span').textContent;
            mainChannelName.textContent = channelName;
            if (welcomeChannel) welcomeChannel.textContent = channelName;

            const iconClass = item.querySelector('i').classList;
            const isText = iconClass.contains('fa-hashtag') || iconClass.contains('fa-lock');
            messageInput.disabled = !isText;
            messageInput.placeholder = isText
                ? `Napisz wiadomość na #${channelName}`
                : 'Nie można wysyłać wiadomości na kanale głosowym';
        });
    });

    updatePlaceholder();

    const toggleMute = (button, offIcon, onIcon, onTitle, offTitle) => {
        button.addEventListener('click', () => {
            const isOff = button.classList.toggle('off');
            const icon = button.querySelector('i');
            icon.className = `fas ${isOff ? offIcon : onIcon}`;
            button.title = isOff ? offTitle : onTitle;
        });
    };
    toggleMute(micBtn, 'fa-microphone-slash', 'fa-microphone', 'Wycisz mikrofon', 'Włącz mikrofon');
    toggleMute(deafenBtn, 'fa-volume-mute', 'fa-headphones', 'Wyłącz dźwięk', 'Włącz dźwięk');

    membersToggle.addEventListener('click', () => {
        const hidden = userList.classList.toggle('hidden');
        membersToggle.classList.toggle('active', !hidden);
    });

    // Na wąskich ekranach lista członków domyślnie jest schowana
    if (window.matchMedia('(max-width: 980px)').matches) {
        userList.classList.add('hidden');
        membersToggle.classList.remove('active');
    }

    const formatTime = () => {
        const now = new Date();
        return `Dzisiaj o ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    };

    // Czat zawsze startuje na dole i zostaje na dole, dopóki użytkownik sam nie przewinie wyżej
    let stickToBottom = true;
    const scrollToBottom = () => {
        chatArea.scrollTop = chatArea.scrollHeight;
    };
    chatArea.addEventListener('scroll', () => {
        stickToBottom = chatArea.scrollHeight - chatArea.scrollTop - chatArea.clientHeight < 40;
    });
    const chatObserver = new ResizeObserver(() => {
        if (stickToBottom) scrollToBottom();
    });
    Array.from(chatArea.children).forEach(child => chatObserver.observe(child));
    chatObserver.observe(chatArea);
    scrollToBottom();
    window.addEventListener('load', scrollToBottom);

    const sendMessage = () => {
        const text = messageInput.value.trim();
        if (!text || messageInput.disabled) return;

        const message = document.createElement('div');
        message.className = 'message own';

        const avatar = document.createElement('img');
        avatar.className = 'avatar';
        avatar.src = currentUser.avatar;
        avatar.alt = currentUser.name;

        const content = document.createElement('div');
        content.className = 'message-content';

        const meta = document.createElement('div');
        meta.className = 'message-meta';

        const username = document.createElement('span');
        username.className = `username rank-${currentUser.rank}`;
        username.textContent = currentUser.name;

        const timestamp = document.createElement('span');
        timestamp.className = 'timestamp';
        timestamp.textContent = formatTime();

        const paragraph = document.createElement('p');
        paragraph.textContent = text;

        meta.append(username, timestamp);
        content.append(meta, paragraph);
        message.append(avatar, content);
        chatArea.appendChild(message);

        messageInput.value = '';
        sendBtn.classList.remove('ready');
        chatArea.scrollTop = chatArea.scrollHeight;
    };

    messageInput.addEventListener('input', () => {
        sendBtn.classList.toggle('ready', messageInput.value.trim().length > 0);
    });
    messageInput.addEventListener('keydown', event => {
        if (event.key === 'Enter') {
            event.preventDefault();
            sendMessage();
        }
    });
    sendBtn.addEventListener('click', sendMessage);
});
