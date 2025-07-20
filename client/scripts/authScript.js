const BASE_URL = '/users';

// Utility to check for a stored JWT
function checkAuth() {
  return !!localStorage.getItem('token');
}

// Global logout function
function logout() {
  localStorage.removeItem('token');
  alert('Logged out successfully!');
  window.location.href = 'login.html';
}

// Render Login/Register or Logout button & fetch welcome on notes page
if (document.title === 'Your Daily Notes') {
  const authButtons = document.getElementById('auth-buttons');

  if (checkAuth()) {
    authButtons.innerHTML = `<button id="logoutButton">Logout</button>`;
    document
      .getElementById('logoutButton')
      .addEventListener('click', logout);
    fetchWelcomeMessage();
  } else {
    authButtons.innerHTML = `
      <a href="login.html"><button>Login</button></a>
      <a href="register.html"><button>Register</button></a>
    `;
  }
}

// Handle Login form
if (document.title === 'Login') {
  document
    .getElementById('login-form')
    .addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const messageEl = document.getElementById('message');

      try {
        const res = await fetch(`${BASE_URL}/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || 'Login failed');
        }
        localStorage.setItem('token', data.token);
        messageEl.textContent = 'Login successful! Redirecting…';
        setTimeout(() => (window.location.href = 'index.html'), 1500);
      } catch (err) {
        messageEl.textContent = err.message;
      }
    });
}

// Handle Register form
if (document.title === 'Register') {
  document
    .getElementById('register-form')
    .addEventListener('submit', async (e) => {
      e.preventDefault();
      const username = document.getElementById('username').value;
      const email    = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const messageEl = document.getElementById('message');

      try {
        const res = await fetch(`${BASE_URL}/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, email, password }),
        });
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || 'Registration failed');
        }
        messageEl.textContent = 'Registered! Redirecting to login…';
        setTimeout(() => (window.location.href = 'login.html'), 1500);
      } catch (err) {
        messageEl.textContent = err.message;
      }
    });
}

// Fetch a protected welcome endpoint, then reload notes
async function fetchWelcomeMessage() {
  const token = localStorage.getItem('token');
  try {
    const res = await fetch(`${BASE_URL}/welcome`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (!res.ok) throw new Error('Please login to get started');
    await res.json();
    if (typeof window.loadNotes === 'function') {
      window.loadNotes();
    }
  } catch (err) {
    alert(err.message);
    window.location.href = 'login.html';
  }
}
