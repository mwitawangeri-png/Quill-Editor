
let editorReady = false;
      let editorId = 'plantilla_1';
      let lastSavedContent = null;
      let idActive = null;
let editordata = "";

      // Escuchar mensajes del editor hijo (iframe)
      window.addEventListener('message', function (event) {
        if (!event.data || event.data.source !== 'quill-editor') return;

        idActive = event.data.data.editorId;
         editordata = event.data.data.html;


        console.log('ID editor',    event.data.data.editorId); 
        console.log('ID BD', event.data.data.uuid);


        switch (event.data.type) {
          case 'editor-ready':
            // editorReady = true;
            // console.log('Editor listo:', event.data.editorId);
            // console.log('UUID del documento:', event.data.uuid);
            // // Enviar contenido inicial al iframe que lo pidió
            // const initial = encodeToBase64(initialContent);
            // event.source.postMessage(
            //   {
            //     type: 'set-content',
            //     data: { content: initial },
            //     source: 'quill-parent',
            //   },
            //   '*'
            // );
            break;


          case 'content-changed':
            console.log('+++Contenido cambiado (HTML):', event.data.html);

          // -------------------------------------
          // NEW
         // --------------------------------------
         bubble_fn_disable(event.data.data.uuid);

            break;


          case 'content-response':
            // Cuando recibimos contenido del editor (en Base64)
            lastSavedContent = event.data.content;
            console.log('Contenido recibido (Base64):', event.data.content);
            console.log('UUID del documento:', event.data.uuid);
            console.log('Variables encontradas:', event.data.variables);
            break;
          case 'save-requested':
            lastSavedContent = event.data;


            console.log(
              'Guardar contenido (Base64):',
              lastSavedContent.data.content
            );
            console.log('UUID del documento:', event.data.uuid);
bubble_fn_save(  [ lastSavedContent.data.content,event.data.data.uuid, editordata ]  );

            break;


          case 'delete-requested':
            console.log('Solicitud de eliminación para UUID:', event.data.uuid);


         
            break;
        }
      });
function getactiveEditor(){
return idActive ;
};

function getData(){
console.log(editordata);
};
