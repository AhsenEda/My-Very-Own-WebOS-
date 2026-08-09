function initApp() {
  const timeElement = document.querySelector("#timeElement");
  const welcomeScreen = document.querySelector("#welcome");
  const welcomeScreenClose = document.querySelector("#welcomeclose");
  const welcomeScreenOpen = document.querySelector("#welcomeopen");
  const welcomeHeader = document.querySelector("#welcomeheader");
  const prologueIcon = document.querySelector("#prologueIcon");
  const prologueScreen = document.querySelector("#prologue");
  const prologueClose = document.querySelector("#prologueClose");
  const prologueHeader = document.querySelector("#prologueHeader");

  if (!timeElement || !welcomeScreen || !welcomeScreenClose || !welcomeScreenOpen || !welcomeHeader) {
    console.error("Missing required DOM element", {
      timeElement,
      welcomeScreen,
      welcomeScreenClose,
      welcomeScreenOpen,
      welcomeHeader,
    });
    return;
  }

  function updateTime() {
    const currentTime = new Date().toLocaleString();
    timeElement.textContent = currentTime;
  }

  updateTime();
  setInterval(updateTime, 1000);

  makeDraggable(welcomeScreen, welcomeHeader);

  if (prologueScreen && prologueHeader) {
    makeDraggable(prologueScreen, prologueHeader);
  }

  welcomeScreenClose.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    welcomeScreen.style.display = "none";
  });

  welcomeScreenOpen.addEventListener("click", () => {
    welcomeScreen.style.display = "block";
  });

  if (prologueClose && prologueScreen) {
    prologueClose.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      prologueScreen.style.display = "none";
    });
  }
}

function makeDraggable(element, handle) {
  let startX = 0;
  let startY = 0;
  let originX = 0;
  let originY = 0;
  let currentPointerId = null;
  let isDragging = false;

  handle.style.cursor = "grab";
  handle.style.touchAction = "none";
  element.style.position = "absolute";

  handle.addEventListener("pointerdown", startDrag);

  function startDrag(e) {
    e.preventDefault();
    isDragging = true;
    currentPointerId = e.pointerId;
    handle.setPointerCapture(e.pointerId);
    startX = e.clientX;
    startY = e.clientY;
    originX = element.offsetLeft;
    originY = element.offsetTop;

    document.addEventListener("pointermove", drag);
    document.addEventListener("pointerup", endDrag);
  }

  function drag(e) {
    if (!isDragging) return;
    e.preventDefault();
    const deltaX = e.clientX - startX;
    const deltaY = e.clientY - startY;
    element.style.left = originX + deltaX + "px";
    element.style.top = originY + deltaY + "px";
  }

  function endDrag(e) {
    if (!isDragging) return;
    isDragging = false;
    document.removeEventListener("pointermove", drag);
    document.removeEventListener("pointerup", endDrag);
    handle.releasePointerCapture?.(e.pointerId || currentPointerId);
    currentPointerId = null;
  }

  return function stopDragging() {
    if (!isDragging) return;
    endDrag({ pointerId: currentPointerId });
  };
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}

// Function to open Prologue window
function openPrologue() {
  const prologueScreen = document.querySelector("#prologue");
  if (prologueScreen) {
    prologueScreen.style.display = "block";
    console.log("Prologue window opened!");
  } else {
    console.error("Prologue window element not found!");
  }
}

let selectedIcon = null;

function selectIcon(element) {
  if (!element) return;
  element.classList.add("selected");
  selectedIcon = element;
}

function deselectIcon(element) {
  if (!element) return;
  element.classList.remove("selected");
  selectedIcon = null;
}

