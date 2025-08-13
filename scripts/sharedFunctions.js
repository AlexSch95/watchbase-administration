export function showFeedback(responseBody) {
  // responseBody dekonstruieren
  const { success, message } = responseBody;
  // Error Alert Elemente Laden
  const errorText = document.getElementById("errorText");
  const errorBox = document.getElementById("errorMessage");
  if (success === true) {
    errorText.textContent = message;
    errorBox.classList.add("alert-success");
  } else if (success === false) {
    errorText.textContent = message;
    errorBox.classList.add("alert-danger");
  }
  errorBox.classList.add("show");
  setTimeout(() => {
    document.getElementById("errorMessage").classList.remove("show");
  }, 5000);
}

export function logout() {
    localStorage.removeItem('jwttoken');
    showFeedback({success: true, message: "Sie haben sich abgemeldet. Sie werden zur Login-Seite weitergeleitet..."})
    setTimeout(() => {
      window.location.href = './index.html'; 
    }, 5000)
}

export async function checkAuth() {
  try {
    const token = localStorage.getItem("jwttoken");
    const response = await fetch("http://localhost:3000/api/check-auth", {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    })
    const result = await response.json();
    if (!result.success) {
      throw new Error("Authentifizierung Fehlgeschlagen. Sie werden zum Login weitergeleitet.")
    }
    return true
  } catch (error) {
    showFeedback({success: false, message: error});
    setTimeout(() => {
    window.location.href = "./index.html";
    }, 5000);
    return false;
  }
}
