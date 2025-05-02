document.addEventListener('DOMContentLoaded', () => {
    const channelItems = document.querySelectorAll('.channel-item');
    const mainChannelName = document.getElementById('main-channel-name');
    const messageInput = document.querySelector('.input-wrapper input[type="text"]');


    const usernameElement = document.querySelector('.username');
    const userRank = 'admin'; // <- przykład, może być pobrane z danych użytkownika
    
    usernameElement.classList.add(`rank-${userRank}`);

    channelItems.forEach(item => {
        item.addEventListener('click', () => {
            // Usuń klasę 'active-channel' ze wszystkich
            channelItems.forEach(el => el.classList.remove('active-channel'));

            // Dodaj klasę 'active-channel' do klikniętego
            item.classList.add('active-channel');

            // Zaktualizuj nazwę kanału w nagłówku i placeholderze
            const channelName = item.querySelector('span').textContent;
            if (mainChannelName) {
                mainChannelName.textContent = channelName;
            }
            if (messageInput) {
                // Sprawdź ikonę, aby odróżnić kanały tekstowe od głosowych
                const iconClass = item.querySelector('i').classList;
                if (iconClass.contains('fa-hashtag') || iconClass.contains('fa-lock')) {
                     messageInput.placeholder = `Napisz wiadomość na #${channelName}`;
                     messageInput.disabled = false; // Włącz pole tekstowe
                 } else {
                     messageInput.placeholder = `Nie można wysyłać wiadomości na kanale głosowym`;
                     messageInput.disabled = true; // Wyłącz pole tekstowe
                 }
            }

            // Tutaj w przyszłości można by ładować odpowiednie wiadomości itp.
            console.log(`Przełączono na kanał: ${channelName}`);
        });
    });

     // Inicjalizacja placeholdera dla domyślnie aktywnego kanału
     const initialActiveChannel = document.querySelector('.channel-item.active-channel span');
     if (initialActiveChannel && messageInput) {
          messageInput.placeholder = `Napisz wiadomość na #${initialActiveChannel.textContent}`;
     }
});