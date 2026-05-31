const storageKey = 'hiringup_user';

/* =========================
   ALERTAS
========================= */

function renderAlert(target, message, type = 'success') {

  if (!target) {
    alert(message);
    return;
  }

  let alertBox = target.querySelector('.js-feedback-alert');

  if (!alertBox) {
    alertBox = document.createElement('div');
    alertBox.className =
      'js-feedback-alert alert alert-' +
      type +
      ' rounded-3 shadow-sm mb-4';

    target.prepend(alertBox);
  }

  alertBox.className =
    'js-feedback-alert alert alert-' +
    type +
    ' rounded-3 shadow-sm mb-4';

  alertBox.textContent = message;
}

/* =========================
   BUSCA DE VAGAS
========================= */

function handleSearch(keyword, location, feedbackId) {

  const keywordText = keyword.trim() || 'qualquer vaga';
  const locationText = location.trim() || 'qualquer local';

  const count = Math.floor(Math.random() * 8) + 5;

  const message =
    `Busca por "${keywordText}" em "${locationText}" realizada com sucesso. ${count} vagas encontradas.`;

  renderAlert(
    document.getElementById(feedbackId),
    message,
    'info'
  );
}

function initSearch(buttonId, keywordId, locationId, feedbackId) {

  const button = document.getElementById(buttonId);
  const keywordInput = document.getElementById(keywordId);
  const locationInput = document.getElementById(locationId);
  const feedback = document.getElementById(feedbackId);

  if (!button || !keywordInput || !locationInput || !feedback) {
    return;
  }

  button.addEventListener('click', () => {

    handleSearch(
      keywordInput.value,
      locationInput.value,
      feedbackId
    );

  });

}

/* =========================
   CADASTRO DE USUÁRIO
========================= */

function initRegisterForm() {

  const form = document.getElementById('register-form');
  const feedback = document.getElementById('register-feedback');

  if (!form) {
    return;
  }

  form.addEventListener('submit', (event) => {

    event.preventDefault();

    const name =
      document.getElementById('register-name')?.value.trim();

    const email =
      document.getElementById('register-email')?.value.trim();

    const password =
      document.getElementById('register-password')?.value;

    const confirmPassword =
      document.getElementById('register-confirm')?.value;

    if (!name || !email || !password || !confirmPassword) {

      renderAlert(
        feedback,
        'Por favor, preencha todos os campos.',
        'warning'
      );

      return;
    }

    if (password !== confirmPassword) {

      renderAlert(
        feedback,
        'As senhas não conferem.',
        'warning'
      );

      return;
    }

    localStorage.setItem(
      storageKey,
      JSON.stringify({
        name,
        email,
        password
      })
    );

    renderAlert(
      feedback,
      'Cadastro realizado com sucesso. Redirecionando...',
      'success'
    );

    form.reset();

    setTimeout(() => {
      window.location.href = 'login.html';
    }, 1200);

  });

}

/* =========================
   LOGIN
========================= */

function initLoginForm() {

  const form = document.getElementById('login-form');
  const feedback = document.getElementById('login-feedback');

  if (!form) {
    return;
  }

  try {

    const storedString =
      localStorage.getItem(storageKey);

    if (storedString) {

      const user =
        JSON.parse(storedString);

      const emailInput =
        document.getElementById('login-email');

      if (emailInput && user.email) {

        emailInput.value = user.email;
        emailInput.focus();

      }

    }

  } catch (error) {
    console.error(error);
  }

  form.addEventListener('submit', (event) => {

    event.preventDefault();

    const email =
      document.getElementById('login-email')?.value.trim();

    const password =
      document.getElementById('login-password')?.value;

    if (!email || !password) {

      renderAlert(
        feedback,
        'Informe e-mail e senha.',
        'warning'
      );

      return;
    }

    const stored =
      localStorage.getItem(storageKey);

    if (!stored) {

      renderAlert(
        feedback,
        'Nenhum usuário cadastrado encontrado.',
        'danger'
      );

      return;
    }

    const user =
      JSON.parse(stored);

    if (
      user.email === email &&
      user.password === password
    ) {

      renderAlert(
        feedback,
        `Bem-vindo(a), ${user.name}!`,
        'success'
      );

      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1200);

      return;
    }

    renderAlert(
      feedback,
      'E-mail ou senha inválidos.',
      'danger'
    );

  });

}

/* =========================
   CURRÍCULO UP
========================= */

function initCurriculoForm() {

  const form = document.getElementById('curriculo-form');
  const feedback = document.getElementById('curriculo-feedback');

  if (!form) return;

  form.addEventListener('submit', (event) => {

    event.preventDefault();

    const nome =
      document.getElementById('curriculo-nome').value.trim();

    const email =
      document.getElementById('curriculo-email').value.trim();

    const telefone =
      document.getElementById('curriculo-telefone').value.trim();

    if (!nome || !email || !telefone) {

      renderAlert(
        feedback,
        'Preencha Nome, E-mail e Telefone antes de salvar o currículo.',
        'warning'
      );

      return;
    }

    renderAlert(
      feedback,
      'Currículo salvo com sucesso! Seu perfil foi cadastrado na Hiring UP.',
      'success'
    );

    form.reset();

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

  });

}

function initEmpresaForm() {

  const form = document.getElementById('empresa-form');
  const feedback = document.getElementById('empresa-feedback');

  if (!form) return;

  form.addEventListener('submit', (event) => {

    event.preventDefault();

    const nome =
      document.getElementById('empresa-nome')?.value.trim();

    const email =
      document.getElementById('empresa-email')?.value.trim();

    const cargo =
      document.getElementById('empresa-cargo')?.value.trim();

    const vaga =
      document.getElementById('empresa-vaga')?.value.trim();

    if (!nome || !email || !cargo || !vaga) {

      renderAlert(
        feedback,
        'Preencha todos os campos obrigatórios antes de publicar a vaga.',
        'warning'
      );

      return;
    }

    renderAlert(
      feedback,
      'Vaga publicada com sucesso! Sua empresa agora está anunciando na Hiring UP.',
      'success'
    );

    form.reset();

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

  });

}


/* =========================
   INICIALIZAÇÃO
========================= */

window.addEventListener('DOMContentLoaded', () => {

  initSearch(
    'home-search-button',
    'home-search-keyword',
    'home-search-location',
    'home-search-feedback'
  );

  initSearch(
    'jobs-search-button',
    'jobs-search-keyword',
    'jobs-search-location',
    'jobs-search-feedback'
  );

  initRegisterForm();
  initLoginForm();
  initCurriculoForm();
  initEmpresaForm();

});