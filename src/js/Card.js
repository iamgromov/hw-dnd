export default class Card {
  constructor() {
    this.container = document.querySelector(".container");
    this.items = null;
    this.storage = { todo: [], inprogress: [], done: [] };
  }

  init() {
    this.addCard();
    this.deleteCard();
    this.items = this.container.querySelectorAll(".items");
  }

  addCard() {
    const addItem = this.container.querySelectorAll(".add_item");
    addItem.forEach((elem) => {
      elem.addEventListener("click", (event) => {
        const item = document.createElement("div");
        item.classList.add("create_item");
        item.innerHTML = `<textarea class="textarea" placeholder="Enter a title for this card..."></textarea>
              <button class="btn">Add Card</button>
              <button class="close">X</button>`;
        event.target.replaceWith(item);
        item.addEventListener("click", (e) => {
          if (e.target.classList.contains("close")) {
            item.replaceWith(elem);
          }
          if (
            e.target.classList.contains("btn") &&
            item.querySelector(".textarea").value !== ""
          ) {
            const li = document.createElement("li");
            li.classList.add("item");
            li.insertAdjacentHTML(
              "beforeend",
              `<span>${
                item.querySelector(".textarea").value
              }</span><button class="close-item">X</button>`
            );
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
    ul.forEach((item) => {
      item.addEventListener("click", (e) => {
        if (e.target.classList.contains("close-item")) {
          const li = e.target.closest(".item");
          li.remove();
        }
      });
    });
  }

  createStorage() {
    this.items.forEach((item) => {
      item.querySelectorAll("li span").forEach((el, i) => {
        const key = item.getAttribute("data");
        this.storage[key][i] = el.textContent;
      });
    });
    return this.storage;
  }
}
