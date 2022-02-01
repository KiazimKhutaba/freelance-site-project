'use strict'


function OpenVideoModal(htmlId, htmlDataAttr) {

    const videoModal = document.getElementById(htmlId);
    let iframe;

    videoModal.addEventListener('show.bs.modal', function (event) {
        // Button that triggered the modal
        const button = event.relatedTarget;
        // Extract info from data-bs-* attributes
        const videoUrl = button.getAttribute(htmlDataAttr);
        // If necessary, you could initiate an AJAX request here
        // and then do the updating in a callback.
        //
        // Update the modal's content.
        //const modalTitle = videoModal.querySelector('.modal-title');
        iframe = videoModal.querySelector('.modal-body iframe');

        //modalTitle.textContent = modalTitle
        iframe.src = videoUrl;
    });

    // stops playing video
    videoModal.addEventListener('hide.bs.modal', function (event) {
       iframe.src = '';
    });
}