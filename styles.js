document.getElementById('upload-form').addEventListener('submit', function(event) {
    event.preventDefault();
    var formData = new FormData();
    formData.append('video', document.getElementById('video').files[0]);
    formData.append('text', document.getElementById('text').files[0]);

    fetch('http://<your-ngrok-url>/upload', {
        method: 'POST',
        body: formData
    })
    .then(response => response.blob())
    .then(blob => {
        var url = window.URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'output.srt';
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