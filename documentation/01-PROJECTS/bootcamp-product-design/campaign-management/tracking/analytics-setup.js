// ============================================
// FATAPLUS BOOTCAMP - ANALYTICS & TRACKING SETUP
// ============================================
// Configuration complète pour Facebook Pixel, Google Analytics 4, LinkedIn Insight Tag
// Dernière mise à jour : 16 Octobre 2025

// ============================================
// FACEBOOK PIXEL CONFIGURATION
// ============================================
window.fbAsyncInit = function() {
    FB.init({
        appId: 'YOUR_FACEBOOK_APP_ID', // À remplacer avec votre App ID
        autoLogAppEvents: true,
        xfbml: true,
        version: 'v18.0'
    });

    // Tracking des événements personnalisés pour le bootcamp
    FB.Event.subscribe('edge.create', function(url) {
        fbq('track', 'AddToWishlist', {
            content_name: 'Bootcamp Product Design',
            content_category: 'Education',
            content_ids: ['bootcamp_2026'],
            content_type: 'product'
        });
    });
};

// Load Facebook Pixel
(function(d, s, id){
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {return;}
    js = d.createElement(s); js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

// Facebook Pixel Initialization
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');

// Initialize Facebook Pixel
fbq('init', 'YOUR_PIXEL_ID'); // À remplacer avec votre Pixel ID
fbq('track', 'PageView');

// ============================================
// GOOGLE ANALYTICS 4 CONFIGURATION
// ============================================

// Global site tag (gtag.js) - Google Analytics 4
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}

// Initialize GA4
gtag('js', new Date());
gtag('config', 'YOUR_MEASUREMENT_ID', {
    // À remplacer avec votre Measurement ID
    page_title: 'Bootcamp Product Design | Fataplus Madagascar',
    page_location: window.location.href,
    custom_map: {'custom_parameter_1': 'bootcamp_interest'}
});

// Enhanced Ecommerce Configuration
gtag('config', 'YOUR_MEASUREMENT_ID', {
    currency: 'EUR',
    send_page_view: true
});

// ============================================
// LINKEDIN INSIGHT TAG CONFIGURATION
// ============================================

 LinkedIn Partner ID
window._linkedin_partner_id = 'YOUR_LINKEDIN_PARTNER_ID'; // À remplacer
window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
window._linkedin_data_partner_ids.push(window._linkedin_partner_id);

// Load LinkedIn Insight Tag
(function(){var s = document.getElementsByTagName("script")[0];
var b = document.createElement("script");
b.type = "text/javascript";b.async = true;
b.src = "https://snap.licdn.com/li.lms-analytics/insight.min.js";
s.parentNode.insertBefore(b, s);})();

// ============================================
// ÉVÉNEMENTS PERSONNALISÉS BOOTCAMP
// ============================================

const FataplusTracking = {

    // Tracking consultation programme
    trackProgramView: function(programDetails = {}) {
        const eventData = {
            content_name: 'Bootcamp Product Design',
            content_category: 'Education',
            content_type: 'course',
            value: 790000, // Prix en MGA
            currency: 'MGA',
            ...programDetails
        };

        // Facebook Pixel
        if (typeof fbq !== 'undefined') {
            fbq('track', 'ViewContent', eventData);
        }

        // Google Analytics 4
        if (typeof gtag !== 'undefined') {
            gtag('event', 'view_item', {
                items: [{
                    item_id: 'bootcamp_product_design_2026',
                    item_name: 'Bootcamp Product Design',
                    category: 'Education',
                    quantity: 1,
                    price: 790000,
                    currency: 'MGA'
                }]
            });
        }

        // LinkedIn Insight Tag
        if (typeof lintrk !== 'undefined') {
            lintrk('track', {conversion_id: YOUR_CONVERSION_ID});
        }

        console.log('Program view tracked:', eventData);
    },

    // Tracking soumission formulaire inscription
    trackFormSubmission: function(formData = {}) {
        const eventData = {
            content_name: 'Bootcamp Product Design Registration',
            content_category: 'Lead Generation',
            value: 50, // Coût par acquisition estimé
            currency: 'EUR',
            ...formData
        };

        // Facebook Pixel - Lead
        if (typeof fbq !== 'undefined') {
            fbq('track', 'Lead', eventData);
            fbq('track', 'CompleteRegistration', {
                content_name: 'Bootcamp Registration',
                currency: 'EUR',
                value: 50
            });
        }

        // Google Analytics 4 - Generate Lead
        if (typeof gtag !== 'undefined') {
            gtag('event', 'generate_lead', {
                event_category: 'engagement',
                event_label: 'bootcamp_registration',
                value: 50,
                currency: 'EUR'
            });

            // Custom event for detailed tracking
            gtag('event', 'form_submission', {
                custom_parameter_1: formData.interest_level || 'high',
                custom_parameter_2: formData.experience_level || 'beginner',
                custom_parameter_3: formData.source || 'organic'
            });
        }

        // LinkedIn Insight Tag
        if (typeof lintrk !== 'undefined') {
            lintrk('track', {conversion_id: YOUR_CONVERSION_ID});
        }

        console.log('Form submission tracked:', eventData);
    },

    // Tracking téléchargement programme
    trackProgramDownload: function() {
        const eventData = {
            content_name: 'Bootcamp Program PDF',
            content_category: 'Content Download',
            content_type: 'document'
        };

        // Facebook Pixel
        if (typeof fbq !== 'undefined') {
            fbq('track', 'Lead', eventData);
        }

        // Google Analytics 4
        if (typeof gtag !== 'undefined') {
            gtag('event', 'file_download', {
                file_name: 'bootcamp_program.pdf',
                content_type: 'application/pdf',
                item_category: 'Educational Content'
            });
        }

        console.log('Program download tracked:', eventData);
    },

    // Tracking visites pages clés
    trackPageView: function(pageName, additionalData = {}) {
        const eventData = {
            page_title: pageName,
            page_location: window.location.href,
            ...additionalData
        };

        // Facebook Pixel
        if (typeof fbq !== 'undefined') {
            fbq('track', 'PageView');
        }

        // Google Analytics 4
        if (typeof gtag !== 'undefined') {
            gtag('config', 'YOUR_MEASUREMENT_ID', {
                page_title: pageName,
                ...additionalData
            });
        }

        console.log('Page view tracked:', eventData);
    },

    // Tracking engagement vidéo
    trackVideoEngagement: function(videoName, percentWatched) {
        const eventData = {
            content_name: videoName,
            content_category: 'Video Engagement',
            percent_watched: percentWatched
        };

        // Facebook Pixel
        if (typeof fbq !== 'undefined') {
            if (percentWatched >= 25) {
                fbq('track', 'ViewContent', {
                    content_name: videoName,
                    content_category: 'Video'
                });
            }
            if (percentWatched >= 50) {
                fbq('track', 'Search', {
                    search_string: videoName
                });
            }
        }

        // Google Analytics 4
        if (typeof gtag !== 'undefined') {
            gtag('event', 'video_progress', {
                video_title: videoName,
                video_percent: percentWatched,
                video_provider: 'fataplus'
            });

            if (percentWatched >= 95) {
                gtag('event', 'video_complete', {
                    video_title: videoName,
                    video_provider: 'fataplus'
                });
            }
        }

        console.log('Video engagement tracked:', eventData);
    },

    // Tracking scroll depth
    trackScrollDepth: function(scrollPercent) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'scroll', {
                event_category: 'engagement',
                custom_parameter_1: scrollPercent + '_percent'
            });
        }
    },

    // Tracking clics CTA
    trackCTAClick: function(ctaText, ctaLocation) {
        const eventData = {
            content_name: ctaText,
            content_category: 'CTA Click',
            location: ctaLocation
        };

        // Facebook Pixel
        if (typeof fbq !== 'undefined') {
            fbq('track', 'Lead', eventData);
        }

        // Google Analytics 4
        if (typeof gtag !== 'undefined') {
            gtag('event', 'click', {
                event_category: 'engagement',
                event_label: ctaText,
                link_url: window.location.href,
                outbound: true
            });
        }

        console.log('CTA click tracked:', eventData);
    }
};

