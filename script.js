document.addEventListener('DOMContentLoaded', function() {
    const apiKeyInput = document.getElementById('apiKey');
    const voiceSelect = document.getElementById('voice-id');
    const form = document.getElementById('upload-form');
    const responseDiv = document.getElementById('response');

    // Fetch available voices from Eleven Labs API and populate the dropdown
    function populateVoices() {
        const apiKey = apiKeyInput.value;
        if (!apiKey) {
            alert("Please enter your API key to load available voices.");
            return;
        }

        fetch('https://api.elevenlabs.io/v1/voices', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${apiKey}`
            }
        })
        .then(response => response.json())
        .then(data => {
            // Clear previous options
            voiceSelect.innerHTML = '<option value="">Select Voice</option>';
            data.voices.forEach(voice => {
                const option = document.createElement('option');
                option.value = voice.id;
                option.textContent = voice.name;
                voiceSelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error fetching voices:', error);
        });
    }

    // Populate voices when API key is entered or changed
    apiKeyInput.addEventListener('change', populateVoices);

    // Handle form submission
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        var formData = new FormData(form);
        fetch('https://video-processing-backend-3.onrender.com/upload', {
            method: 'POST',
            body: formData
        })
        .then(response => response.blob())
        .then(blob => {
            var url = window.URL.createObjectURL(blob);
            var a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = 'output.mp3';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);

            // Update the UI to show success message and "Go Back" button
            form.style.display = 'none';
            responseDiv.innerHTML = `
                <p>Processing completed successfully! Your file is downloaded.</p>
                <button id="go-back">Go Back</button>
            `;

            // Add event listener for "Go Back" button
            document.getElementById('go-back').addEventListener('click', function() {
                form.style.display = 'block';
                responseDiv.innerHTML = '';
            });

            document.getElementById('response').innerText = 'File downloaded!';
        })
        .catch(error => {
            console.error('Error:', error);
            responseDiv.innerHTML = `
                <p>Error uploading files. Please try again.</p>
                <button id="go-back">Go Back</button>
            `;

            // Add event listener for "Go Back" button in case of error
            document.getElementById('go-back').addEventListener('click', function() {
                form.style.display = 'block';
                responseDiv.innerHTML = '';
            });
        });
    });
});
