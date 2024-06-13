document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('upload-form');
    const responseDiv = document.getElementById('response');
    const submitButton = form.querySelector('button[type="submit"]');

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        var formData = new FormData(form);

        // Add default values if fields are not filled
        if (!formData.get('subtitle_width')) formData.set('subtitle_width', 650);
        if (!formData.get('subtitle_height')) formData.set('subtitle_height', 120);
        if (!formData.get('font_size')) formData.set('font_size', 35);
        if (!formData.get('bottom_padding')) formData.set('bottom_padding', 50);
        if (!formData.get('max_width')) formData.set('max_width', 500);  // New max width default value

        // Clear previous messages
        responseDiv.innerHTML = '';

        // Change button text to "Processing"
        submitButton.textContent = 'Processing...';
        submitButton.disabled = true;

        fetch('https://video-processing-backend.crabdance.com/upload', {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json',
                'Origin': 'https://yungnewton.github.io/video_forced_alignment/'
            }
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
            a.download = 'output_files.zip';
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
