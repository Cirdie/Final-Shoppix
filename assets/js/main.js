const navMenu = document.getElementById("nav-menu"),
  navToggle = document.getElementById("nav-toggle"),
  navClose = document.getElementById("nav-close");


if (navToggle) {
  navToggle.addEventListener("click", () => {
    navMenu.classList.add("show-menu");
  });
}


if (navClose) {
  navClose.addEventListener("click", () => {
    navMenu.classList.remove("show-menu");
  });
}

function imgGallery() {
  const mainImg = document.querySelector(".details__img"),
    smallImg = document.querySelectorAll(".details__small-img");

  smallImg.forEach((img) => {
    img.addEventListener("click", function () {
      mainImg.src = this.src;
    });
  });
}

imgGallery();

let swiperCategories = new Swiper(".categories__container", {
  spaceBetween: 24,
  loop: true,
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },

  breakpoints: {
    350: {
      slidesPerView: 2,
      spaceBetween: 24,
    },
    768: {
      slidesPerView: 3,
      spaceBetween: 24,
    },
    992: {
      slidesPerView: 4,
      spaceBetween: 24,
    },
    1200: {
      slidesPerView: 5,
      spaceBetween: 24,
    },
    1400: {
      slidesPerView: 6,
      spaceBetween: 24,
    },
  },
});

let swiperProducts = new Swiper(".new__container", {
  spaceBetween: 24,
  loop: true,
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },

  breakpoints: {
    768: {
      slidesPerView: 2,
      spaceBetween: 24,
    },
    992: {
      slidesPerView: 4,
      spaceBetween: 24,
    },
    1400: {
      slidesPerView: 4,
      spaceBetween: 24,
    },
  },
});

const tabs = document.querySelectorAll("[data-target]"),
  tabsContents = document.querySelectorAll("[content]");

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const target = document.querySelector(tab.dataset.target);

    tabsContents.forEach((tabsContent) => {
      tabsContent.classList.remove("active-tab");
    });

    target.classList.add("active-tab");

    tabs.forEach((tab) => {
      tab.classList.remove("active-tab");
    });

    tab.classList.add("active-tab");
  });
});

/*********** LOGIN & REGISTER SYSTEM WITH COOKIES ***********/

// 🧠 Cookie Helpers
function setCookie(name, value, days) {
  const d = new Date();
  d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
  const expires = "expires=" + d.toUTCString();
  document.cookie = `${name}=${value};${expires};path=/`;
}

function getCookie(name) {
  const cname = name + "=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i].trim();
    if (c.indexOf(cname) == 0) {
      return c.substring(cname.length, c.length);
    }
  }
  return "";
}

function deleteCookie(name) {
  document.cookie = `${name}=; Max-Age=0; path=/;`;
}

// 🧠 Local Storage: retrieve or initialize users array
const userDB = JSON.parse(localStorage.getItem("users")) || [];

const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

// ✅ REGISTER LOGIC
if (registerForm) {
  registerForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const username = document.getElementById("regUsername").value.trim();
    const email = document.getElementById("regEmail").value.trim();
    const password = document.getElementById("regPassword").value;
    const confirmPassword = document.getElementById("regConfirmPassword").value;
    const msg = document.getElementById("registerMessage");

    if (!username || !email || !password || !confirmPassword) {
      msg.textContent = "Please fill in all fields.";
      msg.classList.add("error");
      return;
    }

    if (password !== confirmPassword) {
      msg.textContent = "Passwords do not match.";
      msg.classList.add("error");
      return;
    }

    const exists = userDB.find(user => user.email === email);
    if (exists) {
      msg.textContent = "Email is already registered.";
      msg.classList.add("error");
      return;
    }

    const newUser = { username, email, password };
    userDB.push(newUser);
    localStorage.setItem("users", JSON.stringify(userDB));

    msg.textContent = "Registration successful! You can now login.";
    msg.classList.remove("error");
    registerForm.reset();
  });
}

// ✅ LOGIN LOGIC
if (loginForm) {
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;
    const msg = document.getElementById("loginMessage");

    const userDB = JSON.parse(localStorage.getItem("users")) || [];
    const user = userDB.find(user => user.email === email && user.password === password);

    if (user) {
      // Save login session in cookie
      setCookie("loggedInUser", JSON.stringify(user), 1); // 1 day
      msg.textContent = `Welcome back, ${user.username}!`;
      msg.classList.remove("error");

      setTimeout(() => {
        window.location.href = "index.html";
      }, 1500);
    } else {
      msg.textContent = "Invalid email or password.";
      msg.classList.add("error");
    }
  });
}

// ✅ HEADER UPDATE BASED ON LOGIN STATE
function updateHeaderBasedOnLogin() {
  const userCookie = getCookie("loggedInUser");
  const topAction = document.getElementById("headerAuthAction");

  if (topAction) {
    if (userCookie) {
      const user = JSON.parse(userCookie);
      topAction.textContent = `Logout (${user.username})`;
      topAction.href = "#";
      topAction.addEventListener("click", function (e) {
        e.preventDefault();
        deleteCookie("loggedInUser");
        window.location.href = "index.html";
      });
    } else {
      topAction.textContent = "Log In / Sign Up";
      topAction.href = "login-register.html";
    }
  }
}

document.addEventListener("DOMContentLoaded", updateHeaderBasedOnLogin);

// ✅ MOBILE AUTH LINKS
function updateMobileAuthLinks() {
  const userCookie = getCookie("loggedInUser");
  const mobileLoginItem = document.getElementById("mobileLoginItem");
  const mobileLogoutItem = document.getElementById("mobileLogoutItem");

  if (!mobileLoginItem || !mobileLogoutItem) return;

  const isMobile = window.innerWidth <= 768;

  if (isMobile) {
    if (userCookie) {
      mobileLoginItem.style.display = "none";
      mobileLogoutItem.style.display = "block";

      const logoutLink = mobileLogoutItem.querySelector("a");
      logoutLink.addEventListener("click", function (e) {
        e.preventDefault();
        deleteCookie("loggedInUser");
        window.location.href = "index.html";
      });
    } else {
      mobileLoginItem.style.display = "block";
      mobileLogoutItem.style.display = "none";
    }
  } else {
    mobileLoginItem.style.display = "none";
    mobileLogoutItem.style.display = "none";
  }
}

document.addEventListener("DOMContentLoaded", updateMobileAuthLinks);
window.addEventListener("resize", updateMobileAuthLinks);

// ✅ ACCOUNT TAB LOGOUT FUNCTION
document.addEventListener("DOMContentLoaded", function () {
  const logoutTab = document.querySelector('.account__tab[data-action="logout"]');

  if (logoutTab) {
    logoutTab.addEventListener("click", function () {
      deleteCookie("loggedInUser");
      alert("You have been logged out.");
      window.location.href = "index.html";
    });
  }
});

// ✅ Redirect logged-in users away from login-register.html
document.addEventListener("DOMContentLoaded", function () {
  const user = getCookie("loggedInUser");

  const isLoginRegisterPage = window.location.pathname.includes("login-register.html");

  if (user && isLoginRegisterPage) {
    window.location.href = "index.html"; // or "accounts.html" if you have a dashboard
  }
});
