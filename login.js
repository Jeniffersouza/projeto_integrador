document.addEventListener('DOMContentLoaded', function () {
    const apiUrl = 'http://localhost:3000';

    // Função para realizar o login
    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn) {
        loginBtn.addEventListener('click', function () {
            const cpf = document.getElementById('loginCpf').value;
            const password = document.getElementById('loginPassword').value;

            login(cpf, password);
        });
    }

    function login(cpf, password) {
        axios.post(`${apiUrl}/login`, { cpf, password }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (response.data.message === "Login successful") {
                const userId = response.data.userId; // ou response.data.userId, dependendo da alteração que você fez no backend
                localStorage.setItem('userId', userId);
                console.log('Usuário logado com sucesso. ID do usuário:', userId);
                // Redirecionar para a página do dashboard ou realizar outras ações necessárias
                window.location.href = 'dashboard.html';
            } else {
                // Tratar erro de login
            }
        })
        .catch(error => {
            console.error('Erro ao fazer login:', error);
        });
    }
});
