import { showFeedback } from "./sharedFunctions.js";

document.getElementById("loginForm").addEventListener("submit", async function (e) {
  e.preventDefault();
  try {
    const username = document.getElementById("loginUsername").value.trim();
    const password = document.getElementById("loginPassword").value;

    // 1. Prüfe 2FA-Status
    const active2FaResponse = await fetch2FAStatus(username);
    
    if (!active2FaResponse.isactive2fa) {
      // 2FA nicht aktiv - normaler Login
      const response = await handleRegularLogin(username, password);
      handleLoginResponse(response);
      return;
    }

    // 2FA aktiv - Code abfragen
    const enteredCode = prompt("Gib deinen 2-Faktor-Authentifizierungscode ein");
    
    // Nutzer hat abgebrochen
    if (enteredCode === null) {
      showFeedback({ success: false, message: "2FA-Eingabe abgebrochen" });
      return;
    }

    // Validierung des Codes
    if (!enteredCode || isNaN(enteredCode)) {
      showFeedback({ success: false, message: "Bitte gib einen gültigen 6-stelligen Code ein" });
      return;
    }

    // 2FA-Verifizierung
    const response2Fa = await handle2FALogin(username, password, enteredCode);
    handleLoginResponse(response2Fa);

  } catch (error) {
    console.error("Login-Fehler:", error);
    showFeedback({ 
      success: false, 
      message: error.message || "Verbindungsfehler..." 
    });
  }
});

// Hilfsfunktionen
async function fetch2FAStatus(username) {
  const response = await fetch("http://localhost:3000/api/admin/check-2fa-status", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username })
  });
  return await response.json();
}

async function handleRegularLogin(username, password) {
  const response = await fetch("http://localhost:3000/api/admin/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });
  return await response.json();
}

async function handle2FALogin(username, password, code) {
  const response = await fetch("http://localhost:3000/api/admin/login-2fa", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ 
      username, 
      password, 
      twofactorToken: code 
    })
  });
  return await response.json();
}

function handleLoginResponse(response) {
  if (response.success) {
    localStorage.setItem("jwttoken", response.token);
    showFeedback(response);
    window.location.href = "./overview.html";
  } else {
    showFeedback(response);
  }
}

document.getElementById("registerForm").addEventListener("submit", async function (e) {
  e.preventDefault();
  try {
    const username = document.getElementById('registerUsername').value.trim();
    const password = document.getElementById('registerPassword').value;
    const passwordConfirm = document.getElementById('registerPasswordRepeat').value;
    if (password !== passwordConfirm) {
      return showFeedback({success: false, message: "Passwörter stimmen nicht überein"});
    }
    const response = await fetch('http://localhost:3000/api/admin/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: username,
        password: password
      })
    });
    const result = await response.json();
    if (result.success === false) {
      showFeedback(result)
      return;
    }
    document.getElementById("qrCode").src = result.qrUrl;
    document.getElementById("qrCodeContainer").style.display = "block";
    document.getElementById("verifyBtn").addEventListener("click", async function () {
      const verifyCode = document.getElementById("verifyCode").value;
      const verifyResponse = await fetch('http://localhost:3000/api/admin/verify-2fa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({ username, verifyCode})
      });
      const result = await verifyResponse.json();
      showFeedback(result)
    })
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }
  } catch (error) {
    console.error(error);
  }
})

function checkEqual() {
    const password = document.getElementById('registerPassword');
    const passwordConfirm = document.getElementById('registerPasswordConfirm');
    if (password.value === passwordConfirm.value) {
      passwordConfirm.setCustomValidity('');
    } else {
      passwordConfirm.setCustomValidity('Passwörter stimmen nicht überein')
    }
}
