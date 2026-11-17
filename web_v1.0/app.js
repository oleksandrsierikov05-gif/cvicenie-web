function loadTopbar() {
    fetch('topbar.html')
        .then(response => response.text())
        .then(data => {
            const container = document.getElementById('topbar-container');
            if (container) {
                container.innerHTML = data;
                const currentPath = window.location.pathname;
                const pageName = currentPath.split('/').pop() || 'index.html'; 
                const links = container.querySelectorAll('.topbar a');
                links.forEach(link => {
                    if (link.getAttribute('href') === pageName) {
                        link.classList.add('active');
                    }
                });
            }
        })
        .catch(error => console.error('Error loading topbar:', error));
}


document.addEventListener('DOMContentLoaded', () => {
    loadTopbar();

  
    const clickBtn = document.getElementById('click-btn');
    const clickMessage = document.getElementById('click-message');
    
    if (clickBtn && clickMessage) {
        clickBtn.addEventListener('click', () => {
            clickMessage.textContent = "You clicked the button!";
        });
    }

   
    const nameInput = document.getElementById('name-input');
    const greetingName = document.getElementById('greeting-name');
    
    if (nameInput && greetingName) {
        nameInput.addEventListener('input', () => {
            const enteredText = nameInput.value.trim();
            greetingName.textContent = enteredText !== '' ? enteredText : "Guest";
        });
    }
});