// ============================================
// AUTOMATISATION DU TRACKING
// ============================================

// Initialiser le tracking au chargement de la page
document.addEventListener('DOMContentLoaded', function() {

    // Tracker la vue de la page
    FataplusTracking.trackPageView('Bootcamp Landing Page');

    // Configuration du tracking de scroll depth
    let maxScroll = 0;
    window.addEventListener('scroll', function() {
        const scrollPercent = Math.round(
            (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
        );

        if (scrollPercent > maxScroll) {
            maxScroll = scrollPercent;

            // Tracker à 25%, 50%, 75%, 90%, 100%
            if ([25, 50, 75, 90, 100].includes(scrollPercent)) {
                FataplusTracking.trackScrollDepth(scrollPercent);
            }
        }
    });

    // Tracking des clics sur les liens externes
    document.addEventListener('click', function(e) {
        const target = e.target.closest('a');
        if (target && target.href) {
            // CTA buttons tracking
            if (target.classList.contains('cta-primary') ||
                target.classList.contains('cta-hero') ||
                target.classList.contains('cta-final')) {

                FataplusTracking.trackCTAClick(target.textContent, target.href);
            }

            // PDF download tracking
            if (target.href.includes('.pdf')) {
                FataplusTracking.trackProgramDownload();
            }

            // External link tracking
            if (target.hostname !== window.location.hostname) {
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'click', {
                        event_category: 'outbound',
                        event_label: target.href,
                        transport_type: 'beacon'
                    });
                }
            }
        }
    });

    // Tracking des vidéos (si présentes sur la page)
    const videos = document.querySelectorAll('video');
    videos.forEach(video => {
        let trackedMilestones = new Set();

        video.addEventListener('timeupdate', function() {
            const percent = Math.round((video.currentTime / video.duration) * 100);

            [25, 50, 75, 95].forEach(milestone => {
                if (percent >= milestone && !trackedMilestones.has(milestone)) {
                    trackedMilestones.add(milestone);
                    FataplusTracking.trackVideoEngagement(
                        video.title || 'Product Design Video',
                        percent
                    );
                }
            });
        });

        video.addEventListener('ended', function() {
            FataplusTracking.trackVideoEngagement(
                video.title || 'Product Design Video',
                100
            );
        });
    });

    // Tracking du temps sur page
    let timeOnPage = 0;
    setInterval(function() {
        timeOnPage += 10; // Toutes les 10 secondes

        if (timeOnPage % 60 === 0) { // Toutes les minutes
            if (typeof gtag !== 'undefined') {
                gtag('event', 'user_engagement', {
                    event_category: 'engagement',
                    custom_parameter_1: timeOnPage + '_seconds'
                });
            }
        }
    }, 10000);

    console.log('Fataplus Tracking initialized successfully');
});

