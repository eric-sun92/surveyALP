import React from "react";

const Modal = () => {
  return (
    <>
      <button onClick={toggleModal} className="btn-modal">
        Open
      </button>

      <div className="modal">
        <div className="overlay">
          <div className="modal-content">
            <h2>Hello Modal</h2>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat
              laboriosam quaerat neque saepe quasi, inventore blanditiis ducimus
              earum ipsum quis ut labore, cupiditate deleniti magni dolore
              voluptatem? Quae veniam saepe, aperiam laudantium quo repellendus
              quos facere sequi ex sit hic reprehenderit debitis eius eos
              corrupti incidunt necessitatibus quis. Necessitatibus, expedita.
            </p>
            <button className="close-modal" onClick={toggleModal}>
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;
