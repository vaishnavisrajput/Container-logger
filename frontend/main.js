document.addEventListener('DOMContentLoaded',function() {
    // This code will execute after the DOM has fully loaded

    // Example: Manipulating DOM elements
 

    let appointment = document.querySelector('.appointment'); 
    let master = document.querySelector('.master'); // Assuming you have a button with id "appointmentButton" in your HTML
    let elastic = document.querySelector('.elastic'); // Assuming you have a button with id "appointmentButton" in your HTML
    let patient = document.querySelector('.patient'); // Assuming you have a button with id "appointmentButton" in your HTML
    // Assuming you have a button with id "appointmentButton" in your HTML
    let display = document.querySelector('.ans');

    async function showlogs(service){
        console.log("shologs");
        
        await logging(service);
        
    }
    async function logging(service){
      
        try {
            let response = await fetch(`http://127.0.0.1:5000/api/${service}`);
    
            if (!response.body) {
                console.error('Response body is not readable.');
                return;
            } 
    
            const reader = response.body.getReader();
    
            while (true) {
                const { done, value } = await reader.read();
    
                if (done) {
                    console.log('Stream complete.');
                    break;
                }
    
                const chunk = new TextDecoder('utf-8').decode(value);
                display.innerText += chunk; // Append the chunk to the display element
                console.log(chunk);
            }
        } catch (error) {
            console.error('Error fetching API:', error);
        }  
      }
    
    

    appointment.addEventListener('click', () => {
        display.innerText="";

        showlogs("appointment");
    });
    master.addEventListener('click', () => {
        display.innerText="";

        showlogs("master");
    });
    elastic.addEventListener('click', () => {
        display.innerText="";

        showlogs("elastic");
    });
    patient.addEventListener('click', () => {
        display.innerText="";

        showlogs("patient");
    });
    
    // logging();
});
