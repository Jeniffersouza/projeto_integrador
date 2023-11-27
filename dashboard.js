// Declaração global para armazenar o ID do usuário
let globalUserId;

// Função para obter o ID do usuário do armazenamento local
function getUserIdFromLocalStorage() {
    const userId = localStorage.getItem('userId');
   // console.log('userId from localStorage:', userId);
    return userId;
}
// Função para realizar o logout
function logout() {
    localStorage.removeItem('userId');
    // Redirecionar para a página index.html
    window.location.href = 'index.html';
}

// Função para limpar os campos do formulário
function clearFormFields() {
    document.getElementById('serviceName').value = '';
    document.getElementById('serviceValue').value = '';
    document.getElementById('serviceDescription').value = '';
}

// Adicione um ouvinte de evento ao botão de logout
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', function () {
        logout();
    });
}
// Função para carregar os serviços do usuário
function loadUserServices() {
    const userId = getUserIdFromLocalStorage();
    if (!userId) {
        console.log("Sem ID de usuário");
        return;
    }

    // Atribuir o ID do usuário à variável global
    globalUserId = userId;

    const apiUrl = 'http://localhost:3000';
    axios.get(`${apiUrl}/services?user_id=${userId}`)
        .then(response => {
            const userServices = response.data;
            //console.log('Serviços do usuário:', userServices);
            // Chame a função para exibir os serviços na tela
            displayUserServices(userServices);
            // Agora você pode fazer algo com os serviços do usuário, como exibir na tela
        })
        .catch(error => {
            console.error('Erro ao carregar serviços do usuário:', error);
        });

            // Função para exibir os serviços do usuário na tela
        function displayUserServices(services) {
            const serviceListContainer = document.getElementById('serviceList'); // Onde você deseja exibir os serviços

            // Limpe a lista antes de adicionar os novos serviços
            serviceListContainer.innerHTML = '';

            services.forEach(service => {
                const serviceItem = createServiceElement(service);
                serviceListContainer.appendChild(serviceItem);
            });
        }

        // Função para criar um elemento HTML representando um serviço
        function createServiceElement(service) {
            const serviceItem = document.createElement('div');
            serviceItem.classList.add('service-item');
            serviceItem.innerHTML = `
                <strong>${service.service_name}</strong> <br/> <br/>  
                <Strong>Valor: </strong> R$ ${service.value} <br/> <br/>
                <strong>Descrição</strong> ${service.description} <br/> <br/>
            `;

            return serviceItem;
        }
}

document.addEventListener('DOMContentLoaded', function () {
    const apiUrl = 'http://localhost:3000';
    const userId = getUserIdFromLocalStorage();

    if (!userId) {
        console.log("sem o id");
    }

    document.getElementById('addServiceForm').addEventListener('submit', function (event) {
        event.preventDefault();
        const userId = getUserIdFromLocalStorage();

        if (!userId) {
            console.log("Usuário não logado");
            // Adicione lógica para redirecionar para a página de login ou realizar outras ações necessárias
            return;
        }

        // Atribuir o ID do usuário à variável global
        globalUserId = userId;

        const serviceName = document.getElementById('serviceName').value;
        const serviceValue = parseFloat(document.getElementById('serviceValue').value);
        const serviceDescription = document.getElementById('serviceDescription').value;

        if (!serviceName || isNaN(serviceValue) || !serviceDescription) {
            alert('Por favor, preencha todos os campos!');
            return;
        }

        const newService = {
            service_name: serviceName,
            value: serviceValue,
            description: serviceDescription,
            user_id: userId,
        };

        axios.post(`${apiUrl}/services`, newService)
            .then(response => {
                alert('Serviço cadastrado com sucesso!');
                loadUserServices(); // Atualizar a lista de serviços após o cadastro
                clearFormFields();
            })
            .catch(error => {
                console.error('Erro ao cadastrar serviço:', error);
                alert('Erro ao cadastrar serviço. Tente novamente mais tarde.');
            });
    });

    // Carregar os serviços do usuário ao carregar a página
    loadUserServices();
});
