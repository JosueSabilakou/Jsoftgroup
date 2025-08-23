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

    // --- DÉBUT DE L'AJOUT : Logique pour le menu Hamburger ---
    const hamburgerBtn = document.getElementById('hamburger-menu');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = navMenu.querySelectorAll('a');

    if (hamburgerBtn && navMenu) {
        hamburgerBtn.addEventListener('click', () => {
            // Affiche ou cache le menu en ajoutant/retirant une classe CSS
            navMenu.classList.toggle('mobile-menu-open');
        });
    }

    // Optionnel mais recommandé : ferme le menu quand on clique sur un lien (sur mobile)
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('mobile-menu-open')) {
                navMenu.classList.remove('mobile-menu-open');
            }
        });
    });

    // --- NOUVEAU : Logique d'envoi du formulaire vers Google Sheets ---
    const form = document.getElementById('download-form');
    const formMessage = document.getElementById('form-message');
    // REMPLACEZ CETTE URL PAR CELLE OBTENUE À L'ÉTAPE 2
    const scriptURL = 'https://script.google.com/macros/s/AKfycbxk-G9lgB1qJ65YcByioP0lof2YOPEJRlt8xFtZO4tRkIamziCNtt7OT3gJL6PbtWxZFA/exec'; 

    if (form) {
        form.addEventListener('submit', e => {
            e.preventDefault(); // Empêche le rechargement
            
            const submitButton = form.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent;
            submitButton.disabled = true;
            submitButton.textContent = 'Envoi en cours...';

            const formDataObject = {
                nom: form.nom.value,
                email: form.email.value,
                entreprise: form.entreprise.value,
                contact: form.contact.value,
                licence: form.licence.value // C'est ici qu'on récupère la valeur du <select>
            };

            // 2. On envoie cet objet, mais transformé en chaîne de caractères JSON.
            //    C'est ce que `JSON.parse` attend de l'autre côté.
            fetch(scriptURL, { 
                method: 'POST', 
                body: JSON.stringify(formDataObject)
            })
            // --- FIN DE LA CORRECTION ---

            .then(response => response.json()) // La suite ne change pas
            .then(data => {
                if (data.result === 'success') {
                    form.style.display = 'none';
                    formMessage.style.display = 'block';
                    formMessage.className = 'form-message success';
                    formMessage.innerHTML = 'Merci ! Votre téléchargement va commencer.<br><a href="https://drive.google.com/file/d/1IwHqD4iB0XMIQiXXL_YqmdLxquPhYN-_/view?usp=drive_link" download>Si ce n\'est pas le cas, cliquez ici.</a>';
                    window.location.href = "https://drive.google.com/file/d/1IwHqD4iB0XMIQiXXL_YqmdLxquPhYN-_/view?usp=drive_link"; // Mettez votre vrai lien
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
                if (form.style.display !== 'none') {
                    submitButton.disabled = false;
                    submitButton.textContent = originalButtonText;
                }
            });
        });
    }
   
});