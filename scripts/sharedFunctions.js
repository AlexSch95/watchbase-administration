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
    window.location.href = 'index.html'; 
}