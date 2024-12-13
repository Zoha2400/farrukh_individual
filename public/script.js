const logout = document.querySelector(".logout");
logout.addEventListener("click", function () {
  console.log("logout");
  document.cookie = "email=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
  window.location.href = "/reg.html";
});

window.addEventListener("DOMContentLoaded", () => {
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    console.log(value);
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  };

  const email = getCookie("email");
  console.log("Email from cookie:", email);

  if (!email) {
    window.location.href = "/reg.html";
  }
});
