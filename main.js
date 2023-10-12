/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};

;// CONCATENATED MODULE: ./src/js/Card.js
class Card {
  constructor() {
    this.container = document.querySelector(".container");
    this.items = null;
    this.storage = {
      todo: [],
      inprogress: [],
      done: []
    };
  }
  init() {
    this.addCard();
    this.deleteCard();
    this.items = this.container.querySelectorAll(".items");
  }
  addCard() {
    const addItem = this.container.querySelectorAll(".add_item");
    addItem.forEach(elem => {
      elem.addEventListener("click", event => {
        const item = document.createElement("div");
        item.classList.add("create_item");
        item.innerHTML = `<textarea class="textarea" placeholder="Enter a title for this card..."></textarea>
              <button class="btn">Add Card</button>
              <button class="close">X</button>`;
        event.target.replaceWith(item);
        item.addEventListener("click", e => {
          if (e.target.classList.contains("close")) {
            item.replaceWith(elem);
          }
          if (e.target.classList.contains("btn") && item.querySelector(".textarea").value !== "") {
            const li = document.createElement("li");
            li.classList.add("item");
            li.insertAdjacentHTML("beforeend", `<span>${item.querySelector(".textarea").value}</span><button class="close-item">X</button>`);
            const ul = e.target.closest(".block").querySelector("ul");
            ul.append(li);
            item.replaceWith(elem);
          }
        });
      });
    });
  }
  deleteCard() {
    const ul = [...document.querySelectorAll(".items")];
    ul.forEach(item => {
      item.addEventListener("click", e => {
        if (e.target.classList.contains("close-item")) {
          const li = e.target.closest(".item");
          li.remove();
        }
      });
    });
  }
  createStorage() {
    this.items.forEach(item => {
      item.querySelectorAll("li span").forEach((el, i) => {
        const key = item.getAttribute("data");
        this.storage[key][i] = el.textContent;
      });
    });
    return this.storage;
  }
}
;// CONCATENATED MODULE: ./src/js/DragDrop.js
class DragDrop {
  constructor() {
    this.draggedEl = null;
    this.ghostEl = null;
    this.elem = null;
    this.container = null;
    this.empty = null;
  }
  init() {
    this.container = document.querySelector(".container");
    this.container.addEventListener("mousedown", this.down);
    this.container.addEventListener("mousemove", this.move);
    this.container.addEventListener("mouseleave", this.leave);
    this.container.addEventListener("mouseup", this.up);
  }
  down(e) {
    if (!e.target.classList.contains("item")) {
      return;
    }
    e.preventDefault();
    this.draggedEl = e.target.closest(".item");
    this.ghostEl = this.draggedEl.cloneNode(true);
    this.ghostEl.style.width = `${this.draggedEl.offsetWidth}px`;
    const {
      top,
      left
    } = this.draggedEl.getBoundingClientRect();
    this.cursorInCardY = e.clientY - top;
    this.cursorInCardX = e.clientX - left;
    this.ghostEl.classList.add("dragged");
    document.querySelector(".container").appendChild(this.ghostEl);
    this.ghostEl.style.top = `${e.pageY - this.cursorInCardY}px`;
    this.ghostEl.style.left = `${e.pageX - this.cursorInCardX}px`;
    this.draggedEl.style.opacity = 0;
    this.empty = document.createElement("li");
    this.empty.classList.add("empty");
    this.empty.style.height = `${this.draggedEl.offsetHeight}px`;
  }
  move(e) {
    e.preventDefault();
    if (!this.draggedEl) {
      return;
    }
    this.ghostEl.classList.add("hidden");
    this.elem = document.elementFromPoint(e.clientX, e.clientY);
    this.ghostEl.classList.remove("hidden");
    this.ghostEl.style.left = `${e.pageX - this.cursorInCardX}px`;
    this.ghostEl.style.top = `${e.pageY - this.cursorInCardY}px`;
    if (this.elem.closest(".block")) {
      const parentEl = this.elem.closest(".block").querySelector("ul");
      if (!parentEl.hasChildNodes()) {
        parentEl.append(this.empty);
      } else if (this.elem.closest(".add_item")) {
        parentEl.append(this.empty);
      } else if (this.elem.closest("h3")) {
        parentEl.prepend(this.empty);
      } else if (this.elem.closest(".item")) {
        parentEl.insertBefore(this.empty, this.elem.closest(".item"));
      }
    }
  }
  up(e) {
    e.preventDefault();
    if (!this.draggedEl) {
      return;
    }
    if (this.elem === undefined) {
      this.ghostEl.classList.remove("dragged");
      this.draggedEl.style.opacity = 100;
      this.ghostEl.remove();
      this.ghostEl = null;
      this.draggedEl = null;
      return;
    }
    if (!this.elem.closest(".block")) {
      document.querySelector(".container").removeChild(this.ghostEl);
      this.draggedEl.style.opacity = 100;
      this.ghostEl = null;
      this.draggedEl = null;
      return;
    }
    const parentUl = this.elem.closest(".block").querySelector("ul");
    if (this.elem.closest("h3")) {
      parentUl.prepend(this.ghostEl);
    } else if (this.elem.closest("add_item")) {
      parentUl.append(this.ghostEl);
    } else {
      parentUl.insertBefore(this.ghostEl, this.elem.closest("li"));
    }
    if (document.querySelector(".empty")) {
      document.querySelector(".empty").remove();
    }
    this.ghostEl.classList.remove("dragged");
    this.ghostEl.style = "100%";
    this.draggedEl.remove();
    this.ghostEl = null;
    this.draggedEl = null;
  }
  leave(e) {
    e.preventDefault();
    if (!this.draggedEl) {
      return;
    }
    document.querySelector(".container").removeChild(this.ghostEl);
    document.querySelector(".empty").remove();
    this.draggedEl.style.opacity = 100;
    this.ghostEl = null;
    this.draggedEl = null;
  }
}
;// CONCATENATED MODULE: ./src/js/app.js


const card = new Card();
const container = document.querySelector(".container");
card.init();
const DnD = new DragDrop();
DnD.init();
window.addEventListener("beforeunload", () => {
  const formData = card.createStorage();
  localStorage.setItem("formData", JSON.stringify(formData));
});
document.addEventListener("DOMContentLoaded", () => {
  const json = localStorage.getItem("formData");
  let Data;
  try {
    Data = JSON.parse(json);
  } catch (err) {
    return err;
  }
  if (Data) {
    Object.keys(Data).forEach(key => {
      const value = Data[key];
      value.forEach(content => {
        const li = document.createElement("li");
        li.classList.add("item");
        li.insertAdjacentHTML("beforeend", `<span>${content}</span><button class="close-item">X</button>`);
        container.querySelector(`[data="${key}"]`).insertAdjacentElement("beforeend", li);
      });
    });
  }
});
;// CONCATENATED MODULE: ./src/index.js


/******/ })()
;