const storageKey = 'hiringup_user';

function renderAlert(target, message, type = 'success') {
  if (!target) {
    alert(message);
    return;
  }

  let alertBox = target.querySelector('.js-feedback-alert');
  if (!alertBox) {
    alertBox = document.createElement('div');
    alertBox.className = 'js-feedback-alert alert alert-' + type + ' rounded-3 shadow-sm';
    target.prepend(alertBox);
  }

  alertBox.className = 'js-feedback-alert alert alert-' + type + ' rounded-3 shadow-sm';
  alertBox.textContent = message;
}

function handleSearch(keyword, location, feedbackId) {
  const keywordText = keyword.trim() || 'qualquer vaga';
  const locationText = location.trim() || 'qualquer local';
  const count = Math.floor(Math.random() * 8) + 5;
  const message = `Busca por "${keywordText}" em "${locationText}" realizada com sucesso. ${count} vagas encontradas.`;
  renderAlert(document.getElementById(feedbackId), message, 'info');
}

function initSearch(buttonId, keywordId, locationId, feedbackId) {
  const button = document.getElementById(buttonId);
  const keywordInput = document.getElementById(keywordId);
  const locationInput = document.getElementById(locationId);

  if (!button || !keywordInput || !locationInput || !document.getElementById(feedbackId)) {
    return;
  }

  button.addEventListener('click', () => {
    handleSearch(keywordInput.value, locationInput.value, feedbackId);
  });
}


function initRegisterForm() {
  const form = document.getElementById('register-form');
  const feedback = document.getElementById('register-feedback');
  if (!form) {
    return;
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const name = document.getElementById('register-name')?.value.trim();
    const email = document.getElementById('register-email')?.value.trim();
    const password = document.getElementById('register-password')?.value;
    const confirmPassword = document.getElementById('register-confirm')?.value;

    if (!name || !email || !password || !confirmPassword) {
      renderAlert(feedback, 'Por favor, preencha todos os campos antes de continuar.', 'warning');
      return;
    }

    if (password !== confirmPassword) {
      renderAlert(feedback, 'As senhas não conferem. Por favor, verifique e tente novamente.', 'warning');
      return;
    }

    localStorage.setItem(storageKey, JSON.stringify({ name, email, password }));
    renderAlert(feedback, 'Cadastro realizado com sucesso. Redirecionando para o login...', 'success');
    form.reset();
    setTimeout(() => {
      window.location.href = 'login.html';
    }, 1100);
  });
}

function initLoginForm() {
  const form = document.getElementById('login-form');
  const feedback = document.getElementById('login-feedback');
  if (!form) {
    return;
  }

  // Prefill email if a user was already registered (improves demo flow)
  try {
    const storedString = localStorage.getItem(storageKey);
    if (storedString) {
      const storedUser = JSON.parse(storedString);
      const emailInput = document.getElementById('login-email');
      if (emailInput && storedUser.email) {
        emailInput.value = storedUser.email;
        emailInput.focus();
      }
    }
  } catch (e) {
    // ignore parse errors
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const email = document.getElementById('login-email')?.value.trim();
    const password = document.getElementById('login-password')?.value;

    if (!email || !password) {
      renderAlert(feedback, 'Informe e-mail e senha para continuar.', 'warning');
      return;
    }

    const stored = localStorage.getItem(storageKey);
    if (!stored) {
      renderAlert(feedback, 'Nenhum usuário cadastrado encontrado. Por favor, faça o cadastro.', 'danger');
      return;
    }

    const user = JSON.parse(stored);
    if (user.email === email && user.password === password) {
      renderAlert(feedback, `Autenticação bem-sucedida. Bem-vindo(a), ${user.name}.`, 'success');
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1100);
      return;
    }

    renderAlert(feedback, 'E-mail ou senha inválidos. Verifique os dados e tente novamente.', 'danger');
  });
}

window.addEventListener('DOMContentLoaded', () => {
  initSearch('home-search-button', 'home-search-keyword', 'home-search-location', 'home-search-feedback');
  initSearch('jobs-search-button', 'jobs-search-keyword', 'jobs-search-location', 'jobs-search-feedback');
  
  initRegisterForm();
  initLoginForm();
});