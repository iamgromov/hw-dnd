export default class DragDrop {
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
    this.ghostEl.style.height = `${this.draggedEl.offsetHeight}px`;

    const { top, left } = this.draggedEl.getBoundingClientRect();
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
