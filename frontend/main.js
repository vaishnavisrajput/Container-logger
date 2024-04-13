document.addEventListener('DOMContentLoaded',function() {
    // This code will execute after the DOM has fully loaded

    // Example: Manipulating DOM elements
 

    let appointment = document.querySelector('.appointment'); // Assuming you have a button with id "appointmentButton" in your HTML
    let display = document.querySelector('.ans');

    async function showlogs(){
        console.log("shologs");
        
        let output=await logging();
        
        console.log("output :",output);
        display.innerText=output;
    }
    async function logging(){
      
        try {
            let response = await fetch('http://127.0.0.1:5000/');
    
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
            }
        } catch (error) {
            console.error('Error fetching API:', error);
        }  
      }
    
    

    appointment.addEventListener('click', () => {
        showlogs();
    });
    
    // logging();
});
