
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('upload-form');
    const responseDiv = document.getElementById('response');
    const submitButton = form.querySelector('button[type="submit"]');

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        var formData = new FormData(form);

        // Clear previous messages
        responseDiv.innerHTML = '';

        // Change button text to "Processing"
        submitButton.textContent = 'Processing...';
        submitButton.disabled = true;

        fetch('http://192.168.0.167:5000/upload', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.blob();
        })
        .then(blob => {
            var url = window.URL.createObjectURL(blob);
            var a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = 'audio_output.mp3';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);

            form.style.display = 'none';
            responseDiv.innerHTML = `
                <p>Processing completed successfully! Your file is downloaded.</p>
                <button id="go-back">Go Back</button>
            `;

            document.getElementById('go-back').addEventListener('click', function() {
                form.style.display = 'block';
                responseDiv.innerHTML = '';
                submitButton.textContent = 'Begin Processing';
                submitButton.disabled = false;
            });
        })
        .catch(error => {
            console.error('Error:', error);
            responseDiv.innerHTML = `
                <p>Error uploading files. Please try again.</p>
            `;

            submitButton.textContent = 'Begin Processing';
            submitButton.disabled = false;
        });
    });
});
