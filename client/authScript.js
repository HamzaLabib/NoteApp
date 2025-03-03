const BASE_URL = 'http://localhost:5002/users';  

// Check if token exists
const checkAuth = () => {
    const token = localStorage.getItem('token');
    return token ? true : false;
};

// Render buttons dynamically on the home page
if (document.title === 'Your Daily Notes') {
    const authButtons = document.getElementById('auth-buttons');
    if (checkAuth()) {
        authButtons.innerHTML = `
            <button onclick="logout()">Logout</button>
        `;
        fetchWelcomeMessage();
    } else {
        authButtons.innerHTML = `
            <a href="login.html"><button>Login</button></a>
            <a href="register.html"><button>Register</button></a>
        `;
    }
}


if (document.title === 'Login') {
  document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const response = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    const message = document.getElementById('message');
    if (response.ok) {
      localStorage.setItem('token', data.token);
      message.textContent = 'Login successful! Redirecting...';
      setTimeout(() => (window.location.href = 'index.html'), 1500);
    } else {
      message.textContent = data.error || 'Login failed.';
    }
  });
}


if (document.title === 'Register') {
document.getElementById('register-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const email = document.getElementById('email').value;

  const response = await fetch(`${BASE_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password, email }),
  });

  const data = await response.json();
  const message = document.getElementById('message');
  if (response.ok) {
    message.textContent = 'Registration successful! Redirecting to login...';
    setTimeout(() => (window.location.href = 'login.html'), 1500);
  } else {
    message.textContent = data.error || 'Registration failed.';
  }
});
}

// Function to fetch the welcome message from the server
async function fetchWelcomeMessage() {
const token = localStorage.getItem('token');

try {
  const response = await fetch(`${BASE_URL}/welcome`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Please login to get started');
  }

  const data = await response.json();
  if(loadNotes){
    loadNotes();
  }

} catch (error) {
  alert(error.message);
  // Redirect to login page if the token is invalid or expired
  window.location.href = 'index.html';
}
};

// Client-side logout function
const logout = () => {
// Remove the token from localStorage
localStorage.removeItem('token');

// Optionally show a success message
alert('Logged out successfully!');

// Redirect to the home or login page
window.location.href = 'index.html'; 
};
