import Card from "./Card";
import DragDrop from "./DragDrop";

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
    Object.keys(Data).forEach((key) => {
      const value = Data[key];
      value.forEach((content) => {
        const li = document.createElement("li");
        li.classList.add("item");
        li.insertAdjacentHTML(
          "beforeend",
          `<span>${content}</span><button class="close-item">X</button>`
        );
        container
          .querySelector(`[data="${key}"]`)
          .insertAdjacentElement("beforeend", li);
      });
    });
  }
});
