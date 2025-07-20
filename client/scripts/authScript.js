const BASE_URL = '/users';         // use relative paths
const checkAuth = () => !!localStorage.getItem('token');
const logout = () => {
  localStorage.removeItem('token');
  alert('Logged out successfully!');
  window.location.href = 'login.html';
};

// On the notes page, inject Login/Register or Logout
if (document.title === 'Your Daily Notes') {
  const authButtons = document.getElementById('auth-buttons');
  if (checkAuth()) {
    authButtons.innerHTML = `<button id="logoutButton">Logout</button>`;
    document.getElementById('logoutButton').onclick = logout;
    fetchWelcomeMessage();
  } else {
    authButtons.innerHTML = `
      <a href="login.html"><button>Login</button></a>
      <a href="register.html"><button>Sign Up</button></a>
    `;
  }
}

// Handle Login form
if (document.title === 'Login') {
  document.getElementById('login-form').onsubmit = async e => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    const msg = document.getElementById('message');
    try {
      const res = await fetch(`${BASE_URL}/login`, {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');
      localStorage.setItem('token', data.token);
      msg.textContent = 'Login successful! Redirecting…';
      setTimeout(() => window.location.href = 'index.html', 1500);
    } catch (err) {
      msg.textContent = err.message;
    }
  };
}

// Handle Register form
if (document.title === 'Register') {
  document.getElementById('register-form').onsubmit = async e => {
    e.preventDefault();
    const username = e.target.username.value;
    const email    = e.target.email.value;
    const password = e.target.password.value;
    const msg = document.getElementById('message');
    try {
      const res = await fetch(`${BASE_URL}/register`, {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ username, email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed');
      msg.textContent = 'Registered! Redirecting to login…';
      setTimeout(() => window.location.href = 'login.html', 1500);
    } catch (err) {
      msg.textContent = err.message;
    }
  };
}

// Fetch welcome & then load notes if auth
async function fetchWelcomeMessage() {
  try {
    const res = await fetch(`${BASE_URL}/welcome`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    if (!res.ok) throw new Error('Please login to get started');
    await res.json();
    if (typeof window.loadNotes === 'function') window.loadNotes();
  } catch (err) {
    alert(err.message);
    window.location.href = 'login.html';
  }
}