// ============================================
// UTILITAIRES DE VALIDATION
// ============================================

// Vérifier si les scripts de tracking sont chargés
function validateTrackingSetup() {
    const checks = {
        facebookPixel: typeof fbq !== 'undefined',
        googleAnalytics: typeof gtag !== 'undefined',
        linkedinInsight: typeof lintrk !== 'undefined'
    };

    console.log('Tracking Setup Validation:', checks);

    // Envoyer les résultats à Google Analytics pour monitoring
    if (checks.googleAnalytics) {
        gtag('event', 'tracking_validation', {
            facebook_pixel: checks.facebookPixel,
            linkedin_insight: checks.linkedinInsight,
            custom_parameter_1: 'bootcamp_landing'
        });
    }

    return checks;
}

// Valider le setup après 2 secondes
setTimeout(validateTrackingSetup, 2000);

// ============================================
// GESTION DES COOKIES ET CONSENTEMENT
// ============================================

const CookieManager = {

    // Vérifier le consentement aux cookies
    hasConsent: function() {
        return localStorage.getItem('fataplus_cookie_consent') === 'true';
    },

    // Obtenir le consentement
    requestConsent: function() {
        if (!this.hasConsent()) {
            // Afficher la bannière de cookies
            this.showConsentBanner();
        } else {
            // Activer le tracking
            this.enableTracking();
        }
    },

    // Afficher la bannière de consentement
    showConsentBanner: function() {
        // Créer la bannière (à implémenter selon le design)
        const banner = document.createElement('div');
        banner.id = 'cookie-banner';
        banner.style.cssText = `
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background: #1f2937;
            color: white;
            padding: 1rem;
            z-index: 9999;
            text-align: center;
        `;

        banner.innerHTML = `
            <p style="margin: 0 0 1rem 0;">
                Nous utilisons des cookies pour améliorer votre expérience et mesurer l'audience.
            </p>
            <button onclick="CookieManager.acceptConsent()" style="
                background: #667eea;
                color: white;
                border: none;
                padding: 0.5rem 1rem;
                border-radius: 5px;
                margin-right: 1rem;
                cursor: pointer;
            ">Accepter</button>
            <button onclick="CookieManager.declineConsent()" style="
                background: #6b7280;
                color: white;
                border: none;
                padding: 0.5rem 1rem;
                border-radius: 5px;
                cursor: pointer;
            ">Refuser</button>
        `;

        document.body.appendChild(banner);
    },

    // Accepter le consentement
    acceptConsent: function() {
        localStorage.setItem('fataplus_cookie_consent', 'true');
        this.enableTracking();
        this.hideConsentBanner();

        // Tracker l'acceptation
        if (typeof gtag !== 'undefined') {
            gtag('event', 'cookie_consent_accepted', {
                event_category: 'compliance'
            });
        }
    },

    // Refuser le consentement
    declineConsent: function() {
        localStorage.setItem('fataplus_cookie_consent', 'false');
        this.hideConsentBanner();

        // Tracker le refus
        if (typeof gtag !== 'undefined') {
            gtag('event', 'cookie_consent_declined', {
                event_category: 'compliance'
            });
        }
    },

    // Cacher la bannière
    hideConsentBanner: function() {
        const banner = document.getElementById('cookie-banner');
        if (banner) {
            banner.remove();
        }
    },

    // Activer le tracking
    enableTracking: function() {
        // Réinitialiser les scripts de tracking avec consentement
        console.log('Tracking enabled with consent');
    }
};

// Demander le consentement au chargement
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => CookieManager.requestConsent(), 1000);
});

// ============================================
// EXPORT DES FONCTIONS
// ============================================

// Rendre les fonctions disponibles globalement pour utilisation dans les pages
window.FataplusTracking = FataplusTracking;
window.CookieManager = CookieManager;

console.log('Fataplus Analytics Setup loaded successfully');