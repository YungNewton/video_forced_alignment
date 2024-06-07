document.addEventListener('DOMContentLoaded', function() {
    const apiKeyInput = document.getElementById('apiKey');
    const voiceSelect = document.getElementById('voice-id');

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
    document.getElementById('upload-form').addEventListener('submit', function(event) {
        event.preventDefault();
        var formData = new FormData();
        formData.append('video', document.getElementById('video').files[0]);
        formData.append('text', document.getElementById('text').files[0]);
        formData.append('voice-id', document.getElementById('voice-id').value);
        formData.append('apiKey', apiKeyInput.value);
        formData.append('speed', document.getElementById('speed').value);

        fetch('https://video-processing-backend-3.onrender.com', {
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
            document.getElementById('response').innerText = 'File downloaded!';
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('response').innerText = 'Error uploading files.';
        });
    });
});
