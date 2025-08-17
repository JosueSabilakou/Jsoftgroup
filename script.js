// Fichier: script.js

document.addEventListener("DOMContentLoaded", function() {

    // --- Animation de fondu (inchangé) ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-in').forEach(section => {
        observer.observe(section);
    });

    // --- Bouton "Retour en haut" (inchangé) ---
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    if (scrollTopBtn) {
        window.onscroll = function() {
            if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
                scrollTopBtn.style.display = "block";
            } else {
                scrollTopBtn.style.display = "none";
            }
        };
        scrollTopBtn.addEventListener('click', function() {
            window.scrollTo({top: 0, behavior: 'smooth'});
        });
    }

    // --- NOUVEAU : Logique d'envoi du formulaire vers Google Sheets ---
    const form = document.getElementById('download-form');
    const formMessage = document.getElementById('form-message');
    // REMPLACEZ CETTE URL PAR CELLE OBTENUE À L'ÉTAPE 2
    const scriptURL = 'https://script.google.com/macros/s/AKfycbxk-G9lgB1qJ65YcByioP0lof2YOPEJRlt8xFtZO4tRkIamziCNtt7OT3gJL6PbtWxZFA/exec'; 

    if (form) {
        form.addEventListener('submit', e => {
            e.preventDefault(); // Empêche le rechargement de la page
            
            const submitButton = form.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent;
            submitButton.disabled = true;
            submitButton.textContent = 'Envoi en cours...';

            fetch(scriptURL, { method: 'POST', body: JSON.stringify({
                nom: form.nom.value,
                email: form.email.value,
                entreprise: form.entreprise.value,
                contact: form.contact.value
            })})
            .then(response => response.json())
            .then(data => {
                if (data.result === 'success') {
                    form.style.display = 'none'; // Cache le formulaire
                    formMessage.style.display = 'block';
                    formMessage.className = 'form-message success';
                    // REMPLACEZ PAR VOTRE VRAI LIEN DE TÉLÉCHARGEMENT
                    formMessage.innerHTML = 'Merci ! Votre téléchargement va commencer.<br><a href="https://drive.google.com/file/d/1J-fTuptPjrLkOaHuwEnmApgmW5TdQ9MZ/view?usp=sharing" download>Si ce n\'est pas le cas, cliquez ici.</a>';
                    // Ligne pour déclencher le téléchargement automatiquement
                    window.location.href = "https://drive.google.com/file/d/1J-fTuptPjrLkOaHuwEnmApgmW5TdQ9MZ/view?usp=sharing";
                } else {
                    throw new Error(data.message || 'Une erreur est survenue.');
                }
            })
            .catch(error => {
                formMessage.style.display = 'block';
                formMessage.className = 'form-message error';
                formMessage.textContent = 'Erreur : Impossible d\'envoyer le formulaire. Veuillez réessayer.';
                console.error('Error!', error.message);
            })
            .finally(() => {
                // Réactive le bouton uniquement en cas d'erreur
                if (form.style.display !== 'none') {
                    submitButton.disabled = false;
                    submitButton.textContent = originalButtonText;
                }
            });
        });
    }
});