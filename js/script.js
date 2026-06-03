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

  const updateButtonState = () => {
    const k = keywordInput.value.trim();
    const l = locationInput.value.trim();
    button.disabled = !(k && l);

    // remove inline invalid hint as user types
    if (k) keywordInput.classList.remove('is-invalid');
    if (l) locationInput.classList.remove('is-invalid');
  };

  // initial state
  updateButtonState();

  // react to user typing
  keywordInput.addEventListener('input', updateButtonState);
  locationInput.addEventListener('input', updateButtonState);

  // prevent Enter from submitting the page unless both fields are filled
  [keywordInput, locationInput].forEach((el) => {
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const k = keywordInput.value.trim();
        const l = locationInput.value.trim();
        if (k && l) {
          button.click();
        } else {
          if (!k) keywordInput.classList.add('is-invalid');
          if (!l) locationInput.classList.add('is-invalid');
          renderAlert(
            feedback,
            'Por favor, preencha ambos os campos antes de pesquisar.',
            'warning'
          );
        }
      }
    });
  });

  button.addEventListener('click', () => {
    const keyword = keywordInput.value.trim();
    const location = locationInput.value.trim();

    const missing = [];
    if (!keyword) missing.push('palavra-chave');
    if (!location) missing.push('localidade');

    if (missing.length) {
      if (!keyword) keywordInput.classList.add('is-invalid');
      if (!location) locationInput.classList.add('is-invalid');
      renderAlert(
        feedback,
        `Preencha ${missing.join(' e ')} antes de pesquisar.`,
        'warning'
      );
      const firstMissing = !keyword ? keywordInput : locationInput;
      firstMissing.focus();
      return;
    }

    // clear any validation markers
    keywordInput.classList.remove('is-invalid');
    locationInput.classList.remove('is-invalid');

    handleSearch(
      keyword,
      location,
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

const applicationsKey = 'hiringup_applications';
const newJobsKey = 'hiringup_new_jobs';

function saveNewJob(job) {
  const existing = JSON.parse(
    localStorage.getItem(newJobsKey) || '[]'
  );

  existing.unshift(job);
  localStorage.setItem(newJobsKey, JSON.stringify(existing));
}

function getNewJobs() {
  return JSON.parse(
    localStorage.getItem(newJobsKey) || '[]'
  );
}

function saveApplication(application) {
  const existing = JSON.parse(
    localStorage.getItem(applicationsKey) || '[]'
  );

  existing.unshift(application);
  localStorage.setItem(applicationsKey, JSON.stringify(existing));
}

function getSavedApplications() {
  return JSON.parse(
    localStorage.getItem(applicationsKey) || '[]'
  );
}

function renderApplicationStatus(actionsContainer, application) {
  if (!actionsContainer || !application) return;

  actionsContainer.innerHTML = `
    <div class="card shadow-sm border-0 mt-4">
      <div class="card-body">
        <h5 class="mb-3">Painel: minha candidatura</h5>
        <p class="mb-2"><strong>Vaga:</strong> ${application.title}</p>
        <p class="mb-2"><strong>Empresa:</strong> ${application.company}</p>
        <div class="badge bg-success mb-3">${application.status}</div>
        <p class="mb-3">Sua candidatura foi recebida e está sendo processada. Você pode acompanhar o status das suas candidaturas no painel.</p>
        <a href="acompanhamento.html" class="btn btn-primary">Ver meu acompanhamento</a>
      </div>
    </div>
  `;
}

function renderApplicationsTable() {
  const tbody = document.getElementById('applications-table-body');
  const applications = getSavedApplications();

  if (!tbody || !applications.length) return;

  const rows = applications.map((application) => {
    const badgeClass = application.status === 'Enviada com sucesso'
      ? 'status-aprovado'
      : 'status-analise';

    return `
      <tr>
        <td>${application.title}</td>
        <td>${application.company}</td>
        <td>
          <span class="status-badge ${badgeClass}">
            ${application.status}
          </span>
        </td>
      </tr>
    `;
  }).join('');

  tbody.insertAdjacentHTML('afterbegin', rows);
}

function initCandidaturaForm() {
  const form = document.getElementById('candidatura-form');
  const feedback = document.getElementById('candidatura-feedback');
  const actions = document.getElementById('candidatura-actions');

  if (!form) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const nome = document.getElementById('candidato-nome')?.value.trim();
    const email = document.getElementById('candidato-email')?.value.trim();
    const telefone = document.getElementById('candidato-telefone')?.value.trim();
    const apresentacao = document.getElementById('candidato-apresentacao')?.value.trim();

    if (!nome || !email || !telefone) {
      renderAlert(
        feedback,
        'Por favor, preencha nome, e-mail e telefone para enviar sua candidatura.',
        'warning'
      );
      return;
    }

    const application = {
      title: 'Desenvolvedor Front-End',
      company: 'Google Brasil',
      status: 'Enviada com sucesso',
      submittedAt: new Date().toLocaleDateString('pt-BR'),
      candidate: nome,
      email,
      telefone,
      apresentacao
    };

    saveApplication(application);

    renderAlert(
      feedback,
      'Enviada com sucesso.',
      'success'
    );

    renderApplicationStatus(actions, application);
    form.reset();

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  const latest = getSavedApplications()[0];
  if (latest) {
    renderApplicationStatus(actions, latest);
  }
}

function loadNewJobCards() {
  const container = document.querySelector('.jobs-section .container .row');
  const newJobs = getNewJobs();

  if (!container || !newJobs.length) return;

  const newCards = newJobs.map((job) => {
    return `
      <div class="col-lg-4 col-md-6">
        <div class="job-card">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h5>${job.title}</h5>
              <p>${job.company}</p>
            </div>
            <span class="badge bg-info">${job.status}</span>
          </div>
          <p class="text-muted">${job.description}</p>
          <div class="salary">${job.salary}</div>
          <button class="details-btn" onclick="alert('Nova vaga de ${job.company}!\\n\\nCargo: ${job.title}\\nSalário: ${job.salary}\\n\\nDescrição:\\n${job.description}')">
            Ver Detalhes
          </button>
        </div>
      </div>
    `;
  }).join('');

  container.insertAdjacentHTML('beforeend', newCards);
}

function atualizarCandidaturas() {
  const applications = getSavedApplications();
  
  if (!applications.length) {
    alert('Nenhuma candidatura para atualizar.');
    return;
  }

  const statusCiclo = {
    'em-analise': 'em-entrevista',
    'em-entrevista': 'aprovado',
    'aprovado': 'em-analise'
  };

  applications.forEach(app => {
    const statusAtual = app.status || 'em-analise';
    app.status = statusCiclo[statusAtual] || 'em-analise';
  });

  localStorage.setItem(applicationsKey, JSON.stringify(applications));
  
  renderAlert(
    document.querySelector('.jobs-section .container'),
    '✅ Candidaturas atualizadas! Os status foram modificados conforme o andamento dos processos.',
    'success'
  );

  setTimeout(() => {
    window.location.reload();
  }, 2000);
}

function confirmarLimpar() {
  const confirmacao = confirm(
    '⚠️ Tem certeza que deseja limpar todo o histórico de candidaturas?\n\nEsta ação é irreversível!'
  );

  if (confirmacao) {
    localStorage.removeItem(applicationsKey);
    
    renderAlert(
      document.querySelector('.jobs-section .container'),
      '🗑️ Histórico de candidaturas foi removido com sucesso.',
      'warning'
    );

    setTimeout(() => {
      window.location.reload();
    }, 2000);
  }
}

function loadNewJobCards() {
  const container = document.querySelector('.jobs-section .container .row');
  const newJobs = getNewJobs();

  if (!container || !newJobs.length) return;

  const newCards = newJobs.map((job) => {
    return `
      <div class="col-lg-4 col-md-6">
        <div class="job-card">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h5>${job.title}</h5>
              <p>${job.company}</p>
            </div>
            <span class="badge bg-info">${job.status}</span>
          </div>
          <p class="text-muted">${job.description}</p>
          <div class="salary">${job.salary}</div>
          <button class="details-btn" onclick="alert('Nova vaga de ${job.company}!\\n\\nCargo: ${job.title}\\nSalário: ${job.salary}\\n\\nDescrição:\\n${job.description}')">
            Ver Detalhes
          </button>
        </div>
      </div>
    `;
  }).join('');

  container.insertAdjacentHTML('beforeend', newCards);
}

function setActiveMenuLink() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const menuLinks = document.querySelectorAll('.navbar-nav .nav-link');

  menuLinks.forEach((link) => {
    const href = link.getAttribute('href');
    if (!href) return;

    if (currentPage === href || (currentPage === 'index.html' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
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
      document.getElementById('empresa-vaga')?.value.trim();

    const salario =
      document.getElementById('empresa-salario')?.value.trim();

    const descricaoVaga =
      document.getElementById('empresa-descricao-vaga')?.value.trim();

    if (!nome || !email || !cargo || !salario || !descricaoVaga) {

      renderAlert(
        feedback,
        'Preencha todos os campos obrigatórios antes de publicar a vaga.',
        'warning'
      );

      return;
    }

    const newJob = {
      title: cargo,
      company: nome,
      salary: salario,
      description: descricaoVaga,
      status: 'Remoto',
      publishedAt: new Date().toLocaleDateString('pt-BR'),
      companyEmail: email
    };

    saveNewJob(newJob);

    renderAlert(
      feedback,
      `Vaga publicada com sucesso! "${cargo}" foi adicionada ao site Hiring UP e está disponível para candidatos.`,
      'success'
    );

    form.reset();

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

    setTimeout(() => {
      window.location.href = 'vagas.html';
    }, 2000);

  });

}


/* =========================
   INICIALIZAÇÃO
======================== */

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
  initCandidaturaForm();
  initCurriculoForm();
  initEmpresaForm();
  renderApplicationsTable();
  loadNewJobCards();
  setActiveMenuLink();

});